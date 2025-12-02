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
          new Categoria(c.categoria_id, c.usuario_id, c.nombre, c.tipo)
      );
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return [];
    }
  }

  async crearCategoria(usuarioId, nombre, tipo) {
    try {
      Categoria.validar(nombre, tipo);

      const existente = await DatabaseService.getCategoriaPorNombre(usuarioId, nombre);
      
      if (existente) {
        return { 
            id: existente.categoria_id, 
            nombre: existente.nombre, 
            tipo: existente.tipo, 
        };
      }

      const result = await DatabaseService.addCategoria(
        usuarioId,
        nombre.trim(),
        tipo,
      );

      this.notifyListeners();
      return { id: result.lastInsertRowId || result, nombre, tipo};
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
