const API_BASE_URL = "https://script.google.com/macros/s/AKfycby55ofHPWCBny1V-XHPTClhRwVXrKeK0iDuvq72hNIRppPO4utx6OMmbcphzQ9uulaS/exec";
const DATA_CACHE_KEY = "economiaLogisticaDataCache";
const QUEUE_CACHE_KEY = "economiaLogisticaPendingQueue";
const META_CACHE_KEY = "economiaLogisticaMetaCache";
const CACHE_VERSION = "v2";

const AREA_OPTIONS = [
  "Economía y Logística",
  "Niños",
  "Jóvenes",
  "Adultos",
  "Espiritualidad"
];

const STRUCTURE_OPTIONS = [
  "Meditación",
  "Contemplación",
  "Meditación guiada",
  "Contemplación guiada",
  "Pausa",
  "Información logística",
  "Anuncio de nuevo beneficio"
];

const INFO_CLASSIFICATION_OPTIONS = [
  "Misión Boquerón",
  "Misión San javier",
  "Misión P. Gaboto",
  "Cronograma",
  "Cantidades",
  "Menúes"
];

const TABLES = {
  menu: "Menu Principal",
  reuniones: "Reuniones",
  misioneros: "Misioneros",
  beneficios: "Nombres de Beneficios",
  movimientosBeneficios: "Movimientos Beneficios",
  recuentosBeneficios: "Recuentos Beneficios",
  empanadas: "Beneficio empanadas",
  combos: "Beneficio combos limpieza",
  compras: "Compras (generál)",
  itemsCompra: "Elementos comprados",
  misiones: "Misiones",
  movimientosMisiones: "Movimientos Misiones",
  inscripciones: "Inscripción a Misiones",
  obligaciones: "Cobros a misioneros",
  deudas: "Deudas Personas",
  pagosDeudas: "Pagos Deudas",
  control: "control. General",
  info: "Info Extra"
};

const ID_COLUMNS = {
  "Menu Principal": "IDMenu",
  "Reuniones": "IDORACION",
  "Misioneros": "IDMisionero",
  "Nombres de Beneficios": "IDBeneficio",
  "Movimientos Beneficios": "IDMovimiento",
  "Recuentos Beneficios": "IDRecuento",
  "Beneficio empanadas": "IDPedido",
  "Beneficio combos limpieza": "IDPedidoCombo",
  "Compras (generál)": "IDCompra",
  "Elementos comprados": "IDItemCompra",
  "Misiones": "IDMision",
  "Movimientos Misiones": "IDMovimientoMision",
  "Inscripción a Misiones": "IDInscripcion",
  "Cobros a misioneros": "IDObligacion",
  "Deudas Personas": "IDDeuda",
  "Pagos Deudas": "IDPagoDeuda",
  "control. General": "IDControl",
  "Info Extra": "IDInfo"
};

const DEFAULT_COLUMNS = {
  "Reuniones": ["IDORACION", "Título", "Fecha", "Descripción", "Estructura", "Encargados", "Link Oración", "Info extra"],
  "Misioneros": ["IDMisionero", "Nombre", "Apellido", "Area", "DNI"],
  "Nombres de Beneficios": ["IDBeneficio", "Nombre Beneficio", "Tipo Beneficio", "Fecha Inicio", "Fecha Fin", "Estado", "Comentario"],
  "Movimientos Beneficios": ["IDMovimiento", "IDBeneficio", "Fecha", "Movimiento", "Tipo de Movimiento", "Persona Responsable", "Forma de Pago", "Monto", "Estado", "Comentario", "Monto Firmado"],
  "Recuentos Beneficios": ["IDRecuento", "IDBeneficio", "Fecha", "Persona Responsable", "Forma de Pago", "Monto Declarado", "Comentario"],
  "Beneficio empanadas": ["IDPedido", "IDBeneficio", "Fecha", "Origen", "Nombre Cliente", "Telefono", "Nombre y Apellido", "Persona Responsable", "Area", "Carne Salada", "Arabes", "Jamon y Queso", "Verdura", "Cebolla y Queso", "Total Docenas", "Precio Unitario", "Cobro Total", "Pago", "Forma de Pago", "Tiene la Plata", "Retiro", "Comentario"],
  "Beneficio combos limpieza": ["IDPedidoCombo", "IDBeneficio", "Fecha", "Origen", "Nombre Cliente", "Telefono", "Vendedor", "Persona Responsable", "Precio Combo 1", "Combo 1", "Precio Combo 2", "Combo 2", "Combos Totales", "Cobro Total", "Cuanto Pagó", "Debe Pagar", "Pago Total", "Forma de Pago", "Tiene la Plata", "Retiro", "Comentario"],
  "Compras (generál)": ["IDCompra", "IDBeneficio", "IDMision", "Fecha", "Tipo Compra", "Lugar Compra", "Persona Responsable", "Forma de Pago", "Estado Compra", "Comentario", "Movimiento Generado"],
  "Elementos comprados": ["IDItemCompra", "IDCompra", "Categoria", "Producto", "Unidad", "Necesitamos", "Tenemos", "Comprar", "Precio Unitario", "Subtotal", "Comentario"],
  "Misiones": ["IDMision", "Nombre Mision", "Fecha Inicio", "Fecha Fin", "Estado", "Comentario"],
  "Movimientos Misiones": ["IDMovimientoMision", "IDMision", "Fecha", "Tipo", "Subtipo", "Nombre y Apellido", "Persona Responsable", "Area", "Forma Pago", "Monto", "Monto Firmado", "Estado", "Comentario"],
  "Inscripción a Misiones": ["IDInscripcion", "IDMision", "Misionero", "Area", "DNI", "Estado Inscripcion", "Comentario"],
  "Cobros a misioneros": ["IDObligacion", "Tipo Origen", "Fecha", "IDBeneficio", "IDMision", "Nombre Obligacion", "Monto Esperado", "Fuente Deudores", "Fecha Vencimiento", "Estado", "Comentario"],
  "Deudas Personas": ["IDDeuda", "IDObligacion", "IDMisionero", "Monto Esperado", "Monto Pagado", "Saldo Pendiente", "Estado Deuda", "Observaciones"],
  "Pagos Deudas": ["IDPagoDeuda", "IDDeuda", "Fecha", "Monto", "Forma de Pago", "Recibe la Plata", "Comentario", "Movimiento Generado"],
  "control. General": ["IDControl", "Fecha", "Año", "Mes", "Origen", "Tipo", "Concepto", "IDBeneficio", "IDMision", "Persona Responsable", "Forma de Pago", "Moneda", "Monto", "Monto Firmado", "Monto en Pesos", "Monto en Dólares", "Comentario", "Tabla Origen", "IDOrigen"],
  "Info Extra": ["IDInfo", "Fecha", "información", "Clasificación", "Archivo en cuestión"]
};

const NAV_ITEMS = [
  ["home", "Inicio"],
  ["misioneros", "Misioneros"],
  ["reuniones", "Reuniones"],
  ["info", "Info Extra"],
  ["beneficios", "Beneficios"],
  ["misiones", "Misiones"],
  ["compras", "Compras"],
  ["deudores", "Deudores"],
  ["control", "Control General"]
];

