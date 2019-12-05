import { editor } from "monaco-editor-core";


function debounce<T extends Function>(func: T, delay = 50): T {
    let timeout: ReturnType<typeof setTimeout> | undefined;
  
    return function(this: any, ...args: any[]) {
        const context = this;
    
        const doLater = function() {
            timeout = undefined;
            func.apply(context, args);
        }
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    
        timeout = setTimeout(doLater, delay);
    } as any
}

export interface EditorOptions {
    editorId?: string;
    language?: string;
    value?: string;
    theme?: string;
    fontFamily?: string;
    fontSize?: number;
    tabSize?: number;
    onChange?: () => {};
    onSave?: () => {};
    onAlert?: (alert: string) => void;
    iframe?: HTMLIFrameElement;
}

interface Subscriber {
    Subject: HTMLElement;
    Action: Callback;
}

interface PortalCommunication {
    request: string;
    response: string;
}

/**
 * postMessage request-response messages dictionary
 */
const REQUESTS_DICTIONARY: Map<string, PortalCommunication> = new Map([
    [
        "toggleGrid", {
            request: "axiToggleGrid",
            response: "axiToggleGridResponse"
        }
    ],
    [
        "resizeWidget", {
            request: "axiWidgetResize",
            response: "axiWidgetResizeResponse"
        }
    ],
    [
        "dragWidget", {
            request: "axiWidgetDrag",
            response: "axiWidgetDragResponse"
        }
    ],
    [
        "insertConfigRows", {
            request: "axiInsertConfigRows",
            response: "axiInsertConfigRowsResponse"
        }
    ],
    [
        "lockInteractions", {
            request: "axiLockInteractions",
            response: "axiLockInteractionsResponse"
        }
    ]
]);

type Callback = (value?: boolean) => void;

class GridStatus {
    private codeChanges: boolean = false;
    private manualEnable: boolean | null = null;
    private configSetting: boolean | null = null;
    private _value: boolean = false;
    private callbacks: Callback[] = [];

    public setCodeChange(value: boolean): void {
        this.codeChanges = value;
        this.update();
    }

    public setConfigSetting(value: boolean | null): void {
        this.configSetting = value;
        this.update();
    }

    public toggleManualEnable(): void {
        if (this.manualEnable === null) {
            this.manualEnable = !this._value;
        } else {
            this.manualEnable = !this.manualEnable;
        }
        this.update();
    }

    public addCallback(func: Callback): void {
        this.callbacks.push(func);
    }

    get value(): boolean {
        return this._value;
    }

    private update(): void {
        const newValue = this.getGridStatus();
        if (this._value !== newValue) {
            this._value = newValue;
            this.callbacks.forEach(func => func(this._value));
        }
    }

    private getGridStatus(): boolean {
        let result = null;

        if (this.manualEnable !== null) {
            result = this.manualEnable;
        } else if (this.configSetting !== null) {
            result = this.configSetting;
        } else {
            result = this.codeChanges;
        }

        return result;
    }
}

// tslint:disable-next-line: no-empty
const FN_NOOP = () => { };
const SETTINGS_STORAGE_KEY = "ChartsEditorSettings";
const DEFAULT_TAB_SIZE: number = 2;

// tslint:disable-next-line: max-classes-per-file
export class EditorActions {
    /**
     * Some actions not connected with editor instance which should be performed on save
     * @param onSave
     */
    public static saveEditorContents: Callback;

    public chartsEditor: editor.ICodeEditor;
    private subscribers: Subscriber[] = [];
    private iframeElement: HTMLIFrameElement = null;
    private grid: GridStatus;

    private updateWidth: (group: number, widget: number, line: number, dimension: {
        name: string, value: number
    }) => void = debounce(this.changeValueSetting, 50);

    /**
     * Can be used for config properties update with debounce
     */
    private updateHeight: (group: number, widget: number, line: number, dimension: {
        name: string, value: number
    }) => void = debounce(this.changeValueSetting, 50);
    private _preventLock: boolean = false;

    private alert: (msg: string) => void = () => {};

