const API = "http://localhost:3000/imagens";

document.getElementById("formImagem").addEventListener("submit", salvarImagem);

async function salvarImagem(e) {
  e.preventDefault();

  const imagemFile = document.getElementById("imagem").files[0];
  if (!imagemFile) return alert("Selecione uma imagem!");

  const novaImagem = {
    camera: document.getElementById("camera").value,
    dataHoraCaptura: document.getElementById("dataHora").value,
    localizacao: document.getElementById("localizacao").value,
    descricao: document.getElementById("descricao").value,
    nomeArquivo: imagemFile.name
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaImagem)
  });

  carregarImagens();
  limparForm();
}

async function carregarImagens() {
  const res = await fetch(API);
  const dados = await res.json();

  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  dados.forEach(img => {
    tabela.innerHTML += `
      <tr>
        <td>${img.camera}</td>
        <td>${img.dataHoraCaptura}</td>
        <td>${img.localizacao}</td>
        <td>${img.descricao}</td>
        <td>
          <button onclick="excluir(${img.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

// Tornando a função global para que o onclick do HTML a encontre
window.excluir = async function(id) {
  if (confirm("Deseja realmente excluir?")) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregarImagens();
  }
}

function limparForm() {
  document.getElementById("formImagem").reset();
}

carregarImagens();