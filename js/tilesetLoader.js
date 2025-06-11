export async function loadTileset() {
  const response = await fetch('tilesets/tileset.json');
  const data = await response.json();

  const image = new Image();
  image.src = `tilesets/${data.image}`;
  
  await new Promise(resolve => image.onload = resolve);

  return {
    image,
    tileWidth: data.tileWidth,
    tileHeight: data.tileHeight,
    columns: data.columns
  };
}
