import Usuario from "../models/usuario";
import DatabaseService from "../database/DatabaseService";
import { hashPassword } from "../utils/Hasher";

export class UsuarioController {
  constructor() {
    this.listeners = [];
  }

  async initialize() {
    await DatabaseService.initialize();
  }

  async login(email, password) {
    try {
      const usuarios = await this.obtenerUsuarios();

      const inputHash = await hashPassword(password);

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.passwordHash === inputHash
      );

      if (usuarioEncontrado) {
        return usuarioEncontrado;
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      throw error;
    }
  }

  async restablecerContrasena(email, palabraSecreta, nuevaPassword) {
    try {
      const usuarios = await this.obtenerUsuarios();

      const usuario = usuarios.find((u) => u.email === email.trim());
      if (!usuario) {
        throw new Error("El correo no está registrado.");
      }

      if (usuario.palabraSecreta !== palabraSecreta.trim()) {
        throw new Error("La palabra clave es incorrecta.");
      }

      if (nuevaPassword.length < 6)
        throw new Error("La nueva contraseña es muy corta.");

      const nuevoHash = await hashPassword(nuevaPassword);
      await DatabaseService.updatePassword(email, nuevoHash);

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error("Error recuperación:", error);
      throw error;
    }
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
            u.fecha_registro,
            u.palabra_secreta // Mapeamos la columna de BD al modelo
          )
      );
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
      return [];
    }
  }

  async crearUsuario(nombre, email, password, telefono, palabraSecreta) {
    try {
      Usuario.validar(nombre, email, password, palabraSecreta);

      const usuarios = await this.obtenerUsuarios();
      if (usuarios.some((u) => u.email === email)) {
        throw new Error("El correo ya está registrado");
      }

      const passwordHash = await hashPassword(password);

      const newUser = await DatabaseService.addUsuario(
        nombre.trim(),
        email.trim(),
        passwordHash,
        telefono,
        palabraSecreta.trim()
      );

      this.notifyListeners();
      return newUser;
    } catch (error) {
      console.error("Error al crear usuario", error);
      throw error;
    }
  }

  async actualizarUsuario(id, nombre, telefono) {
    try {
      await DatabaseService.updateUsuario(id, nombre, telefono);
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async delUsuario(id) {
    try {
      await DatabaseService.deleteUsuario(id);
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
