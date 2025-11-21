import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, StatusBar } from "react-native";
import GraficaScreen from "./graficasScreen";
import RegistroGastosScreen from "./registroGastosScreen";
import PresupuestosScreen from "./PresupuestoScreen";
import InicioSesionScreen from "./InicioSesionScreen";

export default function MenuScreen() {
  const [screen, setScreen] = useState("menu");

  switch (screen) {
    case "InicioSesionScreen":
      return <InicioSesionScreen />;
    case "registroGastosScreen":
      return <RegistroGastosScreen />;
    case "GraficasScreen":
      return <GraficaScreen />;
    case "PresupuestoScreen":
      return <PresupuestosScreen />;
    default:
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#16363f" />
          <Text style={styles.title}>🌿 AhorraApp</Text>
          <Text style={styles.subtitle}>Tu espacio para gestionar y crecer</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#00BFA5" }]}
              onPress={() => setScreen("InicioSesionScreen")}
            >
              <Text style={styles.btnText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#4CAF50" }]}
              onPress={() => setScreen("registroGastosScreen")}
            >
              <Text style={styles.btnText}>Gastos e Ingresos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#2196F3" }]}
              onPress={() => setScreen("GraficasScreen")}
            >
              <Text style={styles.btnText}>Gráficas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#FF9800" }]}
              onPress={() => setScreen("PresupuestoScreen")}
            >
              <Text style={styles.btnText}>Presupuesto</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>💰 Mantén el control, sin perder la calma.</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16363f",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#bfe9e3",
    marginBottom: 40,
  },
  btnContainer: {
    width: "90%",
    gap: 20,
  },
  btn: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    color: "#a5c6c0",
    fontStyle: "italic",
  },
});