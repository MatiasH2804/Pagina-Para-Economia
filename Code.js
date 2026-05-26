var SPREADSHEET_ID = "1abtbtRzYaTcJ7BNwCL9MeZTuuIHbHxjktXohvutKPBc";

var TABLE_CONFIG = {
  "Menu Principal": { id: "IDMenu", prefix: "MENU", digits: 3 },
  "Reuniones": { id: "IDORACION", prefix: "REU", digits: 3 },
  "Misioneros": { id: "IDMisionero", prefix: "ID", suffix: "Misionero", digits: 3 },
  "Nombres de Beneficios": { id: "IDBeneficio", prefix: "BEN", digits: 3 },
  "Movimientos Beneficios": { id: "IDMovimiento", prefix: "MOVBEN", digits: 3 },
  "Recuentos Beneficios": { id: "IDRecuento", prefix: "REC", digits: 3 },
  "Beneficio empanadas": { id: "IDPedido", prefix: "PED", digits: 3 },
  "Beneficio combos limpieza": { id: "IDPedidoCombo", prefix: "PEDCOMBO", digits: 3 },
  "Compras (generál)": { id: "IDCompra", prefix: "COMP", digits: 3 },
  "Elementos comprados": { id: "IDItemCompra", prefix: "ITEMCOMP", digits: 3 },
  "Misiones": { id: "IDMision", prefix: "MIS", digits: 3 },
  "Movimientos Misiones": { id: "IDMovimientoMision", prefix: "MOVMIS", digits: 3 },
  "Inscripción a Misiones": { id: "IDInscripcion", prefix: "INS", digits: 3 },
  "Cobros a misioneros": { id: "IDObligacion", prefix: "OBL", digits: 3 },
  "Deudas Personas": { id: "IDDeuda", prefix: "DEU", digits: 3 },
  "Pagos Deudas": { id: "IDPagoDeuda", prefix: "PAGDEU", digits: 3 },
  "control. General": { id: "IDControl", prefix: "CTRL", digits: 3 },
  "Info Extra": { id: "IDInfo", prefix: "INFO", digits: 3 }
};

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = params.action || "ping";
    if (action === "ping") return json_({ ok: true, message: "API funcionando" });
    if (action === "sync") return json_(sync_());
    if (action === "getTable") return json_({ ok: true, table: params.table, data: getRows_(params.table) });
    if (action === "getSchema") return json_({ ok: true, schema: getSchema_() });
    return json_({ ok: false, error: "Acción GET no soportada: " + action });
  } catch (err) {
    return json_({ ok: false, error: err.message || String(err) });
  }
}

function doPost(e) {
  try {
    var body = parseBody_(e);
    var action = body.action;
    if (action === "create") {
      var created = appendRow_(body.table, body.data || {});
      return json_({ ok: true, data: created });
    }
    if (action === "update") {
      var updated = updateRow_(body.table, body.idColumn, body.idValue, body.data || {});
      return json_({ ok: true, data: updated });
    }
    if (action === "delete") {
      var deleted = deleteRow_(body.table, body.idColumn, body.idValue);
      return json_({ ok: true, data: deleted });
    }
    if (action === "syncBatch") {
      var results = [];
      (body.operations || []).forEach(function(operation) {
        if (operation.action === "create") results.push(appendRow_(operation.table, operation.data || {}));
        if (operation.action === "update") results.push(updateRow_(operation.table, operation.idColumn, operation.idValue, operation.data || {}));
        if (operation.action === "delete") results.push(deleteRow_(operation.table, operation.idColumn, operation.idValue));
      });
      return json_({ ok: true, results: results });
    }
    return json_({ ok: false, error: "Acción POST no soportada: " + action });
  } catch (err) {
    return json_({ ok: false, error: err.message || String(err) });
  }
}

function doOptions() {
  return json_({ ok: true });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error("Body vacío.");
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    throw new Error("JSON inválido: " + err.message);
  }
}

