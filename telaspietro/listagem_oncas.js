const API_ONCAS = "http://localhost:3000/oncas";
const API_ONGS = "http://localhost:3000/ongs";

const corpoTabela = document.getElementById("corpoTabela");
const busca = document.getElementById("busca");
const filtroOng = document.getElementById("filtroOng");
const filtroStatus = document.getElementById("filtroStatus");
const btnLimpar = document.getElementById("btnLimpar");
const painelDetalhes = document.getElementById("painelDetalhes");

let oncas = [];
let ongs = [];

async function carregarDados() {
  const respostaOncas = await fetch(API_ONCAS);
  oncas = await respostaOncas.json();

  const respostaOngs = await fetch(API_ONGS);
  ongs = await respostaOngs.json();

  preencherFiltroOngs();
  renderizarTabela(oncas);
}

function preencherFiltroOngs() {
  filtroOng.innerHTML = `<option value="Todas">Todas</option>`;

  ongs.forEach(ong => {
    filtroOng.innerHTML += `
      <option value="${ong.id}">${ong.nome}</option>
    `;
  });
}

function buscarNomeOng(ongId) {
  const ong = ongs.find(item => item.id === ongId);
  return ong ? ong.nome : "ONG não encontrada";
}

function renderizarTabela(lista) {
  corpoTabela.innerHTML = "";

  if (lista.length === 0) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="7">Nenhuma onça encontrada.</td>
      </tr>
    `;
    return;
  }

  lista.forEach(onca => {
    const nomeOng = buscarNomeOng(onca.ongId);
    const classeStatus = onca.status.toLowerCase();

    corpoTabela.innerHTML += `
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
        <td>${nomeOng}</td>
        <td>${onca.idade} anos</td>
        <td>${onca.sexo}</td>
        <td>${onca.localizacao}</td>
        <td><span class="status ${classeStatus}">${onca.status}</span></td>
        <td>
          <button class="acao" onclick="mostrarDetalhes(${onca.id})">👁</button>
        </td>
      </tr>
    `;
  });
}

function aplicarFiltros() {
  const textoBusca = busca.value.toLowerCase();
  const ongSelecionada = filtroOng.value;
  const statusSelecionado = filtroStatus.value;

  const resultado = oncas.filter(onca => {
    const nomeOng = buscarNomeOng(onca.ongId).toLowerCase();

    const correspondeBusca =
      onca.nome.toLowerCase().includes(textoBusca) ||
      onca.codigo.toLowerCase().includes(textoBusca) ||
      nomeOng.includes(textoBusca);

    const correspondeOng =
      ongSelecionada === "Todas" || onca.ongId === Number(ongSelecionada);

    const correspondeStatus =
      statusSelecionado === "Todos" || onca.status === statusSelecionado;

    return correspondeBusca && correspondeOng && correspondeStatus;
  });

  renderizarTabela(resultado);
}

function mostrarDetalhes(id) {
  const onca = oncas.find(item => item.id === id);
  const ong = ongs.find(item => item.id === onca.ongId);

  painelDetalhes.innerHTML = `
    <div class="detalhes-topo">
      <h2>Detalhes da Onça</h2>
      <button onclick="limparDetalhes()">×</button>
    </div>

    <div class="imagem-detalhe">🐆</div>

    <ul>
      <li><strong>Nome:</strong> ${onca.nome}</li>
      <li><strong>ID:</strong> ${onca.codigo}</li>
      <li><strong>Espécie:</strong> ${onca.especie}</li>
      <li><strong>Sexo:</strong> ${onca.sexo}</li>
      <li><strong>Idade:</strong> ${onca.idade} anos</li>
      <li><strong>Status:</strong> ${onca.status}</li>
      <li><strong>ONG Responsável:</strong> ${ong.nome}</li>
      <li><strong>Responsável:</strong> ${ong.responsavel}</li>
      <li><strong>Localização:</strong> ${onca.localizacao}</li>
      <li><strong>Primeiro Registro:</strong> ${onca.primeiroRegistro}</li>
      <li><strong>Último Registro:</strong> ${onca.ultimoRegistro}</li>
      <li><strong>Observações:</strong> ${onca.observacoes}</li>
    </ul>

    <button class="btn-baixar">Baixar ficha da onça</button>
  `;
}

function limparDetalhes() {
  painelDetalhes.innerHTML = `
    <h2>Detalhes da Onça</h2>
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

carregarDados();