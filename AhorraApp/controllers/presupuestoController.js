import Presupuesto from "../models/presupuestos";
import DatabaseService from "../database/DatabaseService";

export class PresupuestoController {
  constructor() {
    this.listeners = [];
  }

  async obtenerPresupuestos(usuarioId, mes, anio) {
    try {
      const data = await DatabaseService.getPresupuestos(usuarioId, mes, anio);

      return data.map(
        (p) =>
          new Presupuesto(
            p.presupuesto_id,
            p.usuario_id,
            p.categoria_id,
            p.monto_limite,
            p.monto_actual,
            p.mes,
            p.anio,
            p.categoria_nombre
          )
      );
    } catch (error) {
      console.error("Error obteniendo presupuestos:", error);
      return [];
    }
  }

  async crearPresupuesto(usuarioId, categoriaId, montoLimite, mes, anio) {
    try {
      Presupuesto.validar(montoLimite, mes, anio);

      await DatabaseService.addPresupuesto(
        usuarioId,
        categoriaId,
        parseFloat(montoLimite),
        mes,
        anio
      );

      this.notifyListeners();
    } catch (error) {
      console.error("Error creando presupuesto:", error);
      throw error;
    }
  }

  async actualizarConsumo(presupuestoId, nuevoMontoActual) {
    try {
      await DatabaseService.updateMontoPresupuesto(
        presupuestoId,
        nuevoMontoActual
      );
      this.notifyListeners();
    } catch (error) {
      console.error("Error actualizando consumo:", error);
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
