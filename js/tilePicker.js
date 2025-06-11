const tilePicker = document.getElementById("tilePicker");
let selectedTile = null;

export function initTilePicker() {
  const colors = ["#666", "#888", "#aaa", "#ccc"];
  colors.forEach(color => {
    const btn = document.createElement("div");
    btn.classList.add("tile-button");
    btn.style.backgroundColor = color;
    btn.addEventListener("click", () => {
      selectedTile = { color };
    });
    tilePicker.appendChild(btn);
  });
}

export function getSelectedTile() {
  return selectedTile;
}
