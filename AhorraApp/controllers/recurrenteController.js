import Recurrente from "../models/recurrentes";
import DatabaseService from "../database/DatabaseService";

export class RecurrenteController {
  constructor() {
    this.listeners = [];
  }

  async obtenerRecurrentes(usuarioId) {
    try {
      const data = await DatabaseService.getRecurrentes(usuarioId);

      return data.map(
        (r) =>
          new Recurrente(
            r.recurrente_id,
            r.usuario_id,
            r.categoria_id,
            r.monto,
            r.descripcion,
            r.frecuencia,
            r.fecha_inicio,
            r.categoria_nombre
          )
      );
    } catch (error) {
      console.error("Error obteniendo recurrentes:", error);
      return [];
    }
  }

  async crearRecurrente(
    usuarioId,
    categoriaId,
    monto,
    descripcion,
    frecuencia,
    fechaInicio
  ) {
    try {
      Recurrente.validar(monto, frecuencia, fechaInicio);

      await DatabaseService.addRecurrente(
        usuarioId,
        categoriaId,
        parseFloat(monto),
        descripcion,
        frecuencia,
        fechaInicio
      );

      this.notifyListeners();
    } catch (error) {
      console.error("Error creando recurrente:", error);
      throw error;
    }
  }

  async eliminarRecurrente(id) {
    try {
      await DatabaseService.deleteRecurrente(id);
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }
  removeListeners(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }
  notifyListeners() {
    this.listeners.forEach((callback) => callback());
  }
}
