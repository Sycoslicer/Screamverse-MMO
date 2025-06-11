import { worldToScreen } from './utils.js';

export function drawMap(ctx, map, tileset, selectedTile, offsetX, offsetY, zoom) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.data[y][x];
      if (tile === null) continue;
      
      const { screenX, screenY } = worldToScreen(x, y, tileset.tileWidth, tileset.tileHeight, offsetX, offsetY, zoom);
      const sx = (tile % tileset.columns) * tileset.tileWidth;
      const sy = Math.floor(tile / tileset.columns) * tileset.tileHeight;
      
      ctx.drawImage(
        tileset.image,
        sx, sy, tileset.tileWidth, tileset.tileHeight,
        screenX, screenY, tileset.tileWidth * zoom, tileset.tileHeight * zoom
      );
    }
  }
}
