# Configuración de WhatsApp con Twilio

## Problema Actual

Las alertas se están generando correctamente, pero los mensajes de WhatsApp no se envían automáticamente. Esto es porque:

1. **El Cron Job no se ejecuta automáticamente** - Railway no soporta Vercel Cron Jobs nativamente
2. **Las credenciales de Twilio deben estar configuradas** en las variables de entorno

## Solución: Configurar Railway Cron Job

### Opción 1: Usar un servicio externo de Cron (Recomendado)

Usa un servicio como **Cron-job.org** o **EasyCron** que ejecute una petición HTTP cada hora:

1. Regístrate en https://cron-job.org (gratis)
2. Crea un nuevo cron job:
   - **URL**: `https://yourbusinesshouse-production.up.railway.app/api/cron/check-alerts`
   - **Método**: GET
   - **Frecuencia**: Cada 6 horas (o la que prefieras)
   - **Header**: Agregar `Authorization: Bearer TU_SECRET_TOKEN` para seguridad

3. El cron ejecutará automáticamente la generación de alertas y envío de WhatsApp

### Opción 2: Endpoint Manual (Testing)

Mientras configuras el cron automático, puedes ejecutar manualmente:

\`\`\`bash
curl https://yourbusinesshouse-production.up.railway.app/api/cron/check-alerts
\`\`\`

## Configuración de Variables de Entorno en Railway

Necesitas agregar estas variables en Railway:

1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Agrega:

\`\`\`
TWILIO_ACCOUNT_SID=AC946f99dfa63d26108fc6d64cbe854039
TWILIO_AUTH_TOKEN=4056a42d48080df2e78099f979859d3a
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_BASE_URL=https://yourbusinesshouse-production.up.railway.app
\`\`\`

## Verificar que Funciona

Después de configurar:

1. Ejecuta el endpoint manualmente o espera a que el cron se ejecute
2. Revisa los logs de Railway para ver si hay errores
3. Deberías recibir WhatsApp en los números registrados en Twilio Sandbox

## Números de WhatsApp en Sandbox

Cada usuario debe:

1. Enviar mensaje a `+1 415 523 8886` con el código `join level-writing`
2. Esto registra su número en el sandbox de Twilio
3. Solo esos números recibirán notificaciones

## Para Producción

Cuando quieras usar números reales (sin sandbox):

1. Solicita aprobación de WhatsApp Business API en Twilio
2. Reemplaza las credenciales del sandbox con las de producción
3. Ya no necesitarás el código "join level-writing"
