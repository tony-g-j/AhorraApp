import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function perfilScreen({ usuario, onLogout }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileCard}>
        <Image
          source={
            usuario?.foto
              ? { uri: usuario.foto }
              : require("../assets/user.png")  
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {usuario?.nombre || "Usuario"}
        </Text>

        <Text style={styles.email}>
          {usuario?.email || "correo@example.com"}
        </Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
        <Text style={[styles.buttonText, { color: "#000000ff" }]}>Cerrar sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#0b3d3a",
  },
  profileCard: {
    backgroundColor: "#f1f1f1",
    width: "100%",
    paddingVertical: 30,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#009688",
    alignItems: "center",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#64e2dcff",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});