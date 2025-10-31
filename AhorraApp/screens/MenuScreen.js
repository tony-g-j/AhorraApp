import { Text, StyleSheet, Button, View } from "react-native";
import React, { useState } from "react";

export default function MenuScreen() {
  const [screen, setScreen] = useState("menu");

  switch (screen) {
    case "inicioSesiónScreen":
      //screen
      break;
    case "registroScreen":
      //screen
      break;
    case "registroGastosScreen":
      //screen
      break;
    case "IngresosScreen":
      //screen
      break;
    case "EgresosScreen":
      //screen
      break;
    case "PresupuestoScreen":
        //screen
      break;
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Screens AhorraApp</Text>
          <View style={styles.btns}>
            <Button
              onPress={() => setScreen("inicioSesiónScreen")}
              title="Inicio de sesión"
            />
            <Button
              onPress={() => setScreen("registroScreen")}
              title="Registro"
            />
            <Button
              onPress={() => setScreen("registroGastosScreen")}
              title="Registro de gastos"
            />
            <Button
              onPress={() => setScreen("IngresosScreen")}
              title="Ingresos"
            />
            <Button
              onPress={() => setScreen("EgresosScreen")}
              title="Ingresos"
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
