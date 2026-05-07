let map = L.map("map").setView([-19.922731, -43.945094], 13);

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    maxZoom: 19,
  },
).addTo(map);

window.addEventListener("load", () => {
  map.invalidateSize();
});

const modal = document.getElementById("camera-modal");
const close = document.getElementById("close");
const cancel = document.getElementById("cancel")

const openCameraModal = () => {
  modal.classList.add("is-open");
};

const closeCameraModal = () => {
  modal.classList.remove("is-open");
};

const handleOnClickAddCamera = () => {
  openCameraModal();
};

document.getElementById("add-camera").onclick = handleOnClickAddCamera;
close.onclick = closeCameraModal;
cancel.onclick = closeCameraModal

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeCameraModal();
});