const state = {
  apiUrl: API_BASE_URL,
  data: {},
  currentView: "home",
  selectedBeneficioId: null,
  selectedMisionId: null,
  selectedCompraId: null,
  selectedTab: null,
  loading: false,
  pendingQueue: [],
  syncingQueue: false,
  pulling: false,
  lastSyncAt: null,
  error: null,
  warning: null,
  cacheMode: false,
  search: "",
  filters: {}
};

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  window.addEventListener("online", () => flushPendingQueue().then(backgroundPullFromSheets));
  bindGlobalEvents();
  loadDataCache();
  loadPendingQueue();
  loadMetaCache();
  applyPendingQueueToState();
  state.loading = false;
  state.warning = Object.keys(state.data || {}).length
    ? "Datos cargados desde cache. Sincronizando en segundo plano..."
    : "App lista. Sincronizando en segundo plano...";
  render();
  flushPendingQueue().then(backgroundPullFromSheets);
}

function bindGlobalEvents() {
  document.getElementById("syncButton").addEventListener("click", () => syncAll(true));

  const sideNav = document.getElementById("sideNav");

  sideNav.addEventListener("click", (event) => {
    const option = event.target.closest(".rdr-radio-option[data-nav-view]");
    if (!option) return;

    event.preventDefault();
    event.stopPropagation();

    const view = option.dataset.navView;
    if (!view || view === state.currentView) return;

    go(view);
  });
}

async function apiGet(action, params = {}) {
  const url = new URL(state.apiUrl);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });
  const response = await fetch(url.toString(), { method: "GET" });
  const json = await response.json();
  if (!json.ok) throw new Error(json.error || "Error de API");
  return json;
}

