const table = document.getElementById("uploads-table-body");
const message = document.getElementById("message");
const nameInput = document.getElementById("name-filter");
const cameraInput = document.getElementById("camera-filter");

let uploads = [];
let cameras = [];

function getCameraName(cameraId) {
  let cameraName = cameraId || "Não informada";

  cameras.forEach((camera) => {
    if (camera.id === cameraId) {
      if (camera.nickname) cameraName = camera.nickname;
      else if (camera.identifier) cameraName = camera.identifier;
      else cameraName = camera.id;
    }
  });

  return cameraName;
}

function render() {
  let rows = [];

  uploads.forEach((upload) => {
    const file = upload.file || {};
    const fileName = file.name || "";
    const nameFilter = nameInput.value || "";
    const cameraFilter = cameraInput.value || "";

    const nameOk = fileName.toLowerCase().includes(nameFilter.toLowerCase());
    const cameraOk = cameraFilter === "" || upload.cameraId === cameraFilter;

    if (nameOk && cameraOk) {
      rows.push(upload);
    }
  });

  if (rows.length === 0) {
    message.textContent = "Nenhum upload encontrado.";
  } else {
    message.textContent = rows.length + " upload(s) encontrado(s).";
  }

  table.innerHTML = "";

  rows.forEach((upload) => {
    const file = upload.file || {};

    table.innerHTML += `
      <tr>
        <td>${file.name || "Arquivo sem nome"}</td>
        <td>${getCameraName(upload.cameraId)}</td>
        <td>${file.status || "Sem status"}</td>
        <td>${file.createdAt || "Sem data"}</td>
        <td>${file.sizeInKbs || 0} KB</td>
      </tr>
    `;
  });
}

async function loadData() {
  try {
    const uploadsResponse = await fetch("http://localhost:3000/uploads");
    uploads = await uploadsResponse.json();
    console.log(uploads, '<><>><')

    const camerasResponse = await fetch("http://localhost:3000/cameras");
    cameras = await camerasResponse.json();

    cameras.forEach((camera) => {
      const option = document.createElement("option");

      option.value = camera.id;
      option.textContent = camera.nickname || camera.identifier || camera.id;
      cameraInput.appendChild(option);
    });

    render();
  } catch (error) {
    console.error(error);
    message.textContent = "Não foi possível carregar os uploads.";
  }
}

nameInput.addEventListener("input", render);
cameraInput.addEventListener("input", render);

loadData();
