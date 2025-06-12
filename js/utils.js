export const TILE_SIZE = 32;

export function getTileSource(tileIndex) {
    return {
        sx: (tileIndex - 1) * TILE_SIZE,
        sy: 0
    };
}
