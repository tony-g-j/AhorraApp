import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, Button, Image, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import Logo from '../assets/logo.png'; // tu logo local

export default function InicioSesionScreen() {
  const [pantalla, setPantalla] = useState('splash');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPantalla('login');
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.appContainer}>
      {pantalla === 'splash' && <SplashScreen />}
      {pantalla === 'login' && <LoginScreen onRegister={() => setPantalla('register')} />}
      {pantalla === 'register' && <RegisterScreen onLogin={() => setPantalla('login')} />}
    </View>
  );
}

function SplashScreen() {
  return (
    <View style={styles.splashBg}>
      <Image
        source={Logo}
        style={styles.logoSplash}
      />
      <Text style={styles.title}>Ahorra+ App</Text>
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
    </View>
  );
}

function LoginScreen({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const usuarios = [
    { email: 'admin@ahorra.com', password: '123456' },
    { email: 'user@ahorra.com', password: 'abcdef' },
  ];

  const validarCorreo = (correo) => /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(correo);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos');
      return;
    }
    if (!validarCorreo(email)) {
      Alert.alert('Correo inválido', 'Ingresa un correo con formato válido');
      return;
    }
    const usuario = usuarios.find((u) => u.email === email && u.password === password);
    if (usuario) {
      Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
    } else {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.centerContent}>
        <Image
          source={Logo}
          style={styles.logo}
        />
        <Text style={styles.title}>Ahorra+ App</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.btn}>
          <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>

        <Text style={{ color: '#000', marginTop: 10 }}>- Olvidé mi contraseña -</Text>

        <View style={{ marginTop: 20 }}>
          <Button title="Ir a Registro" onPress={onRegister} />
        </View>
      </ScrollView>
    </View>
  );
}

function RegisterScreen({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [aceptado, setAceptado] = useState(false);

  const validarCorreo = (correo) => /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(correo);

  const handleRegister = () => {
    if (!nombre.trim() || !correo.trim() || !password) {
      Alert.alert('Campos vacíos', 'Completa todos los campos');
      return;
    }
    if (!validarCorreo(correo)) {
      Alert.alert('Correo inválido', 'Formato incorrecto');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'Debe tener al menos 6 caracteres');
      return;
    }
    if (!aceptado) {
      Alert.alert('Términos', 'Debes aceptar los términos y condiciones');
      return;
    }
    Alert.alert('Registro completo', 'Usuario creado correctamente');
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.centerContent}>
        <Image
          source={Logo}
          style={styles.logo}
        />
        <Text style={styles.title}>Registro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#999"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#999"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.switchRow}>
          <Switch value={aceptado} onValueChange={setAceptado} />
          <Text style={{ marginLeft: 8 }}>Acepto términos y condiciones</Text>
        </View>

        <View style={styles.btn}>
          <Button title="Registrar" onPress={handleRegister} />
        </View>

        <View style={{ marginTop: 15 }}>
          <Button title="Volver a inicio de sesión" onPress={onLogin} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#bff0ea',
  },
  bg: {
    flex: 1,
    backgroundColor: '#bff0ea', // fondo sólido
  },
  splashBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#70cfc1', // splash sólido
  },
  logoSplash: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0b3d3a',
    marginBottom: 10,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  input: {
    width: '85%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 8,
    elevation: 2,
  },
  btn: {
    width: '85%',
    marginTop: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});