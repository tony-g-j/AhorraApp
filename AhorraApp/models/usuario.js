export default class Usuario {
    constructor(id, nombre, email, passwordHash, telefono, fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.passwordHash = passwordHash;
        this.telefono = telefono;
        this.fechaRegistro = fechaRegistro || new Date().toISOString();
    }

    static validar(nombre, email, password) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre es obligatorio.');
        }
        if (!email || !email.includes('@')) {
            throw new Error('El email no es válido.');
        }
        if (password && password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
    }
}