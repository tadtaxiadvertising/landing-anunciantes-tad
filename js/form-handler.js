/**
 * ============================================================================
 * TAD DOMINICANA - FRONTEND FORM HANDLER
 * ============================================================================
 * 
 * Landing Page: https://landing-anunciantes-tad.vercel.app
 * Google Apps Script Webhook: https://script.google.com/macros/s/AKfycbzoXowGQhBsd99iTKIj06lRObGHyoFvVBXbn74AhPRL2mVXe3JcEbXIjbaCAuu5xBBW/exec
 * 
 * Versión: 2.0 PRODUCTION
 * Compatible con: Codigo-PRODUCTION.gs
 * 
 * ============================================================================
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const GAS_CONFIG = {
  WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbzoXowGQhBsd99iTKIj06lRObGHyoFvVBXbn74AhPRL2mVXe3JcEbXIjbaCAuu5xBBW/exec',
  RATE_LIMIT_MS: 60000, // 1 minuto entre envíos
  STORAGE_KEY: 'tad_anunciantes_last_submit'
};

// ============================================
// RATE LIMITING
// ============================================
function checkRateLimit() {
  const lastSubmit = localStorage.getItem(GAS_CONFIG.STORAGE_KEY);
  
  if (lastSubmit) {
    const elapsed = Date.now() - parseInt(lastSubmit);
    
    if (elapsed < GAS_CONFIG.RATE_LIMIT_MS) {
      const waitTime = Math.ceil((GAS_CONFIG.RATE_LIMIT_MS - elapsed) / 1000);
      return { 
        allowed: false, 
        waitTime: waitTime,
        message: `Por favor espera ${waitTime} segundos antes de enviar otra solicitud`
      };
    }
  }
  
  return { allowed: true };
}

function setRateLimit() {
  localStorage.setItem(GAS_CONFIG.STORAGE_KEY, Date.now().toString());
}

// ============================================
// SANITIZACIÓN
// ============================================
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .substring(0, 500);
}

// ============================================
// VALIDACIÓN
// ============================================
function isValidEmail(email) {
  if (!email) return false;
  return email.indexOf('@') !== -1 && email.indexOf('.') !== -1;
}

function isValidPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+1|1)?[23456789]\d{9}$/.test(clean);
}

// ============================================
// ENVÍO DE FORMULARIO
// ============================================
async function submitLeadForm(formData) {
  console.log('🚀 [FORM] Iniciando envío de lead...');
  console.log('[FORM] Datos recibidos:', formData);
  
  // ============================================
  // 1. VERIFICAR RATE LIMIT
  // ============================================
  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    console.warn('⚠️ [FORM] Rate limit exceeded:', rateCheck);
    throw new Error(rateCheck.message);
  }
  
  // ============================================
  // 2. VALIDAR CAMPOS REQUERIDOS
  // ============================================
  if (!formData.nombre || formData.nombre.trim() === '') {
    throw new Error('El nombre es requerido');
  }
  
  if (!formData.correo || !isValidEmail(formData.correo)) {
    throw new Error('El email no es válido');
  }
  
  // ============================================
  // 3. SANITIZAR DATOS
  // ============================================
  const sanitizedData = {};
  Object.keys(formData).forEach(key => {
    sanitizedData[key] = sanitizeInput(formData[key]);
  });
  
  console.log('🔒 [FORM] Datos sanitizados:', sanitizedData);
  
  // ============================================
  // 4. AGREGAR METADATA
  // ============================================
  sanitizedData.tipo = 'anunciante';
  sanitizedData.source = 'landing-anunciantes';
  sanitizedData.fecha = new Date().toISOString();
  
  // ============================================
  // 5. PREPARAR URLSearchParams
  // ============================================
  const params = new URLSearchParams();
  
  // Agregar TODOS los campos requeridos por el backend
  const fieldMapping = {
    'nombre': sanitizedData.nombre,
    'empresa': sanitizedData.empresa || '',
    'puesto': sanitizedData.puesto || '',
    'telefono': sanitizedData.telefono || '',
    'correo': sanitizedData.correo,
    'ciudad': sanitizedData.ciudad || '',
    'industria': sanitizedData.industria || '',
    'presupuesto': sanitizedData.presupuesto || '',
    'tieneAgencia': sanitizedData.tieneAgencia || '',
    'necesitaDiseno': sanitizedData.necesitaDiseno || '',
    'taxis': sanitizedData.taxis || '',
    'espaciosPorTaxi': sanitizedData.espaciosPorTaxi || '',
    'duracion': sanitizedData.duracion || '',
    'inversionMensual': sanitizedData.inversionMensual || '',
    'inversionTotal': sanitizedData.inversionTotal || '',
    'tipo': sanitizedData.tipo,
    'source': sanitizedData.source,
    'fecha': sanitizedData.fecha
  };
  
  Object.keys(fieldMapping).forEach(key => {
    params.append(key, fieldMapping[key]);
  });
  
  console.log('📦 [FORM] Payload preparado:', fieldMapping);
  console.log('📤 [FORM] URLSearchParams:', params.toString());
  
  // ============================================
  // 6. ENVIAR A GOOGLE APPS SCRIPT
  // ============================================
  console.log('📡 [FORM] Enviando a:', GAS_CONFIG.WEBHOOK_URL);
  
  try {
    const response = await fetch(GAS_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for GAS
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    console.log('📥 [FORM] Respuesta recibida');
    console.log('[FORM] Status:', response.status);
    console.log('[FORM] OK:', response.ok);
    console.log('[FORM] Type:', response.type); // 'opaque' con no-cors
    
    // ============================================
    // 7. MARCAR COMO ENVIADO
    // ============================================
    // Con no-cors, no podemos leer la respuesta
    // Pero si llegamos aquí sin error, asumimos éxito
    setRateLimit();
    
    console.log('✅ [FORM] Lead enviado exitosamente');
    
    return {
      success: true,
      message: 'Lead enviado correctamente',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ [FORM] Error de red:', error);
    console.error('[FORM] Stack:', error.stack);
    
    throw new Error('Error de conexión. Verifica tu internet e intenta de nuevo.');
  }
}

// ============================================
// MANEJADOR DEL FORMULARIO (React)
// ============================================
function createFormHandler(setFormData, setLoading, setSubmitted, setAlert) {
  return async function handleSubmit(e, formDataState) {
    e.preventDefault();
    
    console.log('🎯 [REACT] handleSubmit llamado');
    console.log('[REACT] FormData:', formDataState);
    
    try {
      setLoading(true);
      
      // Validaciones adicionales
      if (!isValidEmail(formDataState.correo)) {
        setAlert({
          type: 'error',
          message: '⚠️ El email corporativo no es válido'
        });
        setLoading(false);
        return;
      }
      
      if (!isValidPhone(formDataState.telefono)) {
        setAlert({
          type: 'warning',
          message: '⚠️ El teléfono puede no ser válido (ej: +18495043872)'
        });
        // Continuamos, no es crítico
      }
      
      // Enviar formulario
      const result = await submitLeadForm(formDataState);
      
      console.log('[REACT] Resultado:', result);
      
      setAlert({
        type: 'success',
        message: '✅ ¡Solicitud enviada! Nos pondremos en contacto contigo en las próximas 24 horas.'
      });
      
      setSubmitted(true);
      
    } catch (error) {
      console.error('[REACT] Error:', error);
      
      setAlert({
        type: 'error',
        message: error.message || 'Error al enviar. Por favor intenta de nuevo o contáctanos por WhatsApp.'
      });
      
    } finally {
      setLoading(false);
    }
  };
}

// ============================================
// EXPORTS (para usar en diferentes contextos)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkRateLimit,
    setRateLimit,
    sanitizeInput,
    isValidEmail,
    isValidPhone,
    submitLeadForm,
    createFormHandler,
    GAS_CONFIG
  };
}
