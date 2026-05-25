const styles = `
:root {
    --bg-header: #1f4f3a; /* Verde escuro do wireframe */
    --bg-body: #f2f6f4;   /* Fundo cinza/esverdeado muito claro */
    --btn-orange: #f0a25c; /* Laranja suave do botão */
    --btn-orange-hover: #e08b45;
}

body {
    background-color: var(--bg-body);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Navbar */
.custom-navbar {
    background-color: var(--bg-header);
    padding: 15px 0;
}
.active-link {
    border-bottom: 2px solid var(--btn-orange);
    padding-bottom: 4px;
}
.btn-cadastro {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    font-size: 0.9rem;
    padding: 8px 16px;
    transition: all 0.2s;
}
.btn-cadastro:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

/* Inputs de Busca e Filtros */
.search-box {
    border: 1px solid #e0e8e3;
}
.search-box input:focus {
    outline: none;
    box-shadow: none;
}
.form-select:focus, .form-check-input:focus {
    border-color: #a3c4b1;
    box-shadow: 0 0 0 0.25rem rgba(31, 79, 58, 0.25);
}
.form-check-input:checked {
    background-color: var(--bg-header);
    border-color: var(--bg-header);
}

/* Cartões das ONGs */
.ong-card {
    border-radius: 12px;
    overflow: hidden;
}
.img-placeholder {
    height: 140px;
    width: 100%;
}
.btn-detalhes {
    background-color: var(--btn-orange);
    color: white;
    border-radius: 6px;
    padding: 10px;
    transition: background-color 0.2s;
}
.btn-detalhes:hover {
    background-color: var(--btn-orange-hover);
    color: white;
}`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);