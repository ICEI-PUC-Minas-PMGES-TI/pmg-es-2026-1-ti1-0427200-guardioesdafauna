const UPLOADS_API_ROOT = window.location.origin;

const table = document.getElementById("uploads-table-body");
const message = document.getElementById("message");
const summary = document.getElementById("upload-summary");
const nameInput = document.getElementById("name-filter");
const cameraInput = document.getElementById("camera-filter");
const statusInput = document.getElementById("status-filter");
const sortInput = document.getElementById("sort-filter");
const clearFiltersButton = document.getElementById("clear-filters");
const uploadForm = document.getElementById("upload-form");
const cameraSelect = document.getElementById("camera-select");
const uploadFeedback = document.getElementById("upload-feedback");
const resetUploadFormButton = document.getElementById("reset-upload-form");

let uploads = [];
let cameras = [];

function getCameraName(cameraId) {
  const camera = cameras.find((item) => item.id === cameraId);
  if (!camera) return cameraId || "Não informada";
  return camera.nickname || camera.identifier || camera.id;
}

function getStatusLabel(status) {
  const labels = {
    approved: "Aprovado",
    pending: "Pendente",
    rejected: "Rejeitado",
    "in-evaluation": "Em avaliação",
  };

  return labels[status] || "Sem status";
}

function getStatusClass(status) {
  if (status === "approved") return "is-success";
  if (status === "rejected") return "is-danger";
  if (status === "pending" || status === "in-evaluation") return "is-warning";
  return "is-neutral";
}

