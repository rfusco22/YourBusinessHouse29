import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "trolley.proxy.rlwy.net",
  port: Number.parseInt(process.env.DB_PORT || "18375"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "FAhDJuDEBkrJTPBkTeOQzoQSXgkKwNDk",
  database: process.env.DB_NAME || "ybh",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
})

// Test the connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log("[v0] Database connection successful")
    conn.release()
  })
  .catch((err) => {
    console.error("[v0] Database connection failed:", err.message)
  })

export async function query(sql: string, values?: any[]) {
  let connection
  try {
    connection = await pool.getConnection()
    const [results] = await connection.execute(sql, values)
    return results
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export default pool
