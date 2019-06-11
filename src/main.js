import "../monaco/monaco.contribution";
import "./main.css";

self.MonacoEnvironment = {
  getWorker: function () {
		return new Worker('./dist/charts.worker.js');
	}
};