function formatDate(dateValue) {
  if (!dateValue) return "Sem data";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleString("pt-BR");
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

function buildSummary() {
  const counters = {
    total: uploads.length,
    approved: uploads.filter((item) => item.file?.status === "approved").length,
    review: uploads.filter((item) => item.file?.status === "in-evaluation")
      .length,
    rejected: uploads.filter((item) => item.file?.status === "rejected").length,
  };

  const items = [
    { label: "Total de uploads", value: counters.total },
    { label: "Aprovados", value: counters.approved },
    { label: "Em avaliação", value: counters.review },
    { label: "Rejeitados", value: counters.rejected },
  ];

  summary.innerHTML = items
    .map((item) => {
      const width = counters.total
        ? Math.round((item.value / counters.total) * 100)
        : 0;
      return `
        <div class="chart-bar">
          <div class="chart-bar__meta">
            <strong>${item.label}</strong>
            <span>${item.value}</span>
          </div>
          <div class="chart-bar__track">
            <div class="chart-bar__fill" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function fillCameraOptions() {
  const options = cameras
    .map(
      (camera) =>
        `<option value="${camera.id}">${camera.nickname || camera.identifier || camera.id}</option>`,
    )
    .join("");

  cameraInput.innerHTML =
    '<option value="">Todas as câmeras</option>' + options;
  cameraSelect.innerHTML =
    '<option value="">Selecione uma câmera</option>' + options;
}

function sortRows(rows) {
  const sortValue = sortInput.value;

  if (sortValue === "date-asc") {
    rows.sort(
      (a, b) => new Date(a.file?.createdAt) - new Date(b.file?.createdAt),
    );
  }

  if (sortValue === "date-desc") {
    rows.sort(
      (a, b) => new Date(b.file?.createdAt) - new Date(a.file?.createdAt),
    );
  }

  if (sortValue === "status-asc") {
    rows.sort((a, b) =>
      String(a.file?.status || "").localeCompare(String(b.file?.status || "")),
    );
  }

  if (sortValue === "status-desc") {
    rows.sort((a, b) =>
      String(b.file?.status || "").localeCompare(String(a.file?.status || "")),
    );
  }

  return rows;
}

function render() {
  const nameFilter = (nameInput.value || "").trim().toLowerCase();
  const cameraFilter = cameraInput.value || "";
  const statusFilter = statusInput.value || "";

  const rows = sortRows(
    uploads.filter((upload) => {
      const file = upload.file || {};
      const nameOk = String(file.name || "")
        .toLowerCase()
        .includes(nameFilter);
      const cameraOk = cameraFilter === "" || upload.cameraId === cameraFilter;
      const statusOk = statusFilter === "" || file.status === statusFilter;
      return nameOk && cameraOk && statusOk;
    }),
  );

  message.textContent = rows.length
    ? `${rows.length} upload(s) encontrado(s).`
    : "Nenhum upload encontrado.";

  if (!rows.length) {
    table.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">Sem resultados para filtros atuais.</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = rows
    .map((upload) => {
      const file = upload.file || {};
      return `
        <tr>
          <td>
            <strong>${file.name || "Arquivo sem nome"}</strong><br />
            <span>${file.type || "Tipo não informado"}</span>
          </td>
          <td>${getCameraName(upload.cameraId)}</td>
          <td><span class="status-badge ${getStatusClass(file.status)}">${getStatusLabel(file.status)}</span></td>
          <td>${formatDate(file.createdAt)}</td>
          <td>${file.sizeInKbs || 0} KB</td>
          <td>${upload.location || "Sem localização"}<br /><span>${upload.description || "Sem descrição"}</span></td>
          <td>
            <div class="button-row">
              <button class="button-danger action-button" type="button" onclick="deleteUpload('${upload.id}')">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

async function deleteUpload(id) {
  const shouldDelete = confirm("Deseja excluir este upload?");
  if (!shouldDelete) return;

  await fetch(`${UPLOADS_API_ROOT}/uploads/${id}`, { method: "DELETE" });
  await loadData();
}

async function handleUpload(event) {
  event.preventDefault();

  const file = document.getElementById("upload-file").files[0];
  if (!file) {
    uploadFeedback.textContent = "Selecione um arquivo para continuar.";
    return;
  }

  uploadFeedback.textContent = "Processando arquivo...";

  const content = await fileToDataUrl(file);
  const payload = {
    cameraId: cameraSelect.value,
    location: document.getElementById("upload-location").value.trim(),
    description: document.getElementById("upload-description").value.trim(),
    file: {
      name: file.name,
      sizeInKbs: Math.round(file.size / 1024),
      status: document.getElementById("upload-status").value,
      createdAt: document.getElementById("upload-datetime").value,
      type: file.type || "application/octet-stream",
      content,
    },
  };

  const response = await fetch(`${UPLOADS_API_ROOT}/uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    uploadFeedback.textContent = "Falha ao salvar upload.";
    return;
  }

  uploadFeedback.textContent = "Upload salvo com sucesso.";
  uploadForm.reset();
  document.getElementById("upload-status").value = "in-evaluation";
  setDefaultDateTime();
  await loadData();
}

function setDefaultDateTime() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - timezoneOffset * 60 * 1000);
  document.getElementById("upload-datetime").value = local
    .toISOString()
    .slice(0, 16);
}

async function loadData() {
  const [uploadsResponse, camerasResponse] = await Promise.all([
    fetch(`${UPLOADS_API_ROOT}/uploads`),
    fetch(`${UPLOADS_API_ROOT}/cameras`),
  ]);

  if (!uploadsResponse.ok || !camerasResponse.ok) {
    throw new Error("Falha ao carregar dados de upload.");
  }

  uploads = await uploadsResponse.json();
  cameras = await camerasResponse.json();

  fillCameraOptions();
  buildSummary();
  render();
}

nameInput.addEventListener("input", render);
cameraInput.addEventListener("input", render);
statusInput.addEventListener("input", render);
sortInput.addEventListener("input", render);
uploadForm.addEventListener("submit", handleUpload);
resetUploadFormButton.addEventListener("click", () => {
  uploadFeedback.textContent = "";
  setDefaultDateTime();
});
clearFiltersButton.addEventListener("click", () => {
  nameInput.value = "";
  cameraInput.value = "";
  statusInput.value = "";
  sortInput.value = "date-desc";
  render();
});

window.deleteUpload = deleteUpload;

setDefaultDateTime();
loadData().catch(() => {
  message.textContent = "Não foi possível carregar os uploads.";
  uploadFeedback.textContent = "Não foi possível carregar câmeras disponíveis.";
  cameraSelect.innerHTML =
    '<option value="">Falha ao carregar câmeras</option>';
});
