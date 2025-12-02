import Presupuesto from "../models/presupuestos";
import DatabaseService from "../database/DatabaseService";

export class PresupuestoController {
  constructor() {
    this.listeners = [];
  }

  async obtenerPresupuestos(usuarioId, mes, anio) {
    
    if (!usuarioId || !mes || !anio) {
    console.warn("obtenerPresupuestos abortado: Faltan datos", { usuarioId, mes, anio });
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

      const presupuestosExistentes = await this.obtenerPresupuestos(usuarioId, mes, anio);

      const duplicado = presupuestosExistentes.find(p => p.categoriaId === categoriaId);

      if (duplicado) {
        throw new Error(`Ya existe un presupuesto para la categoría "${duplicado.nombreCategoria}" en este mes.`);
      }
      
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
