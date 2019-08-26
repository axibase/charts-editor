import { EditorActions, EditorOptions } from "./editorActions";
import { editor } from "monaco-editor-core";
import { version } from "../package.json";

interface WorkerPaths {
    EditorWorker: string;
    ChartsWorker: string;
}

class EditorAPI {
    public editorActions: EditorActions = new EditorActions();

    public initWorkers(paths: WorkerPaths): void {
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
                    console.log(`Worker is initing, its url is ${paths.ChartsWorker}?v=${version}`);
                    
                    return new Worker(`${paths.ChartsWorker}?v=${version}`);
                }

                return new Worker(paths.EditorWorker);
            }
        };

    }

    public create(options: EditorOptions): editor.ICodeEditor {
        this.editorActions.initEditor(options);

        return this.editorActions.chartsEditor;
    }

    public fromTextArea(element: HTMLTextAreaElement, options: EditorOptions): editor.ICodeEditor {
        if (!element) {
            console.warn('Can\'t create editor from textarea. Element is missing');
            return null;
        }

        element.style.display = 'none';
        options.value = element.value;
        return this.create(options);
    }
}

export const API = new EditorAPI();
