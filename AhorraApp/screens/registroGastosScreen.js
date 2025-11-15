import React, { useRef, useMemo, useState, useCallback } from "react"; // 'Activity' eliminado
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
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const GASTOS_INICIALES = [
  { id: "1", descripcion: "Café de la mañana", monto: 45.5 },
  { id: "2", descripcion: "Transporte (Metro)", monto: 10.0 },
  { id: "3", descripcion: "Comida", monto: 120.0 },
];
const Ingresos_I = [
  { id: "1", descripcion: "Transferencia ", monto: 500 },
  { id: "2", descripcion: "Aguinaldo", monto: 2500 },
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
  const bottomSheetGastosRef = useRef(null);
  const bottomSheetIngresosRef = useRef(null);
  const bottomSheetOpsRef = useRef(null);
  const bottomSheetModRef = useRef(null);
  const snapPoints = useMemo(() => ["50%"], []); 


  const handleOpenSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };
  const handledOpenOpsSheet = (item, tipo) => {
    setItem({ ...item, tipo: tipo });
    bottomSheetOpsRef.current?.snapToIndex(0);
  };
  const handledOpenIngresoSheet = () => {
    bottomSheetRef.current.close();
    bottomSheetIngresosRef.current.snapToIndex(0);
  };
  const handledOpenGastosSheet = () => {
    bottomSheetRef.current.close();
    bottomSheetGastosRef.current.snapToIndex(0);
  };
  const handledOpenModSheet = () => {
    if (!item) return;
    setDescripcionM(item.descripcion);
    setMontoM(item.monto.toString());
    bottomSheetOpsRef.current?.close();
    bottomSheetModRef.current?.snapToIndex(0);
  };

  const handleGuardarGasto = useCallback(() => {
    const montoNum = parseFloat(montoG);
    if (!descripcionG || !montoNum || montoNum <= 0) {
      Alert.alert(
        "Error",
        "Por favor, ingresa una descripción y un monto válido."
      );
      return;
    }

    const nuevoGasto = {
      id: Date.now().toString(),
      descripcion: descripcionG,
      monto: montoNum,
    };


    Keyboard.dismiss();
    bottomSheetGastosRef.current?.snapToIndex(-1);


    setTimeout(() => {
      setGastos((gastosActuales) => [nuevoGasto, ...gastosActuales]);

      setDescripcionG("");
      setMontoG("");
    }, 300); 

  }, [descripcionG, montoG]);

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
    bottomSheetIngresosRef.current?.close();

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

    const { id, tipo } = item;

    Keyboard.dismiss();
    bottomSheetModRef.current?.close();

    setTimeout(() => {
      if (tipo === "gasto") {
        setGastos((gastosActuales) =>
          gastosActuales.map((gasto) =>
            gasto.id === id
              ? { ...gasto, descripcion: descripcionM.trim(), monto: montoNum }
              : gasto
          )
        );
      } else if (tipo === "ingreso") {
        setIngreso((ingresosActuales) =>
          ingresosActuales.map((ingreso) =>
            ingreso.id === id
              ? { ...ingreso, descripcion: descripcionM.trim(), monto: montoNum }
              : ingreso
          )
        );
      }
      setItem(null);
      setDescripcionM("");
      setMontoM("");
    }, 300);
  }, [item, descripcionM, montoM]);

  const handleEliminar = useCallback(() => {
    if (!item) return;
    const { id, tipo } = item;

    bottomSheetOpsRef.current?.close();

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


  const renderGasto = ({ item }) => (
    <View style={styles.gastoItem}>
      <Text style={styles.gastoDescripcion}>{item.descripcion}</Text>
      <Text style={styles.gastoMonto}>${item.monto.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => handledOpenOpsSheet(item, "gasto")}>
        <Text style={styles.dotsTreeV}>&#x22EE;</Text>
      </TouchableOpacity>
    </View>
  );

  const renderIngreso = ({ item }) => (
    <View style={styles.ingresoItem}>
      <Text style={styles.ingresoDesc}>{item.descripcion}</Text>
      <Text style={styles.ingresoMonto}>${item.monto.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => handledOpenOpsSheet(item, "ingreso")}>
        <Text style={styles.dotsTreeV}>&#x22EE;</Text>
      </TouchableOpacity>
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
        ref={bottomSheetOpsRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={styles.bSheet}
      >
        <BottomSheetScrollView contentContainerStyle={styles.bView}>
          <TouchableOpacity style={styles.THBtn} onPress={handledOpenModSheet}>
            <Text style={styles.BtnTxt}>Modificar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.THBtn} onPress={handleEliminar}>
            <Text style={styles.BtnTxt}>Eliminar</Text>
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
    // ¡¡¡AQUÍ ESTÁ LA CONFIRMACIÓN DE QUE NO HAY FLEX: 1!!!
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
    width: "45%", // Ajustado para que quepan dos
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
});