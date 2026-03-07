/**
 * Webhook Google Apps Script para guardar leads del formulario
 * https://landing-anunciantes-tad.vercel.app/#contacto
 * 
 * Versión mejorada: Soporta JSON y FormData
 * Fecha: 7 de Marzo, 2026
 */

var SHEET_NAME = "Leads";
var REQUIRED_FIELDS = [
  "nombre",
  "empresa",
  "puesto",
  "telefono",
  "correo",
  "ciudad",
  "industria"
];

var COLUMN_HEADERS = [
  "Timestamp",
  "Nombre",
  "Empresa",
  "Puesto",
  "Telefono",
  "Correo",
  "Ciudad",
  "Industria",
  "Presupuesto",
  "Tiene Agencia",
  "Necesita Diseno",
  "Taxis",
  "Espacios por Taxi",
  "Duracion",
  "Inversion Mensual",
  "Inversion Total",
  "Tipo",
  "Source",
  "Fecha"
];

function doPost(e) {
  try {
    // ============================================
    // PARSEAR DATOS (Soporta JSON y FormData)
    // ============================================
    var payload = parsePayload(e);
    
    // ============================================
    // VALIDAR DATOS
    // ============================================
    validatePayload(payload);
    
    // ============================================
    // GUARDAR EN SHEETS
    // ============================================
    var sheet = getSheet();
    ensureHeaders(sheet);
    
    sheet.appendRow([
      new Date(),
      clean(payload.nombre),
      clean(payload.empresa),
      clean(payload.puesto),
      clean(payload.telefono),
      clean(payload.correo),
      clean(payload.ciudad),
      clean(payload.industria),
      clean(payload.presupuesto || ""),
      clean(payload.tieneAgencia || ""),
      clean(payload.necesitaDiseno || ""),
      clean(payload.taxis || ""),
      clean(payload.espaciosPorTaxi || ""),
      clean(payload.duracion || ""),
      clean(payload.inversionMensual || ""),
      clean(payload.inversionTotal || ""),
      clean(payload.tipo || "anunciante"),
      clean(payload.source || "landing-anunciantes-tad"),
      clean(payload.fecha || new Date().toISOString())
    ]);
    
    Logger.log("✅ Lead guardado: " + payload.correo);
    
    return jsonResponse({
      status: "success",
      message: "Lead guardado correctamente",
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    Logger.log("❌ Error: " + err.message);
    
    return jsonResponse({
      status: "error",
      message: err.message,
      stack: err.stack
    });
  }
}

function doGet(e) {
  return jsonResponse({
    status: "success",
    message: "Webhook activo - TAD Dominicana",
    version: "2.0",
    timestamp: new Date().toISOString()
  });
}

/**
 * Parsea el payload soportando múltiples formatos
 */
function parsePayload(e) {
  var data = {};
  
  // ============================================
  // INTENTO 1: JSON (e.postData.contents)
  // ============================================
  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log("📦 Datos parseados como JSON");
      return normalizePayloadKeys(data);
    } catch (jsonError) {
      Logger.log("⚠️ No es JSON válido, intentando FormData");
    }
  }
  
  // ============================================
  // INTENTO 2: FormData (e.parameter)
  // ============================================
  if (e.parameter) {
    Logger.log("📦 Datos recibidos como FormData");
    return normalizePayloadKeys(e.parameter);
  }
  
  // ============================================
  // INTENTO 3: Query params (fallback)
  // ============================================
  Logger.log("⚠️ Usando parámetros directos de e");
  return normalizePayloadKeys(e);
}

/**
 * Normaliza las keys (quita acentos, minúsculas)
 */
function normalizePayloadKeys(payload) {
  var normalized = {};
  
  for (var key in payload) {
    if (payload.hasOwnProperty(key)) {
      var normalizedKey = normalizeKeyName(key);
      normalized[normalizedKey] = payload[key];
    }
  }
  
  return normalized;
}

/**
 * Normaliza el nombre de una key
 */
