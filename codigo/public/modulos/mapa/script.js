const SERVER_URL = "http://localhost:3000";

let map = L.map("map").setView([-19.922731, -43.945094], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

const modal = document.getElementById("camera-modal");
const close = document.getElementById("close");
const cancel = document.getElementById("cancel");
const addCamera = document.getElementById("add-camera");
const cameraCount = document.getElementById("camera-count")

const openCameraModal = () => {
  modal.classList.add("is-open");
};

const closeCameraModal = () => {
  modal.classList.remove("is-open");
};

const handleOnClickAddCamera = () => {
  openCameraModal();
};

addCamera.onclick = handleOnClickAddCamera;
close.onclick = closeCameraModal;
cancel.onclick = closeCameraModal;
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeCameraModal();
});

const fetchCameras = async () => {
  const camerasRequests = await fetch(`${SERVER_URL}/cameras`, {
    cache: "force-cache",
  });
  const cameras = await camerasRequests.json();

  return cameras;
};

const renderCameraMarkers = async (camera) => {
  const availableCameras = await fetchCameras();

  cameraCount.innerHTML = `${availableCameras.length} câmeras`

  availableCameras.forEach((camera) =>
    L.marker([camera.latitude, camera.longitude]).addTo(map),
  );
};

renderCameraMarkers();
