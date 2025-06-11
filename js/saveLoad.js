import { createEmptyMap } from './utils.js';

export function saveMap(data) {
  localStorage.setItem("mapData", JSON.stringify(data));
}

export function loadMap() {
  const saved = localStorage.getItem("mapData");
  if (saved) {
    return JSON.parse(saved);
  }
  return createEmptyMap();
}

export function exportMap(data) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mapData.json";
  a.click();
}

export function importMap(callback) {
  const fileInput = document.getElementById("fileLoader");
  fileInput.click();
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const data = JSON.parse(e.target.result);
      callback(data);
    };
    reader.readAsText(file);
  };
}
