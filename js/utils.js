import { isoToScreen, TILE_WIDTH, TILE_HEIGHT } from './isometric.js';
import { tileImage } from './tilePicker.js';

export function drawGrid(ctx, mapData, mapWidth, mapHeight, offsetX, offsetY, zoom, selectedTile, activeLayer) {
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const [screenX, screenY] = isoToScreen(x, y);
      let tile = mapData[activeLayer][y][x];
      if (tile >= 0) {
        ctx.drawImage(tileImage, tile * TILE_WIDTH, 0, TILE_WIDTH, TILE_HEIGHT, screenX, screenY, TILE_WIDTH, TILE_HEIGHT);
      }
      // optional: draw tile border
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.strokeRect(screenX, screenY, TILE_WIDTH, TILE_HEIGHT);
    }
  }
  ctx.restore();
}
