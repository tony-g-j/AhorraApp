import DatabaseService from "../database/DatabaseService";
import { hashPassword } from "../utils/Hasher";

export const seedDatabase = async () => {
  try {
    console.log("Iniciando sembrado de datos...");

    await DatabaseService.db.execAsync("DELETE FROM transacciones;");
    await DatabaseService.db.execAsync("DELETE FROM presupuestos;");
    await DatabaseService.db.execAsync("DELETE FROM categorias;");
    await DatabaseService.db.execAsync("DELETE FROM usuarios;");

    const email = "demo@lana.app";
    const password = "123";
    const passwordHash = await hashPassword(password);
    
    const usuarios = await DatabaseService.getUsuarios();
    let usuarioId;
    const usuarioExistente = usuarios.find(u => u.email === email);

    if (usuarioExistente) {
      usuarioId = usuarioExistente.usuario_id;
      console.log("Usuario Demo ya existe ID:", usuarioId);
    } else {
      const newUser = await DatabaseService.addUsuario(
        "Usuario Demo",
        email,
        passwordHash,
        "555-555-5555",
        "mi palabra secreta"
      );
      usuarioId = newUser.id;
      console.log("Usuario Demo creado ID:", usuarioId);
    }

    const catsData = [
      { nombre: "Salario", tipo: "Ingreso" },
      { nombre: "Ventas Extra", tipo: "Ingreso" },
      { nombre: "Freelance", tipo: "Ingreso" },
      { nombre: "Inversiones", tipo: "Ingreso" },
      { nombre: "Comida", tipo: "Gasto" },
      { nombre: "Transporte", tipo: "Gasto" },
      { nombre: "Renta", tipo: "Gasto" },
      { nombre: "Entretenimiento", tipo: "Gasto" },
      { nombre: "Salud", tipo: "Gasto" },
    ];

    const catMap = {};

    for (const cat of catsData) {
      const existente = await DatabaseService.getCategoriaPorNombre(usuarioId, cat.nombre);
      if (existente) {
        catMap[cat.nombre] = existente.categoria_id;
      } else {
        const res = await DatabaseService.addCategoria(usuarioId, cat.nombre, cat.tipo);
        catMap[cat.nombre] = res.id;
      }
    }
    console.log("Categorias listas");

    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const mesPasadoDate = new Date();
    mesPasadoDate.setMonth(hoy.getMonth() - 1);
    const mesPasado = mesPasadoDate.getMonth() + 1;
    const anioPasado = mesPasadoDate.getFullYear();

    const presupuestosData = [
      { cat: "Salario", limite: 15000, mes: mesActual, anio: anioActual },
      { cat: "Ventas Extra", limite: 3000, mes: mesActual, anio: anioActual },
      { cat: "Freelance", limite: 5000, mes: mesActual, anio: anioActual },
      { cat: "Comida", limite: 3000, mes: mesActual, anio: anioActual },
      { cat: "Transporte", limite: 1500, mes: mesActual, anio: anioActual },
      { cat: "Entretenimiento", limite: 1000, mes: mesActual, anio: anioActual },
      
      { cat: "Salario", limite: 15000, mes: mesPasado, anio: anioPasado },
      { cat: "Comida", limite: 3000, mes: mesPasado, anio: anioPasado },
    ];

    for (const p of presupuestosData) {
      const catId = catMap[p.cat];
      if (catId) {
        const existe = await DatabaseService.getPresupuestoPorCategoria(usuarioId, catId, p.mes, p.anio);
        if (!existe) {
          await DatabaseService.addPresupuesto(usuarioId, catId, p.limite, p.mes, p.anio);
        }
      }
    }
    console.log("Presupuestos listos");

    const transaccionesData = [
      { cat: "Salario", monto: 8000, desc: "Nomina Q1", fecha: new Date(anioActual, mesActual - 1, 15).toISOString() },
      { cat: "Salario", monto: 7000, desc: "Nomina Q2", fecha: new Date(anioActual, mesActual - 1, 30).toISOString() },
      { cat: "Ventas Extra", monto: 1200, desc: "Venta de garage", fecha: new Date(anioActual, mesActual - 1, 5).toISOString() },
      { cat: "Ventas Extra", monto: 850, desc: "Venta marketplace", fecha: new Date(anioActual, mesActual - 1, 12).toISOString() },
      { cat: "Freelance", monto: 3500, desc: "Proyecto Web", fecha: new Date(anioActual, mesActual - 1, 20).toISOString() },
      { cat: "Inversiones", monto: 450, desc: "Rendimientos", fecha: new Date(anioActual, mesActual - 1, 28).toISOString() },
      
      { cat: "Comida", monto: 150, desc: "Tacos", fecha: new Date(anioActual, mesActual - 1, 2).toISOString() },
      { cat: "Comida", monto: 1200, desc: "Supermercado Semanal", fecha: new Date(anioActual, mesActual - 1, 5).toISOString() },
      { cat: "Transporte", monto: 500, desc: "Gasolina", fecha: new Date(anioActual, mesActual - 1, 10).toISOString() },
      { cat: "Entretenimiento", monto: 1200, desc: "Concierto", fecha: new Date(anioActual, mesActual - 1, 20).toISOString() },
      { cat: "Salud", monto: 800, desc: "Consulta", fecha: new Date(anioActual, mesActual - 1, 18).toISOString() },

      { cat: "Salario", monto: 15000, desc: "Nomina Pasada", fecha: new Date(anioPasado, mesPasado - 1, 15).toISOString() },
      { cat: "Comida", monto: 2800, desc: "Supermercado Mensual", fecha: new Date(anioPasado, mesPasado - 1, 10).toISOString() },
      { cat: "Freelance", monto: 2000, desc: "Consultoria", fecha: new Date(anioPasado, mesPasado - 1, 25).toISOString() },
    ];

    for (const t of transaccionesData) {
      const catId = catMap[t.cat];
      if (catId) {
        await DatabaseService.addTransaccion(usuarioId, catId, t.monto, t.fecha, t.desc, 0);
      }
    }
    console.log("Transacciones listas");

    const clavesUnicas = new Set(presupuestosData.map(p => `${p.cat}-${p.mes}-${p.anio}`));
    
    for (const clave of clavesUnicas) {
        const [nombreCat, m, a] = clave.split('-');
        const catId = catMap[nombreCat];
        if (catId) {
            await DatabaseService.recalcularGastoCategoria(usuarioId, catId, parseInt(m), parseInt(a));
        }
    }

    console.log("Sembrado Completo Totales actualizados");
    return true;

  } catch (error) {
    console.error("Error en sembrado:", error);
    return false;
  }
};