# Configuración del Agente de IA Hogarcito

Para que Hogarcito funcione como un agente inteligente que automatiza el proceso de búsqueda de propiedades, necesitas configurar la API de OpenAI.

## Pasos para Configurar en Railway:

### 1. Obtener tu API Key de OpenAI

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Inicia sesión o crea una cuenta
3. Ve a "API Keys" en el menú
4. Haz clic en "Create new secret key"
5. Copia tu API key (empieza con `sk-`)

### 2. Configurar en Railway

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio
3. Ve a la pestaña "Variables"
4. Agrega una nueva variable:
   - **Nombre**: `OPENAI_API_KEY`
   - **Valor**: Tu API key (ejemplo: `sk-proj-abc123...`)
5. Guarda los cambios
6. Railway redesplegará automáticamente tu aplicación

## Cómo Funciona el Agente de IA

Una vez configurado, Hogarcito podrá:

### ✅ Conversación Natural
- Hablar como un humano venezolano cercano y profesional
- Entender el contexto y mantener la conversación fluida
- Adaptarse a cambios de intención del usuario

### ✅ Filtrado Progresivo
El agente hará preguntas estratégicas una a la vez:

1. **Tipo de operación**: ¿Comprar o alquilar?
2. **Ubicación**: ¿En qué parte de Venezuela?
3. **Presupuesto**: Tope de canon (alquiler) o inversión (compra)
4. **Tipo de propiedad**: Apartamento, casa, local, etc.
5. **Detalles**: Habitaciones, baños, etc.

### ✅ Búsqueda Automática
- Ejecuta búsquedas en la base de datos cuando tiene suficiente información
- Refina resultados según los criterios del usuario
- Si el usuario cambia de alquiler a compra, hace nueva búsqueda automáticamente

### ✅ Automatización del Proceso
- Presenta propiedades que coinciden con los criterios
- Ofrece agendar citas con asesores
- Proporciona enlaces directos a WhatsApp

### ✅ Responde Preguntas Generales
- Información de la empresa
- Redes sociales
- Cobertura de servicio
- Cualquier duda sobre inmobiliaria

## Ejemplo de Conversación

\`\`\`
Usuario: Hola, busco un apartamento
Hogarcito: ¡Hola! Con gusto te ayudo a encontrar tu próximo hogar. ¿Estás buscando comprar o alquilar?

Usuario: Alquilar
Hogarcito: Perfecto. ¿En qué parte de Venezuela te gustaría vivir?

Usuario: Valencia, Carabobo
Hogarcito: ¡Excelente elección! ¿Cuál es tu tope de canon mensual?

Usuario: 280
Hogarcito: Entendido, $280 USD. ¿Cuántas habitaciones necesitas?

Usuario: 2 habitaciones
Hogarcito: [Busca automáticamente] He encontrado 3 apartamentos en alquiler en Valencia con 2 habitaciones por hasta $280. [Muestra propiedades] ¿Te gustaría que agende una cita con un asesor para visitarlos?
\`\`\`

## Verificar que Funciona

1. Abre el chatbot en tu sitio web
2. Escribe "Hola"
3. Si ves una respuesta personalizada (no un mensaje de error), ¡está funcionando!
4. Si ves un mensaje sobre configurar el API key, revisa los pasos anteriores

## Costos de OpenAI

- OpenAI cobra por uso (tokens procesados)
- GPT-4o-mini es muy económico (~$0.15 por 1M de tokens)
- Un chat típico cuesta ~$0.001-0.003 USD
- Puedes configurar límites de uso en OpenAI

## Soporte

Si tienes problemas:
1. Verifica que el API key esté correcto
2. Revisa los logs de Railway
3. Asegúrate de tener créditos en tu cuenta de OpenAI