    public initEditor(options: EditorOptions): void {
        /** Editor is already initialized */
        if (this.chartsEditor) {
            return;
        }

        const editorId = options.editorId || "editorHolder";
        const language = options.language || "axibaseCharts";
        const value = options.value || "";
        const theme = options.theme || "chartsTheme";
        const fontFamily = options.fontFamily || "Source Code Pro";
        const fontSize = options.fontSize || 12;
        const tabSize = options.tabSize || DEFAULT_TAB_SIZE;

        if (options.iframe) {
            this.iframeElement = options.iframe;
            this.iframeElement.addEventListener("load", () => {
                sendStatusOnConnect(this.iframeElement, this.grid.value);
            });
        }

        window.addEventListener("message", (event: MessageEvent) => this.notifyAboutChanges(event));

        /**
         * Editor onchange (type, paste text) callback
         */
        const onChange = (
            options.onChange instanceof Function
        ) ? options.onChange : FN_NOOP;

        /**
         * Editor save callback
         */
        const onSave = (
            options.onSave instanceof Function
        ) ? options.onSave : FN_NOOP;

        
        /**
         * Write editor's settings to localStorage
         */
        localSettings.init({
            fontSize
        });

        const editorHolder = document.getElementById(editorId);

        if (!editorHolder) {
            console.error("Editor holder with id «" + editorId + "» not found");
            return;
        }

        this.chartsEditor = monaco.editor.create(
            editorHolder,
            {
                fontFamily,
                fontSize: localSettings.get("fontSize") || fontSize,
                language,
                lineDecorationsWidth: 0.5,
                lineNumbersMinChars: 4,
                minimap: {
                    enabled: false
                },
                scrollBeyondLastLine: false,
                theme,
                value,
            }
        );

        /**
         * Create controls to increase/decrease editor's font-size
         * @type {HTMLElement}
         */
        const fontControls = this.createFontControls();

        editorHolder.appendChild(fontControls);

        editorHolder.addEventListener("mouseover", () => {
            fontControls.style.opacity = "1";
        });

        editorHolder.addEventListener("mouseout", () => {
            fontControls.style.opacity = "0";
        });

        /**
         * Set editor tabSize
         */
        this.chartsEditor.getModel().updateOptions({ tabSize });

        /**
         * Activate callback for editor content changes
         */
        this.chartsEditor.getModel().onDidChangeContent(() => {
            onChange();
            this.grid.setCodeChange(true);
            this.grid.setConfigSetting(
                this.getGridConfigSetting(
                    this.getEditorValue()
                )
            );
            if (!this._preventLock) {
                this.lockInteractions();
            } else {
                this._preventLock = false;
            }
        });

        EditorActions.saveEditorContents = onSave;
        this.grid = new GridStatus();

        this.grid.setConfigSetting(this.getGridConfigSetting(this.getEditorValue()));
        if (this.iframeElement) {
            this.grid.addCallback((val: boolean) => {
                this.iframeElement.contentWindow.postMessage({
                    type: REQUESTS_DICTIONARY.get("toggleGrid").request,
                    value: val
                }, "*");
            });
        }

        if (options.onAlert) {
            this.alert = options.onAlert;
        }
    }

    /**
     * Toggle grid visibility via control button (has highest priority in the runtime)
     */
    public toggleGrid(): void {
        this.grid.toggleManualEnable();
    }

    /**
     * Append string contents to the end of the editor
     * @param text
     */
    public insertEditorValue(text: string): void {
        /** Check if editor has been initialized */
        if (!this.chartsEditor) {
            return;
        }

        const endLine = this.chartsEditor.getModel().getLineCount();
        const endCharacter = 1;

        /** Add indentation for [widget] section */
        text = "\t" + text.replace(/(\r?\n)/g, "$1\t");

        /** If editor has content prepend inserted text with blank lines */
        text = (endLine > 1) ? "\n\n" + text : text;

        const edits = {
            /**
             * If start & end of the range aren't distant enough to contain config's text
             * (they obviously aren't), automatically expand range
             */
            forceMoveMarkers: true,
            identifier: { major: 1, minor: 1 },
            range: new monaco.Range(endLine + 1, endCharacter, endLine + 1, endCharacter),
            text
        };

        this.chartsEditor.executeEdits("onPaste", [edits]);
    }

    /**
     * Set model tab size
     * @param tabSize
     */
    public setTabSize(tabSize: number): void {
        tabSize = tabSize || DEFAULT_TAB_SIZE;
        if (this.chartsEditor) {
            this.chartsEditor.getModel().updateOptions({ tabSize });
        }
    }

    public getGridConfigSetting(text: string) {
        const match = /^[\s]*grid-display\s*=\s*(true|false)[\s]*$/gm.exec(text);
        return match ? match[1] === "true" : null;
    }

