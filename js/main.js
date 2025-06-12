import { loadTileSet, tileSet, TILE_SIZE, tileCountX, tileCountY } from './tileLoader.js';
import { saveMap, loadMap } from './saveLoad.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let tool = 'paint';
let currentLayer = 'ground';
let mapWidth = 100;
let mapHeight = 100;
let mapData = {};
let offsetX = 0;
let offsetY = 0;
let zoom = 1;
let selectedTile = 0;
let isPanning = false;
let lastMouseX = 0;
let lastMouseY = 0;

let selection = null;
let clipboard = null;
let undoStack = [];

// Initialize blank map
function initMap() {
  mapData = {};
  ['ground', 'objects', 'collision', 'events'].forEach(layer => {
    mapData[layer] = [];
    for (let y = 0; y < mapHeight; y++) {
      mapData[layer][y] = [];
      for (let x = 0; x < mapWidth; x++) {
        mapData[layer][y][x] = -1;
      }
    }
  });
  pushUndo();
  render();
}

function pushUndo() {
  undoStack.push(JSON.stringify(mapData));
  if (undoStack.length > 20) undoStack.shift();
}

function undo() {
  if (undoStack.length > 1) {
    undoStack.pop();
    mapData = JSON.parse(undoStack[undoStack.length - 1]);
    render();
  }
}

function save() { pushUndo(); }

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      ['ground', 'objects', 'collision', 'events'].forEach(layer => {
        const tileIndex = mapData[layer][y][x];
        if (tileIndex >= 0) {
          const sx = (tileIndex % tileCountX) * TILE_SIZE;
          const sy = Math.floor(tileIndex / tileCountX) * TILE_SIZE;
          ctx.drawImage(tileSet, sx, sy, TILE_SIZE, TILE_SIZE, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      });
    }
  }

  if (selection) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(selection.x * TILE_SIZE, selection.y * TILE_SIZE, selection.w * TILE_SIZE, selection.h * TILE_SIZE);
  }

  ctx.restore();
}

function getTilePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(((evt.clientX - rect.left - offsetX) / zoom) / TILE_SIZE);
  const y = Math.floor(((evt.clientY - rect.top - offsetY) / zoom) / TILE_SIZE);
  return {x, y};
}

canvas.addEventListener('mousedown', evt => {
  if (evt.button === 2) {
    isPanning = true;
    lastMouseX = evt.clientX;
    lastMouseY = evt.clientY;
    return;
  }

  const pos = getTilePos(evt);
  if (tool === 'paint') {
    mapData[currentLayer][pos.y][pos.x] = selectedTile;
    save();
    render();
  } else if (tool === 'erase') {
    mapData[currentLayer][pos.y][pos.x] = -1;
    save();
    render();
  } else if (tool === 'select') {
    selection = {x: pos.x, y: pos.y, w: 1, h: 1};
  }
});

canvas.addEventListener('mousemove', evt => {
  if (isPanning) {
    offsetX += evt.clientX - lastMouseX;
    offsetY += evt.clientY - lastMouseY;
    lastMouseX = evt.clientX;
    lastMouseY = evt.clientY;
    render();
  }
});

canvas.addEventListener('mouseup', evt => {
  if (isPanning) {
    isPanning = false;
    return;
  }

  if (tool === 'select' && selection) {
    const pos = getTilePos(evt);
    selection.w = pos.x - selection.x + 1;
    selection.h = pos.y - selection.y + 1;
    render();
  }
});

document.addEventListener('keydown', evt => {
  if (evt.ctrlKey && evt.key === 'c' && selection) {
    clipboard = JSON.stringify(selection);
  }
  if (evt.ctrlKey && evt.key === 'v' && clipboard) {
    const data = JSON.parse(clipboard);
    for (let y = 0; y < data.h; y++) {
      for (let x = 0; x < data.w; x++) {
        mapData[currentLayer][data.y + y][data.x + x] = mapData[currentLayer][data.y + y][data.x + x];
      }
    }
    render();
  }
  if (evt.ctrlKey && evt.key === 'z') {
    undo();
  }
});

document.getElementById('toolSelector').addEventListener('change', e => {
  tool = e.target.value;
  selection = null;
  render();
});

document.getElementById('layerSelector').addEventListener('change', e => {
  currentLayer = e.target.value;
  render();
});

document.getElementById('saveButton').addEventListener('click', () => saveMap(mapData));
document.getElementById('loadButton').addEventListener('click', () => document.getElementById('fileLoader').click());
document.getElementById('fileLoader').addEventListener('change', e => {
  const file = e.target.files[0];
  loadMap(file, data => {
    mapData = data;
    pushUndo();
    render();
  });
});

canvas.addEventListener('wheel', e => {
  zoom *= e.deltaY < 0 ? 1.1 : 0.9;
  render();
});

loadTileSet('./tilesets/tileset.png', () => {
  initMap();
});
