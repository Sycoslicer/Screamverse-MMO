export function saveMap(mapData) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapData));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "map.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function loadMap(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const json = JSON.parse(e.target.result);
    callback(json);
  };
  reader.readAsText(file);
}
