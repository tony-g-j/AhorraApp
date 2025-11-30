import { Usuario } from "../models/usuario";
import DatabaseService from "../database/DatabaseService";

export default class UsuarioController {
  constructor() {
    this.Listeners = [];
  }

  async initialize() {
    await DatabaseService.initialize();
  }

  async obtenerUsuarios() {
    try {
      const data = await DatabaseService.getUsuarios();
      return data.map(
        (u) =>
          new Usuario(
            u.usuario_id,
            u.nombre,
            u.email,
            u.password_hash,
            u.telefono,
            u.fecha_registro
          )
      );
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      return [];
    }
  }

  async crearUsuario(nombre, email, password, telefono) {
    try {
      Usuario.validar(nombre, email, password);

      const newUser = await DatabaseService.addUsuario(
        nombre.trim(),
        email.trim(),
        password,
        telefono
      );

      this.notifyListeners();

      return newUser;
    } catch (error) {
      console.error("Error al crear usuario", error);
      throw error;
    }
  }

  async delUsuario(id) {
    try {
      await DatabaseService.deleteUsuario(id);
      this.notifyListeners();
    } catch (error) {
      console.error("Error al eliminar usuario", error);
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
