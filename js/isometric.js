export function isoToScreen(x, y, tileSize) {
  return {
    x: (x - y) * tileSize / 2,
    y: (x + y) * tileSize / 4
  };
}

export function screenToIso(screenX, screenY, tileSize) {
  const isoX = (screenX / (tileSize / 2) + screenY / (tileSize / 4)) / 2;
  const isoY = (screenY / (tileSize / 4) - screenX / (tileSize / 2)) / 2;
  return { x: Math.floor(isoX), y: Math.floor(isoY) };
}
