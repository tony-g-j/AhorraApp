import Presupuesto from "../models/presupuestos";
import DatabaseService from "../database/DatabaseService";

export class PresupuestoController {
  constructor() {
    this.listeners = [];
  }

  async obtenerPresupuestos(usuarioId, mes, anio) {
    
    if (!usuarioId || !mes || !anio) {
    console.warn("⚠️ obtenerPresupuestos abortado: Faltan datos", { usuarioId, mes, anio });
    return [];
  }
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
            p.categoria_nombre,
            p.categoria_tipo
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

  async actualizarPresupuesto(presupuestoId, nuevoMontoLimite) {
    try {
      if (!nuevoMontoLimite || nuevoMontoLimite < 0)
        throw new Error("Monto inválido");

      await DatabaseService.updatePresupuestoLimite(
        presupuestoId,
        parseFloat(nuevoMontoLimite)
      );

      this.notifyListeners();
    } catch (error) {
      console.error("Error actualizando presupuesto:", error);
      throw error;
    }
  }

  async eliminarPresupuesto(id) {
    try {
      await DatabaseService.deletePresupuesto(id);
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
