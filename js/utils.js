export function isoToScreen(x, y, tileWidth, tileHeight) {
    const screenX = (x - y) * (tileWidth / 2);
    const screenY = (x + y) * (tileHeight / 2);
    return { screenX, screenY };
}

export function screenToIso(screenX, screenY, tileWidth, tileHeight) {
    const x = (screenX / (tileWidth / 2) + screenY / (tileHeight / 2)) / 2;
    const y = (screenY / (tileHeight / 2) - screenX / (tileWidth / 2)) / 2;
    return { x, y };
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
