// For: nodeunit
window._browserRunner = {
  events: []
};

var worker = new Worker('./worker-bundle.js');
var consoleEl = document.querySelector('.console');

function fire(event, detail) {
  window._browserRunner.events.push({
    event: event,
    detail: detail
  });
}

worker.onmessage = function (e) {
  if (e.data.method) {
    switch (e.data.method) {
      case 'fire':
        fire(e.data.params.event, e.data.params.data);
        break;
      case 'console':
        fire('console', e.data.params);
        console[e.data.params.level].apply(console, e.data.params.message);
        break;
      case 'ready':
        fire('ready');
        worker.postMessage(location.search.slice(1));
        break;
      default:
        console.error('Unknown method', e.data.method);
    }
  }
};

