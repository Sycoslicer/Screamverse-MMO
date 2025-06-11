export function setupTilePicker(tileset, onSelect) {
  const tilePicker = document.getElementById('tilePicker');
  for (let i = 0; i < tileset.columns * (tileset.image.height / tileset.tileHeight); i++) {
    const button = document.createElement('div');
    button.classList.add('tile-button');
    button.style.backgroundImage = `url(tilesets/${tileset.image.src.split('/').pop()})`;
    
    const x = (i % tileset.columns) * tileset.tileWidth;
    const y = Math.floor(i / tileset.columns) * tileset.tileHeight;
    button.style.backgroundPosition = `-${x}px -${y}px`;
    
    button.addEventListener('click', () => onSelect(i));
    tilePicker.appendChild(button);
  }
}
