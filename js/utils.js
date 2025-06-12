export function saveToFile(content, filename) {
  const blob = new Blob([content], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadFromFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(JSON.parse(reader.result));
  reader.readAsText(file);
}
