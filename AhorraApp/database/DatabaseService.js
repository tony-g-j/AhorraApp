import * as SQLite from "expo-sqlite";

class DatabaseService {
  constructor() {
    this.db = null;
  }

  async initialize() {
    this.db = await SQLite.openDatabaseAsync("Ahorrapp.db");
    await this.db.execAsync("PRAGMA foreign_keys = ON;");

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        telefono TEXT,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS categorias (
        categoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        tipo TEXT NOT NULL,
        icono TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS transacciones (
        transaccion_id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,
        monto REAL NOT NULL,
        fecha DATE NOT NULL,
        descripcion TEXT,
        es_recurrente INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE SET NULL
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS presupuestos (
        presupuesto_id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,
        monto_limite REAL NOT NULL,
        monto_actual REAL NOT NULL DEFAULT 0,
        mes INTEGER NOT NULL,
        anio INTEGER NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE CASCADE
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS recurrentes (
        recurrente_id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,
        monto REAL NOT NULL,
        descripcion TEXT,
        frecuencia TEXT NOT NULL,
        fecha_inicio DATE NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE CASCADE
      );
    `);
  }

  async getUsuarios() {
    return await this.db.getAllAsync('SELECT * FROM usuarios ORDER BY fecha_registro DESC');
  }

  async addUsuario(nombre, email, passwordHash, telefono = null) {
    const result = await this.db.runAsync(
      'INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES (?, ?, ?, ?)',
      nombre, email, passwordHash, telefono
    );
    return { id: result.lastInsertRowId, nombre, email };
  }

  async updateUsuario(id, nombre, telefono) {
    await this.db.runAsync(
      'UPDATE usuarios SET nombre = ?, telefono = ? WHERE usuario_id = ?',
      nombre, telefono, id
    );
  }

  async deleteUsuario(id) {
    await this.db.runAsync('DELETE FROM usuarios WHERE usuario_id = ?', id);
  }

  async getCategorias(usuarioId) {
    return await this.db.getAllAsync(
      'SELECT * FROM categorias WHERE usuario_id = ? ORDER BY nombre ASC',
      usuarioId
    );
  }

  async addCategoria(usuarioId, nombre, tipo, icono) {
    const result = await this.db.runAsync(
      'INSERT INTO categorias (usuario_id, nombre, tipo, icono) VALUES (?, ?, ?, ?)',
      usuarioId, nombre, tipo, icono
    );
    return { id: result.lastInsertRowId, usuarioId, nombre, tipo };
  }

  async deleteCategoria(id) {
    await this.db.runAsync('DELETE FROM categorias WHERE categoria_id = ?', id);
  }

  async addTransaccion(usuarioId, categoriaId, monto, fecha, descripcion, esRecurrente = 0) {
    const result = await this.db.runAsync(
      `INSERT INTO transacciones (usuario_id, categoria_id, monto, fecha, descripcion, es_recurrente) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      usuarioId, categoriaId, monto, fecha, descripcion, esRecurrente
    );
    return result.lastInsertRowId;
  }

  async getTransacciones(usuarioId) {
    return await this.db.getAllAsync(
      `SELECT t.*, c.nombre as categoria_nombre, c.icono as categoria_icono 
       FROM transacciones t 
       LEFT JOIN categorias c ON t.categoria_id = c.categoria_id 
       WHERE t.usuario_id = ? 
       ORDER BY t.fecha DESC`,
      usuarioId
    );
  }

  async deleteTransaccion(id) {
    await this.db.runAsync('DELETE FROM transacciones WHERE transaccion_id = ?', id);
  }

  async addPresupuesto(usuarioId, categoriaId, montoLimite, mes, anio) {
    const result = await this.db.runAsync(
      `INSERT INTO presupuestos (usuario_id, categoria_id, monto_limite, monto_actual, mes, anio) 
       VALUES (?, ?, ?, 0, ?, ?)`,
      usuarioId, categoriaId, montoLimite, mes, anio
    );
    return result.lastInsertRowId;
  }

  async getPresupuestos(usuarioId, mes, anio) {
    return await this.db.getAllAsync(
      `SELECT p.*, c.nombre as categoria_nombre 
       FROM presupuestos p 
       JOIN categorias c ON p.categoria_id = c.categoria_id 
       WHERE p.usuario_id = ? AND p.mes = ? AND p.anio = ?`,
      usuarioId, mes, anio
    );
  }

  async updateMontoPresupuesto(presupuestoId, nuevoMonto) {
    await this.db.runAsync(
      'UPDATE presupuestos SET monto_actual = ? WHERE presupuesto_id = ?',
      nuevoMonto, presupuestoId
    );
  }

  async addRecurrente(usuarioId, categoriaId, monto, descripcion, frecuencia, fechaInicio) {
    const result = await this.db.runAsync(
      `INSERT INTO recurrentes (usuario_id, categoria_id, monto, descripcion, frecuencia, fecha_inicio) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      usuarioId, categoriaId, monto, descripcion, frecuencia, fechaInicio
    );
    return result.lastInsertRowId;
  }

  async getRecurrentes(usuarioId) {
    return await this.db.getAllAsync(
      `SELECT r.*, c.nombre as categoria_nombre 
       FROM recurrentes r 
       JOIN categorias c ON r.categoria_id = c.categoria_id 
       WHERE r.usuario_id = ?`,
      usuarioId
    );
  }

  async deleteRecurrente(id) {
    await this.db.runAsync('DELETE FROM recurrentes WHERE recurrente_id = ?', id);
  }
}

export default new DatabaseService();