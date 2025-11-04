import React, { useRef, useMemo, useState, useCallback, Activity } from "react";
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
  ScrollView
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  const [gastos, setGastos] = useState(GASTOS_INICIALES);
  const [ingresos, setIngreso] = useState(Ingresos_I);

  const [descripcionG, setDescripcionG] = useState("");
  const [montoG, setMontoG] = useState("");

  const [descripcionI, setDescripcionI] = useState("");
  const [montoI, setMontoI] = useState("");

  const bottomSheetRef = useRef(null);
  const bottomSheetGastosRef = useRef(null);
  const bottomSheetIngresosRef = useRef(null);
  const snapPoints = useMemo(() => [0.1, "50%"]);

  const handleOpenSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const handledOpenIngresoSheet = () => {
    bottomSheetRef.current.close();
    bottomSheetIngresosRef.current.expand();
  };
  const handledOpenGastosSheet = () => {
    bottomSheetRef.current.close();
    bottomSheetGastosRef.current.expand();
  };

  const modalOptions = (item, type) =>{
    setElemento({...item, type: type});
    setModalV(true);
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

    setGastos((gastosActuales) => [nuevoGasto, ...gastosActuales]);

    setDescripcionG("");
    setMontoG("");

    Keyboard.dismiss();
    bottomSheetGastosRef.current?.close();
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

    setIngreso((ingreso) => [NIngreso, ...ingreso]);

    setDescripcionI("");
    setMontoI("");

    Keyboard.dismiss();
    bottomSheetIngresosRef.current?.close();
  }, [descripcionG, montoI]);

  const renderGasto = ({ item }) => (
    <View style={styles.gastoItem}>
      <Text style={styles.gastoDescripcion}>{item.descripcion}</Text>
      <Text style={styles.gastoMonto}>${item.monto.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => modalOptions(item, 'gasto')}>
        <Text style={styles.dotsTreeV}>&#x22EE;</Text>
      </TouchableOpacity>
    </View>
  );

  const renderIngreso = ({ item }) => (
    <View style={styles.ingresoItem}>
      <Text style={styles.ingresoDesc}>{item.descripcion}</Text>
      <Text style={styles.ingresoMonto}>${item.monto.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => modalOptions(item, 'ingreso')}>
        <Text style={styles.dotsTreeV}>&#x22EE;</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.Screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
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
          index={0}
          enablePanDownToClose={true}
          backgroundStyle={styles.bSheet}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.bView}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.titulo}>Agregar</Text>

            <TouchableHighlight 
              style={styles.THBtn}
              underlayColor={'#ECFDF5'}
              onPress={handledOpenIngresoSheet}
              
            >
              <Text style={styles.BtnTxt}>Ingreso</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.THBtn}
              underlayColor={'#ECFDF5'}
              onPress={handledOpenGastosSheet}
            >
              <Text style={styles.BtnTxt}>Gasto</Text>
            </TouchableHighlight>

          </BottomSheetScrollView>
        </BottomSheet>

        <BottomSheet
          ref={bottomSheetIngresosRef}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={true}
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

            <TouchableOpacity
              style={styles.THBtn}
              onPress={handleGuardarIngreso}
            >
              <Text style={styles.BtnTxt}>Guardar ingreso</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>

        <BottomSheet
          ref={bottomSheetGastosRef}
          snapPoints={snapPoints}
          index={0}
          enablePanDownToClose={true}
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

            <TouchableOpacity
              style={styles.THBtn}
              onPress={handleGuardarGasto}
            >
              <Text style={styles.BtnTxt}>Guardar gasto</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: "#bff0ea",
  },
  Seccion: {
    marginTop:12,
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
    backgroundColor: "#10B981",
  },
  bView: {
    flex: 1,
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
  THBtn:{
    width:'35%',
    alignItems:'center',
    backgroundColor:'#3B82F6',
    margin:10,
    borderRadius:10
  },
  BtnTxt:{
    fontSize:20,
    padding:10,
    color:'#fff'
  },
});
