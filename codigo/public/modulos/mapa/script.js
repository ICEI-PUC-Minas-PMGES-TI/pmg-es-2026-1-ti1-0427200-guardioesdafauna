const SERVER_URL = "http://localhost:3000";
const BELO_HORIZONTE_COORDS = [-19.922731, -43.945094];

const modal = document.getElementById("camera-modal");
const close = document.getElementById("close");
const cancel = document.getElementById("cancel");
const addCamera = document.getElementById("add-camera");
const cameraCount = document.getElementById("camera-count");
const createCameraForm = document.getElementById("create-camera-form");
const cameraSearch = document.getElementById("camera-search");

let cameras = [];
let map = L.map("map").setView(BELO_HORIZONTE_COORDS, 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

const cameraMarkersLayer = L.layerGroup().addTo(map);
const normalizeSearchTerm = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const buildMarkerPopup = (camera) => `
   <article class="popup">
      <header>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpsCk-K1JX2HmjeCAPf4JH-Khp8WU_81nJ0Q&s"
          alt=""
        />
        <span class="popup-badge">⚡ Camera Trap</span>
        <strong class="popup-id">ID - ${camera.identifier}</strong>
      </header>

      <section class="popup-details">
        <div>
          <span>Apelido: </span>
          <strong>${camera.nickname}</strong>
        </div>
        <div>
          <span>Data de instalação: </span>
          <strong>${new Date(camera.installationDate).toLocaleDateString()}</strong>
        </div>
      </section>

      <footer>
        <button onclick="closeCameraPopupHtmlInline()" class="close-popup">Fechar</button>
        <button onclick="deleteCamera('${camera.id}', '${camera.identifier}')" class="delete-camera">Deletar</button>
      </footer>
    </article>
`;

const openCameraModal = () => {
  modal.classList.add("is-open");
};

const closeCameraModal = () => {
  modal.classList.remove("is-open");
};

function closeCameraPopupHtmlInline() {
  map.closePopup();
}

const resetCameraForm = () => {
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

const filterCameras = (searchTerm) => {
  const normalizedSearchTerm = normalizeSearchTerm(searchTerm);

  if (!normalizedSearchTerm) return cameras;

  return cameras.filter((camera) => {
    const identifier = normalizeSearchTerm(camera.identifier ?? "");
    const nickname = normalizeSearchTerm(camera.nickname ?? "");

    return (
      identifier.includes(normalizedSearchTerm) ||
      nickname.includes(normalizedSearchTerm)
    );
  });
};

const renderCameraMarkers = (availableCameras = cameras) => {
  cameraMarkersLayer.clearLayers();
  cameraCount.textContent = `${availableCameras.length} câmeras`;

  for (const camera of availableCameras) {
    const marker = L.marker([camera.latitude, camera.longitude]).addTo(
      cameraMarkersLayer,
    );
    const popup = buildMarkerPopup(camera);
    marker.bindPopup(popup);
  }
};

const insertCamera = async (e) => {
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

    cameras = await fetchCameras();
    renderCameraMarkers(filterCameras(cameraSearch.value));
    resetCameraForm();
    closeCameraModal();
  } catch (error) {
    console.error(error);
    alert("Não foi possível inserir nova câmera.");
  }
};

async function deleteCamera(id, identifier) {
  if (confirm(`Certeza que deseja deletar a câmera: ${identifier} ?`)) {
    try {
      const response = await fetch(`${SERVER_URL}/cameras/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar câmera");

      cameras = await fetchCameras();
      renderCameraMarkers(filterCameras(cameraSearch.value));
      closeCameraModal();
    } catch (error) {
      console.error(error);
      alert("Não foi possível deletar a câmera.");
    }
  }
}

const setupModalEvents = () => {
  close.onclick = closeCameraModal;
  cancel.onclick = closeCameraModal;
  addCamera.onclick = openCameraModal;

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeCameraModal();
  });
};

const setupFormEvents = () => {
  createCameraForm.addEventListener("submit", insertCamera);
};

const setupSearchEvents = () => {
  cameraSearch.addEventListener("input", (event) => {
    renderCameraMarkers(filterCameras(event.target.value));
  });
};

const init = async () => {
  setupFormEvents();
  setupModalEvents();
  setupSearchEvents();
  cameras = await fetchCameras();
  renderCameraMarkers();
};

init();
