import React, { useRef, useMemo, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Keyboard,
  Alert
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const GASTOS_INICIALES = [
  { id: "1", descripcion: "Café de la mañana", monto: 45.50 },
  { id: "2", descripcion: "Transporte (Metro)", monto: 10.00 },
  { id: "3", descripcion: "Comida", monto: 120.00 },
];

export default function RegistroGastosScreen() {
  const [gastos, setGastos] = useState(GASTOS_INICIALES);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [0.1, "50%"], []);

  const handleOpenSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const handleGuardarGasto = useCallback(() => {
    const montoNum = parseFloat(monto);
    if (!descripcion || !montoNum || montoNum <= 0) {
      Alert.alert("Error", "Por favor, ingresa una descripción y un monto válido.");
      return;
    }

    const nuevoGasto = {
      id: Date.now().toString(),
      descripcion: descripcion,
      monto: montoNum,
    };

    setGastos(gastosActuales => [nuevoGasto, ...gastosActuales]);

    setDescripcion("");
    setMonto("");

    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  }, [descripcion, monto]);

  const renderGasto = ({ item }) => (
    <View style={styles.gastoItem}>
      <Text style={styles.gastoDescripcion}>{item.descripcion}</Text>
      <Text style={styles.gastoMonto}>${item.monto.toFixed(2)}</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Gastos</Text>

        <FlatList
          data={gastos}
          renderItem={renderGasto}
          keyExtractor={(item) => item.id}
          style={styles.lista}
        />

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
            <Text style={styles.sheetTitulo}>Registrar Nuevo Gasto</Text>

            <TextInput
              style={styles.input}
              placeholder="Descripción (ej. Comida)"
              placeholderTextColor="#9CA3AF"
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <TextInput
              style={styles.input}
              placeholder="Monto (ej. 150.00)"
              placeholderTextColor="#9CA3AF"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
            />

            <Button
              title="Guardar Gasto"
              onPress={handleGuardarGasto}
              color="#3B82F6"
            />
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#374151", 
    alignItems: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F9FAFB", 
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
    backgroundColor: '#FFFFFF' 
  },
  bView:{
    flex: 1,
    padding: 20,
    alignItems:'center'
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
});