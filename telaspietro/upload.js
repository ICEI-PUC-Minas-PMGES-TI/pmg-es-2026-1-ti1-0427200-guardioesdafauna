let cameras = [];

document.getElementById("formImagem").addEventListener("submit", salvarImagem);

function getCameraName(cameraId) {
  let cameraName = cameraId;

  cameras.forEach((camera) => {
    if (camera.id === cameraId) {
      cameraName = camera.nickname || camera.identifier || camera.id;
    }
  });

  return cameraName || "Não informada";
}

async function carregarCameras() {
  const cameraSelect = document.getElementById("camera");
  const res = await fetch("http://localhost:3000/cameras");
  cameras = await res.json();

  cameraSelect.innerHTML = '<option value="">Selecione</option>';

  cameras.forEach((camera) => {
    const option = document.createElement("option");

    option.value = camera.id;
    option.textContent = camera.nickname || camera.identifier || camera.id;
    cameraSelect.appendChild(option);
  });
}

async function salvarImagem(e) {
  e.preventDefault();

  const imagemFile = document.getElementById("imagem").files[0];
  if (!imagemFile) return alert("Selecione uma imagem!");

  const novaImagem = {
    cameraId: document.getElementById("camera").value,
    file: {
      name: imagemFile.name,
      sizeInKbs: Math.round(imagemFile.size / 1024),
      status: "in-evaluation",
      createdAt: document.getElementById("dataHora").value,
      type: imagemFile.type,
    },
  };

  await fetch('http://localhost:3000/uploads', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaImagem),
  });

  carregarImagens();
  limparForm();
}

async function carregarImagens() {
  const res = await fetch('http://localhost:3000/uploads');
  const dados = await res.json();
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  dados.forEach((upload) => {
    const file = upload.file || {};

    tabela.innerHTML += `
      <tr>
        <td>${getCameraName(upload.cameraId)}</td>
        <td>${file.createdAt || "Sem data"}</td>
        <td>${file.name || "Arquivo sem nome"}</td>
        <td>${file.status || "Sem status"}</td>
        <td>
          <button onclick="excluir('${upload.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });
}

window.excluir = async function (id) {
  if (confirm("Deseja realmente excluir?")) {
    await fetch(`http://localhost:3000/uploads/${id}`, { method: "DELETE" });
    carregarImagens();
  }
};

function limparForm() {
  document.getElementById("formImagem").reset();
}

carregarCameras();
carregarImagens();
