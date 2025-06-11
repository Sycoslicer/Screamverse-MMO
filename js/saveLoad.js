import { events } from './eventSystem.js';

export function saveMap(map, layers) {
  const data = { map, layers, events };
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'map.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function loadMap(file, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    callback(data);
  };
  reader.readAsText(file);
}