function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "PEGAR_SPREADSHEET_ID_ACA") {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet_(tableName) {
  validateTable_(tableName);
  var sheet = getSpreadsheet_().getSheetByName(tableName);
  if (!sheet) throw new Error("No existe la hoja: " + tableName);
  return sheet;
}

function getHeaders_(sheet) {
  if (!sheet || sheet.getLastColumn() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function(header) {
    return String(header || "").trim();
  }).filter(Boolean);
}

function getRows_(tableName) {
  validateTable_(tableName);
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(tableName);
  if (!sheet) return [];
  var headers = getHeaders_(sheet);
  if (!headers.length || sheet.getLastRow() < 2) return [];
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  return values.map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      obj[header] = serializeValue_(row[index]);
    });
    return obj;
  }).filter(function(obj) {
    return Object.keys(obj).some(function(key) { return obj[key] !== "" && obj[key] !== null; });
  });
}

function appendRow_(tableName, data) {
  validateTable_(tableName);
  var sheet = getSheet_(tableName);
  var headers = getHeaders_(sheet);
  if (!headers.length) throw new Error("La hoja no tiene encabezados: " + tableName);
  var config = TABLE_CONFIG[tableName];
  if (config && config.id && !data[config.id]) data[config.id] = generateId_(tableName);
  data = prepareData_(tableName, data);
  var row = headers.map(function(header) {
    return data[header] !== undefined ? data[header] : "";
  });
  sheet.appendRow(row);
  var saved = objectFromHeaders_(headers, row);
  saved.__serverSyncedAt = new Date().toISOString();
  if (tableName === "Movimientos Beneficios") addControlGeneralFromBeneficio_(saved);
  if (tableName === "Movimientos Misiones") addControlGeneralFromMision_(saved);
  if (tableName === "Pagos Deudas") recalcDebt_(saved.IDDeuda);
  return saved;
}

function updateRow_(tableName, idColumn, idValue, data) {
  validateTable_(tableName);
  var sheet = getSheet_(tableName);
  var headers = getHeaders_(sheet);
  var idIndex = headers.indexOf(idColumn);
  if (idIndex < 0) throw new Error("No existe la columna ID: " + idColumn);
  var foundRow = findRowNumber_(sheet, idIndex + 1, idValue);
  if (!foundRow) throw new Error("No se encontró el registro: " + idValue);
  data = prepareData_(tableName, data);
  var current = sheet.getRange(foundRow, 1, 1, headers.length).getValues()[0];
  headers.forEach(function(header, index) {
    if (data[header] !== undefined) current[index] = data[header];
  });
  sheet.getRange(foundRow, 1, 1, headers.length).setValues([current]);
  if (tableName === "Pagos Deudas") {
    var deudaIndex = headers.indexOf("IDDeuda");
    if (deudaIndex >= 0) recalcDebt_(current[deudaIndex]);
  }
  return objectFromHeaders_(headers, current);
}

function deleteRow_(tableName, idColumn, idValue) {
  validateTable_(tableName);
  var sheet = getSheet_(tableName);
  var headers = getHeaders_(sheet);
  var idIndex = headers.indexOf(idColumn);
  if (idIndex < 0) throw new Error("No existe la columna ID: " + idColumn);
  var foundRow = findRowNumber_(sheet, idIndex + 1, idValue);
  if (!foundRow) throw new Error("No se encontró el registro: " + idValue);
  var estadoIndex = headers.indexOf("Estado");
  var activoIndex = headers.indexOf("Activo");
  if (activoIndex >= 0) {
    sheet.getRange(foundRow, activoIndex + 1).setValue(false);
    return { idValue: idValue, deleted: false, inactive: true };
  }
  if (estadoIndex >= 0) {
    sheet.getRange(foundRow, estadoIndex + 1).setValue("Inactivo");
    return { idValue: idValue, deleted: false, inactive: true };
  }
  sheet.deleteRow(foundRow);
  return { idValue: idValue, deleted: true };
}

