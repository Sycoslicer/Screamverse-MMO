import { TILE_WIDTH, TILE_HEIGHT, MAP_WIDTH, MAP_HEIGHT, TILESET_COLUMNS } from './isometric.js';
import { screenToIso, isoToScreen } from './utils.js';
import { loadTilePicker, selectedTile, tilesetImage } from './tilePicker.js';
import { saveMap, loadMap } from './saveLoad.js';

let canvas = document.getElementById("mapCanvas");
let ctx = canvas.getContext("2d");

let map = [];
for (let x = 0; x < MAP_WIDTH; x++) {
  map[x] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map[x][y] = -1;
  }
}

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      const tileIndex = map[x][y];
      const { isoX, isoY } = screenToIso(x, y, TILE_WIDTH, TILE_HEIGHT);
      const drawX = (canvas.width / 2) + isoX;
      const drawY = 100 + isoY;

      if (tileIndex >= 0) {
        const sx = (tileIndex % TILESET_COLUMNS) * TILE_WIDTH;
        const sy = Math.floor(tileIndex / TILESET_COLUMNS) * TILE_HEIGHT;
        ctx.drawImage(tilesetImage, sx, sy, TILE_WIDTH, TILE_HEIGHT, drawX, drawY, TILE_WIDTH, TILE_HEIGHT);
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(drawX, drawY, TILE_WIDTH, TILE_HEIGHT);
      }
    }
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left - canvas.width / 2;
  const mouseY = e.clientY - rect.top - 100;
  const { x, y } = isoToScreen(mouseX, mouseY, TILE_WIDTH, TILE_HEIGHT);
  const gridX = Math.floor(x);
  const gridY = Math.floor(y);

  if (gridX >= 0 && gridX < MAP_WIDTH && gridY >= 0 && gridY < MAP_HEIGHT) {
    map[gridX][gridY] = selectedTile;
    drawMap();
  }
});

document.getElementById("newMapButton").addEventListener("click", () => {
  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      map[x][y] = -1;
    }
  }
  drawMap();
});

document.getElementById("saveButton").addEventListener("click", () => {
  saveMap(map);
});

document.getElementById("loadButton").addEventListener("click", () => {
  document.getElementById("fileLoader").click();
});

document.getElementById("fileLoader").addEventListener("change", (e) => {
  const file = e.target.files[0];
  loadMap(file, (loadedMap) => {
    map = loadedMap;
    drawMap();
  });
});

loadTilePicker();
drawMap();
