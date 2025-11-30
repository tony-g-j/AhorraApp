export default class Transaccion {
    constructor(id, usuarioId, categoriaId, monto, fecha, descripcion, esRecurrente, nombreCategoria = null, iconoCategoria = null) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.categoriaId = categoriaId;
        this.monto = parseFloat(monto);
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.esRecurrente = !!esRecurrente;
        this.nombreCategoria = nombreCategoria;
        this.iconoCategoria = iconoCategoria;
    }

    static validar(monto, fecha, categoriaId) {
        if (!categoriaId) {
            throw new Error('Debes seleccionar una categoría.');
        }
        if (isNaN(monto) || monto <= 0) {
            throw new Error('El monto debe ser un número mayor a 0.');
        }
        if (!fecha) {
            throw new Error('La fecha es obligatoria.');
        }
    }

    getFechaFormateada() {
        return new Date(this.fecha).toLocaleDateString();
    }
}