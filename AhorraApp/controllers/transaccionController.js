import Transaccion from "../models/transaccion";
import DatabaseService from "../database/DatabaseService";

export class TransaccionController {
  constructor() {
    this.listeners = [];
  }

  async obtenerTransacciones(usuarioId) {
    try {
      const data = await DatabaseService.getTransacciones(usuarioId);
      
      return data.map((t) => new Transaccion(
          t.transaccion_id,
          t.usuario_id,
          t.categoria_id,
          t.monto,
          t.fecha,
          t.descripcion,
          t.es_recurrente,
          t.categoria_nombre, 
          t.categoria_icono   
      ));
    } catch (error) {
      console.error("Error obteniendo transacciones:", error);
      return [];
    }
  }

  async agregarTransaccion(usuarioId, categoriaId, monto, fecha, descripcion, esRecurrente = false) {
    try {

      Transaccion.validar(monto, fecha, categoriaId);

      const esRecurrenteInt = esRecurrente ? 1 : 0;
      
      await DatabaseService.addTransaccion(
          usuarioId, 
          categoriaId, 
          parseFloat(monto), 
          fecha, 
          descripcion, 
          esRecurrenteInt
      );

      // (Opcional) AQUÍ podrías agregar lógica para actualizar el presupuesto actual si es un gasto

      this.notifyListeners();
    } catch (error) {
      console.error("Error agregando transacción:", error);
      throw error;
    }
  }

  async eliminarTransaccion(id) {
    try {
      await DatabaseService.deleteTransaccion(id);
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  // Patrón Observer
  addListener(callback) { this.listeners.push(callback); }
  removeListeners(callback) { this.listeners = this.listeners.filter(l => l !== callback); }
  notifyListeners() { this.listeners.forEach(callback => callback()); }
}