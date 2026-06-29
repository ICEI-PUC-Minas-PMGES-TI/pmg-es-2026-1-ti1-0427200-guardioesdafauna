const API_OCORRENCIAS = `${window.location.origin}/ocorrencias`;

const formDenuncia = document.getElementById("formDenuncia");
const btnGps = document.getElementById("btnGps");
const inputLocalizacao = document.getElementById("inputLocalizacao");
const gpsStatus = document.getElementById("gpsStatus");
const alertaSucesso = document.getElementById("alertaSucesso");
const btnEnviar = document.getElementById("btnEnviar");

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao ler evidência."));
    reader.readAsDataURL(file);
  });
}

btnGps.addEventListener("click", () => {
  if (!navigator.geolocation) {
    gpsStatus.textContent = "Seu navegador não suporta geolocalização.";
    return;
  }

  gpsStatus.textContent = "Buscando localização...";
  btnGps.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lng = position.coords.longitude.toFixed(5);
      inputLocalizacao.value = `Coordenadas: Lat ${lat}, Lng ${lng}`;
      gpsStatus.textContent = "Localização capturada com sucesso.";
      btnGps.disabled = false;
    },
    () => {
      gpsStatus.textContent = "Não foi possível obter localização. Digite manualmente.";
      btnGps.disabled = false;
    },
  );
});

formDenuncia.addEventListener("submit", async (event) => {
  event.preventDefault();
  btnEnviar.textContent = "Enviando...";
  btnEnviar.disabled = true;

  const evidenciaFile = document.getElementById("arquivoEvidencia").files[0];
  let evidencia = null;

  if (evidenciaFile) {
    evidencia = {
      nome: evidenciaFile.name,
      tipo: evidenciaFile.type,
      tamanhoKb: Math.round(evidenciaFile.size / 1024),
      conteudo: await fileToDataUrl(evidenciaFile),
    };
  }

  const payload = {
    tipoSituacao: document.getElementById("tipoSituacao").value,
    localizacao: inputLocalizacao.value.trim(),
    dataOcorrencia: document.getElementById("dataOcorrencia").value,
    horaOcorrencia: document.getElementById("horaOcorrencia").value,
    descricaoDetalhada: document.getElementById("descricaoDetalhada").value.trim(),
    contato: {
      nome: document.getElementById("nomeContato").value.trim(),
      telefone: document.getElementById("telefoneContato").value.trim(),
    },
    evidencia,
    criadoEm: new Date().toISOString(),
  };

  const response = await fetch(API_OCORRENCIAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    alertaSucesso.hidden = false;
    alertaSucesso.className = "feedback feedback-error";
    alertaSucesso.innerHTML = "<strong>Erro.</strong> Não foi possível salvar ocorrência.";
    btnEnviar.textContent = "Enviar registro";
    btnEnviar.disabled = false;
    return;
  }

  alertaSucesso.hidden = false;
  alertaSucesso.className = "feedback feedback-success";
  alertaSucesso.innerHTML = "<strong>Pronto.</strong> Registro enviado com sucesso.";

  window.scrollTo({ top: 0, behavior: "smooth" });
  formDenuncia.reset();
  gpsStatus.textContent = "";
  preencherDataHora();
  btnEnviar.textContent = "Enviar registro";
  btnEnviar.disabled = false;
});

function preencherDataHora() {
  const dataOcorrencia = document.getElementById("dataOcorrencia");
  const horaOcorrencia = document.getElementById("horaOcorrencia");
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");

  dataOcorrencia.value = `${ano}-${mes}-${dia}`;
  horaOcorrencia.value = `${horas}:${minutos}`;
}

window.addEventListener("DOMContentLoaded", preencherDataHora);