function normalizeKeyName(key) {
  return key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Valida los campos requeridos
 */
function validatePayload(payload) {
  REQUIRED_FIELDS.forEach(function(field) {
    var normalizedField = normalizeKeyName(field);
    var value = getValue(payload, field, normalizedField);
    
    if (!value || value.toString().trim() === "") {
      throw new Error("Falta el campo requerido: " + field);
    }
  });
  
  // Validar email
  var email = getValue(payload, "correo", "correo");
  if (!isValidEmail(email)) {
    throw new Error("Email inválido: " + email);
  }
  
  // Validar teléfono (RD)
  var phone = getValue(payload, "telefono", "telefono");
  if (!isValidPhone(phone)) {
    Logger.log("⚠️ Teléfono puede no ser válido: " + phone);
    // No lanzamos error, solo log
  }
}

/**
 * Obtiene un valor probando múltiples aliases
 */
function getValue(payload, field, normalizedField) {
  // Intentar con key original
  if (payload[field] !== undefined) {
    return payload[field];
  }
  
  // Intentar con key normalizada
  if (payload[normalizedField] !== undefined) {
    return payload[normalizedField];
  }
  
  // Intentar con aliases
  var aliases = getAliases(field);
  for (var i = 0; i < aliases.length; i++) {
    if (payload[aliases[i]] !== undefined) {
      return payload[aliases[i]];
    }
    var normalizedAlias = normalizeKeyName(aliases[i]);
    if (payload[normalizedAlias] !== undefined) {
      return payload[normalizedAlias];
    }
  }
  
  return "";
}

/**
 * Retorna aliases comunes para un campo
 */
function getAliases(field) {
  var aliases = {
    "nombre": ["name", "fullName", "full_name"],
    "empresa": ["company", "companyName", "company_name", "business"],
    "puesto": ["position", "title", "jobTitle", "job_title"],
    "telefono": ["phone", "phoneNumber", "phone_number", "celular", "whatsapp"],
    "correo": ["email", "correoElectronico", "correo_electronico", "mail"],
    "ciudad": ["city", "location"],
    "industria": ["industry", "sector", "rubro"],
    "presupuesto": ["budget", "presupuestoMensual", "presupuesto_mensual"],
    "taxis": ["numTaxis", "num_taxis", "cantidadTaxis", "cantidad_taxis"],
    "duracion": ["duration", "meses", "months"],
    "inversionMensual": ["monthlyInvestment", "inversion_mensual", "monthly_investment"],
    "inversionTotal": ["totalInvestment", "inversion_total", "total_investment"]
  };
  
  return aliases[field] || [];
}

/**
 * Obtiene o crea la sheet
 */
function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log("📊 Creando sheet: " + SHEET_NAME);
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  
  return sheet;
}

/**
 * Asegura que los headers existan
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    Logger.log("📝 Agregando headers");
    sheet.appendRow(COLUMN_HEADERS);
  } else {
    // Verificar si los headers actuales coinciden
    var currentHeaders = sheet.getRange(1, 1, 1, COLUMN_HEADERS.length).getValues()[0];
    var headersMatch = true;
    
    for (var i = 0; i < COLUMN_HEADERS.length; i++) {
      if (currentHeaders[i] !== COLUMN_HEADERS[i]) {
        headersMatch = false;
        break;
      }
    }
    
    if (!headersMatch) {
      Logger.log("⚠️ Headers no coinciden, actualizando...");
      // Insertar nueva fila en la posición 1
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, COLUMN_HEADERS.length).setValues([COLUMN_HEADERS]);
    }
  }
}

/**
 * Limpia un valor
 */
function clean(value) {
  if (value === undefined || value === null) {
    return "";
  }
  return value.toString().trim();
}

/**
 * Valida email
 */
function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida teléfono (formato RD)
 */
function isValidPhone(phone) {
  if (!phone) return false;
  var cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, "");
  var re = /^(\+1|1)?[23456789]\d{9}$/;
  return re.test(cleanPhone);
}

/**
 * Crea respuesta JSON
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
