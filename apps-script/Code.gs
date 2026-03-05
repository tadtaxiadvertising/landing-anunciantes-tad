/**
 * Webhook Google Apps Script para formulario #contacto de la landing de anunciantes.
 *
 * Nota de compatibilidad CORS:
 * - Desde frontend estático, Apps Script suele funcionar mejor con
 *   application/x-www-form-urlencoded (sin preflight).
 * - Este endpoint acepta TANTO JSON como form-urlencoded.
 */

var SHEET_NAME = 'Leads';
var REQUIRED_FIELDS = [
  'nombre', 'empresa', 'puesto', 'telefono', 'correo', 'ciudad', 'industria'
];

var COLUMN_HEADERS = [
  'Timestamp', 'Nombre', 'Empresa', 'Puesto', 'Telefono', 'Correo', 'Ciudad',
  'Industria', 'Presupuesto', 'Tiene Agencia', 'Necesita Diseno', 'Taxis',
  'Espacios por Taxi', 'Duracion', 'Inversion Mensual', 'Inversion Total', 'Source'
];

function doPost(e) {
  try {
    var payload = parseRequest_(e);
    validatePayload_(payload);

    var sheet = getLeadsSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      clean_(payload.nombre),
      clean_(payload.empresa),
      clean_(payload.puesto),
      clean_(payload.telefono),
      clean_(payload.correo),
      clean_(payload.ciudad),
      clean_(payload.industria),
      clean_(payload.presupuesto),
      clean_(payload.tieneAgencia),
      clean_(payload.necesitaDiseno),
      clean_(payload.taxis),
      clean_(payload.espaciosPorTaxi),
      clean_(payload.duracion),
      clean_(payload.inversionMensual),
      clean_(payload.inversionTotal),
      clean_(payload.source || 'landing-anunciantes-tad')
    ]);

    return jsonResponse_({ status: 'success', message: 'Lead stored successfully' });
  } catch (err) {
    Logger.log('doPost error: ' + err);
    return jsonResponse_({ status: 'error', message: err && err.message ? err.message : 'Unexpected server error' });
  }
}

function doGet() {
  return jsonResponse_({ status: 'success', message: 'Webhook is running' });
}

/**
 * Soporta:
 * 1) JSON: e.postData.contents
 * 2) x-www-form-urlencoded: e.parameter
 */
function parseRequest_(e) {
  if (!e) {
    throw new Error('Empty request body');
  }

  // Primero intentamos JSON si viene contenido.
  if (e.postData && e.postData.contents) {
    var raw = String(e.postData.contents || '').trim();
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        // Si no es JSON válido, seguimos con e.parameter (form-urlencoded)
      }
    }
  }

  // Fallback para form-urlencoded
  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return e.parameter;
  }

  throw new Error('Invalid or empty payload');
}

function validatePayload_(payload) {
  REQUIRED_FIELDS.forEach(function (field) {
    if (!Object.prototype.hasOwnProperty.call(payload, field) || !clean_(payload[field])) {
      throw new Error('Missing required field: ' + field);
    }
  });

  if (!isValidEmail_(payload.correo)) {
    throw new Error('Invalid email format');
  }
}

function getLeadsSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Spreadsheet not available');

  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found');

  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMN_HEADERS);
  }
}

function clean_(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function isValidEmail_(email) {
  var value = clean_(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
