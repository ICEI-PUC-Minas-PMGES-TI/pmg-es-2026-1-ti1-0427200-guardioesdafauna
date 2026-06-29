const API_ROOT = window.location.origin;
const API_URL = `${API_ROOT}/ongs`;
const API_VOLUNTARIOS_URL = `${API_ROOT}/voluntarios`;

const containerOngs = document.getElementById("container-ongs");
const contadorOngs = document.getElementById("contador-ongs");
const inputBusca = document.getElementById("input-busca");
const selectRegiao = document.getElementById("select-regiao");
const checkboxesApoio = document.querySelectorAll(".check-apoio");
const btnLimpar = document.getElementById("btn-limpar");
const divSemResultados = document.getElementById("sem-resultados");
const ongSummary = document.getElementById("ong-summary");
const volunteerForm = document.getElementById("form-voluntario");
const ongForm = document.getElementById("form-cadastrar-ong");
const ongModalTitle = document.getElementById("ong-modal-title");
const ongFeedback = document.getElementById("ong-feedback");
const voluntarioFeedback = document.getElementById("voluntario-feedback");

let todasAsOngs = [];
let modoEdicaoId = "";

document.addEventListener("DOMContentLoaded", () => {
  configurarModais();
  configurarEventos();
  carregarOngs();
});

function configurarEventos() {
  inputBusca.addEventListener("input", aplicarFiltros);
  selectRegiao.addEventListener("change", aplicarFiltros);
  checkboxesApoio.forEach((checkbox) => checkbox.addEventListener("change", aplicarFiltros));
  btnLimpar.addEventListener("click", limparFiltros);
  volunteerForm.addEventListener("submit", salvarVoluntario);
  ongForm.addEventListener("submit", salvarOng);
}

function configurarModais() {
  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.dataset.openModal;
      openModal(modalId);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.closeModal));
  });

  document.querySelectorAll(".modal-sheet").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal.id);
    });
  });
}

function openModal(id) {
  document.getElementById(id).hidden = false;
}

function closeModal(id) {
  document.getElementById(id).hidden = true;
}

function limparFiltros() {
  inputBusca.value = "";
  selectRegiao.value = "todos";
  checkboxesApoio.forEach((checkbox) => {
    checkbox.checked = false;
  });
  aplicarFiltros();
}

async function converterArquivoParaDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(new Error("Não foi possível ler imagem enviada."));
    leitor.readAsDataURL(arquivo);
  });
}

async function carregarOngs() {
  const resposta = await fetch(API_URL);
  todasAsOngs = await resposta.json();
  renderizarResumo(todasAsOngs);
  renderizarOngs(todasAsOngs);
}

function renderizarResumo(ongs) {
  const total = ongs.length;
  const porRegiao = ongs.reduce((acc, ong) => {
    acc[ong.regiao] = (acc[ong.regiao] || 0) + 1;
    return acc;
  }, {});
  const totalCapacidade = ongs.reduce((acc, ong) => acc + Number(ong.capacidadeMensal || 0), 0);
  const topRegioes = Object.entries(porRegiao)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  ongSummary.innerHTML = `
    <div class="chart-bar">
      <div class="chart-bar__meta"><strong>ONGs cadastradas</strong><span>${total}</span></div>
      <div class="chart-bar__track"><div class="chart-bar__fill" style="width: 100%"></div></div>
    </div>
    <div class="chart-bar">
      <div class="chart-bar__meta"><strong>Capacidade mensal total</strong><span>${totalCapacidade} resgates</span></div>
      <div class="chart-bar__track"><div class="chart-bar__fill" style="width: ${Math.min(totalCapacidade, 100)}%"></div></div>
    </div>
    ${topRegioes
      .map(
        ([regiao, value]) => `
          <div class="chart-bar">
            <div class="chart-bar__meta"><strong>${regiao}</strong><span>${value}</span></div>
            <div class="chart-bar__track"><div class="chart-bar__fill" style="width: ${total ? Math.round((value / total) * 100) : 0}%"></div></div>
          </div>
        `,
      )
      .join("")}
  `;
}

