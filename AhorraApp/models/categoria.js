export default class Categoria {
    constructor(id, usuarioId, nombre, tipo) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.tipo = tipo;
    }

    static validar(nombre, tipo){
        if (!nombre || nombre.trim() === 0) {
            throw new Error('El nombre de la categoria es obligatorio');
        }
        if (tipo !== 'Ingreso' && tipo !== 'Gasto') {
            throw new Error('El tipo debe ser gasto o ingreso');
        }
    }
}