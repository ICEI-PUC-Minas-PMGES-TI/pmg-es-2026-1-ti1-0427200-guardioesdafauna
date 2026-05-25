const API_URL = 'http://localhost:3000/ongs';

const containerOngs = document.getElementById('container-ongs');
const contadorOngs = document.getElementById('contador-ongs');
const inputBusca = document.getElementById('input-busca');
const selectRegiao = document.getElementById('select-regiao');
const checkboxesApoio = document.querySelectorAll('.check-apoio');
const btnLimpar = document.getElementById('btn-limpar');
const divSemResultados = document.getElementById('sem-resultados');

let todasAsOngs = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarOngs();
});

inputBusca.addEventListener('input', aplicarFiltros);

selectRegiao.addEventListener('change', aplicarFiltros);
checkboxesApoio.forEach(checkbox => {
    checkbox.addEventListener('change', aplicarFiltros);
});

btnLimpar.addEventListener('click', () => {
    inputBusca.value = '';
    selectRegiao.value = 'todos';
    checkboxesApoio.forEach(cb => cb.checked = false);
    aplicarFiltros();
});

async function carregarOngs() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Falha ao buscar dados');
        
        todasAsOngs = await resposta.json();
        renderizarOngs(todasAsOngs);
    } catch (erro) {
        console.error("Erro:", erro);
        containerOngs.innerHTML = `<p class="text-danger mt-4">Erro ao carregar as ONGs. Certifique-se de que o JSONServer está rodando.</p>`;
    }
}

function renderizarOngs(ongs) {
    containerOngs.innerHTML = '';
    contadorOngs.textContent = `(${ongs.length})`;

    if (ongs.length === 0) {
        divSemResultados.classList.remove('d-none');
    } else {
        divSemResultados.classList.add('d-none');
        
        ongs.forEach(ong => {
            const apoiosFormatados = ong.apoio.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ');
            
            const cardHTML = `
                <div class="col-lg-4 col-md-6 mb-4 card-item">
                    <div class="card ong-card h-100 border-0 shadow-sm">
                        <div class="img-placeholder bg-light d-flex justify-content-center align-items-center text-muted" 
                             style="background-image: url('${ong.imagem}'); background-size: cover; background-position: center;">
                        </div>
                        <div class="card-body d-flex flex-column p-4">
                            <span class="badge bg-success bg-opacity-75 text-white mb-3 align-self-start py-2 px-3 rounded-pill small">
                                ${ong.categoria}
                            </span>
                            <h5 class="card-title fw-bold text-dark mb-1">${ong.nome}</h5>
                            <p class="card-text text-muted small mb-3">
                                <i class="fas fa-map-marker-alt text-danger"></i> Atuação ${ong.regiao}
                            </p>
                            <p class="card-text text-secondary small flex-grow-1">${ong.descricao}</p>
                            
                            <hr class="opacity-25 mt-1 mb-3">
                            
                            <div class="text-muted small mb-4 d-flex align-items-center">
                                <i class="fas fa-hands-helping me-2"></i> Apoio: ${apoiosFormatados}
                            </div>
                            <a href="${ong.link}" target="_blank" class="btn btn-detalhes w-100 fw-bold text-decoration-none text-center"> Sobre a ONG </a>
                        </div>
                    </div>
                </div>
            `;
            containerOngs.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
}

function aplicarFiltros() {
    const termoBusca = inputBusca.value.toLowerCase();
    const regiaoSelecionada = selectRegiao.value;
    
    const apoiosSelecionados = Array.from(checkboxesApoio)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const ongsFiltradas = todasAsOngs.filter(ong => {
        const matchBusca = ong.nome.toLowerCase().includes(termoBusca) || ong.descricao.toLowerCase().includes(termoBusca);
        const matchRegiao = regiaoSelecionada === 'todos' || ong.regiao === regiaoSelecionada;
        
        const matchApoio = apoiosSelecionados.length === 0 || apoiosSelecionados.some(apoio => ong.apoio.includes(apoio));

        return matchBusca && matchRegiao && matchApoio;
    });

    renderizarOngs(ongsFiltradas);
}