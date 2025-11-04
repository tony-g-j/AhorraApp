import { Text, StyleSheet, Button, View } from "react-native";
import React, { useState } from "react";
import GraficaScreen from "./graficasScreen";
import RegistroGastosScreen from "./registroGastosScreen";
import PresupuestosScreen from "./PresupuestoScreen";
import InicioSesionScreen from "./InicioSesionScreen";


export default function MenuScreen() {
  const [screen, setScreen] = useState("menu");

  switch (screen) {
    case "InicioSesionScreen":
      return <InicioSesionScreen/>
      
    case "registroScreen":
      //screen
      break;
    case "registroGastosScreen":
      return <RegistroGastosScreen/>
    case "GraficasScreen":
      return <GraficaScreen/>
    case "PresupuestoScreen":
        return <PresupuestosScreen/>
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Screens AhorraApp</Text>
          <View style={styles.btns}>
            <Button
              onPress={() => setScreen("InicioSesionScreen")}
              title="Inicio de sesión"
            />
            <Button
              onPress={() => setScreen("registroGastosScreen")}
              title="Gastos e Ingresos"
            />
            <Button
              onPress={() => setScreen("GraficasScreen")}
              title="Graficas"
            />
            <Button
              onPress={() => setScreen("PresupuestoScreen")}
              title="presupuesto"
            />
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f4354ff",
  },
  title: {
    fontSize: 25,
    color: "#fff",
  },
  btns: {
    marginTop: 20,
    gap: 30,
  },
});
