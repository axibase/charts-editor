import { EditorActions, EditorOptions } from "./editorActions";
import { editor } from "monaco-editor-core";

interface WorkerPaths {
    EditorWorker: string;
    ChartsWorker: string;
}

/**
 * Class for editor instance creation and manipulation
 */
export class ChartsEditor {
    /** Init, format, getValue, etc — actions that deal with editor instance */
    public static editorActions: EditorActions = new EditorActions();

    /**
     * Create workers from script paths
     * @param paths 
     */
    public static initWorkers(paths: WorkerPaths): void {
        if (!paths) {
            throw new Error(`Can't create workers — worker paths are missing`)
        }
        /**
         * Initialize charts editor worker to perform
         *              validation, completion & formatting tasks
         */
        (<any>self).MonacoEnvironment = {
            getWorker: function (moduleId: string, label: string) {
                if (label === "axibaseCharts") {

                    return new Worker(`${paths.ChartsWorker}?v=${CURRENT_TIME}`);
                }

                return new Worker(paths.EditorWorker);
            }
        };

    }

    /**
     * Create editor instance
     * @param options 
     */
    public static create(options: EditorOptions): editor.ICodeEditor {
        ChartsEditor.editorActions.initEditor(options);

        return ChartsEditor.editorActions.chartsEditor;
    }

    /**
     * Create editor instance from textarea
     * @param element 
     * @param options 
     */
    public static fromTextArea(element: HTMLTextAreaElement, options: EditorOptions): editor.ICodeEditor {
        if (!element) {
            console.warn('Can\'t create editor from textarea. Element is missing');
            return null;
        }

        element.style.display = 'none';
        options.value = element.value;
        return ChartsEditor.create(options);
    }
}
