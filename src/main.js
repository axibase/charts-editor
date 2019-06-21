import "../monaco/monaco.contribution";

self.MonacoEnvironment = {
  getWorker: function () {
		return new Worker('./dist/charts.worker.js');
	}
};

