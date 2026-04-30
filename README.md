## Introdução

- **Projeto:** Amigos da Onça  
- **Repositório GitHub:** https://github.com/Knumi5/Amigos-da-on-a  
- **Membros da equipe:**  
  - Fernando Rodrigues  
  - Ricardo Santana Kill
  - Taccio Bernal
  - Pietro Reis Lopes Melo  
  - Lucca Lourenço  
  - Bernardo Gonçalves  

A documentação do projeto está estruturada da seguinte forma:

1. Introdução  
2. Contexto  
3. Product Discovery  
4. Product Design  
5. Metodologia  
6. Solução  
7. Referências  


# Contexto do Projeto

## Problema

A onça-pintada enfrenta risco crescente de extinção no Brasil devido à perda de habitat, caça ilegal e redução de presas naturais.

No contexto da conservação, existem desafios operacionais relevantes:

- Dados de campo são descentralizados (planilhas, anotações, sistemas isolados)  
- Processos de coleta e consolidação são manuais e lentos  
- Existe atraso entre coleta e análise das informações  
- Falta visibilidade consolidada da movimentação e comportamento dos animais  

Esse cenário ocorre principalmente em ONGs, centros de pesquisa e órgãos ambientais que operam com recursos limitados e forte dependência de trabalho de campo.

---

## Objetivo do Projeto

**Objetivo geral:**  
Desenvolver uma plataforma de software para centralizar, analisar e facilitar o monitoramento de onças-pintadas.

**Objetivos específicos:**

- Centralizar dados de sensores, GPS e câmeras  
- Reduzir esforço manual  
- Melhorar tomada de decisão  
- Aumentar eficiência de equipes de campo  
- Criar mais poder de influência, com métricas e estatísticas

---

## Justificativa

A conservação da onça-pintada possui impacto direto na manutenção do equilíbrio ecológico, sendo um predador de topo na cadeia alimentar.

Além das ameaças ambientais, existe um problema estrutural:

- A falta de dados confiáveis reduz a eficiência das ações de conservação  
- A ausência de métricas dificulta a avaliação de impacto  
- Projetos com pouca evidência enfrentam maior dificuldade na captação de recursos  

Dessa forma, melhorar a forma como dados são coletados, organizados e analisados não apenas contribui para a preservação da espécie, mas também aumenta a capacidade de ONGs e instituições de escalar suas operações e obter financiamento.

---

## Público-alvo

O público-alvo é composto por profissionais envolvidos diretamente na conservação ambiental, com diferentes níveis de atuação estratégica e operacional.

### 1. Coordenadores de ONG

- Responsáveis por gestão de projetos, equipes e captação de recursos  
- Trabalham sob forte restrição de orçamento e equipe  
- Utilizam ferramentas como Excel, Google Docs e plataformas governamentais
- Principais dores:
  - Dados descentralizados
  - Falta de métricas confiáveis
  - Alto esforço manual

---

### 2. Pesquisadores

- Atuam na análise científica e produção de estudos  
- Ligados a universidades ou centros de pesquisa (ex: perfil internacional) 
- Utilizam dados de campo para validar hipóteses  
- Principais dores:
  - Falta de dados estruturados
  - Dificuldade de acesso a registros confiáveis

---

### 3. Biólogos de Campo

- Responsáveis pela coleta de dados em ambientes remotos  
- Trabalham em condições limitadas (floresta, baixa conectividade, equipamentos físicos)  
- Dependem de processos simples e rápidos  
- Principais dores:
  - Ferramentas complexas não funcionam no campo
  - Registro manual e repetitivo
  - Dificuldade de analisar os dados após a coleta

---

### 4. Diretores / Tomadores de decisão

- Perfil estratégico, focado em impacto e risco  
- Utilizam múltiplos dispositivos (notebook, smartphone, tablet) para acompanhar operações
- Precisam de visão consolidada do sistema  
- Principais dores:
  - Falta de visibilidade em tempo hábil
  - Dificuldade de antecipar riscos

---

# Product Discovery

