const API_URL = 'http://localhost:3000/ongs';

const containerOngs = document.getElementById('container-ongs');
const contadorOngs = document.getElementById('contador-ongs');
const inputBusca = document.getElementById('input-busca');
const selectRegiao = document.getElementById('select-regiao');
const checkboxesApoio = document.querySelectorAll('.check-apoio');
const btnLimpar = document.getElementById('btn-limpar');
const divSemResultados = document.getElementById('sem-resultados');

// Elementos dos novos formulários
const formVoluntario = document.getElementById('form-voluntario');
const formCadastrarOng = document.getElementById('form-cadastrar-ong');

let todasAsOngs = [];

// Exemplo do Greenpeace estruturado para o sistema
const ExemploGreenpeace = {
    id: "greenpeace-oceanos",
    nome: "Greenpeace Brasil",
    descricao: "Campanha ativa para conter e parar a mineração em águas profundas, protegendo a biodiversidade dos oceanos de impactos industriais irreversíveis.",
    regiao: "Nacional",
    categoria: "Preservação Marinha",
    apoio: ["voluntariado", "doacao"],
    imagem: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80",
    link: "https://www.greenpeace.org/brasil/apoie/parem-a-mineracao-em-aguas-profundas/?utm_source=google&utm_medium=paid&utm_campaign=oceanos&utm_content=pm4&gad_source=1&gad_campaignid=20187875970&gbraid=0AAAAAD4RlhY5V9t4rW4X9U06WGmhANL1U&gclid=CjwKCAjw5s_QBhAdEiwADD_gBlynBgw-QDSNEHEyDgKsR6cDVvpRU0yQNJAeeLG1RSO4TLWGTYC2qBoC9f8QAvD_BwE"
};

document.addEventListener('DOMContentLoaded', () => {
    carregarOngs();
    configurarFormularios();
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
        
        if (!todasAsOngs.some(o => o.id === ExemploGreenpeace.id)) {
            todasAsOngs.unshift(ExemploGreenpeace);
        }
        
        renderizarOngs(todasAsOngs);
    } catch (erro) {
        console.warn("JSONServer offline. Usando dados locais com Greenpeace.");
        todasAsOngs = [ExemploGreenpeace];
        renderizarOngs(todasAsOngs);
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
                             style="background-image: url('${ong.imagem || 'https://via.placeholder.com/600x400?text=Guardiões+da+Fauna'}'); background-size: cover; background-position: center;">
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

// Configura o envio dos formulários dentro dos modais
function configurarFormularios() {
    
    // 1. Envio do formulário do Voluntário
    formVoluntario.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado pelo interesse! Seu cadastro de voluntário foi enviado com sucesso. As ONGs parceiras entrarão em contato.');
        
        // Fecha o modal limpando os dados
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalVoluntario'));
        modal.hide();
        formVoluntario.reset();
    });

    // 2. Envio do formulário para Cadastrar uma nova ONG
    formCadastrarOng.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura os apoios selecionados no formulário
        const apoiosSelecionados = Array.from(document.querySelectorAll('.form-check-apoio'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const novaOng = {
            id: 'ong-' + Date.now(), // Gera um ID único provisório
            nome: document.getElementById('form-nome').value,
            categoria: document.getElementById('form-categoria').value,
            regiao: document.getElementById('form-regiao').value,
            imagem: document.getElementById('form-imagem').value,
            link: document.getElementById('form-link').value,
            descricao: document.getElementById('form-descricao').value,
            apoio: apoiosSelecionados.length > 0 ? apoiosSelecionados : ["voluntariado"]
        };

        // Adiciona à nossa lista em memória para atualizar a tela imediatamente
        todasAsOngs.unshift(novaOng);
        renderizarOngs(todasAsOngs);

        // Tenta salvar no seu JSONServer se ele estiver ativo
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaOng)
            });
        } catch (err) {
            console.log("Nota: ONG renderizada na tela, mas não salva no banco (JSONServer Offline).");
        }

        alert(`A ONG "${novaOng.nome}" foi cadastrada com sucesso e já está listada na tela!`);
        
        // Fecha o modal e resfresca o formulário
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastroOng'));
        modal.hide();
        formCadastrarOng.reset();
    });
}