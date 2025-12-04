# Configuración de Twilio para Notificaciones WhatsApp

Este documento explica cómo configurar Twilio para recibir notificaciones automáticas de alertas de inmuebles por WhatsApp.

## Credenciales Necesarias

Necesitas configurar las siguientes variables de entorno en tu proyecto Vercel o archivo `.env.local`:

\`\`\`env
TWILIO_ACCOUNT_SID=AC946f99dfa63d26108fc6d64cbe854039
TWILIO_AUTH_TOKEN=4056a42d48080df2e78099f979859d3a
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
NEXT_PUBLIC_BASE_URL=https://yourbusinesshouse-production.up.railway.app
\`\`\`

## Configuración en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable con su valor correspondiente
4. Redeploya el proyecto para que tome los cambios

## Configuración del Sandbox de Twilio

Actualmente estás usando el **Twilio Sandbox** para WhatsApp. Para que funcione:

### 1. Conectar tu número de WhatsApp al Sandbox

Cada usuario que quiera recibir notificaciones debe:

1. Enviar un mensaje desde WhatsApp al número: **+1 415 523 8886**
2. Con el código: **join level-writing**
3. Esperar el mensaje de confirmación de Twilio

### 2. Números registrados actualmente

- **whatsapp:+584122928717** - Ya está registrado en el sandbox

### 3. Agregar más usuarios

Para que **admin** y **gerencia** también reciban alertas:

1. Obtén los números de WhatsApp de admin y gerencia
2. Actualiza la tabla `users` con sus números en el campo `whatsapp`:

\`\`\`sql
UPDATE users 
SET whatsapp = '+584122928717' 
WHERE role = 'admin';

UPDATE users 
SET whatsapp = '+584129999999' 
WHERE role = 'gerencia';
\`\`\`

3. Cada uno debe enviar el mensaje de activación al sandbox de Twilio

## Cómo Funcionan las Alertas Automáticas

El sistema detecta automáticamente:

- **Propiedades de alquiler** sin movimiento por **30+ días** (1 mes)
- **Propiedades de venta** sin movimiento por **60+ días** (2 meses)

### Formato del mensaje WhatsApp:

\`\`\`
🚨 *ALERTA DE INMUEBLE - Your Business House*

📍 *Título del Inmueble*

Este inmueble tiene X meses sin alquilarse/venderse

🔗 Ver inmueble: [LINK DIRECTO]

📋 Tipo: Alquiler/Venta
⏰ Días inactivo: 370 días (12 meses)
👤 Asesor: Nombre del Asesor

💡 Descripción de la alerta

_Alerta generada automáticamente_
\`\`\`

## Ejecutar Alertas Manualmente

Para generar y enviar alertas manualmente:

1. Ve a la página de **Alertas** como Admin o Gerencia
2. Haz clic en el botón **"Generar Alertas"**
3. El sistema:
   - Detectará inmuebles desactualizados
   - Creará/actualizará alertas en la base de datos
   - Enviará WhatsApp al asesor, admin y gerencia

## Verificar que Funciona

1. **Revisa los logs** en la consola del navegador (F12) y en los logs de Vercel
2. **Busca estos mensajes**:
   - `[v0] Attempting to send WhatsApp message...`
   - `[v0] WhatsApp message sent successfully!`
   - `[v0] WhatsApp to [Usuario] (role): ✓ sent`

3. **Si no llegan mensajes**, verifica:
   - ✅ Las credenciales de Twilio están correctamente configuradas
   - ✅ El número está en formato internacional: `+584122928717`
   - ✅ El número está registrado en el sandbox de Twilio
   - ✅ El campo `whatsapp` en la tabla `users` tiene el número correcto

## Pasar a Producción (Después del Sandbox)

Para usar WhatsApp en producción sin el sandbox:

1. **Solicitar aprobación de WhatsApp Business** en Twilio
2. **Crear plantillas de mensajes** aprobadas por WhatsApp
3. **Actualizar** `TWILIO_WHATSAPP_FROM` con tu número de WhatsApp Business
4. **Modificar** el código para usar templates en lugar de mensajes libres

## Troubleshooting

### "No me llegan los WhatsApp"

1. Verifica que el número esté en el sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Revisa los logs de Twilio: https://console.twilio.com/us1/monitor/logs/messaging
3. Confirma que las variables de entorno estén correctas en Vercel
4. Ejecuta manualmente las alertas desde el panel Admin/Gerencia

### "Error 403 o credentials invalid"

- Verifica que `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN` sean correctos
- No uses comillas en las variables de entorno de Vercel

### "Messages queued but not delivered"

- El usuario debe enviar el mensaje de activación al sandbox primero
- Espera unos minutos, los operadores pueden tener demoras

## Soporte

Para más ayuda, consulta:
- Documentación oficial: https://www.twilio.com/docs/whatsapp
- Sandbox de WhatsApp: https://www.twilio.com/docs/whatsapp/sandbox
