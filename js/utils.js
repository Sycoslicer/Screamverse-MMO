export function screenToIso(x, y, tileWidth, tileHeight) {
  let isoX = (x - y) * tileWidth / 2;
  let isoY = (x + y) * tileHeight / 2;
  return { isoX, isoY };
}

export function isoToScreen(isoX, isoY, tileWidth, tileHeight) {
  let x = (isoX / (tileWidth / 2) + isoY / (tileHeight / 2)) / 2;
  let y = (isoY / (tileHeight / 2) - (isoX / (tileWidth / 2))) / 2;
  return { x, y };
}