    /**
     * Get editor's text value
     * @return {string}
     */
    public getEditorValue(): string {
        /** Check if editor has been initialized */
        if (!this.chartsEditor) {
            return "";
        }

        return this.chartsEditor.getValue();
    }

    /**
     * Format editor's config
     */
    public formatEditorContents() {
        /** Check if editor has been initialized */
        if (this.chartsEditor) {
            this.chartsEditor.trigger(this.getEditorValue(), "editor.action.formatDocument", {});
        }
    }

    /**
     * Trigger editor redraw
     */
    public resizeEditor() {
        if (this.chartsEditor) {
            this.chartsEditor.layout();
        }
    }

    /**
     * Brings focus to textarea
     */
    public focus(): void {
        if (this.chartsEditor) {
            this.chartsEditor.focus();
        }
    }

    /**
     * Subscribe toggleGrid Button to event
     * @param button — control button
     * @param action - button callback
     */
    public subscribeToGridChanges(button: HTMLElement, action: () => void): void {
        this.subscribers.push({
            Action: action,
            Subject: button
        });
    }

    /**
     * Notify each subscriber about specific event
     */
    private notifyAboutChanges(event: MessageEvent): void {
        switch (event.data.type) {
            case REQUESTS_DICTIONARY.get("toggleGrid").response: {
                for (let { Subject, Action } of this.subscribers) {
                    Action.call(Subject, event.data.value);
                }
                break;
            }
            case REQUESTS_DICTIONARY.get("resizeWidget").response: {
                const error = event.data.value.error;
                if (error) {
                    this.alert(error);
                    return;
                }
                const line = event.data.value.widgetSectionLine;
                const match = /widget-(\d+)-(\d+)/.exec(event.data.value.widgetId);
                const width = parseFloat(event.data.value.widthUnits);
                const height = parseFloat(event.data.value.heightUnits);

                if (match && isValidNumber(width) && isValidNumber(height)) {
                    try {
                        const group = parseInt(match[1], 10);
                        const widget = parseInt(match[2], 10);

                        this.changeValueSetting(group, widget, line, { name: "width-units", value: width });
                        this.changeValueSetting(group, widget, line, { name: "height-units", value: height });
                    } catch (error) {
                        // we couldn't retrieve group and widget from string having format 'widget-1-1'
                    }
                }
                // console.log(event.data.value);
                break;
            }
            case REQUESTS_DICTIONARY.get("dragWidget").response: {
                const error = event.data.value.error;
                if (error) {
                    this.alert(error);
                    return;
                }
                const line = event.data.value.widgetSectionLine;
                const match = /widget-(\d+)-(\d+)/.exec(event.data.value.widgetId);
                const row = parseInt(event.data.value.posY, 10);
                const column = parseInt(event.data.value.posX, 10);

                if (match && isValidNumber(row) && isValidNumber(column)) {
                    try {
                        const group = parseInt(match[1], 10);
                        const widget = parseInt(match[2], 10);

                        const position = `${row}-${column}`;

                        this.changeValueSetting(group, widget, line, { name: "position", value: position });
                    } catch (error) {
                        // we couldn't retrieve group and widget from string having format 'widget-1-1'
                    }
                }

                break;
            }
            default: {
                console.log(`Unknown event type: ${event.data.type}`);
            }
        }
    }

