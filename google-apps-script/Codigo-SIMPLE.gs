/**
 * Webhook Google Apps Script para guardar leads del formulario
 * Versión SIMPLE Y ROBUSTA - Funciona seguro
 * Fecha: 7 de Marzo, 2026
 */

var SHEET_NAME = "Leads";

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
    Logger.log("🚀 POST recibido - TAD Dominicana");
    
    // ============================================
    // OBTENER DATOS - Múltiples formas
    // ============================================
    var data = {};
    
    // Forma 1: e.parameter (FormData)
    if (e && e.parameter) {
      Logger.log("📦 Usando e.parameter (FormData)");
      data = e.parameter;
    }
    // Forma 2: e.postData.contents (JSON)
    else if (e && e.postData && e.postData.contents) {
      Logger.log("📦 Usando e.postData.contents (JSON)");
      data = JSON.parse(e.postData.contents);
    }
    // Forma 3: e directo
    else if (e) {
      Logger.log("📦 Usando e directo");
      data = e;
    }
    // Error: no hay datos
    else {
      Logger.log("❌ No hay objeto e");
      return jsonResponse({
        status: "error",
        message: "No se recibieron datos"
      });
    }
    
    Logger.log("Datos recibidos: " + JSON.stringify(data));
    
    // ============================================
    // VALIDAR CAMPOS REQUERIDOS
    // ============================================
    var requiredFields = ["nombre", "empresa", "correo"];
    for (var i = 0; i < requiredFields.length; i++) {
      var field = requiredFields[i];
      var value = data[field] || data[field.toLowerCase()] || "";
      if (!value || value.toString().trim() === "") {
        throw new Error("Falta campo: " + field);
      }
    }
    
    // Validar email
    var email = data.correo || data.email || "";
    if (email.indexOf("@") === -1) {
      throw new Error("Email inválido");
    }
    
    // ============================================
    // GUARDAR EN SHEETS
    // ============================================
    var sheet = getSheet();
    ensureHeaders(sheet);
    
    // Construir fila
    var row = [
      new Date(),
      clean(data.nombre || ""),
      clean(data.empresa || ""),
      clean(data.puesto || ""),
      clean(data.telefono || data.phone || ""),
      clean(data.correo || data.email || ""),
      clean(data.ciudad || ""),
      clean(data.industria || ""),
      clean(data.presupuesto || ""),
      clean(data.tieneAgencia || ""),
      clean(data.necesitaDiseno || ""),
      clean(data.taxis || ""),
      clean(data.espaciosPorTaxi || ""),
      clean(data.duracion || ""),
      clean(data.inversionMensual || ""),
      clean(data.inversionTotal || ""),
      clean(data.tipo || "anunciante"),
      clean(data.source || "landing-anunciantes-tad"),
      clean(data.fecha || new Date().toISOString())
    ];
    
    Logger.log("Guardando fila: " + row.join(" | "));
    sheet.appendRow(row);
    
    Logger.log("✅ Lead guardado exitosamente");
    
    return jsonResponse({
      status: "success",
      message: "Lead guardado correctamente"
    });
    
  } catch (err) {
    Logger.log("❌ ERROR: " + err.message);
    Logger.log("Stack: " + err.stack);
    
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
    version: "3.0-SIMPLE"
  });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log("Creando sheet: " + SHEET_NAME);
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    Logger.log("Agregando headers");
    sheet.appendRow(COLUMN_HEADERS);
  }
}

function clean(value) {
  if (value === undefined || value === null) return "";
  return value.toString().trim();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
