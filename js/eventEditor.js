import { mapData, setEventAtTile } from './main.js';

export function initEventEditor() {
  const eventEditor = document.getElementById("eventEditor");
  const eventType = document.getElementById("eventType");
  const eventData = document.getElementById("eventData");
  const saveEvent = document.getElementById("saveEvent");
  const cancelEvent = document.getElementById("cancelEvent");
  const openEventEditor = document.getElementById("openEventEditor");

  let targetTile = null;

  openEventEditor.addEventListener("click", () => {
    eventEditor.classList.toggle("hidden");
  });

  document.getElementById("mapCanvas").addEventListener("click", (e) => {
    if (document.getElementById("toolSelector").value !== "event") return;

    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 32);
    const y = Math.floor((e.clientY - rect.top) / 32);
    targetTile = { x, y };

    eventEditor.classList.remove("hidden");
  });

  saveEvent.addEventListener("click", () => {
    if (!targetTile) return;
    const eventObj = {
      type: eventType.value,
      data: eventData.value
    };
    setEventAtTile(targetTile.x, targetTile.y, eventObj);
    eventEditor.classList.add("hidden");
  });

  cancelEvent.addEventListener("click", () => {
    eventEditor.classList.add("hidden");
  });
}