    /**
     * 
     * @param group - target config group number
     * @param widget - target widget group number
     * @param dimension - setting name to search for
     */
    private changeValueSetting(group: number, widget: number, lineIndex: number, dimension: {
        name: string, value: number | string
    }): void {
        const configText = this.getEditorValue().split("\n");
        this._preventLock = true;
        const model = this.chartsEditor.getModel();

        let i = lineIndex+1;
        let lastWidgetConfigLine = i+1;
        for (; i < configText.length; i++) {
            let line = configText[i];

            /**
             * If we found setting inside target section, substitute it
             */
            if (new RegExp(`\\b${dimension.name}\\b`).test(line)) {
                model.applyEdits([{
                    forceMoveMarkers: true,
                    range: new monaco.Range(
                        i + 1,
                        model.getLineFirstNonWhitespaceColumn(i + 1),
                        i + 1,
                        model.getLineLastNonWhitespaceColumn(i + 1)
                    ),
                    text: `${dimension.name} = ${dimension.value}`,
                }]);
                return;
                /**
                 * Otherwise insert this setting at the end of the section
                 */
            } else if (/\[\w+\]/.test(line)) {
                break;
            }

            if (line.trim()) {
                lastWidgetConfigLine = i+1;
            }
        }

        let indent = model.getLineFirstNonWhitespaceColumn(lastWidgetConfigLine) - 1;
        // If last line is empty, indent will be -1. Try previous line
        let nonEmptyLineIndex = lastWidgetConfigLine-1;
        while (indent < 0) {
            if (nonEmptyLineIndex<0) {
                indent = 0;
                break;
            }
            indent = model.getLineFirstNonWhitespaceColumn(nonEmptyLineIndex--) - 1;
        }

        let text =  " ".repeat(indent) + `${dimension.name} = ${dimension.value}\n`
        if (lastWidgetConfigLine >= configText.length) {
            text = "\n" + text;
        }
        
        model.applyEdits([{
            forceMoveMarkers: true,
            range: new monaco.Range(
                lastWidgetConfigLine + 1,
                0,
                lastWidgetConfigLine + 1,
                0
            ),
            text,
        }]);

        this.iframeElement.contentWindow.postMessage({
            type: REQUESTS_DICTIONARY.get("insertConfigRows").request,
            value: { lines: [text], start: i }
        }, "*");

    }
    /**
     * Create controls buttons to increase/decrease editor's font-size
     * @return {HTMLElement}
     */
    private createFontControls(): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("font-controls");

        const decreaseFontBtn = document.createElement("div");
        decreaseFontBtn.className += " btn-minus control-button";

        decreaseFontBtn.addEventListener("click", () => {
            this.chartsEditor.getAction("editor.action.fontZoomOut").run().then(
                () => {
                    return localSettings.update("fontSize", this.chartsEditor.getConfiguration().fontInfo.fontSize);
                }
            );
        });

        const increaseFontBtn = document.createElement("div");
        increaseFontBtn.className += " btn-plus control-button";

        increaseFontBtn.addEventListener("click", () => {
            this.chartsEditor.getAction("editor.action.fontZoomIn").run().then(
                () => {
                    return localSettings.update("fontSize", this.chartsEditor.getConfiguration().fontInfo.fontSize);
                }
            );
        });

        const separator = document.createElement("div");
        separator.className += " btn-label control-button";

        container.appendChild(decreaseFontBtn);
        container.appendChild(separator);
        container.appendChild(increaseFontBtn);

        return container;
    }

    private lockInteractions() {
        this.iframeElement.contentWindow.postMessage({
            type: REQUESTS_DICTIONARY.get("lockInteractions").request,
            value: null
        }, "*");
    }
}

/**
 * Send message to portal iframe
 */
function sendStatusOnConnect(iframe: HTMLIFrameElement, value: boolean = false) {
    if (!iframe) {
        return null;
    }

    return new Promise((resolve, reject) => {
        let stopped = false;

        setTimeout((message) => {
            stopped = true;
            reject(message);
        }, 3000, "timeout");

        const connected = function ok(event: MessageEvent) {
            stopped = true;
            window.removeEventListener("message", ok);
            resolve(event);
        };

        window.addEventListener("message", connected);

        const ping = function run() {
            if (!stopped) {
                iframe.contentWindow.postMessage({
                    type: REQUESTS_DICTIONARY.get("toggleGrid").request,
                    value
                }, "*");
                setTimeout(run, 50);
            }
        };

        ping();
    });
}

/**
 * Helper functions to keep editor settings in localStorage
 */
const localSettings = {
    init(settings: EditorOptions) {
        try {
            if (localStorage.getItem(SETTINGS_STORAGE_KEY)) {
                // Settings were already saved
                return;
            }

            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn("Couldn't set initial editor's settings:", e.message);
        }
    },

    update(name: string, setting: any) {
        try {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY));

            settings[name] = setting;
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn("Couldn't update editor's settings:", e.message);
        }
    },

    get(name: string) {
        try {
            return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY))[name];
        } catch (e) {
            console.warn("Couldn't read editor's setting,", name, ":", e.message);
        }

        return null;
    }
};

/**
 * Run save on Ctrl+S or Cmd+S
 */
window.addEventListener("keydown", (event) => {
    if (event.keyCode === 83 && (event.ctrlKey || event.metaKey)) {

        EditorActions.saveEditorContents();

        event.preventDefault();
        event.stopPropagation();
    }
});

/**
 * Check that number is valid and finite
 */
function isValidNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num);
}