function generateId_(tableName) {
  validateTable_(tableName);
  var config = TABLE_CONFIG[tableName];
  if (!config) throw new Error("No hay configuración de ID para: " + tableName);
  var rows = getRows_(tableName);
  var max = 0;
  rows.forEach(function(row) {
    var raw = String(row[config.id] || "");
    var match = raw.match(/(\d+)/);
    if (match) max = Math.max(max, Number(match[1]));
  });
  var next = String(max + 1);
  while (next.length < (config.digits || 3)) next = "0" + next;
  return (config.prefix || "") + next + (config.suffix || "");
}

function normalizeNumber_(value) {
  if (typeof value === "number") return value;
  if (value === null || value === undefined || value === "") return 0;
  var text = String(value).replace(/\./g, "").replace(",", ".");
  var number = Number(text);
  return isNaN(number) ? 0 : number;
}

function signedAmount_(tipo, monto) {
  var text = String(tipo || "").toLowerCase();
  var amount = Math.abs(normalizeNumber_(monto));
  if (text.indexOf("egreso") >= 0 || text.indexOf("gasto") >= 0 || text.indexOf("salida") >= 0 || text.indexOf("compra") >= 0) return -amount;
  return amount;
}

function addControlGeneralFromBeneficio_(row) {
  var signed = signedAmount_(row["Tipo de Movimiento"] || row.Movimiento, row.Monto);
  var fecha = row.Fecha || new Date();
  appendControl_( {
    Fecha: fecha,
    "Año": getYear_(fecha),
    Mes: getMonth_(fecha),
    Origen: "Beneficio",
    Tipo: signed >= 0 ? "Ingreso" : "Egreso",
    Concepto: row.Movimiento || row["Tipo de Movimiento"] || "",
    IDBeneficio: row.IDBeneficio || "",
    IDMision: "",
    "Persona Responsable": row["Persona Responsable"] || "",
    "Forma de Pago": row["Forma de Pago"] || "",
    Moneda: "ARS",
    Monto: Math.abs(normalizeNumber_(row.Monto)),
    "Monto Firmado": signed,
    "Monto en Pesos": signed,
    "Monto en Dólares": 0,
    Comentario: row.Comentario || "",
    "Tabla Origen": "Movimientos Beneficios",
    IDOrigen: row.IDMovimiento || ""
  });
}

function addControlGeneralFromMision_(row) {
  var signed = signedAmount_(row.Tipo || row.Subtipo, row.Monto);
  var fecha = row.Fecha || new Date();
  appendControl_( {
    Fecha: fecha,
    "Año": getYear_(fecha),
    Mes: getMonth_(fecha),
    Origen: "Misión",
    Tipo: signed >= 0 ? "Ingreso" : "Egreso",
    Concepto: row.Subtipo || row.Tipo || "",
    IDBeneficio: "",
    IDMision: row.IDMision || "",
    "Persona Responsable": row["Persona Responsable"] || "",
    "Forma de Pago": row["Forma Pago"] || row["Forma de Pago"] || "",
    Moneda: "ARS",
    Monto: Math.abs(normalizeNumber_(row.Monto)),
    "Monto Firmado": signed,
    "Monto en Pesos": signed,
    "Monto en Dólares": 0,
    Comentario: row.Comentario || "",
    "Tabla Origen": "Movimientos Misiones",
    IDOrigen: row.IDMovimientoMision || ""
  });
}

