const list = document.querySelector("#uploads-list");
const message = document.querySelector("#message");

function createUploadItem(upload) {
  const file = upload.file || {};
  const item = document.createElement("li");

  item.innerHTML = `
    <strong>${file.name || "Arquivo sem nome"}</strong>
    <span>Câmera: ${upload.cameraId || "Não informada"}</span>
    <span>Status: ${file.status || "Sem status"}</span>
    <span>${file.createdAt.toLocaleDateString()} • ${file.sizeInKbs || 0} KB</span>
  `;

  return item;
}

async function loadUploads() {
  try {
    const response = await fetch("/uploads");
    const uploads = await response.json();
    list.innerHTML = "";

    uploads.forEach((upload) => list.appendChild(createUploadItem(upload)));
  } catch (error) {
    console.error(error);
  }
}

loadUploads();
