-- Create alerts table to track property inactivity alerts
CREATE TABLE IF NOT EXISTS property_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  agent_id INT NOT NULL,
  alert_type ENUM('no_alquilado_1m', 'no_vendido_2m') NOT NULL,
  status ENUM('activa', 'resuelta', 'notificada') DEFAULT 'activa',
  whatsapp_notified BOOLEAN DEFAULT FALSE,
  whatsapp_notified_at DATETIME DEFAULT NULL,
  resolved_at DATETIME DEFAULT NULL,
  resolved_action VARCHAR(50) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES inmueble(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_active_alert (property_id, alert_type, status)
);

-- Add index for faster queries
CREATE INDEX idx_alerts_status ON property_alerts(status);
CREATE INDEX idx_alerts_agent ON property_alerts(agent_id);
CREATE INDEX idx_alerts_property ON property_alerts(property_id);
