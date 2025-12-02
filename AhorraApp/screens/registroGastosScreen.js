import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ScrollView as GestureHandlerScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import { TransaccionController } from "../controllers/transaccionController";
import { CategoriaController } from "../controllers/categoriaController";
import { PresupuestoController } from "../controllers/presupuestoController";

import { SafeAreaView } from "react-native-safe-area-context";

const nombresMeses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

<<<<<<< Updated upstream
const transaccionController = new TransaccionController();
const categoriaController = new CategoriaController();
const presupuestoController = new PresupuestoController();

=======
>>>>>>> Stashed changes
export default function RegistroGastosScreen({ usuarioId }) {
  const USUARIO_ID = usuarioId;
  const [rawIngresos, setRawIngresos] = useState([]);
  const [rawGastos, setRawGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroMes, setFiltroMes] = useState(true);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  const [tipoOperacion, setTipoOperacion] = useState("Gasto");

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["65%"], []);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const { ingresos, gastos } =
        await transaccionController.obtenerTransaccionesClasificadas(
          USUARIO_ID
        );
      setRawIngresos(ingresos);
      setRawGastos(gastos);

      const listaCategorias = await categoriaController.obtenerCategorias(
        USUARIO_ID
      );
      setCategorias(listaCategorias);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [USUARIO_ID]);

  useEffect(() => {
    cargarDatos();

    const onChange = () => {
      cargarDatos();
    };

    transaccionController.addListener(onChange);
    categoriaController.addListener(onChange);
    presupuestoController.addListener(onChange);

    return () => {
      transaccionController.removeListeners(onChange);
      categoriaController.removeListeners(onChange);
      presupuestoController.removeListeners(onChange);
    };
  }, [cargarDatos]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const aplicarFiltros = (lista) => {
    return lista.filter((item) => {
      if (filtroCategoria && item.categoriaId !== filtroCategoria) return false;

      if (filtroMes) {
        const fechaItem = new Date(item.fecha);
        const hoy = new Date();
        if (
          fechaItem.getMonth() !== hoy.getMonth() ||
          fechaItem.getFullYear() !== hoy.getFullYear()
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const gastosFiltrados = aplicarFiltros(rawGastos);
  const ingresosFiltrados = aplicarFiltros(rawIngresos);

  const abrirFormulario = (tipo, transaccionAEditar = null) => {
    setTipoOperacion(tipo);

    if (transaccionAEditar) {
      setModoEdicion(true);
      setIdEdicion(transaccionAEditar.id);
      setDescripcion(transaccionAEditar.descripcion);
      setMonto(transaccionAEditar.monto.toString());
      setCatSeleccionada(transaccionAEditar.categoriaId);
    } else {
      setModoEdicion(false);
      setIdEdicion(null);
      setDescripcion("");
      setMonto("");
      setCatSeleccionada(null);
    }
    bottomSheetRef.current?.expand();
  };

  const handleGuardar = async () => {
    if (!descripcion.trim() || !monto.trim() || !catSeleccionada) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      if (modoEdicion) {
        await transaccionController.actualizarTransaccion(
          idEdicion,
          catSeleccionada,
          monto,
          new Date().toISOString(),
          descripcion
        );
        Alert.alert("Éxito", "Transacción actualizada");
      } else {
        const resultado = await transaccionController.agregarTransaccion(
          USUARIO_ID,
          catSeleccionada,
          monto,
          new Date().toISOString(),
          descripcion,
          false
        );

        if (resultado && resultado.alerta) {
          Alert.alert("Aviso de Presupuesto", resultado.alerta);
        }
      }

      setDescripcion("");
      setMonto("");
      setCatSeleccionada(null);
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

<<<<<<< Updated upstream
=======
  const handleEliminar = async (id) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await transaccionController.eliminarTransaccion(id);
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

>>>>>>> Stashed changes
  const renderItem = ({ item }) => {
    const fechaObj = new Date(item.fecha);
    const dia = fechaObj.getDate();
    const mesIndex = fechaObj.getMonth();
    const anio = fechaObj.getFullYear();

    const nombreMes = nombresMeses[mesIndex];

    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.infoContainer}>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.categoria}>{item.nombreCategoria}</Text>

              {!filtroMes && (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "#3B82F6",
                    marginLeft: 5,
                  }}
                >
                  {nombreMes}
                </Text>
              )}

              <Text style={styles.categoria}>
                {" • "}
                {dia} {nombreMes} {anio}
              </Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Text
              style={[
                styles.monto,
                {
                  color:
                    item.tipoCategoria === "Ingreso" ? "#10B981" : "#EF4444",
                },
              ]}
            >
              ${parseFloat(item.monto).toFixed(2)}
            </Text>
            <Menu>
              <MenuTrigger>
                <Text style={styles.dotsTreeV}>⋮</Text>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  onSelect={() => abrirFormulario(item.tipoCategoria, item)}
                >
                  <Text style={{ color: "#3B82F6", padding: 10 }}>Editar</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleEliminar(item.id)}>
                  <Text style={{ color: "red", padding: 10 }}>Eliminar</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>
    );
  };

<<<<<<< Updated upstream
  const handleEliminar = async (id) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await transaccionController.eliminarTransaccion(id);
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

=======
>>>>>>> Stashed changes
  const renderSelectorCategorias = (
    tipoFiltro,
    seleccionado,
    setSeleccionado,
    modoFiltro = false
  ) => {
    let filtradas = categorias;

    if (!modoFiltro) {
      filtradas = categorias.filter((c) => c.tipo === tipoFiltro);
    }

    if (filtradas.length === 0) {
      return (
        <Text style={{ marginVertical: 10, color: "#999" }}>
          No hay categorías disponibles.
        </Text>
      );
    }

    return (
      <View style={{ marginVertical: 5, width: "100%" }}>
        {modoFiltro ? null : (
          <Text style={styles.labelInput}>Selecciona Categoría:</Text>
        )}
        <GestureHandlerScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row", paddingVertical: 5 }}
        >
          {modoFiltro && (
            <TouchableOpacity
              onPress={() => setSeleccionado(null)}
              style={[
                styles.chip,
                seleccionado === null && styles.chipSelected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  seleccionado === null && styles.chipTextSelected,
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>
          )}

          {filtradas.map((cat) => {
            const isSelected = seleccionado === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  setSeleccionado(isSelected && modoFiltro ? null : cat.id)
                }
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                  {
                    borderColor: cat.tipo === "Ingreso" ? "#10B981" : "#EF4444",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </GestureHandlerScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#bff0ea" }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ margin: 20 }}
        />
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtros:</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={[styles.filterChip, filtroMes && styles.filterChipActive]}
              onPress={() => setFiltroMes(!filtroMes)}
            >
              <Text
                style={[
                  styles.filterText,
                  filtroMes && styles.filterTextActive,
                ]}
              >
                {filtroMes ? "Este Mes" : "Histórico Completo"}
              </Text>
            </TouchableOpacity>
          </View>
          {renderSelectorCategorias(
            null,
            filtroCategoria,
            setFiltroCategoria,
            true
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gastos</Text>
          <TouchableOpacity
            onPress={() => abrirFormulario("Gasto")}
            style={styles.addButtonMini}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {gastosFiltrados.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay gastos (con estos filtros)
          </Text>
        ) : (
          gastosFiltrados.map((item) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))
        )}

        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Ingresos</Text>
          <TouchableOpacity
            onPress={() => abrirFormulario("Ingreso")}
            style={[styles.addButtonMini, { backgroundColor: "#10B981" }]}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {ingresosFiltrados.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay ingresos (con estos filtros)
          </Text>
        ) : (
          ingresosFiltrados.map((item) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))
        )}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bSheet}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bView}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sheetTitulo}>
            {modoEdicion ? "Editar Transacción" : `Nuevo ${tipoOperacion}`}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Descripción (ej. Café)"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <TextInput
            style={styles.input}
            placeholder="Monto"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />

          {renderSelectorCategorias(
            tipoOperacion,
            catSeleccionada,
            setCatSeleccionada,
            false
          )}

          <TouchableOpacity
            style={[
              styles.THBtn,
              {
                backgroundColor:
                  tipoOperacion === "Ingreso" ? "#10B981" : "#EF4444",
              },
            ]}
            onPress={handleGuardar}
          >
            <Text style={styles.BtnTxt}>
              {modoEdicion ? "Guardar Cambios" : `Guardar ${tipoOperacion}`}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: { flex: 1 },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  descripcion: { fontSize: 16, fontWeight: "bold", color: "#374151" },
  categoria: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  monto: { fontSize: 16, fontWeight: "bold", marginRight: 5 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#374151" },
  addButtonMini: {
    backgroundColor: "#EF4444",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 10,
  },
  bSheet: { backgroundColor: "#FFFFFF", elevation: 20 },
  bView: { padding: 20, alignItems: "center" },
  sheetTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#374151",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#374151",
  },
  THBtn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    margin: 10,
    borderRadius: 10,
  },
  BtnTxt: { fontSize: 18, padding: 10, color: "#fff", fontWeight: "600" },
  dotsTreeV: { fontSize: 20, color: "#9CA3AF", paddingHorizontal: 10 },
  labelInput: {
    alignSelf: "flex-start",
    color: "#6B7280",
    marginBottom: 5,
    fontWeight: "600",
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  chipSelected: {
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#374151",
  },
  chipText: { color: "#374151" },
  chipTextSelected: { fontWeight: "bold" },
  filterContainer: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f3f4f6",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterChipActive: { backgroundColor: "#DBEAFE", borderColor: "#3B82F6" },
  filterText: { color: "#6b7280", fontSize: 12 },
  filterTextActive: { color: "#1e40af", fontWeight: "bold" },
});