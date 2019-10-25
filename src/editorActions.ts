import { editor } from "monaco-editor-core";

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
    gridEnabled?: boolean;
}

interface Subscriber {
    Subject: HTMLElement;
    Action: () => void;
}

// tslint:disable-next-line: no-empty
const FN_NOOP = () => { };
const SETTINGS_STORAGE_KEY = "ChartsEditorSettings";
const DEFAULT_TAB_SIZE: number = 2;

export class EditorActions {
    /**
     * Some actions not connected with editor instance which should be performed on save
     * @param onSave
     */
    // tslint:disable-next-line: ban-types
    public static saveEditorContents(onSave: Function = FN_NOOP) {
        onSave();
    }
    public chartsEditor: editor.ICodeEditor;
    public gridEnabled: boolean = false;
    private subscribers: Subscriber[] = [];

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
        this.gridEnabled = options.gridEnabled || false;

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
            fontSize,
            gridEnabled: /grid-display\s*=\strue/gm.test(value)
        });

        const editorHolder = document.getElementById(editorId);

        if (!editorHolder) {
            console.log("Editor holder with id «" + editorId + "» not found");
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
        this.chartsEditor.getModel().onDidChangeContent(onChange);

        EditorActions.saveEditorContents.bind(null, onSave);
    }

    public toggleGrid(): void {
        this.gridEnabled = !this.gridEnabled;
        sendMessage(this.gridEnabled).then(() => this.notifyControl());
        localSettings.update("gridEnabled", this.gridEnabled);
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

    public subscribeControl(button: HTMLElement, action: () => void): void {
        console.log("subscribed a button");
        console.log(this, "this from subscribe")
        this.subscribers.push({
            Action: action,
            Subject: button
        });
    }

    private notifyControl(): void {
        console.log("subscribers are notified");
        console.log(this)
        for (let { Subject, Action } of this.subscribers) {
            const func = Action.bind(Subject);
            func();
        }
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
}

function sendMessage(value: boolean = false) {
    const gridButton = document.getElementById("gridBtn");
    return new Promise((resolve, reject) => {
        let stopped = false;

        setTimeout((message) => {
            stopped = true;
            reject(message);
        }, 3000, "timeout");

        const connected = function ok(event: MessageEvent) {
            stopped = true;
            if (event.data.type === "axiToggleGridResponse") {
                gridButton.classList.toggle("active", event.data.value);
            }
            window.removeEventListener("message", ok);
            resolve();
        };

        window.addEventListener("message", connected);

        const ping = function run() {
            if (!stopped) {
                (document.getElementById("portal") as HTMLIFrameElement).contentWindow.postMessage({
                    type: "axiToggleGrid",
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

document.getElementById("portal").addEventListener("load", () => {
    const gridEnabled = localSettings.get("gridEnabled") || false;
    sendMessage(gridEnabled).then(() => console.log("portal connected after reload"));
});
