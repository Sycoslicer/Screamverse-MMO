import { loadTileset } from './tilesetLoader.js';
import { setupTilePicker } from './tilePicker.js';
import { saveMap, loadMap } from './saveLoad.js';
import { drawMap } from './isometric.js';

let map, tileset, selectedTile = 0, offsetX = 512, offsetY = 256, zoom = 1;

document.addEventListener('DOMContentLoaded', async () => {
  tileset = await loadTileset();
  setupTilePicker(tileset, tile => selectedTile = tile);
  
  createNewMap();
  const canvas = document.getElementById('mapCanvas');
  const ctx = canvas.getContext('2d');

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offsetX) / (tileset.tileWidth * zoom / 2) + (e.clientY - rect.top - offsetY) / (tileset.tileHeight * zoom / 4)) / 2;
    const y = Math.floor((e.clientY - rect.top - offsetY) / (tileset.tileHeight * zoom / 4) - (e.clientX - rect.left - offsetX) / (tileset.tileWidth * zoom / 2)) / 2;
    if (x >= 0 && y >= 0 && x < map.width && y < map.height) {
      map.data[Math.floor(y)][Math.floor(x)] = selectedTile;
    }
    drawMap(ctx, map, tileset, selectedTile, offsetX, offsetY, zoom);
  });

  document.getElementById('saveButton').addEventListener('click', () => saveMap(map));
  document.getElementById('loadButton').addEventListener('click', () => loadMap(loadedMap => {
    map = loadedMap;
    drawMap(ctx, map, tileset, selectedTile, offsetX, offsetY, zoom);
  }));
  document.getElementById('newMapBtn').addEventListener('click', () => {
    createNewMap();
    drawMap(ctx, map, tileset, selectedTile, offsetX, offsetY, zoom);
  });

  drawMap(ctx, map, tileset, selectedTile, offsetX, offsetY, zoom);
});

function createNewMap() {
  map = {
    width: 64,
    height: 64,
    data: Array(64).fill().map(() => Array(64).fill(null))
  };
}