## Matriz CSD
![alt text](matriz-csd.png)
---

## Mapa de Stakeholders
![alt text](stakeholders.png)

---

## Pesquisa e Entendimento

A onça-pintada está em risco de extinção no Brasil devido à perda de habitat, caça ilegal e redução de presas naturais.

- Menos de 300 onças restantes na Mata Atlântica  
  https://oeco.org.br/salada-verde/mata-atlantica-tem-menos-de-300-oncas-pintadas/

- Redução de presas aumenta risco de extinção  
  https://ods.fapesp.br/diminuicao-de-presas-aumenta-risco-de-extincao-da-onca-pintada-na-mata-atlantica/13281

- Estratégias de conservação ainda enfrentam desafios estruturais  
  https://www.gov.br/mma/pt-br/noticias/estrategias-transfronteiricas-para-conservacao-e-coexistencia-com-a-onca-pintada-pauta-a-agenda-no-espaco-brasil

Além disso, ONGs ambientais enfrentam dificuldades operacionais e financeiras:

- Falta de dados confiáveis dificulta tomada de decisão  
- Ausência de métricas impacta captação de recursos  
- Dados descentralizados aumentam esforço manual  

Esses fatores tornam a conservação menos eficiente e limitam o impacto das ações.

---

## Personas

### Rafael — Coordenador de ONG
![alt text](persona-1.png)

### Leonardo — Pesquisador
![alt text](persona-2.png)

### Yara — Bióloga de Campo
![alt text](persona-3.png)

### Eduardo — Diretor Executivo
![alt text](persona-4.png)

---

# Product Design

## Histórias de Usuário
![alt text](historias-de-usuario.png)

---

## Proposta de Valor
![alt text](proposta-valor-1.png)
![alt text](proposta-valor-2.png)
---

## Projeto de Interface

### Fluxo do Usuário
![alt text](fluxo-usuario.png)
---

### Wireframes
![alt text](dashboard-principal.png) 
![alt text](mapa-rastreamento.png)
---

### Protótipo Interativo
https://www.figma.com/make/IYqsisOgXq05oo8Nc6P4wG/Projeto-G8?fullscreen=1&t=1eTmWPl8P9wGPRhI-1
https://www.loom.com/share/a87f66d0e22b4b5faf694ac2a88dd63b

---

# Metodologia

## Ferramentas

- **VS Code:** utilizado para desenvolvimento de código pela equipe  
- **Figma:** utilizado para criação de wireframes e protótipos interativos, permitindo validação visual da solução  
- **GitHub:** utilizado para versionamento de código e colaboração entre os membros da equipe  
- **Discord / WhatsApp:** utilizados para comunicação rápida e alinhamento entre os integrantes  
---

## Organização da Equipe

A equipe adotou uma abordagem baseada em Scrum:

- Divisão por papéis  
- Sprints curtos  
- Revisões frequentes  

---

## Kanban

O gerenciamento das tarefas foi organizado em um quadro Kanban com as seguintes colunas:

- To Do  
- In Progress  
- Done  

Exemplos de tarefas:

- Criação de personas → Done  
- Desenvolvimento de wireframes → In Progress  
- Validação do protótipo → To Do  

---

# Solução

Plataforma integrada que:

- Coleta dados via sensores e câmeras  
- Centraliza informações  
- Permite visualização em dashboards  
- Gera alertas e relatórios  

Inclui:

- Monitoramento de movimentação  
- Registro de eventos  
- Gestão de equipes  
- Analytics  

---

# Referências

- https://oeco.org.br/salada-verde/mata-atlantica-tem-menos-de-300-oncas-pintadas/  
- https://ods.fapesp.br/diminuicao-de-presas-aumenta-risco-de-extincao-da-onca-pintada-na-mata-atlantica/13281  
- https://www.gov.br/mma/pt-br/noticias/estrategias-transfronteiricas-para-conservacao-e-coexistencia-com-a-onca-pintada-pauta-a-agenda-no-espaco-brasil  
- https://www.todamateria.com.br/onca-pintada/  
