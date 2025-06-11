import { layers, getActiveLayer } from './layers.js';
import { TILE_SIZE, tileImages } from './tiles.js';

export function drawGrid(ctx, width, height, camera) {
  const layer = getActiveLayer();
  ctx.clearRect(0, 0, width, height);
  
  for (let key in layer) {
    const [x, y] = key.split(',').map(Number);
    const data = layer[key];
    
    if (typeof data === 'object') {
      // For event tiles or complex data
      drawTile(ctx, "npc", x, y, camera);
    } else {
      // Default basic tile
      drawTile(ctx, "grass", x, y, camera);
    }
  }

  // Draw grid lines
  for (let x = 0; x < width; x += TILE_SIZE) {
    for (let y = 0; y < height; y += TILE_SIZE) {
      ctx.strokeStyle = "#444";
      ctx.strokeRect(x - camera.x % TILE_SIZE, y - camera.y % TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawTile(ctx, tileName, x, y, camera) {
  const img = tileImages[tileName];
  if (!img) return;
  ctx.drawImage(img, x * TILE_SIZE - camera.x, y * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
}
