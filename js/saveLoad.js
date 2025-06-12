import { saveToFile, loadFromFile } from './utils.js';

export function saveMap(mapData) {
  saveToFile(JSON.stringify(mapData), 'map.json');
}

export function loadMap(file, callback) {
  loadFromFile(file, callback);
}
