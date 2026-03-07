/**
 * TAD Dominicana - Webhook para Leads (ANUNCIANTES)
 * Versión FINAL - 100% compatible
 * 
 * INSTRUCCIONES:
 * 1. Copia TODO este código
 * 2. Ve a https://script.google.com/
 * 3. Abre tu proyecto de TAD
 * 4. BORRA todo el código existente
 * 5. Pega este código
 * 6. Guarda (Ctrl+S)
 * 7. Deploy → Manage Deployments
 * 8. Who has access: Anyone, even anonymous
 * 9. Click en Update
 */

function doPost(e) {
  try {
    Logger.log("========================================");
    Logger.log("🚀 POST recibido - TAD Anunciantes");
    Logger.log("========================================");
    
    // ============================================
    // ABRIR SPREADSHEET
    // ============================================
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads');
    
    // Crear sheet si no existe
    if (!sheet) {
      Logger.log("📊 Creando sheet 'Leads'...");
      sheet = ss.insertSheet('Leads');
      
      // Agregar headers
      sheet.appendRow([
        'Timestamp',
        'Nombre',
        'Empresa',
        'Puesto',
        'Telefono',
        'Correo',
        'Ciudad',
        'Industria',
        'Presupuesto',
        'Tiene Agencia',
        'Necesita Diseno',
        'Taxis',
        'Espacios por Taxi',
        'Duracion',
        'Inversion Mensual',
        'Inversion Total',
        'Tipo',
        'Source',
        'Fecha'
      ]);
      
      // Congelar primera fila
      sheet.setFrozenRows(1);
      
      // Ajustar ancho de columnas
      sheet.setColumnWidth(1, 150); // Timestamp
      sheet.setColumnWidth(2, 120); // Nombre
      sheet.setColumnWidth(3, 120); // Empresa
      sheet.setColumnWidth(6, 200); // Correo
      sheet.setColumnWidth(12, 80); // Taxis
      sheet.setColumnWidth(15, 100); // Inversion Mensual
      sheet.setColumnWidth(16, 100); // Inversion Total
    }
    
    // ============================================
    // OBTENER DATOS
    // ============================================
    var data = {};
    
    // Método 1: e.parameter (FormData, URLSearchParams)
    if (e && e.parameter) {
      Logger.log("📦 Datos en e.parameter");
      data = e.parameter;
    }
    // Método 2: e.postData.contents (JSON)
    else if (e && e.postData && e.postData.contents) {
      Logger.log("📦 Datos en e.postData.contents (JSON)");
      data = JSON.parse(e.postData.contents);
    }
    // Método 3: e directo
    else if (e) {
      Logger.log("📦 Usando e directo");
      data = e;
    }
    // Error
    else {
      Logger.log("❌ No hay datos");
      return jsonResponse({
        status: 'error',
        message: 'No se recibieron datos'
      });
    }
    
    Logger.log("Datos recibidos: " + JSON.stringify(data));
    
    // ============================================
    // VALIDAR CAMPOS REQUERIDOS
    // ============================================
    var requiredFields = ['nombre', 'correo'];
    for (var i = 0; i < requiredFields.length; i++) {
      var field = requiredFields[i];
      var value = data[field] || '';
      if (!value || value.toString().trim() === '') {
        throw new Error('Falta campo requerido: ' + field);
      }
    }
    
    // Validar email
    var email = data.correo || data.email || '';
    if (email.indexOf('@') === -1) {
      throw new Error('Email inválido: ' + email);
    }
    
    // ============================================
    // CONSTRUIR FILA
    // ============================================
    var row = [
      new Date(),
      clean(data.nombre || ''),
      clean(data.empresa || ''),
      clean(data.puesto || ''),
      clean(data.telefono || data.phone || ''),
      clean(data.correo || data.email || ''),
      clean(data.ciudad || ''),
      clean(data.industria || ''),
      clean(data.presupuesto || ''),
      clean(data.tieneAgencia || ''),
      clean(data.necesitaDiseno || ''),
      clean(data.taxis || ''),
      clean(data.espaciosPorTaxi || ''),
      clean(data.duracion || ''),
      clean(data.inversionMensual || ''),
      clean(data.inversionTotal || ''),
      clean(data.tipo || 'anunciante'),
      clean(data.source || 'landing-anunciantes'),
      clean(data.fecha || new Date().toISOString())
    ];
    
    Logger.log("Fila a guardar: " + row.join(' | '));
    
    // ============================================
    // GUARDAR EN SHEETS
    // ============================================
    sheet.appendRow(row);
    
    Logger.log("✅ Lead guardado exitosamente");
    
    // ============================================
    // ENVIAR EMAIL DE NOTIFICACIÓN (OPCIONAL)
    // ============================================
    try {
      var emailBody = 'Nuevo lead de TAD Anunciantes\n\n' +
                      'Nombre: ' + data.nombre + '\n' +
                      'Empresa: ' + data.empresa + '\n' +
                      'Email: ' + data.correo + '\n' +
                      'Teléfono: ' + (data.telefono || 'N/A') + '\n' +
                      'Taxis: ' + (data.taxis || 'N/A') + '\n' +
                      'Inversión Total: RD$ ' + (data.inversionTotal || 'N/A');
      
      MailApp.sendEmail({
        to: 'tad.taxiadvertising@gmail.com',
        subject: '🚀 Nuevo Lead - TAD Anunciantes',
        body: emailBody
      });
      
      Logger.log("📧 Email de notificación enviado");
      
    } catch (emailError) {
      Logger.log("⚠️ No se pudo enviar email: " + emailError.message);
      // No fallamos por esto
    }
    
    // ============================================
    // RETORNAR ÉXITO
    // ============================================
    return jsonResponse({
      status: 'success',
      message: 'Lead guardado correctamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    Logger.log("❌ ERROR: " + err.message);
    Logger.log("Stack: " + err.stack);
    
    return jsonResponse({
      status: 'error',
      message: err.message,
      stack: err.stack
    });
  }
}

function doGet(e) {
  return jsonResponse({
    status: 'success',
    message: 'Webhook activo - TAD Anunciantes',
    version: 'FINAL-1.0',
    timestamp: new Date().toISOString(),
    instructions: 'Usa POST para enviar leads'
  });
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function clean(value) {
  if (value === undefined || value === null) return '';
  return value.toString().trim();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
