const API = window.location.origin;

const statsGrid = document.getElementById("stats-grid");
const ongChart = document.getElementById("ong-chart");
const uploadChart = document.getElementById("upload-chart");
const tableBody = document.getElementById("metrics-table-body");

const exportJsonButton = document.getElementById("export-json");

let exportRows = [];

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderBarChart(container, rows, maxValue) {
  container.innerHTML = rows
    .map(
      (row) => `
        <div class="chart-bar">
          <div class="chart-bar__meta">
            <strong>${row.label}</strong>
            <span>${row.value}</span>
          </div>
          <div class="chart-bar__track">
            <div class="chart-bar__fill" style="width: ${maxValue ? Math.round((row.value / maxValue) * 100) : 0}%"></div>
          </div>
        </div>
      `,
    )
    .join("");
}

function getStatusLabel(status) {
  const labels = {
    approved: "Aprovado",
    pending: "Pendente",
    rejected: "Rejeitado",
    "in-evaluation": "Em avaliação",
  };
  return labels[status] || "Sem status";
}

function dominantStatus(oncaRows) {
  const counts = oncaRows.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    getStatusLabel(
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0],
    ) || "Sem dados"
  );
}

async function loadMetrics() {
  const [ongsResponse, oncasResponse, uploadsResponse, ocorrenciasResponse] =
    await Promise.all([
      fetch(`${API}/ongs`),
      fetch(`${API}/oncas`),
      fetch(`${API}/uploads`),
      fetch(`${API}/ocorrencias`),
    ]);

  const [ongs, oncas, uploads, ocorrencias] = await Promise.all([
    ongsResponse.json(),
    oncasResponse.json(),
    uploadsResponse.json(),
    ocorrenciasResponse.json(),
  ]);

  const metrics = ongs.map((ong) => {
    const oncasDaOng = oncas.filter(
      (onca) => String(onca.ongId) === String(ong.id),
    );
    const uploadsRelacionados = uploads.filter((upload) =>
      oncasDaOng.some(
        (onca) => String(onca.cameraId || "") === String(upload.cameraId),
      ),
    );

    return {
      nome: ong.nome,
      oncasMonitoradas: oncasDaOng.length,
      uploadsLigados: uploadsRelacionados.length,
      statusDominante: dominantStatus(oncasDaOng),
    };
  });

  exportRows = metrics;

  const cards = [
    {
      label: "ONGs ativas",
      value: ongs.length,
      note: "Rede parceira cadastrada",
    },
    {
      label: "Onças monitoradas",
      value: oncas.length,
      note: "Animais no sistema",
    },
    {
      label: "Uploads registrados",
      value: uploads.length,
      note: "Evidências processadas",
    },
    {
      label: "Ocorrências abertas",
      value: ocorrencias.length,
      note: "Entradas de campo",
    },
  ];

  statsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="stat-card">
          <p>${card.label}</p>
          <strong>${card.value}</strong>
          <span>${card.note}</span>
        </article>
      `,
    )
    .join("");

  renderBarChart(
    ongChart,
    metrics.map((item) => ({ label: item.nome, value: item.oncasMonitoradas })),
    Math.max(...metrics.map((item) => item.oncasMonitoradas), 1),
  );

  const uploadStatuses = uploads.reduce((acc, upload) => {
    const status = upload.file?.status || "sem-status";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  renderBarChart(
    uploadChart,
    Object.entries(uploadStatuses).map(([key, value]) => ({ label: getStatusLabel(key), value })),
    Math.max(...Object.values(uploadStatuses), 1),
  );

  tableBody.innerHTML = metrics
    .map(
      (row) => `
        <tr>
          <td>${row.nome}</td>
          <td>${row.oncasMonitoradas}</td>
          <td>${row.uploadsLigados}</td>
          <td>${row.statusDominante}</td>
        </tr>
      `,
    )
    .join("");
}

exportJsonButton.addEventListener("click", () => {
  downloadFile(
    "metricas-ongs.json",
    JSON.stringify(exportRows, null, 2),
    "application/json",
  );
});

loadMetrics();
