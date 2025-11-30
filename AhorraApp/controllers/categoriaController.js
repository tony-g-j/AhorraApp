import Categoria from "../models/categoria";
import DatabaseService from "../database/DatabaseService";

export class CategoriaController {
  constructor() {
    this.listeners = [];
  }

  async obtenerCategorias(usuarioId) {
    try {
      const data = await DatabaseService.getCategorias(usuarioId);
      return data.map(
        (c) =>
          new Categoria(c.categoria_id, c.usuario_id, c.nombre, c.tipo, c.icono)
      );
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return [];
    }
  }

  async crearCategoria(usuarioId, nombre, tipo, icono = "help-circle") {
    try {
      Categoria.validar(nombre, tipo);

      const result = await DatabaseService.addCategoria(
        usuarioId,
        nombre.trim(),
        tipo,
        icono
      );

      this.notifyListeners();
      return result;
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  }

  async eliminarCategoria(id) {
    try {
      await DatabaseService.deleteCategoria(id);
      this.notifyListeners();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
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
