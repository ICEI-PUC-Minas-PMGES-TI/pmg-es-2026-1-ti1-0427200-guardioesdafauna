const API_ONCAS = `${window.location.origin}/oncas`;
const API_ONGS = `${window.location.origin}/ongs`;

const corpoTabela = document.getElementById("corpoTabela");
const busca = document.getElementById("busca");
const filtroOng = document.getElementById("filtroOng");
const filtroStatus = document.getElementById("filtroStatus");
const btnLimpar = document.getElementById("btnLimpar");
const painelDetalhes = document.getElementById("painelDetalhes");

let oncas = [];
let ongs = [];

async function carregarDados() {
  const [respostaOncas, respostaOngs] = await Promise.all([
    fetch(API_ONCAS),
    fetch(API_ONGS),
  ]);

  oncas = await respostaOncas.json();
  ongs = await respostaOngs.json();

  preencherFiltroOngs();
  renderizarTabela(oncas);
}

function preencherFiltroOngs() {
  filtroOng.innerHTML = '<option value="Todas">Todas</option>';
  ongs.forEach((ong) => {
    filtroOng.innerHTML += `<option value="${ong.id}">${ong.nome}</option>`;
  });
}

function buscarNomeOng(ongId) {
  const ong = ongs.find((item) => Number(item.id) === Number(ongId) || String(item.id) === String(ongId));
  return ong ? ong.nome : "ONG não encontrada";
}

function classeStatus(status) {
  if (status === "Ativa") return "is-success";
  if (status === "Monitorada") return "is-warning";
  if (status === "Inativa") return "is-danger";
  return "is-neutral";
}

function renderizarTabela(lista) {
  if (!lista.length) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">Nenhuma onça encontrada.</td>
      </tr>
    `;
    return;
  }

  corpoTabela.innerHTML = lista
    .map((onca) => `
      <tr>
        <td>
          <div class="onca-info">
            <div class="foto">🐆</div>
            <div>
              <strong>${onca.nome}</strong>
              <span>ID: ${onca.codigo}</span>
            </div>
          </div>
        </td>
        <td>${buscarNomeOng(onca.ongId)}</td>
        <td>${onca.idade} anos</td>
        <td>${onca.sexo}</td>
        <td>${onca.localizacao}</td>
        <td><span class="status-badge ${classeStatus(onca.status)}">${onca.status}</span></td>
        <td>
          <div class="button-row">
            <button class="button-ghost" type="button" onclick="mostrarDetalhes(${onca.id})">Detalhes</button>
            <button class="button-danger" type="button" onclick="deletarOnca(${onca.id})">Excluir</button>
          </div>
        </td>
      </tr>
    `)
    .join("");
}

function aplicarFiltros() {
  const textoBusca = busca.value.toLowerCase();
  const ongSelecionada = filtroOng.value;
  const statusSelecionado = filtroStatus.value;

  const resultado = oncas.filter((onca) => {
    const nomeOng = buscarNomeOng(onca.ongId).toLowerCase();

    const correspondeBusca =
      onca.nome.toLowerCase().includes(textoBusca) ||
      onca.codigo.toLowerCase().includes(textoBusca) ||
      nomeOng.includes(textoBusca);

    const correspondeOng =
      ongSelecionada === "Todas" || String(onca.ongId) === String(ongSelecionada);

    const correspondeStatus =
      statusSelecionado === "Todos" || onca.status === statusSelecionado;

    return correspondeBusca && correspondeOng && correspondeStatus;
  });

  renderizarTabela(resultado);
}

function mostrarDetalhes(id) {
  const onca = oncas.find((item) => Number(item.id) === Number(id));
  const ong = ongs.find((item) => Number(item.id) === Number(onca.ongId) || String(item.id) === String(onca.ongId));

  painelDetalhes.innerHTML = `
    <h2>Detalhes da onça</h2>
    <dl class="detail-list">
      <div><dt>Nome</dt><dd>${onca.nome}</dd></div>
      <div><dt>ID</dt><dd>${onca.codigo}</dd></div>
      <div><dt>Espécie</dt><dd>${onca.especie}</dd></div>
      <div><dt>Sexo</dt><dd>${onca.sexo}</dd></div>
      <div><dt>Idade</dt><dd>${onca.idade} anos</dd></div>
      <div><dt>Status</dt><dd>${onca.status}</dd></div>
      <div><dt>ONG responsável</dt><dd>${ong?.nome || "Sem ONG"}</dd></div>
      <div><dt>Responsável</dt><dd>${ong?.responsavel || "Sem responsável"}</dd></div>
      <div><dt>Localização</dt><dd>${onca.localizacao}</dd></div>
      <div><dt>Primeiro registro</dt><dd>${onca.primeiroRegistro}</dd></div>
      <div><dt>Último registro</dt><dd>${onca.ultimoRegistro}</dd></div>
      <div><dt>Observações</dt><dd>${onca.observacoes}</dd></div>
    </dl>
  `;
}

async function deletarOnca(id) {
  const shouldDelete = confirm("Deseja realmente excluir esta onça do monitoramento?");
  if (!shouldDelete) return;

  const response = await fetch(`${API_ONCAS}/${id}`, { method: "DELETE" });
  if (!response.ok) return;

  oncas = oncas.filter((item) => Number(item.id) !== Number(id));
  aplicarFiltros();
  painelDetalhes.innerHTML = `
    <h2>Detalhes da onça</h2>
    <p>Selecione uma onça para visualizar os detalhes.</p>
  `;
}

function limparFiltros() {
  busca.value = "";
  filtroOng.value = "Todas";
  filtroStatus.value = "Todos";
  renderizarTabela(oncas);
}

busca.addEventListener("input", aplicarFiltros);
filtroOng.addEventListener("change", aplicarFiltros);
filtroStatus.addEventListener("change", aplicarFiltros);
btnLimpar.addEventListener("click", limparFiltros);

window.mostrarDetalhes = mostrarDetalhes;
window.deletarOnca = deletarOnca;

carregarDados();
