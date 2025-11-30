export default class Presupuesto {
    constructor(id, usuarioId, categoriaId, montoLimite, montoActual, mes, anio, nombreCategoria = null) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.categoriaId = categoriaId;
        this.montoLimite = parseFloat(montoLimite);
        this.montoActual = parseFloat(montoActual) || 0;
        this.mes = mes;
        this.anio = anio;
        this.nombreCategoria = nombreCategoria;
    }

    static validar(montoLimite, mes, anio) {
        if (isNaN(montoLimite) || montoLimite <= 0) {
            throw new Error('El límite del presupuesto debe ser mayor a 0.');
        }
        if (mes < 1 || mes > 12) {
            throw new Error('Mes inválido.');
        }
        if (anio < 2000 || anio > 2100) {
            throw new Error('Año inválido.');
        }
    }

    getRestante() {
        return this.montoLimite - this.montoActual;
    }

    getPorcentajeGastado() {
        if (this.montoLimite === 0) return 0;
        let porcentaje = (this.montoActual / this.montoLimite) * 100;
        return Math.min(porcentaje, 100); 
    }

    estaExcedido() {
        return this.montoActual > this.montoLimite;
    }
}