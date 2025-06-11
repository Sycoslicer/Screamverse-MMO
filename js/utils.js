export function worldToScreen(x, y, tileWidth, tileHeight, offsetX, offsetY, zoom) {
  let screenX = (x - y) * tileWidth / 2 * zoom + offsetX;
  let screenY = (x + y) * tileHeight / 4 * zoom + offsetY;
  return { screenX, screenY };
}

export function screenToWorld(screenX, screenY, tileWidth, tileHeight, offsetX, offsetY, zoom) {
  screenX = (screenX - offsetX) / zoom;
  screenY = (screenY - offsetY) / zoom;
  let worldX = (screenY / (tileHeight / 4) + screenX / (tileWidth / 2)) / 2;
  let worldY = (screenY / (tileHeight / 4) - screenX / (tileWidth / 2)) / 2;
  return { worldX: Math.floor(worldX), worldY: Math.floor(worldY) };
}