async function apiPost(payload) {
  const response = await fetch(state.apiUrl, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  const json = await response.json();
  if (!json.ok) throw new Error(json.error || "Error de API");
  return json;
}

async function syncAll(forceMessage) {
  state.loading = false;
  state.warning = "Sincronizando...";
  renderMessages();
  await flushPendingQueue();
  await backgroundPullFromSheets();
  state.warning = pendingCount() ? `${pendingCount()} cambios pendientes` : (forceMessage ? "Sincronización finalizada" : "Datos sincronizados");
  render();
}

function saveDataCache() {
  localStorage.setItem(DATA_CACHE_KEY, JSON.stringify({
    version: CACHE_VERSION,
    savedAt: new Date().toISOString(),
    data: state.data
  }));
}

function loadDataCache() {
  try {
    const cached = localStorage.getItem(DATA_CACHE_KEY) || localStorage.getItem("economiaLogisticaCache");
    if (!cached) {
      state.data = {};
      return false;
    }
    const parsed = JSON.parse(cached);
    state.data = parsed.data || {};
    state.cacheMode = true;
    state.error = null;
    return true;
  } catch (error) {
    state.data = {};
    return false;
  }
}

function savePendingQueue() {
  localStorage.setItem(QUEUE_CACHE_KEY, JSON.stringify({
    version: CACHE_VERSION,
    savedAt: new Date().toISOString(),
    queue: state.pendingQueue
  }));
}

function loadPendingQueue() {
  try {
    const cached = localStorage.getItem(QUEUE_CACHE_KEY);
    state.pendingQueue = cached ? (JSON.parse(cached).queue || []) : [];
    state.pendingQueue.forEach((op) => {
      if (op.status === "sending") op.status = "pending";
    });
    return true;
  } catch (error) {
    state.pendingQueue = [];
    return false;
  }
}

function saveMetaCache() {
  localStorage.setItem(META_CACHE_KEY, JSON.stringify({
    version: CACHE_VERSION,
    savedAt: new Date().toISOString(),
    lastSyncAt: state.lastSyncAt
  }));
}

function loadMetaCache() {
  try {
    const cached = localStorage.getItem(META_CACHE_KEY);
    if (!cached) return false;
    state.lastSyncAt = JSON.parse(cached).lastSyncAt || null;
    return true;
  } catch (error) {
    return false;
  }
}

function saveAllLocal() {
  saveDataCache();
  savePendingQueue();
  saveMetaCache();
}

function render() {
  renderNav();
  const root = document.getElementById("appRoot");
  renderMessages();
  const views = {
    home: renderHome,
    misioneros: renderMisioneros,
    reuniones: renderReuniones,
    info: renderInfoExtra,
    beneficios: renderBeneficios,
    beneficioDetail: () => renderBeneficioDetail(state.selectedBeneficioId),
    misiones: renderMisiones,
    misionDetail: () => renderMisionDetail(state.selectedMisionId),
    compras: renderCompras,
    compraDetail: () => renderCompraDetail(state.selectedCompraId),
    deudores: renderDeudores,
    control: renderControlGeneral
  };
  root.innerHTML = (views[state.currentView] || renderHome)();
  bindViewEvents();
}

function renderNav() {
  const nav = document.getElementById("sideNav");

  nav.innerHTML = `
    <div class="rdr-radio-demo">
      ${NAV_ITEMS.map(([view, label]) => `
        <label class="rdr-radio-option" data-nav-view="${escapeHtml(view)}">
          <input
            type="radio"
            name="rdr-menu"
            value="${escapeHtml(view)}"
            ${state.currentView === view ? "checked" : ""}
            tabindex="-1"
          />

          <div class="rdr-radio-marker">
            <svg class="rdr-x-mark" viewBox="0 0 100 100" aria-hidden="true">
              <path class="rdr-x-path" d="M25,25 L75,75"></path>
              <path class="rdr-x-path delay" d="M75,25 L25,75"></path>
            </svg>
          </div>

          <span class="rdr-label-text">${escapeHtml(label)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function renderMessages() {
  updateHeaderSyncStatus();

  const host = document.getElementById("messageHost");
  const messages = [];

  const count = pendingCount();
  const hasFailed = state.pendingQueue.some((op) => op.status === "failed");

  if (state.error) {
    messages.push(`
      <div class="message error">
        ${escapeHtml(state.error)}
        <button type="button" data-action="retry">Reintentar</button>
      </div>
    `);
  }

  if (hasFailed) {
    messages.push(`
      <div class="message error">
        Error de sincronización. La app sigue funcionando localmente. ${count} cambios pendientes.
      </div>
    `);
  } else if (count) {
    messages.push(`
      <div class="message warning">
        ${count} cambios pendientes de sincronizar.
      </div>
    `);
  }

  host.innerHTML = messages.join("");

  const retry = host.querySelector("[data-action='retry']");
  if (retry) retry.addEventListener("click", () => syncAll(true));
}

function updateHeaderSyncStatus() {
  const status = document.getElementById("connectionStatus");
  if (!status) return;
  const count = pendingCount();
  if (state.syncingQueue || state.pulling) {
    status.textContent = "Sincronizando...";
    status.className = "status-pill ok";
  } else if (state.pendingQueue.some((op) => op.status === "failed")) {
    status.textContent = `${count} pendientes`;
    status.className = "status-pill error";
  } else if (count) {
    status.textContent = `${count} pendientes`;
    status.className = "status-pill cache";
  } else {
    status.textContent = "Todo sincronizado";
    status.className = "status-pill ok";
  }
}

function pendingCount() {
  return state.pendingQueue.filter((op) => op.status === "pending" || op.status === "failed" || op.status === "sending").length;
}

function go(view) {
  state.currentView = view;
  state.selectedTab = null;
  state.search = "";
  render();
}

function renderHome() {
  return `
    <div class="view-header"><div><h2>Inicio</h2><p>Elegí una sección para trabajar.</p></div></div>
    <div class="home-grid">
      ${NAV_ITEMS.filter(([view]) => view !== "home").map(([view, label]) => `<button class="home-button" data-view="${escapeHtml(view)}" type="button"><strong>${escapeHtml(label)}</strong></button>`).join("")}
    </div>
  `;
}

function renderMisioneros() {
  const area = state.filters.AreaMisioneros || "";
  const filtered = rowsOf(TABLES.misioneros).filter((row) => !area || row.Area === area);
  const rows = searchRows(filtered, ["Nombre", "Apellido", "Area", "DNI"]);
  return `
    <div class="view-header">
      <div><h2>Misioneros</h2><p>Misioneros</p></div>
      <button class="primary" type="button" data-open-form="${TABLES.misioneros}">Agregar</button>
    </div>
    <div class="toolbar">
  <div class="brutalist-container">
    <input class="brutalist-input smooth-type" data-search type="search" placeholder="BUSCAR..." value="${escapeHtml(state.search)}">
    <label class="brutalist-label">BUSCAR</label>
  </div>

  <div class="brutalist-container">
    <select class="brutalist-input smooth-type" data-filter="AreaMisioneros">
      <option value="">Todas las áreas</option>
      ${AREA_OPTIONS.map((option) => `<option value="${escapeHtml(option)}" ${area === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
    <label class="brutalist-label">ÁREA</label>
  </div>
</div>
    ${renderTable(TABLES.misioneros, rows, ["Nombre", "Apellido", "Area", "DNI"])}
  `;
}

function renderReuniones() {
  return listView("Reuniones", "Reuniones", TABLES.reuniones, rowsOf(TABLES.reuniones), ["Título", "Fecha", "Descripción", "Encargados", "Link Oración"]);
}

function renderInfoExtra() {
  return listView("Info Extra", "Información extra", TABLES.info, rowsOf(TABLES.info), ["Fecha", "información", "Clasificación", "Archivo en cuestión"]);
}

function renderBeneficios() {
  const rows = rowsOf(TABLES.beneficios);
  return listView("Beneficios", "Nombres de Beneficios", TABLES.beneficios, rows, ["Nombre Beneficio", "Tipo Beneficio", "Fecha Inicio", "Fecha Fin", "Estado"], { detailView: "beneficioDetail", detailId: "IDBeneficio" });
}

function renderBeneficioDetail(id) {
  const beneficio = getById(TABLES.beneficios, "IDBeneficio", id) || {};
  const tabs = [
    ["datos", "Datos", TABLES.beneficios, [beneficio], ["Nombre Beneficio", "Tipo Beneficio", "Fecha Inicio", "Fecha Fin", "Estado", "Comentario"]],
    ["empanadas", "Pedidos empanadas", TABLES.empanadas, filterBy(TABLES.empanadas, "IDBeneficio", id), ["Fecha", "Nombre Cliente", "Persona Responsable", "Total Docenas", "Cobro Total", "Pago"]],
    ["combos", "Combos limpieza", TABLES.combos, filterBy(TABLES.combos, "IDBeneficio", id), ["Fecha", "Nombre Cliente", "Vendedor", "Combos Totales", "Cobro Total", "Debe Pagar"]],
    ["movimientos", "Movimientos", TABLES.movimientosBeneficios, filterBy(TABLES.movimientosBeneficios, "IDBeneficio", id), ["Fecha", "Movimiento", "Tipo de Movimiento", "Persona Responsable", "Forma de Pago", "Monto", "Monto Firmado"]],
    ["recuentos", "Recuentos", TABLES.recuentosBeneficios, filterBy(TABLES.recuentosBeneficios, "IDBeneficio", id), ["Fecha", "Persona Responsable", "Forma de Pago", "Monto Declarado", "Comentario"]],
    ["compras", "Compras", TABLES.compras, filterBy(TABLES.compras, "IDBeneficio", id), ["Fecha", "Tipo Compra", "Lugar Compra", "Persona Responsable", "Estado Compra"]]
  ];
  const active = state.selectedTab || "datos";
  const tab = tabs.find((item) => item[0] === active) || tabs[0];
  const canCreate = active !== "datos";
  return `
    <div class="view-header">
      <div><h2>${escapeHtml(beneficio["Nombre Beneficio"] || "Beneficio")}</h2><p>${escapeHtml(id || "")}</p></div>
      <button type="button" data-view="beneficios">Volver</button>
    </div>
    <div class="tabs">${tabs.map(([key, label]) => `<button class="tab-button ${key === active ? "active" : ""}" data-tab="${key}" type="button">${label}</button>`).join("")}</div>
    ${canCreate ? `<div class="toolbar"><button class="primary" type="button" data-open-form="${tab[2]}" data-default-idbeneficio="${escapeHtml(id)}">Agregar</button></div>` : ""}
    ${renderTable(tab[2], tab[3], tab[4], { readOnly: false, detailCompra: active === "compras" })}
  `;
}

function renderMisiones() {
  return listView("Misiones", "Misiones", TABLES.misiones, rowsOf(TABLES.misiones), ["Nombre Mision", "Fecha Inicio", "Fecha Fin", "Estado"], { detailView: "misionDetail", detailId: "IDMision" });
}

function renderMisionDetail(id) {
  const mision = getById(TABLES.misiones, "IDMision", id) || {};
  const obligaciones = filterBy(TABLES.obligaciones, "IDMision", id);
  const tabs = [
    ["datos", "Datos", TABLES.misiones, [mision], ["Nombre Mision", "Fecha Inicio", "Fecha Fin", "Estado", "Comentario"]],
    ["inscriptos", "Inscriptos", TABLES.inscripciones, filterBy(TABLES.inscripciones, "IDMision", id), ["Misionero", "Area", "DNI", "Estado Inscripcion"]],
    ["movimientos", "Movimientos", TABLES.movimientosMisiones, filterBy(TABLES.movimientosMisiones, "IDMision", id), ["Fecha", "Tipo", "Subtipo", "Persona Responsable", "Forma Pago", "Monto", "Monto Firmado"]],
    ["compras", "Compras", TABLES.compras, filterBy(TABLES.compras, "IDMision", id), ["Fecha", "Tipo Compra", "Lugar Compra", "Persona Responsable", "Estado Compra"]],
    ["cobros", "Cobros/deudas", TABLES.obligaciones, obligaciones, ["Fecha", "Nombre Obligacion", "Monto Esperado", "Fecha Vencimiento", "Estado"]]
  ];
  const active = state.selectedTab || "datos";
  const tab = tabs.find((item) => item[0] === active) || tabs[0];
  const canCreate = ["inscriptos", "movimientos", "compras"].includes(active);
  return `
    <div class="view-header">
      <div><h2>${escapeHtml(mision["Nombre Mision"] || "Misión")}</h2><p>${escapeHtml(id || "")}</p></div>
      <button type="button" data-view="misiones">Volver</button>
    </div>
    <div class="tabs">${tabs.map(([key, label]) => `<button class="tab-button ${key === active ? "active" : ""}" data-tab="${key}" type="button">${label}</button>`).join("")}</div>
    ${canCreate ? `<div class="toolbar"><button class="primary" type="button" data-open-form="${tab[2]}" data-default-idmision="${escapeHtml(id)}">Agregar</button></div>` : ""}
    ${renderTable(tab[2], tab[3], tab[4], { detailCompra: active === "compras" })}
  `;
}

function renderCompras() {
  return listView("Compras", "Compras generales", TABLES.compras, rowsOf(TABLES.compras), ["Fecha", "Tipo Compra", "Lugar Compra", "Persona Responsable", "Forma de Pago", "Estado Compra"], { detailView: "compraDetail", detailId: "IDCompra" });
}

function renderCompraDetail(id) {
  const compra = getById(TABLES.compras, "IDCompra", id) || {};
  return `
    <div class="view-header">
      <div><h2>Compra ${escapeHtml(id || "")}</h2><p>${escapeHtml(compra["Tipo Compra"] || compra["Lugar Compra"] || "")}</p></div>
      <button type="button" data-view="compras">Volver</button>
    </div>
    <div class="section-card">
      ${renderKeyValues(compra, ["Fecha", "Tipo Compra", "Lugar Compra", "Persona Responsable", "Forma de Pago", "Estado Compra", "Comentario"])}
    </div>
    <div class="toolbar" style="margin-top:14px"><button class="primary" type="button" data-open-form="${TABLES.itemsCompra}" data-default-idcompra="${escapeHtml(id)}">Agregar elemento</button></div>
    ${renderTable(TABLES.itemsCompra, filterBy(TABLES.itemsCompra, "IDCompra", id), ["Categoria", "Producto", "Unidad", "Necesitamos", "Tenemos", "Comprar", "Precio Unitario", "Subtotal", "Comentario"])}
  `;
}

function renderDeudores() {
  const deudas = rowsOf(TABLES.deudas).filter((deuda) => toNumber(deuda["Saldo Pendiente"]) > 0 || String(deuda["Estado Deuda"] || "").toLowerCase() !== "pagado");
  const rows = deudas.map((deuda) => {
    const obligacion = getById(TABLES.obligaciones, "IDObligacion", deuda.IDObligacion) || {};
    const misionero = getById(TABLES.misioneros, "IDMisionero", deuda.IDMisionero) || {};
    return {
      ...deuda,
      Misionero: fullName(misionero),
      Obligación: obligacion["Nombre Obligacion"] || deuda.IDObligacion
    };
  });
  return `
    <div class="view-header"><div><h2>Deudores</h2><p>Deudas pendientes y registro de pagos.</p></div></div>
    ${renderTable(TABLES.deudas, rows, ["Misionero", "Obligación", "Monto Esperado", "Monto Pagado", "Saldo Pendiente", "Estado Deuda"], { payment: true })}
  `;
}

function renderControlGeneral() {
  const rows = applyControlFilters(rowsOf(TABLES.control));
  const totalIngresos = rows.reduce((sum, row) => sum + Math.max(amountFromControl(row), 0), 0);
  const totalEgresos = rows.reduce((sum, row) => sum + Math.min(amountFromControl(row), 0), 0);
  const years = unique(rowsOf(TABLES.control).map((row) => row["Año"]).filter(Boolean));
  return `
    <div class="view-header"><div><h2>Control General</h2><p>Consolidado solo lectura.</p></div></div>
    <span class="readonly-banner">Solo lectura</span>
    <div class="toolbar">
      ${selectFilter("Año", years)}
      ${selectFilter("Mes", unique(rowsOf(TABLES.control).map((row) => row["Mes"]).filter(Boolean)))}
      ${selectFilter("Origen", unique(rowsOf(TABLES.control).map((row) => row["Origen"]).filter(Boolean)))}
      ${selectFilter("Tipo", unique(rowsOf(TABLES.control).map((row) => row["Tipo"]).filter(Boolean)))}
      ${selectFilter("Persona Responsable", unique(rowsOf(TABLES.control).map((row) => row["Persona Responsable"]).filter(Boolean)))}
      ${selectFilter("Forma de Pago", unique(rowsOf(TABLES.control).map((row) => row["Forma de Pago"]).filter(Boolean)))}
    </div>
    <div class="totals-grid control-cards-grid">
  <div class="control-card-container">
    <div class="control-title-card">
      <p>INGRESOS</p>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2l1.8 5.5h5.8l-4.7 3.4l1.8 5.5L12 13l-4.7 3.4l1.8-5.5l-4.7-3.4h5.8L12 2z"></path>
      </svg>
    </div>
    <div class="control-card-content">
      <p class="control-card-title">Total ingresos</p>
      <p class="control-card-amount">${formatMoney(totalIngresos)}</p>
      <p class="control-card-description">Dinero registrado como entrada.</p>
    </div>
  </div>

  <div class="control-card-container">
    <div class="control-title-card">
      <p>EGRESOS</p>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2l1.8 5.5h5.8l-4.7 3.4l1.8 5.5L12 13l-4.7 3.4l1.8-5.5l-4.7-3.4h5.8L12 2z"></path>
      </svg>
    </div>
    <div class="control-card-content">
      <p class="control-card-title">Total egresos</p>
      <p class="control-card-amount">${formatMoney(totalEgresos)}</p>
      <p class="control-card-description">Dinero registrado como salida.</p>
    </div>
  </div>

  <div class="control-card-container">
    <div class="control-title-card">
      <p>SALDO</p>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 2l1.8 5.5h5.8l-4.7 3.4l1.8 5.5L12 13l-4.7 3.4l1.8-5.5l-4.7-3.4h5.8L12 2z"></path>
      </svg>
    </div>
    <div class="control-card-content">
      <p class="control-card-title">Saldo final</p>
      <p class="control-card-amount">${formatMoney(totalIngresos + totalEgresos)}</p>
      <p class="control-card-description">Resultado neto del período filtrado.</p>
    </div>
  </div>
</div>
    ${renderTable(TABLES.control, rows, ["Fecha", "Origen", "Tipo", "Concepto", "Persona Responsable", "Forma de Pago", "Monto", "Monto Firmado", "Monto en Pesos", "Tabla Origen"], { readOnly: true })}
  `;
}

function listView(title, subtitle, table, rows, columns, options = {}) {
  return `
    <div class="view-header">
      <div><h2>${title}</h2><p>${subtitle}</p></div>
      <button class="primary" type="button" data-open-form="${table}">Agregar</button>
    </div>
    ${options.searchable ? `
  <div class="toolbar">
    <div class="brutalist-container">
      <input class="brutalist-input smooth-type" data-search type="search" placeholder="BUSCAR..." value="${escapeHtml(state.search)}">
      <label class="brutalist-label">BUSCAR</label>
    </div>
  </div>
` : ""}
    ${renderTable(table, rows, columns, options)}
  `;
}

function renderTable(table, rows, columns, options = {}) {
  const idColumn = ID_COLUMNS[table];
  const safeRows = rows.filter(Boolean);

  if (!safeRows.length) {
    return `<div class="empty-state">No hay registros para mostrar.</div>`;
  }

  return `
    <div class="datatable-card">
      <div class="datatable-header">
        <div>
          <h3>${escapeHtml(table)}</h3>
          <p>${safeRows.length} registro${safeRows.length === 1 ? "" : "s"} cargado${safeRows.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      <div class="table-wrap datatable-wrap">
        <table class="excel-data-table">
          <thead>
            <tr>
              ${columns.map((column) => `
                <th>${escapeHtml(column)}</th>
              `).join("")}
              ${options.readOnly ? "" : "<th>Acciones</th>"}
            </tr>
          </thead>

          <tbody>
            ${safeRows.map((row) => `
              <tr class="${row.__syncStatus ? "pending-row" : ""}">
                ${columns.map((column) => `
                  <td>${formatCell(column, row[column])}</td>
                `).join("")}

                ${options.readOnly ? "" : `
                  <td class="row-actions excel-actions">
                    ${rowActions(table, row, idColumn, options)}
                  </td>
                `}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function rowActions(table, row, idColumn, options) {
  const idValue = row[idColumn] || row.IDDeuda;
  const badge = row.__syncStatus ? `<span class="pending-badge">Pendiente</span>` : "";
  if (options.payment) return `${badge}<button type="button" data-pay-debt="${escapeHtml(row.IDDeuda)}">Registrar pago</button>`;
  const actions = [badge];
  if (options.detailView) actions.push(`<button type="button" data-detail-view="${options.detailView}" data-detail-id="${escapeHtml(row[options.detailId])}">Abrir</button>`);
  if (options.detailCompra) actions.push(`<button type="button" data-detail-view="compraDetail" data-detail-id="${escapeHtml(row.IDCompra)}">Elementos</button>`);
  if (idValue) {
    actions.push(`<button type="button" data-edit-table="${escapeHtml(table)}" data-edit-id="${escapeHtml(idValue)}">Editar</button>`);
    actions.push(`<button class="danger" type="button" data-delete-table="${escapeHtml(table)}" data-delete-id="${escapeHtml(idValue)}">Eliminar</button>`);
  }
  return actions.join("");
}

function bindViewEvents() {
  const root = document.getElementById("appRoot");
  if (!root) return;

  root.querySelectorAll("[data-view]").forEach((element) => element.addEventListener("click", () => go(element.dataset.view)));
  root.querySelectorAll("[data-tab]").forEach((element) => element.addEventListener("click", () => {
    state.selectedTab = element.dataset.tab;
    render();
  }));
  root.querySelectorAll("[data-open-form]").forEach((button) => button.addEventListener("click", () => {
    openForm(button.dataset.openForm, defaultsFromButton(button));
  }));
  root.querySelectorAll("[data-detail-view]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.detailView === "beneficioDetail") state.selectedBeneficioId = button.dataset.detailId;
    if (button.dataset.detailView === "misionDetail") state.selectedMisionId = button.dataset.detailId;
    if (button.dataset.detailView === "compraDetail") state.selectedCompraId = button.dataset.detailId;
    state.currentView = button.dataset.detailView;
    state.selectedTab = null;
    render();
  }));
  root.querySelectorAll("[data-edit-table]").forEach((button) => button.addEventListener("click", () => {
    const table = button.dataset.editTable;
    const idColumn = ID_COLUMNS[table];
    openForm(table, getById(table, idColumn, button.dataset.editId), true);
  }));
  root.querySelectorAll("[data-delete-table]").forEach((button) => button.addEventListener("click", () => {
    deleteRecord(button.dataset.deleteTable, ID_COLUMNS[button.dataset.deleteTable], button.dataset.deleteId);
  }));
  root.querySelectorAll("[data-pay-debt]").forEach((button) => button.addEventListener("click", () => {
    openForm(TABLES.pagosDeudas, { IDDeuda: button.dataset.payDebt, Fecha: todayIso() });
  }));
  const search = root.querySelector("[data-search]");
  if (search) search.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });
  root.querySelectorAll("[data-filter]").forEach((filter) => filter.addEventListener("change", () => {
    state.filters[filter.dataset.filter] = filter.value;
    render();
  }));
}

function defaultsFromButton(button) {
  const defaults = {};
  Object.entries(button.dataset).forEach(([key, value]) => {
    if (key.startsWith("default")) {
      const column = key.replace("default", "");
      defaults[column.charAt(0).toUpperCase() + column.slice(1)] = value;
    }
  });
  if (button.dataset.defaultIdbeneficio) defaults.IDBeneficio = button.dataset.defaultIdbeneficio;
  if (button.dataset.defaultIdmision) defaults.IDMision = button.dataset.defaultIdmision;
  if (button.dataset.defaultIdcompra) defaults.IDCompra = button.dataset.defaultIdcompra;
  return defaults;
}

function openForm(table, defaults = {}, editing = false) {
  const idColumn = ID_COLUMNS[table];
  const columns = columnsOf(table).filter((column) => column !== idColumn && !["Monto Firmado", "Movimiento Generado", "IDControl", "Año", "Mes", "Monto en Pesos", "Monto en Dólares", "Tabla Origen", "IDOrigen"].includes(column));
  const modal = document.getElementById("modalRoot");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.innerHTML = `
    <form class="modal-panel eco-form" id="recordForm">
      <div class="eco-form-header">
        <div class="eco-form-title-area">
          <p class="eco-form-title">${editing ? "EDITAR" : "AGREGAR"}</p>
          <p class="eco-form-subtitle">${escapeHtml(table)}</p>
        </div>

        <button class="eco-form-close" type="button" data-close-modal>
          Cancelar
        </button>
      </div>

      <div class="form-grid eco-form-grid">
        ${columns.map((column) => renderField(table, column, defaults[column])).join("")}
      </div>

      <div class="modal-footer eco-form-footer">
        <button type="button" data-close-modal>Cancelar</button>
        <button class="primary eco-form-submit" type="submit">Guardar</button>
      </div>

      <div class="eco-form-bg"></div>
      <div class="eco-form-whitefilter"></div>
    </form>
  `;
  modal.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
  modal.querySelector("#recordForm").addEventListener("input", () => applyFormCalculations(table));
  modal.querySelector("#recordForm").addEventListener("submit", (event) => {
    event.preventDefault();
    submitForm(table, editing ? { idColumn, idValue: defaults[idColumn] } : null);
  });
  applyFormCalculations(table);
}

function renderField(table, column, value) {
  const lower = column.toLowerCase();
  const escapedValue = value === undefined || value === null ? "" : String(value);
  const attrs = `name="${escapeHtml(column)}" data-column="${escapeHtml(column)}"`;
  if (table === TABLES.misioneros && column === "Area") {
    return renderSelectField(column, escapedValue, AREA_OPTIONS.map((option) => ({ value: option, label: option })));
  }
  if (table === TABLES.reuniones && column === "Encargados") {
    return renderCheckboxGroupField(column, value, getMisionerosEconomiaOptions());
  }
  if (table === TABLES.reuniones && column === "Estructura") {
    return renderCheckboxGroupField(column, value, STRUCTURE_OPTIONS.map((option) => ({ value: option, label: option })));
  }
  if (table === TABLES.reuniones && column === "Link Oración") {
    return `<div class="field"><label>${escapeHtml(column)}</label><input ${attrs} type="url" placeholder="Pegar enlace de oración, Drive, YouTube, documento, etc." value="${escapeHtml(escapedValue)}"></div>`;
  }
  if (table === TABLES.info && column === "Clasificación") {
    return renderSelectField(column, escapedValue, INFO_CLASSIFICATION_OPTIONS.map((option) => ({ value: option, label: option })));
  }
  if (table === TABLES.info && column === "Archivo en cuestión") {
    return `<div class="field"><label>${escapeHtml(column)}</label><input ${attrs} type="text" placeholder="Pegar enlace o escribir nombre del archivo" value="${escapeHtml(escapedValue)}"></div>`;
  }
  if (column === "DNI") {
    return `<div class="field"><label>${escapeHtml(column)}</label><input ${attrs} type="text" inputmode="numeric" value="${escapeHtml(escapedValue)}"></div>`;
  }
  if (["Comentario", "Descripción", "Estructura", "información", "Observaciones"].some((key) => lower.includes(key.toLowerCase()))) {
    return `<div class="field"><label>${escapeHtml(column)}</label><textarea ${attrs}>${escapeHtml(escapedValue)}</textarea></div>`;
  }
  const options = selectOptionsFor(column);
  if (options) {
    return renderSelectField(column, escapedValue, options);
  }
  const type = lower.includes("fecha") ? "date" : isNumericColumn(column) ? "number" : "text";
  const step = type === "number" ? ` step="any"` : "";
  return `<div class="field"><label>${escapeHtml(column)}</label><input ${attrs} type="${type}"${step} value="${escapeHtml(formatInputValue(type, escapedValue))}"></div>`;
}

function renderSelectField(column, value, options) {
  const attrs = `name="${escapeHtml(column)}" data-column="${escapeHtml(column)}"`;
  return `<div class="field"><label>${escapeHtml(column)}</label><select ${attrs}>${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></div>`;
}

function renderCheckboxGroupField(column, value, options) {
  const selected = parseMultiValue(value);
  return `
    <div class="field field-wide">
      <label>${escapeHtml(column)}</label>
      <div class="checkbox-group" data-multi-field="${escapeHtml(column)}">
        ${options.length ? options.map((option) => `
          <label class="checkbox-option">
            <input type="checkbox" value="${escapeHtml(option.value)}" ${selected.includes(option.value) ? "checked" : ""}>
            <span>${escapeHtml(option.label)}</span>
          </label>
        `).join("") : `<div class="empty-state">No hay opciones disponibles.</div>`}
      </div>
    </div>
  `;
}

function parseMultiValue(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function getCheckboxGroupValue(form, column) {
  const group = Array.from(form.querySelectorAll("[data-multi-field]")).find((item) => item.dataset.multiField === column);
  if (!group) return "";
  return Array.from(group.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value).join(", ");
}

function getMisionerosEconomiaOptions() {
  return rowsOf(TABLES.misioneros)
    .filter((row) => row.Area === "Economía y Logística")
    .map((row) => ({ value: fullName(row), label: fullName(row) }))
    .filter((option) => option.value);
}

function selectOptionsFor(column) {
  const blank = [{ value: "", label: "" }];
  if (["IDBeneficio"].includes(column)) return blank.concat(rowsOf(TABLES.beneficios).map((row) => ({ value: row.IDBeneficio, label: `${row.IDBeneficio} - ${row["Nombre Beneficio"] || ""}` })));
  if (["IDMision"].includes(column)) return blank.concat(rowsOf(TABLES.misiones).map((row) => ({ value: row.IDMision, label: `${row.IDMision} - ${row["Nombre Mision"] || ""}` })));
  if (["IDCompra"].includes(column)) return blank.concat(rowsOf(TABLES.compras).map((row) => ({ value: row.IDCompra, label: `${row.IDCompra} - ${row["Tipo Compra"] || row["Lugar Compra"] || ""}` })));
  if (["IDMisionero"].includes(column)) return blank.concat(rowsOf(TABLES.misioneros).map((row) => ({ value: row.IDMisionero, label: `${row.IDMisionero} - ${fullName(row)}` })));
  if (["Persona Responsable", "Vendedor", "Recibe la Plata", "Misionero", "Nombre y Apellido"].includes(column)) return blank.concat(rowsOf(TABLES.misioneros).map((row) => ({ value: column === "Misionero" ? row.IDMisionero : fullName(row), label: fullName(row) })));
  if (column === "Forma de Pago" || column === "Forma Pago") return blank.concat(["Efectivo", "Transferencia", "Mercado Pago", "Otro"].map((value) => ({ value, label: value })));
  if (column === "Estado" || column.includes("Estado")) return blank.concat(["Activo", "Pendiente", "Pagado", "Cerrado", "Cancelado"].map((value) => ({ value, label: value })));
  if (["Tipo", "Movimiento", "Tipo de Movimiento"].includes(column)) return blank.concat(["Ingreso", "Egreso", "Gasto", "Otro"].map((value) => ({ value, label: value })));
  if (["Pago", "Tiene la Plata", "Retiro", "Pago Total"].includes(column)) return blank.concat(["Si", "No"].map((value) => ({ value, label: value })));
  return null;
}

function submitForm(table, editing) {
  const form = document.getElementById("recordForm");
  const data = getFormData(form);

  cleanData(data);
  calculateRecord(table, data);

  if (editing) {
    submitEditOptimistic(table, editing, data);
  } else {
    submitCreateOptimistic(table, data);
  }
}

function deleteRecord(table, idColumn, idValue) {
  if (!confirm(`¿Eliminar registro ${idValue}?`)) return;
  const record = getById(table, idColumn, idValue);
  if (!record) return;

  if (isTempId(idValue)) {
    removeLocalRow(table, idColumn, idValue);
    if (table === TABLES.pagosDeudas && record.IDDeuda) recalcDebtLocal(record.IDDeuda);
    state.pendingQueue = state.pendingQueue.filter((op) => !(op.action === "create" && (op.localId === idValue || op.idValue === idValue)));
    state.warning = "Registro temporal eliminado localmente.";
    saveAllLocal();
    render();
    return;
  }

  removeLocalRow(table, idColumn, idValue);
  if (table === TABLES.pagosDeudas && record.IDDeuda) recalcDebtLocal(record.IDDeuda);
  enqueueOperation({ action: "delete", table, idColumn, idValue, data: {} });
  state.error = null;
  state.warning = "Eliminado localmente. Pendiente de sincronizar.";
  saveAllLocal();
  render();
  flushPendingQueue();
}

function submitCreateOptimistic(table, data) {
  const idColumn = ID_COLUMNS[table];
  const tempId = makeTempId(table);
  const opId = makeOpId();

  const localRow = {
    ...data,
    [idColumn]: tempId,
    __localId: tempId,
    __syncStatus: "pending_create",
    __opId: opId
  };

  addLocalRow(table, localRow);
  if (table === TABLES.pagosDeudas && data.IDDeuda) recalcDebtLocal(data.IDDeuda);
  enqueueOperation({ opId, action: "create", table, idColumn, localId: tempId, idValue: tempId, data: { ...data } });
  state.error = null;
  state.warning = "Guardado local instantáneo. Pendiente de sincronizar.";
  closeModal();
  saveAllLocal();
  render();
  flushPendingQueue();
}

function submitEditOptimistic(table, editing, data) {
  const { idColumn, idValue } = editing;

  const previousRecord = getById(table, idColumn, idValue);
  if (!previousRecord) {
    state.error = "No se encontró el registro local para editar: " + idValue;
    renderMessages();
    return;
  }

  if (isTempId(idValue)) {
    const createOp = state.pendingQueue.find((op) => op.action === "create" && (op.localId === idValue || op.idValue === idValue));
    if (createOp) {
      createOp.data = { ...createOp.data, ...data };
      createOp.updatedAt = new Date().toISOString();
      createOp.status = createOp.status === "sending" ? "sending" : "pending";
    }
  } else {
    enqueueOperation({ action: "update", table, idColumn, idValue, data: { ...data } });
  }

  const updatedLocalRow = {
    ...previousRecord,
    ...data,
    [idColumn]: idValue,
    __localId: previousRecord.__localId,
    __syncStatus: isTempId(idValue) ? "pending_create" : "pending_update",
    __opId: previousRecord.__opId
  };

  replaceLocalRow(table, idColumn, idValue, updatedLocalRow);
  if (table === TABLES.pagosDeudas && (data.IDDeuda || previousRecord.IDDeuda)) recalcDebtLocal(data.IDDeuda || previousRecord.IDDeuda);

  state.error = null;
  state.warning = "Editado localmente. Pendiente de sincronizar.";
  closeModal();
  saveAllLocal();
  render();
  flushPendingQueue();
}

function addLocalRow(table, row) {
  if (!Array.isArray(state.data[table])) {
    state.data[table] = [];
  }

  state.data[table].push(row);
}

function replaceLocalRow(table, idColumn, idValue, newRow) {
  if (!Array.isArray(state.data[table])) {
    state.data[table] = [];
  }

  const index = state.data[table].findIndex((row) => String(row[idColumn]) === String(idValue));

  if (index >= 0) {
    state.data[table][index] = newRow;
  } else {
    state.data[table].push(newRow);
  }
}

function removeLocalRow(table, idColumn, idValue) {
  if (!Array.isArray(state.data[table])) return;

  state.data[table] = state.data[table].filter((row) => String(row[idColumn]) !== String(idValue));
}

function recalcDebtLocal(idDeuda) {
  const deuda = getById(TABLES.deudas, "IDDeuda", idDeuda);
  if (!deuda) return;
  const totalPagado = filterBy(TABLES.pagosDeudas, "IDDeuda", idDeuda).reduce((sum, pago) => sum + toNumber(pago.Monto), 0);
  const esperado = toNumber(deuda["Monto Esperado"]);
  deuda["Monto Pagado"] = totalPagado;
  deuda["Saldo Pendiente"] = esperado - totalPagado;
  deuda["Estado Deuda"] = deuda["Saldo Pendiente"] <= 0 ? "Pagado" : "Pendiente";
  deuda.__syncStatus = deuda.__syncStatus || "pending_update";
}

function makeTempId(table) {
  const idColumn = ID_COLUMNS[table] || "ID";
  return "TMP_" + table.replace(/\W+/g, "_") + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function makeOpId() {
  return "OP_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

function isTempId(value) {
  return String(value || "").startsWith("TMP_");
}

function enqueueOperation(operation) {
  const now = new Date().toISOString();
  if (operation.action === "update") {
    const existingUpdate = state.pendingQueue.find((op) => op.action === "update" && op.table === operation.table && String(op.idValue) === String(operation.idValue));
    if (existingUpdate) {
      existingUpdate.data = { ...existingUpdate.data, ...(operation.data || {}) };
      existingUpdate.status = existingUpdate.status === "sending" ? "sending" : "pending";
      existingUpdate.updatedAt = now;
      return existingUpdate;
    }
  }
  if (operation.action === "delete") {
    state.pendingQueue = state.pendingQueue.filter((op) => !(op.table === operation.table && String(op.idValue) === String(operation.idValue) && op.action === "update"));
  }
  state.pendingQueue.push({
    opId: operation.opId || makeOpId(),
    action: operation.action,
    table: operation.table,
    idColumn: operation.idColumn || ID_COLUMNS[operation.table],
    localId: operation.localId || "",
    idValue: operation.idValue || operation.localId || "",
    data: operation.data || {},
    status: "pending",
    createdAt: now,
    updatedAt: now,
    attempts: 0,
    lastError: ""
  });
}

async function flushPendingQueue() {
  if (state.syncingQueue) return;
  if (navigator.onLine === false) return;
  const operations = state.pendingQueue.filter((op) => op.status === "pending" || op.status === "failed");
  if (!operations.length) {
    renderMessages();
    return;
  }
  state.syncingQueue = true;
  renderMessages();
  try {
    for (const op of operations) {
      op.status = "sending";
      op.updatedAt = new Date().toISOString();
      savePendingQueue();
      renderMessages();
      try {
        const payload = buildPayloadFromOperation(op);
        const result = await apiPost(payload);
        if (op.action === "create") {
          const savedRow = result.data || {};
          const realId = savedRow[op.idColumn];
          if (realId) {
            replaceLocalRow(op.table, op.idColumn, op.idValue, clearLocalFlags(savedRow));
            replaceReferencesEverywhere(op.idValue, realId);
          }
        } else if (op.action === "update") {
          const savedRow = result.data;
          if (savedRow) replaceLocalRow(op.table, op.idColumn, op.idValue, clearLocalFlags(savedRow));
        }
        state.pendingQueue = state.pendingQueue.filter((item) => item.opId !== op.opId);
        state.error = null;
        state.cacheMode = false;
        saveAllLocal();
        render();
      } catch (error) {
        op.status = "failed";
        op.attempts = (op.attempts || 0) + 1;
        op.lastError = error.message || String(error);
        op.updatedAt = new Date().toISOString();
        state.error = "Error de sincronización, la app sigue funcionando localmente.";
        savePendingQueue();
        renderMessages();
        break;
      }
    }
  } finally {
    state.syncingQueue = false;
    savePendingQueue();
    renderMessages();
  }
}

function buildPayloadFromOperation(op) {
  if (op.action === "create") return { action: "create", table: op.table, data: { ...op.data } };
  if (op.action === "update") return { action: "update", table: op.table, idColumn: op.idColumn, idValue: op.idValue, data: { ...op.data } };
  if (op.action === "delete") return { action: "delete", table: op.table, idColumn: op.idColumn, idValue: op.idValue };
  throw new Error("Operación no soportada: " + op.action);
}

async function backgroundPullFromSheets() {
  if (state.pulling) return;
  state.pulling = true;
  renderMessages();
  try {
    const result = await apiGet("sync");
    const serverData = result.data || {};
    state.data = mergeServerDataWithPending(serverData, state.pendingQueue);
    state.lastSyncAt = new Date().toISOString();
    state.cacheMode = false;
    state.error = null;
    state.warning = pendingCount() ? `${pendingCount()} cambios pendientes` : "Datos sincronizados";
    saveDataCache();
    saveMetaCache();
    render();
  } catch (error) {
    state.cacheMode = true;
    state.warning = "La app sigue funcionando localmente. No se pudo refrescar desde Google Sheets todavía.";
    renderMessages();
  } finally {
    state.pulling = false;
    renderMessages();
  }
}

function mergeServerDataWithPending(serverData, pendingQueue) {
  const merged = cloneData(serverData || {});
  pendingQueue.forEach((op) => {
    const idColumn = op.idColumn || ID_COLUMNS[op.table];
    if (!Array.isArray(merged[op.table])) merged[op.table] = [];
    if (op.action === "create") {
      const existing = merged[op.table].find((row) => String(row[idColumn]) === String(op.idValue));
      const localRow = { ...op.data, [idColumn]: op.idValue, __localId: op.localId || op.idValue, __syncStatus: "pending_create", __opId: op.opId };
      if (existing) Object.assign(existing, localRow);
      else merged[op.table].push(localRow);
    }
    if (op.action === "update") {
      const index = merged[op.table].findIndex((row) => String(row[idColumn]) === String(op.idValue));
      const nextRow = { ...(index >= 0 ? merged[op.table][index] : {}), ...op.data, [idColumn]: op.idValue, __syncStatus: "pending_update", __opId: op.opId };
      if (index >= 0) merged[op.table][index] = nextRow;
      else merged[op.table].push(nextRow);
    }
    if (op.action === "delete") {
      merged[op.table] = merged[op.table].filter((row) => String(row[idColumn]) !== String(op.idValue));
    }
  });
  return merged;
}

function applyPendingQueueToState() {
  state.data = mergeServerDataWithPending(state.data || {}, state.pendingQueue || []);
}

function replaceReferencesEverywhere(oldId, newId) {
  if (String(state.selectedBeneficioId) === String(oldId)) state.selectedBeneficioId = newId;
  if (String(state.selectedMisionId) === String(oldId)) state.selectedMisionId = newId;
  if (String(state.selectedCompraId) === String(oldId)) state.selectedCompraId = newId;
  Object.keys(state.data || {}).forEach((table) => {
    rowsOf(table).forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (String(row[key]) === String(oldId)) row[key] = newId;
      });
    });
  });
  state.pendingQueue.forEach((op) => {
    if (String(op.idValue) === String(oldId)) op.idValue = newId;
    if (String(op.localId) === String(oldId)) op.localId = newId;
    Object.keys(op.data || {}).forEach((key) => {
      if (String(op.data[key]) === String(oldId)) op.data[key] = newId;
    });
  });
}

function clearLocalFlags(row) {
  const clean = { ...(row || {}) };
  delete clean.__localId;
  delete clean.__syncStatus;
  delete clean.__opId;
  return clean;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

function closeModal() {
  const modal = document.getElementById("modalRoot");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = "";
}

function applyFormCalculations(table) {
  const form = document.getElementById("recordForm");
  if (!form) return;
  const data = getFormData(form);
  calculateRecord(table, data);
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field && ["Total Docenas", "Cobro Total", "Combos Totales", "Debe Pagar", "Pago Total", "Subtotal"].includes(key)) field.value = value;
  });
}

function getFormData(form) {
  const data = {};
  form.querySelectorAll("[data-multi-field]").forEach((group) => {
    const column = group.dataset.multiField;
    data[column] = getCheckboxGroupValue(form, column);
  });
  Array.from(form.elements).forEach((field) => {
    if (!field.name || field.disabled) return;
    if (field.tagName === "SELECT" && field.multiple) {
      data[field.name] = Array.from(field.selectedOptions).map((option) => option.value).join(", ");
      return;
    }
    if (field.type === "checkbox") {
      data[field.name] = field.checked;
      return;
    }
    data[field.name] = field.value;
  });
  return data;
}

function calculateRecord(table, data) {
  if (table === TABLES.empanadas) {
    const total = ["Carne Salada", "Arabes", "Jamon y Queso", "Verdura", "Cebolla y Queso"].reduce((sum, key) => sum + toNumber(data[key]), 0);
    data["Total Docenas"] = total;
    data["Cobro Total"] = total * toNumber(data["Precio Unitario"]);
  }
  if (table === TABLES.combos) {
    const total = toNumber(data["Combo 1"]) + toNumber(data["Combo 2"]);
    const cobro = toNumber(data["Precio Combo 1"]) * toNumber(data["Combo 1"]) + toNumber(data["Precio Combo 2"]) * toNumber(data["Combo 2"]);
    data["Combos Totales"] = total;
    data["Cobro Total"] = cobro;
    data["Debe Pagar"] = cobro - toNumber(data["Cuanto Pagó"]);
    data["Pago Total"] = data["Debe Pagar"] <= 0 ? "Si" : "No";
  }
  if (table === TABLES.itemsCompra) {
    data.Subtotal = toNumber(data.Comprar) * toNumber(data["Precio Unitario"]);
  }
}

function rowsOf(table) {
  return Array.isArray(state.data[table]) ? state.data[table] : [];
}

function columnsOf(table) {
  const fromRows = rowsOf(table).flatMap((row) => Object.keys(row || {}));
  return unique((DEFAULT_COLUMNS[table] || []).concat(fromRows));
}

function getById(table, idColumn, idValue) {
  return rowsOf(table).find((row) => String(row[idColumn]) === String(idValue));
}

function filterBy(table, column, value) {
  return rowsOf(table).filter((row) => String(row[column] || "") === String(value || ""));
}

function searchRows(rows, columns) {
  const query = state.search.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => columns.some((column) => String(row[column] || "").toLowerCase().includes(query)));
}

function applyControlFilters(rows) {
  const controlKeys = ["Año", "Mes", "Origen", "Tipo", "Persona Responsable", "Forma de Pago"];
  return rows.filter((row) => controlKeys.every((key) => !state.filters[key] || String(row[key] || "") === state.filters[key]));
}

function selectFilter(column, values) {
  return `
    <div class="brutalist-container">
      <select class="brutalist-input smooth-type" data-filter="${escapeHtml(column)}">
        <option value="">${escapeHtml(column)}</option>
        ${values.map((value) => `
          <option value="${escapeHtml(value)}" ${state.filters[column] === value ? "selected" : ""}>
            ${escapeHtml(value)}
          </option>
        `).join("")}
      </select>
      <label class="brutalist-label">${escapeHtml(column)}</label>
    </div>
  `;
}

function renderKeyValues(row, columns) {
  return columns.map((column) => `<p><strong>${escapeHtml(column)}:</strong> ${formatCell(column, row[column])}</p>`).join("");
}

function formatCell(column, value) {
  if (value === undefined || value === null || value === "") return "";
  if (column === "DNI") return escapeHtml(formatDNI(value));
  if (column.toLowerCase().includes("fecha")) return escapeHtml(formatDate(value));
  if (isNumericColumn(column) || column.includes("Monto") || column.includes("Precio") || column.includes("Cobro") || column.includes("Saldo") || column === "Subtotal") return escapeHtml(formatMoney(value));
  if (String(value).startsWith("http")) return `<a href="${escapeHtml(value)}" target="_blank" rel="noopener">Abrir</a>`;
  return escapeHtml(value);
}

function formatDNI(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return String(value || "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatMoney(value) {
  const number = toNumber(value);
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(number);
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-AR");
}

function formatInputValue(type, value) {
  if (type !== "date" || !value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function fullName(row) {
  return [row.Nombre, row.Apellido].filter(Boolean).join(" ") || row["Nombre y Apellido"] || row.IDMisionero || "";
}

function toNumber(value) {
  if (typeof value === "number") return value;
  const normalized = String(value || "0").replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function amountFromControl(row) {
  return toNumber(row["Monto Firmado"] || row["Monto en Pesos"] || row.Monto);
}

function isNumericColumn(column) {
  return ["Monto", "Monto Firmado", "Monto Declarado", "Precio Unitario", "Precio Combo 1", "Precio Combo 2", "Combo 1", "Combo 2", "Combos Totales", "Total Docenas", "Cobro Total", "Cuanto Pagó", "Debe Pagar", "Comprar", "Subtotal", "Necesitamos", "Tenemos", "Monto Esperado", "Monto Pagado", "Saldo Pendiente", "Año", "Mes"].includes(column);
}

function cleanData(data) {
  Object.keys(data).forEach((key) => {
    if (data[key] === "") delete data[key];
  });
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ""))];
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}
