# Guardiões da Fauna 🐾

**Entrega Individual - Sprint 1 | PUC Minas**

Uma aplicação web desenvolvida para a disciplina de Programação Web, focada na exibição, busca e filtragem dinâmica de ONGs voltadas para a proteção animal e ambiental. O projeto atende aos requisitos de "Apresentação de Informação" (Nível Completo - 100%), consumindo dados de uma API REST simulada e interagindo com o usuário através de múltiplos eventos.

---

## 🎯 Funcionalidades Implementadas

O código JavaScript foi construído em estrita harmonia com a estrutura HTML e CSS fornecida, garantindo o funcionamento coerente da interface. As principais funcionalidades incluem:

* **Consumo de Dados (Fetch API):** Leitura assíncrona dos dados das ONGs a partir de um servidor local (`db.json`).
* **Manipulação Dinâmica do DOM:** Geração automática dos *cards* das ONGs diretamente na tela, sem necessidade de recarregar a página.
* **Sistema de Filtros Complexos (Interatividade):**
    * **Busca Textual (`oninput`):** Filtra as ONGs por nome ou descrição em tempo real.
    * **Filtro por Região (`onchange`):** Seleção via menu *dropdown*.
    * **Filtro por Tipo de Apoio (`onchange`):** Seleção múltipla utilizando *checkboxes*.
    * **Botão Limpar (`onclick`):** Reseta todos os filtros e recarrega a lista original.
* **Tratamento de Exceções:** Exibição de mensagens de erro caso a API falhe ou nenhuma ONG corresponda aos filtros aplicados.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3**
* **Bootstrap 5** (Para estruturação responsiva e componentes de interface)
* **JavaScript (ES6+)**
* **JSONServer** (Simulação da API REST)

---

## 📂 Estrutura de Arquivos

* `index.html`: Estrutura principal da página, barra de navegação e *containers* de busca.
* `style.css`: Estilização customizada (cores da marca, comportamentos de hover, etc).
* `script.js`: Lógica de consumo da API, renderização do DOM e algoritmos de filtragem.
* `db.json`: Banco de dados estruturado das ONGs.

---
