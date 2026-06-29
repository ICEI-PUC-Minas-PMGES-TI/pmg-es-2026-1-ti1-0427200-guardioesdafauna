const NAV_ITEMS = [
  { id: "home", label: "Home", href: "home.html", icon: "ph-house" },
  { id: "mapa", label: "Mapa", href: "modulos/mapa/index.html", icon: "ph-map-trifold" },
  { id: "uploads", label: "Uploads", href: "modulos/listagem-upload/index.html", icon: "ph-upload-simple" },
  { id: "ongs", label: "ONGs", href: "modulos/ongs/ongs.html", icon: "ph-users-three" },
  { id: "oncas", label: "Onças", href: "modulos/oncas/oncas.html", icon: "ph-cat" },
  { id: "ocorrencias", label: "Ocorrências", href: "modulos/ocorrencias/form.html", icon: "ph-warning-circle" },
  { id: "metricas", label: "Métricas", href: "modulos/metricas/metricas.html", icon: "ph-chart-bar" },
  { id: "sobre", label: "Sobre", href: "about.html", icon: "ph-info" },
];

function buildHref(root, href) {
  return `${root || "./"}${href}`;
}

function renderSidebar() {
  const mount = document.querySelector("[data-app-sidebar]");
  if (!mount) return;

  const root = document.body.dataset.root || "./";
  const activePage = document.body.dataset.page || "";

  mount.className = "app-sidebar";
  mount.setAttribute("aria-label", "Navegação principal");
  mount.innerHTML = `
    <a class="app-sidebar__brand" href="${buildHref(root, "home.html")}">
      <span class="app-sidebar__logo">GF</span>
      <div>
        <p class="app-sidebar__title">Guardiões da Fauna</p>
        <p class="app-sidebar__subtitle">Monitoramento, resposta e parceria</p>
      </div>
    </a>
    <nav class="app-sidebar__links">
      ${NAV_ITEMS.map((item) => `
        <a class="${item.id === activePage ? "active" : ""}" href="${buildHref(root, item.href)}">
          <span class="app-sidebar__icon"><i class="ph ${item.icon}"></i></span>
          <span>${item.label}</span>
        </a>
      `).join("")}
    </nav>
    <div class="app-sidebar__footer">
      <a href="${buildHref(root, "modulos/login/login.html")}" onclick="logoutUser(); return false;">
        <span class="app-sidebar__icon"><i class="ph ph-sign-out"></i></span>
        <span>Logout</span>
      </a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", renderSidebar);
