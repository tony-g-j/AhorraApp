import Transaccion from "../models/transaccion";
import DatabaseService from "../database/DatabaseService";

export class TransaccionController {
  constructor() {
    this.listeners = [];
  }

  async obtenerTransacciones(usuarioId) {
    try {
      const data = await DatabaseService.getTransacciones(usuarioId);

      return data.map((t) => {
        const tipoCalculado =
          t.categoria_tipo ||
          (["Salario", "Ventas", "Ingreso"].includes(t.categoria_nombre)
            ? "Ingreso"
            : "Gasto");

        return new Transaccion(
          t.transaccion_id,
          t.usuario_id,
          t.categoria_id,
          t.monto,
          t.fecha,
          t.descripcion,
          t.es_recurrente,
          t.categoria_nombre,
          t.categoria_icono,
          tipoCalculado
        );
      });
    } catch (error) {
      console.error("Error obteniendo transacciones:", error);
      return [];
    }
  }

  async obtenerTransaccionesClasificadas(usuarioId) {
    const todas = await this.obtenerTransacciones(usuarioId);
    return {
      ingresos: todas.filter((t) => t.tipoCategoria === "Ingreso"),
      gastos: todas.filter((t) => t.tipoCategoria === "Gasto"),
    };
  }

  async sincronizarPresupuesto(usuarioId, categoriaId, fechaString) {
    try {
      const fechaObj = new Date(fechaString);
      const mes = fechaObj.getMonth() + 1;
      const anio = fechaObj.getFullYear();

      const estado = await DatabaseService.recalcularGastoCategoria(
        usuarioId,
        categoriaId,
        mes,
        anio
      );

      if (estado.existe && estado.total > estado.limite) {
        return `¡Alerta! Has gastado $${estado.total} y tu límite es $${estado.limite}.`;
      }
      return null;
    } catch (error) {
      console.error("Error sincronizando presupuesto:", error);
      return null;
    }
  }

  async agregarTransaccion(
    usuarioId,
    categoriaId,
    monto,
    fecha,
    descripcion,
    esRecurrente = false
  ) {
    try {
      Transaccion.validar(monto, fecha, categoriaId);
      const esRecurrenteInt = esRecurrente ? 1 : 0;
      const montoFloat = parseFloat(monto);

      await DatabaseService.addTransaccion(
        usuarioId,
        categoriaId,
        montoFloat,
        fecha,
        descripcion,
        esRecurrenteInt
      );

      const alerta = await this.sincronizarPresupuesto(
        usuarioId,
        categoriaId,
        fecha
      );

      this.notifyListeners();
      return { success: true, alerta: alerta };
    } catch (error) {
      console.error("Error agregando transacción:", error);
      throw error;
    }
  }

  async actualizarTransaccion(id, categoriaId, monto, fecha, descripcion) {
    try {
      const transaccionVieja = await DatabaseService.getTransaccionById(id);

      Transaccion.validar(monto, fecha, categoriaId);

      await DatabaseService.updateTransaccion(
        id,
        categoriaId,
        parseFloat(monto),
        fecha,
        descripcion
      );

      await this.sincronizarPresupuesto(
        transaccionVieja.usuario_id,
        categoriaId,
        fecha
      );

      if (
        transaccionVieja.categoria_id !== categoriaId ||
        new Date(transaccionVieja.fecha).getMonth() !==
          new Date(fecha).getMonth()
      ) {
        await this.sincronizarPresupuesto(
          transaccionVieja.usuario_id,
          transaccionVieja.categoria_id,
          transaccionVieja.fecha
        );
      }

      this.notifyListeners();
    } catch (error) {
      console.error("Error actualizando transacción:", error);
      throw error;
    }
  }

  async eliminarTransaccion(id) {
    try {
      const transaccionAEliminar = await DatabaseService.getTransaccionById(id);

      if (!transaccionAEliminar) {
        throw new Error("Transacción no encontrada");
      }

      await DatabaseService.deleteTransaccion(id);

      await this.sincronizarPresupuesto(
        transaccionAEliminar.usuario_id,
        transaccionAEliminar.categoria_id,
        transaccionAEliminar.fecha
      );

      this.notifyListeners();
    } catch (error) {
      console.error("Error eliminando transacción:", error);
      throw error;
    }
  }

  async filtrarTransacciones(
    usuarioId,
    { fechaInicio, fechaFin, categoriaId }
  ) {
    const todas = await this.obtenerTransacciones(usuarioId);

    return todas.filter((t) => {
      const fechaT = new Date(t.fecha);
      const cumpleFecha =
        (!fechaInicio || fechaT >= new Date(fechaInicio)) &&
        (!fechaFin || fechaT <= new Date(fechaFin));
      const cumpleCategoria = !categoriaId || t.categoria_id === categoriaId;

      return cumpleFecha && cumpleCategoria;
    });
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
