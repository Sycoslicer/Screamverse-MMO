import { Tileset } from './tilesetLoader.js';

// Canvas Setup
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

// Map Config
const TILE_SIZE = 32;
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

// Initialize map with blank tiles
let map = Array.from({ length: MAP_WIDTH }, () =>
  Array.from({ length: MAP_HEIGHT }, () => 0)
);

// Load Tileset
let tileset = new Tileset("tilesets/basic.json");

await tileset.load();

// Draw entire grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      tileset.drawTile(ctx, map[x][y], x * TILE_SIZE, y * TILE_SIZE);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

// Handle click to cycle tile index
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const gridX = Math.floor(mouseX / TILE_SIZE);
  const gridY = Math.floor(mouseY / TILE_SIZE);

  if (gridX >= 0 && gridX < MAP_WIDTH && gridY >= 0 && gridY < MAP_HEIGHT) {
    const maxTileIndex = tileset.tilesPerRow * tileset.tilesPerRow;
    map[gridX][gridY] = (map[gridX][gridY] + 1) % maxTileIndex;
    drawGrid();
  }
});

// Initial render
drawGrid();
