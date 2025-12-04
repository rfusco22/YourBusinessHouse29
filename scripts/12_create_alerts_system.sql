-- Create property_alerts table to track alerts
CREATE TABLE IF NOT EXISTS property_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  asesor_id INT NOT NULL,
  alert_type ENUM('no_vendido_2m', 'no_alquilado_1m') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  days_inactive INT NOT NULL,
  status ENUM('activa', 'resuelta') NOT NULL DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  notified_at TIMESTAMP NULL,
  FOREIGN KEY (property_id) REFERENCES inmueble(id) ON DELETE CASCADE,
  FOREIGN KEY (asesor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id),
  INDEX idx_asesor_id (asesor_id),
  INDEX idx_status (status),
  INDEX idx_alert_type (alert_type),
  -- Prevent duplicate active alerts for the same property and type
  UNIQUE KEY unique_active_alert (property_id, alert_type, status)
);

-- Create notification_log table to track sent notifications
CREATE TABLE IF NOT EXISTS notification_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alert_id INT NOT NULL,
  recipient_id INT NOT NULL,
  recipient_role ENUM('asesor', 'admin', 'gerencia') NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  error_message TEXT NULL,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alert_id) REFERENCES property_alerts(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_alert_id (alert_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_status (status)
);
