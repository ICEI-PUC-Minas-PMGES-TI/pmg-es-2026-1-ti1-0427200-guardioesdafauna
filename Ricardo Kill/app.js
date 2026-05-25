const API = "http://localhost:3000/oncas";

const table = document.getElementById("oncasTable");
const form = document.getElementById("oncaForm");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const sortBtn = document.getElementById("sortBtn");

let chart;

window.onload = () => {
    loadOncas();
};

async function loadOncas() {

    const response = await fetch(API);
    const data = await response.json();

    renderTable(data);
    renderChart(data);
}

function renderTable(data){

    table.innerHTML = "";

    data.forEach(onca => {

        table.innerHTML += `
            <tr>
                <td>
                    <img src="${onca.imagem}">
                </td>

                <td>${onca.nome}</td>
                <td>${onca.sexo}</td>
                <td>${onca.idade}</td>
                <td>${onca.peso}</td>
                <td>${onca.status}</td>

                <td>

                    <button class="action-btn edit"
                        onclick="editOnca(${onca.id})">
                        Editar
                    </button>

                    <button class="action-btn delete"
                        onclick="deleteOnca(${onca.id})">
                        Excluir
                    </button>

                </td>
            </tr>
        `;
    });
}

form.onsubmit = async (e) => {

    e.preventDefault();

    const id = document.getElementById("oncaId").value;

    const onca = {
        nome: nome.value,
        sexo: sexo.value,
        idade: Number(idade.value),
        peso: Number(peso.value),
        localizacao: localizacao.value,
        ultimaCaptura: ultimaCaptura.value,
        status: status.value,
        imagem: imagem.value
    };

    if(id){

        await fetch(`${API}/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(onca)
        });

    }else{

        await fetch(API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(onca)
        });

    }

    form.reset();
    loadOncas();
};

async function deleteOnca(id){

    await fetch(`${API}/${id}`,{
        method:"DELETE"
    });

    loadOncas();
}

async function editOnca(id){

    const response = await fetch(`${API}/${id}`);
    const onca = await response.json();

    document.getElementById("oncaId").value = onca.id;
    nome.value = onca.nome;
    sexo.value = onca.sexo;
    idade.value = onca.idade;
    peso.value = onca.peso;
    localizacao.value = onca.localizacao;
    ultimaCaptura.value = onca.ultimaCaptura;
    status.value = onca.status;
    imagem.value = onca.imagem;
}

searchInput.addEventListener("input", async () => {

    const response = await fetch(API);
    const data = await response.json();

    const filtered = data.filter(onca =>
        onca.nome.toLowerCase()
        .includes(searchInput.value.toLowerCase())
    );

    renderTable(filtered);
});

filterStatus.addEventListener("change", async () => {

    const response = await fetch(API);
    const data = await response.json();

    const filtered = data.filter(onca =>
        filterStatus.value === ""
        || onca.status === filterStatus.value
    );

    renderTable(filtered);
});

sortBtn.onclick = async () => {

    const response = await fetch(API);
    const data = await response.json();

    data.sort((a,b)=>a.idade-b.idade);

    renderTable(data);
};

function renderChart(data){

    const ctx = document
        .getElementById("idadeChart");

    const nomes = data.map(o=>o.nome);
    const idades = data.map(o=>o.idade);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:nomes,
            datasets:[{
                label:"Idade",
                data:idades
            }]
        }
    });
}