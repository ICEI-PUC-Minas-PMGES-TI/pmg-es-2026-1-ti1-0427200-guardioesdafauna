// Mapeamento dos elementos do HTML
const formDenuncia = document.getElementById('formDenuncia');
const btnGps = document.getElementById('btnGps');
const inputLocalizacao = document.getElementById('inputLocalizacao');
const gpsStatus = document.getElementById('gpsStatus');
const alertaSucesso = document.getElementById('alertaSucesso');
const btnEnviar = document.getElementById('btnEnviar');

// 1. Funcionalidade de Geofencing / GPS do Navegador
btnGps.addEventListener('click', () => {
    // Verifica se o navegador suporta geolocalização
    if (!navigator.geolocation) {
        gpsStatus.textContent = "Seu navegador não suporta geolocalização.";
        gpsStatus.className = "form-text text-danger";
        return;
    }

    // Feedback visual de carregamento
    gpsStatus.textContent = "Buscando localização...";
    gpsStatus.className = "form-text text-info";
    btnGps.disabled = true;

    // API nativa do navegador para pegar coordenadas
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(5);
            const lng = position.coords.longitude.toFixed(5);
            
            // Preenche o input de localização do HTML
            inputLocalizacao.value = `Coordenadas: Lat ${lat}, Lng ${lng} (Belo Horizonte e região)`;
            
            // Atualiza o status
            gpsStatus.textContent = "Localização capturada com sucesso!";
            gpsStatus.className = "form-text text-success";
            btnGps.disabled = false;
        },
        (error) => {
            // Tratamento de erros (ex: usuário negou a permissão)
            gpsStatus.textContent = "Não foi possível obter a localização. Por favor, digite o endereço manualmente.";
            gpsStatus.className = "form-text text-danger";
            btnGps.disabled = false;
        }
    );
});

// 2. Interceptação do Envio do Formulário
formDenuncia.addEventListener('submit', (event) => {
    // Impede a página de recarregar
    event.preventDefault();

    // Altera o botão para dar feedback ao usuário
    btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
    btnEnviar.disabled = true;

    // Simulação de tempo de envio para um servidor (2 segundos)
    setTimeout(() => {
        // Exibe o alerta de sucesso no topo do form
        alertaSucesso.classList.remove('d-none');
        
        // Rola a página para o topo suavemente para o usuário ver a mensagem
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Limpa todos os campos do formulário
        formDenuncia.reset();
        
        // Limpa o status do GPS
        gpsStatus.textContent = "";

        // Restaura o botão original
        btnEnviar.innerHTML = 'ENVIAR REGISTRO';
        btnEnviar.disabled = false;

        // Esconde o alerta de sucesso após 5 segundos
        setTimeout(() => {
            alertaSucesso.classList.add('d-none');
        }, 5000);

    }, 2000);
});

// 3. Preenchimento automático de Data e Hora no momento do acesso
window.addEventListener('DOMContentLoaded', () => {
    const dataOcorrencia = document.getElementById('dataOcorrencia');
    const horaOcorrencia = document.getElementById('horaOcorrencia');
    
    const agora = new Date();
    
    // Formata a data para YYYY-MM-DD (padrão do input type="date")
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    dataOcorrencia.value = `${ano}-${mes}-${dia}`;
    
    // Formata a hora para HH:MM (padrão do input type="time")
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    horaOcorrencia.value = `${horas}:${minutos}`;
});