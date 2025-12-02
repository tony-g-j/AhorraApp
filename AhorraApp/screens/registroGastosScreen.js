import React, { useRef, useMemo, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { ScrollView as GestureHandlerScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";

import { TransaccionController } from "../controllers/transaccionController";
import { CategoriaController } from "../controllers/categoriaController";
import { PresupuestoController } from "../controllers/presupuestoController";

import { SafeAreaView } from "react-native-safe-area-context";

const transaccionController = new TransaccionController();
const categoriaController = new CategoriaController();
const presupuestoController = new PresupuestoController();

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

export default function RegistroGastosScreen() {
  const [item, setItem] = useState(null);
  const [gastos, setGastos] = useState(GASTOS_INICIALES);
  const [ingresos, setIngreso] = useState(Ingresos_I);

  const [descripcionG, setDescripcionG] = useState("");
  const [montoG, setMontoG] = useState("");

  const [descripcionI, setDescripcionI] = useState("");
  const [montoI, setMontoI] = useState("");

  const [descripcionM, setDescripcionM] = useState("");
  const [montoM, setMontoM] = useState("");

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

  const handleGuardarIngreso = useCallback(() => {
    const montoNum = parseFloat(montoI);
    if (!descripcionI || !montoNum || montoNum <= 0) {
      Alert.alert(
        "Error",
        "Por favor, ingresa una descripción y un monto válido."
      );
      return;
    }
    const NIngreso = {
      id: Date.now().toString(),
      descripcion: descripcionI,
      monto: montoNum,
    };

    Keyboard.dismiss();
    setTimeout(() => bottomSheetIngresosRef.current?.close(), 300)
    

    setTimeout(() => {
      setIngreso((ingreso) => [NIngreso, ...ingreso]);
      setDescripcionI("");
      setMontoI("");
    }, 300);
  }, [descripcionI, montoI]);

  const handleModificar = useCallback(() => {
    if (!item) return;
    const montoNum = parseFloat(montoM);
    if (descripcionM.trim() === "" || !montoNum || montoNum <= 0) {
      Alert.alert("Error", "Datos de modificación inválidos.");
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
          Alert.alert("⚠️ Aviso de Presupuesto", resultado.alerta);
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

  const handleEliminar = useCallback(() => {
    if (!item) return;
    const { id, tipo } = item;

    setTimeout(() => {
      if (tipo === "gasto") {
        setGastos((gastosActuales) =>
          gastosActuales.filter((gasto) => gasto.id !== id)
        );
      } else if (tipo === "ingreso") {
        setIngreso((ingresosActuales) =>
          ingresosActuales.filter((ingreso) => ingreso.id !== id)
        );
      }
      setItem(null);
    }, 300);
  }, [item]);

  const renderItem = ({ item }) => {
    const fechaObj = new Date(item.fecha);
    const dia = fechaObj.getDate();
    const mesIndex = fechaObj.getMonth();
    const anio = fechaObj.getFullYear();

    const nombreMes = nombresMeses[mesIndex];

    const etiquetaMes = !filtroMes ? `(${nombreMes})` : "";

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

  const renderIngreso = ({ item }) => (
    <View style={styles.ingresoItem}>
      <Text style={styles.ingresoDesc}>{item.descripcion}</Text>
      <Text style={styles.ingresoMonto}>${item.monto.toFixed(2)}</Text>
      <Menu style={styles.Menu}>
        <MenuTrigger style={styles.trigger}>
          <Text style={styles.dotsTreeV}>&#x22EE;</Text>
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.MenuOpsContainer}>
          <MenuOption
            style={styles.option}
            onSelect={() => {
              setItem({ ...item, tipo: "ingreso" });
              handledOpenModSheet();
            }}
          >
            <Text style={styles.opText}> Modificar </Text>
          </MenuOption>
          <MenuOption
            style={styles.option}
            onSelect={() => {
              setItem({ ...item, tipo: "ingreso" });
              handleEliminar();
            }}
          >
            <Text style={styles.opText}> Eliminar </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );

  return (
    <View style={styles.Screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.Seccion}>
          <Text style={styles.titulo}>Mis Ingresos</Text>

          <FlatList
            data={ingresos}
            renderItem={renderIngreso}
            keyExtractor={(item) => item.id}
            style={styles.lista}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.Seccion}>
          <Text style={styles.titulo}>Mis Gastos</Text>

          <FlatList
            data={gastos}
            renderItem={renderGasto}
            keyExtractor={(item) => item.id}
            style={styles.lista}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleOpenSheet}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bSheet}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bView}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Agregar</Text>

          <TouchableHighlight
            style={styles.THBtn}
            underlayColor={"#ECFDF5"}
            onPress={handledOpenIngresoSheet}
          >
            <Text style={styles.BtnTxt}>Ingreso</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.THBtn}
            underlayColor={"#ECFDF5"}
            onPress={handledOpenGastosSheet}
          >
            <Text style={styles.BtnTxt}>Gasto</Text>
          </TouchableHighlight>
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetIngresosRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bSheet}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bView}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sheetTitulo}>Registrar Ingreso</Text>

          <TextInput
            style={styles.input}
            placeholder="Descripción (ej. Pago quincenal)"
            placeholderTextColor={"#9CA3AF"}
            value={descripcionI}
            onChangeText={setDescripcionI}
          />

          <TextInput
            style={styles.input}
            placeholder="Ingrese una cantidad"
            placeholderTextColor={"#9CA3AF"}
            value={montoI}
            onChangeText={setMontoI}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.THBtn} onPress={handleGuardarIngreso}>
            <Text style={styles.BtnTxt}> Guardar ingreso </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetGastosRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bSheet}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bView}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sheetTitulo}>Registrar Nuevo Gasto</Text>

          <TextInput
            style={styles.input}
            placeholder="Descripción (ej. Comida)"
            placeholderTextColor="#9CA3AF"
            value={descripcionG}
            onChangeText={setDescripcionG}
          />

          <TextInput
            style={styles.input}
            placeholder="Monto (ej. 150.00)"
            placeholderTextColor="#9CA3AF"
            value={montoG}
            onChangeText={setMontoG}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.THBtn} onPress={handleGuardarGasto}>
            <Text style={styles.BtnTxt}>Guardar gasto</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetModRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bSheet}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bView}
          keyboardShouldPersistTaps="handled"
        >
          <Text> Modificar </Text>

          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcionM}
            onChangeText={setDescripcionM}
          />

          <TextInput
            style={styles.input}
            placeholder="Monto"
            value={montoM}
            onChangeText={setMontoM}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.THBtn} onPress={handleModificar}>
            <Text style={styles.BtnTxt}> Guardar Modificación </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: "#bff0ea",
  },
  Seccion: {
    marginTop: 12,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#bff0ea",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0B3D3A",
    marginTop: 20,
    marginBottom: 20,
  },
  lista: {
    width: "90%",
  },
  gastoItem: {
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gastoDescripcion: {
    color: "#F9FAFB",
    fontSize: 16,
  },
  gastoMonto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  ingresoItem: {
    backgroundColor: "#059669",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingresoDesc: {
    color: "#FFF",
  },
  ingresoMonto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabTexto: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 32,
  },
  bSheet: {
    backgroundColor: "#abbbb5ff",
  },
  bView: {
    padding: 20,
    alignItems: "center",
  },
  sheetTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#374151",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderColor: "#9CA3AF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#374151",
  },
  dotsTreeV: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
    paddingLeft: 20,
  },
  THBtn: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    margin: 10,
    borderRadius: 10,
  },
  BtnTxt: {
    textAlign: "center",
    fontSize: 20,
    padding: 10,
    color: "#fff",
  },
  Menu: {
    position: "static",
    top: 10,
    right: 10,
    borderRadius: 16,
  },
  trigger: {
    padding: 5,
  },
  MenuOpsContainer: {
    marginTop: 30,
    borderRadius: 8,
    padding: 5,
    backgroundColor:'#9CA3AF'
  },
  option: {
    backgroundColor:'#fff',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 5,
  },
  opText: {
    textAlign: "center",
    fontSize: 16,
    padding: 8,
    color: "#333",
  },
});
