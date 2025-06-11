export const tiles = [
  { id: 1, name: 'Grass', src: 'tiles/grass.png' },
  { id: 2, name: 'Water', src: 'tiles/water.png' },
  { id: 3, name: 'Dirt', src: 'tiles/dirt.png' }
];

export function loadTiles(callback) {
  let loaded = 0;
  tiles.forEach(tile => {
    const img = new Image();
    img.src = tile.src;
    img.onload = () => {
      tile.image = img;
      if (++loaded === tiles.length) callback();
    }
  });
}
