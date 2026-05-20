const SERVER_URL = "http://localhost:3000";
const BELO_HORIZONTE_COORDS = [-19.922731, -43.945094];

const modal = document.getElementById("camera-modal");
const close = document.getElementById("close");
const cancel = document.getElementById("cancel");
const addCamera = document.getElementById("add-camera");
const cameraCount = document.getElementById("camera-count");
const createCameraForm = document.getElementById("create-camera-form");

let map = L.map("map").setView(BELO_HORIZONTE_COORDS, 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

const cameraMarkersLayer = L.layerGroup().addTo(map);
const customMarkerPopup = `
  <div>
    <p>Custom popup</p>
  </div>
`;

const openCameraModal = () => {
  modal.classList.add("is-open");
};

const closeCameraModal = () => {
  modal.classList.remove("is-open");
};

const resetForm = () => {
  createCameraForm.reset();
};

const fetchCameras = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/cameras`);
    if (!response.ok) {
      throw new Error("Erro ao buscar câmeras");
    }

    const cameras = await response.json();
    return cameras;
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar as câmeras.");
    return [];
  }
};

const renderCameraMarkers = async (camera) => {
  cameraMarkersLayer.clearLayers();

  const availableCameras = await fetchCameras();
  cameraCount.innerHTML = `${availableCameras.length} câmeras`;

  for (camera of availableCameras) {
    const marker = L.marker([camera.latitude, camera.longitude]).addTo(
      cameraMarkersLayer,
    );
    marker.bindPopup(customMarkerPopup);
  }
};

addCamera.onclick = openCameraModal;
close.onclick = closeCameraModal;
cancel.onclick = closeCameraModal;
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeCameraModal();
});

renderCameraMarkers();

createCameraForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = e.target["camera-id"].value;
  const nickname = e.target["nickname"].value;
  const latitude = Number(e.target["x-coordinate"].value);
  const longitude = Number(e.target["y-coordinate"].value);
  const batteryLifeSpanInWeeks = e.target["battery-lifespan"].value;
  const installationDate = e.target["installation-date"].value;

  try {
    const response = await fetch(`${SERVER_URL}/cameras`, {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier,
        nickname,
        latitude,
        longitude,
        batteryLifeSpanInWeeks,
        installationDate,
      }),
    });

    if (!response.ok) throw new Error("Erro ao inserir câmera");
  } catch (error) {
    console.error(error);
    alert("Não foi possível inserir nova câmera.");
  }

  await renderCameraMarkers();
  resetForm();
  closeCameraModal();
});
