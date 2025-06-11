export function saveMap(mapData) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapData));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "map.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function loadMap(onLoad) {
  const fileLoader = document.getElementById('fileLoader');
  fileLoader.click();

  fileLoader.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      const data = JSON.parse(event.target.result);
      onLoad(data);
    };
    reader.readAsText(file);
  };
}
