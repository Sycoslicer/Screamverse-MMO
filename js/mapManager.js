export function generateEmptyMap(width, height, layers) {
  const mapData = {};
  layers.forEach(layer => {
    mapData[layer] = [];
    for (let y = 0; y < height; y++) {
      mapData[layer][y] = [];
      for (let x = 0; x < width; x++) {
        mapData[layer][y][x] = -1;
      }
    }
  });
  return mapData;
}
