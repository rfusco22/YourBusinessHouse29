-- Tabla para trackear notificaciones de alertas enviadas
CREATE TABLE IF NOT EXISTS alert_notifications (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'alquiler_sin_movimiento', 'venta_sin_movimiento'
  notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  message_sid VARCHAR(100), -- ID del mensaje de Twilio
  UNIQUE(property_id, alert_type) -- Evita duplicados
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_alert_notifications_property ON alert_notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_type ON alert_notifications(alert_type);