function recalcDebt_(idDeuda) {
  if (!idDeuda) return null;
  var debtSheet = getSheet_("Deudas Personas");
  var debtHeaders = getHeaders_(debtSheet);
  var debtIdIndex = debtHeaders.indexOf("IDDeuda");
  var debtRowNumber = findRowNumber_(debtSheet, debtIdIndex + 1, idDeuda);
  if (!debtRowNumber) throw new Error("No se encontró la deuda: " + idDeuda);
  var debtValues = debtSheet.getRange(debtRowNumber, 1, 1, debtHeaders.length).getValues()[0];
  var debt = objectFromHeaders_(debtHeaders, debtValues);
  var pagos = getRows_("Pagos Deudas").filter(function(pago) {
    return String(pago.IDDeuda) === String(idDeuda);
  });
  var totalPagado = pagos.reduce(function(sum, pago) {
    return sum + normalizeNumber_(pago.Monto);
  }, 0);
  var esperado = normalizeNumber_(debt["Monto Esperado"]);
  var saldo = esperado - totalPagado;
  setIfHeader_(debtHeaders, debtValues, "Monto Pagado", totalPagado);
  setIfHeader_(debtHeaders, debtValues, "Saldo Pendiente", saldo);
  setIfHeader_(debtHeaders, debtValues, "Estado Deuda", saldo <= 0 ? "Pagado" : "Pendiente");
  debtSheet.getRange(debtRowNumber, 1, 1, debtHeaders.length).setValues([debtValues]);
  return objectFromHeaders_(debtHeaders, debtValues);
}

function appendControl_(data) {
  var table = "control. General";
  var sheet = getSheet_(table);
  var headers = getHeaders_(sheet);
  var idColumn = TABLE_CONFIG[table].id;
  if (!data[idColumn]) data[idColumn] = generateId_(table);
  var row = headers.map(function(header) {
    return data[header] !== undefined ? data[header] : "";
  });
  sheet.appendRow(row);
  return objectFromHeaders_(headers, row);
}

function prepareData_(tableName, data) {
  var copy = {};
  Object.keys(data || {}).forEach(function(key) {
    copy[key] = data[key];
  });
  if (tableName === "Movimientos Beneficios") {
    copy["Monto Firmado"] = signedAmount_(copy["Tipo de Movimiento"] || copy.Movimiento, copy.Monto);
  }
  if (tableName === "Movimientos Misiones") {
    copy["Monto Firmado"] = signedAmount_(copy.Tipo || copy.Subtipo, copy.Monto);
  }
  if (tableName === "Elementos comprados") {
    copy.Subtotal = normalizeNumber_(copy.Comprar) * normalizeNumber_(copy["Precio Unitario"]);
  }
  return copy;
}

function sync_() {
  var data = {};
  var warnings = [];
  Object.keys(TABLE_CONFIG).forEach(function(tableName) {
    try {
      data[tableName] = getRows_(tableName);
    } catch (err) {
      data[tableName] = [];
      warnings.push(err.message || String(err));
    }
  });
  return { ok: true, data: data, warnings: warnings };
}

function getSchema_() {
  var schema = {};
  Object.keys(TABLE_CONFIG).forEach(function(tableName) {
    var sheet = getSpreadsheet_().getSheetByName(tableName);
    schema[tableName] = sheet ? getHeaders_(sheet) : [];
  });
  return schema;
}

function validateTable_(tableName) {
  if (!tableName) throw new Error("Falta table.");
  if (!TABLE_CONFIG[tableName]) throw new Error("Tabla no permitida: " + tableName);
}

function findRowNumber_(sheet, columnNumber, value) {
  if (sheet.getLastRow() < 2) return null;
  var values = sheet.getRange(2, columnNumber, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(value)) return i + 2;
  }
  return null;
}

function objectFromHeaders_(headers, values) {
  var obj = {};
  headers.forEach(function(header, index) {
    obj[header] = serializeValue_(values[index]);
  });
  return obj;
}

function serializeValue_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return value === null || value === undefined ? "" : value;
}

function setIfHeader_(headers, values, header, value) {
  var index = headers.indexOf(header);
  if (index >= 0) values[index] = value;
}

function getYear_(fecha) {
  var date = fecha instanceof Date ? fecha : new Date(fecha);
  if (isNaN(date.getTime())) date = new Date();
  return date.getFullYear();
}

function getMonth_(fecha) {
  var date = fecha instanceof Date ? fecha : new Date(fecha);
  if (isNaN(date.getTime())) date = new Date();
  return date.getMonth() + 1;
}