function normalizarTexto(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function renderizarOngs(ongs) {
  contadorOngs.textContent = `(${ongs.length})`;

  if (!ongs.length) {
    containerOngs.innerHTML = "";
    divSemResultados.hidden = false;
    return;
  }

  divSemResultados.hidden = true;
  containerOngs.innerHTML = ongs
    .map((ong) => {
      const apoiosFormatados = (ong.apoio || []).join(", ");
      return `
        <article class="ong-card">
          <div class="ong-card__media" style="background-image: url('${ong.imagem || "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80"}')"></div>
          <div class="ong-card__body">
            <div class="ong-card__top">
              <span class="status-badge is-success">${ong.categoria}</span>
              <span class="ong-card__region">${ong.regiao}</span>
            </div>
            <h3>${ong.nome}</h3>
            <p>${ong.descricao}</p>
            <dl class="ong-meta">
              <div><dt>Cidade</dt><dd>${ong.cidade}</dd></div>
              <div><dt>Responsável</dt><dd>${ong.responsavel}</dd></div>
              <div><dt>Contato</dt><dd>${ong.email}</dd></div>
              <div><dt>Capacidade</dt><dd>${ong.capacidadeMensal} resgates/mês</dd></div>
            </dl>
            <p class="ong-needs"><strong>Necessidades:</strong> ${ong.necessidades || "Não informadas."}</p>
            <p class="ong-support"><strong>Apoio:</strong> ${apoiosFormatados}</p>
            <div class="button-row">
              <a class="button-ghost" href="${ong.link}" target="_blank" rel="noreferrer">Site oficial</a>
              <button class="button-secondary" type="button" onclick="editarOng('${ong.id}')">Editar</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function aplicarFiltros() {
  const termoBusca = normalizarTexto(inputBusca.value);
  const regiaoSelecionada = selectRegiao.value;
  const apoiosSelecionados = Array.from(checkboxesApoio)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const ongsFiltradas = todasAsOngs.filter((ong) => {
    const buscaCombinada = normalizarTexto(
      `${ong.nome} ${ong.descricao} ${ong.cidade} ${ong.necessidades} ${ong.responsavel}`,
    );
    const matchBusca = buscaCombinada.includes(termoBusca);
    const matchRegiao = regiaoSelecionada === "todos" || ong.regiao === regiaoSelecionada;
    const matchApoio =
      !apoiosSelecionados.length ||
      apoiosSelecionados.some((apoio) => (ong.apoio || []).includes(apoio));
    return matchBusca && matchRegiao && matchApoio;
  });

  renderizarResumo(ongsFiltradas);
  renderizarOngs(ongsFiltradas);
}

async function salvarVoluntario(event) {
  event.preventDefault();

  const disponibilidades = Array.from(document.querySelectorAll("#dias-uteis, #finais-semana"))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.parentElement.textContent.trim());

  const tiposVoluntariado = Array.from(
    document.querySelectorAll("#vol-presencial, #vol-remoto, #vol-eventual"),
  )
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.parentElement.textContent.trim());

  const cadastroVoluntario = {
    id: `vol-${Date.now()}`,
    nome: document.getElementById("vol-nome").value.trim(),
    email: document.getElementById("vol-email").value.trim(),
    telefone: document.getElementById("vol-telefone").value.trim(),
    cidadeEstado: document.getElementById("vol-cidade").value.trim(),
    areaInteresse: document.getElementById("vol-area").value,
    disponibilidade: disponibilidades,
    tiposVoluntariado,
    experiencia: document.getElementById("vol-experiencia").value.trim(),
  };

  const response = await fetch(API_VOLUNTARIOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cadastroVoluntario),
  });

  voluntarioFeedback.textContent = response.ok
    ? "Voluntário salvo com sucesso."
    : "Falha ao salvar voluntário.";

  if (response.ok) {
    volunteerForm.reset();
    closeModal("volunteer-modal");
  }
}

function coletarApoiosFormulario() {
  return Array.from(document.querySelectorAll(".form-check-apoio"))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

async function salvarOng(event) {
  event.preventDefault();

  const arquivoImagem = document.getElementById("form-imagem").files[0];
  let imagemDaOng = "";

  if (arquivoImagem) {
    imagemDaOng = await converterArquivoParaDataUrl(arquivoImagem);
  } else if (modoEdicaoId) {
    const antiga = todasAsOngs.find((item) => String(item.id) === String(modoEdicaoId));
    imagemDaOng = antiga?.imagem || "";
  }

  const payload = {
    nome: document.getElementById("form-nome").value.trim(),
    cnpj: document.getElementById("form-cnpj").value.trim(),
    categoria: document.getElementById("form-categoria").value.trim(),
    regiao: document.getElementById("form-regiao").value,
    cidade: document.getElementById("form-cidade").value.trim(),
    responsavel: document.getElementById("form-responsavel").value.trim(),
    email: document.getElementById("form-email").value.trim(),
    telefone: document.getElementById("form-telefone").value.trim(),
    link: document.getElementById("form-link").value.trim(),
    descricao: document.getElementById("form-descricao").value.trim(),
    necessidades: document.getElementById("form-necessidades").value.trim(),
    capacidadeMensal: Number(document.getElementById("form-capacidade").value || 0),
    apoio: coletarApoiosFormulario(),
    imagem: imagemDaOng,
  };

  const isEditing = Boolean(modoEdicaoId);
  const response = await fetch(isEditing ? `${API_URL}/${modoEdicaoId}` : API_URL, {
    method: isEditing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isEditing ? { ...payload, id: modoEdicaoId } : payload),
  });

  ongFeedback.textContent = response.ok
    ? isEditing
      ? "ONG atualizada com sucesso."
      : "ONG cadastrada com sucesso."
    : "Falha ao salvar ONG.";

  if (!response.ok) return;

  resetarFormularioOng();
  closeModal("ong-modal");
  await carregarOngs();
}

function preencherFormularioOng(ong) {
  document.getElementById("form-id").value = ong.id;
  document.getElementById("form-nome").value = ong.nome || "";
  document.getElementById("form-cnpj").value = ong.cnpj || "";
  document.getElementById("form-categoria").value = ong.categoria || "";
  document.getElementById("form-regiao").value = ong.regiao || "Nacional";
  document.getElementById("form-cidade").value = ong.cidade || "";
  document.getElementById("form-responsavel").value = ong.responsavel || "";
  document.getElementById("form-email").value = ong.email || "";
  document.getElementById("form-telefone").value = ong.telefone || "";
  document.getElementById("form-link").value = ong.link || "";
  document.getElementById("form-descricao").value = ong.descricao || "";
  document.getElementById("form-necessidades").value = ong.necessidades || "";
  document.getElementById("form-capacidade").value = ong.capacidadeMensal || 0;
  document.querySelectorAll(".form-check-apoio").forEach((checkbox) => {
    checkbox.checked = (ong.apoio || []).includes(checkbox.value);
  });
}

function resetarFormularioOng() {
  modoEdicaoId = "";
  ongModalTitle.textContent = "Cadastrar ONG";
  ongFeedback.textContent = "";
  ongForm.reset();
  document.querySelectorAll(".form-check-apoio").forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function editarOng(id) {
  const ong = todasAsOngs.find((item) => String(item.id) === String(id));
  if (!ong) return;

  modoEdicaoId = String(id);
  ongModalTitle.textContent = "Editar ONG";
  preencherFormularioOng(ong);
  openModal("ong-modal");
}

window.editarOng = editarOng;
