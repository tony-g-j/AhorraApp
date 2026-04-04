import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import { UsuarioController } from "../controllers/usuarioController";
import { seedDatabase } from '../utils/data';

const usuarioController = new UsuarioController();

const SplashScreen = () => (
  <View style={styles.splashBg}>
    <Image
      source={require('../assets/logo.png')}
      style={styles.logo}
    />
    <Text style={styles.logoText}>Ahorra+ App</Text>
    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
  </View>
);

const LoginScreen = ({ onRegister, onRecover, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atención", "Por favor ingresa correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      const usuario = await usuarioController.login(email.trim(), password);
      onLoginSuccess(usuario);
    } catch (error) {
      Alert.alert("Error de Acceso", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatosSilencioso = async () => {
      try {
        console.log("🔄 Verificando datos iniciales...");
        console.log("✅ Base de datos lista para demo.");
        seedDatabase();
      } catch (error) {
        console.error("Error en sembrado silencioso:", error);
      }
    };

    cargarDatosSilencioso();
  }, []);

  return (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Bienvenido de nuevo</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
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

      <TouchableOpacity onPress={onRecover} style={{ alignSelf: 'center', marginBottom: 20 }}>
        <Text style={{ color: "#00796b", fontSize: 14 }}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <View style={styles.btnWrapper}>
        <Button
          title={loading ? "Verificando..." : "Iniciar Sesión"}
          color="#009688"
          onPress={handleLogin}
          disabled={loading}
        />
      </View>

      <TouchableOpacity onPress={onRegister} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>
          ¿No tienes cuenta? <Text style={{ fontWeight: "bold" }}>Regístrate aquí</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const RegisterScreen = ({ onLogin }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [palabraSecreta, setPalabraSecreta] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password || !palabraSecreta) {
      Alert.alert("Error", "Por favor completa los campos obligatorios (*)");
      return;
    }

    setLoading(true);
    try {
      await usuarioController.crearUsuario(
        nombre,
        email,
        password,
        telefono,
        palabraSecreta
      );
      Alert.alert("¡Éxito!", "Cuenta creada correctamente. Por favor inicia sesión.");
      onLogin();
    } catch (error) {
      Alert.alert("Error al registrar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Crear Cuenta</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo *"
        placeholderTextColor="#999"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico *"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono (Opcional)"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <View style={styles.separator} />
      
      <Text style={styles.label}>Seguridad:</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña *"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Text style={styles.helperText}>Pregunta de seguridad (Ej. Nombre de tu primera mascota):</Text>
      <TextInput
        style={styles.input}
        placeholder="Palabra Clave Secreta *"
        placeholderTextColor="#999"
        value={palabraSecreta}
        onChangeText={setPalabraSecreta}
      />

      <View style={styles.btnWrapper}>
        <Button
          title={loading ? "Creando..." : "Registrarse"}
          color="#009688"
          onPress={handleRegister}
          disabled={loading}
        />
      </View>

      <TouchableOpacity onPress={onLogin} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? Inicia Sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ForgotPasswordScreen = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [palabraSecreta, setPalabraSecreta] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRecover = async () => {
        if(!email || !palabraSecreta || !nuevaPassword) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }
        setLoading(true);
        try {
            await usuarioController.restablecerContrasena(email, palabraSecreta, nuevaPassword);
            Alert.alert("Éxito", "Tu contraseña ha sido restablecida. Inicia sesión con la nueva clave.");
            onLogin();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={{textAlign:'center', color: '#666', marginTop: 10}}>
                    Ingresa tu correo y la palabra clave que definiste al registrarte.
                </Text>
            </View>

            <TextInput 
                style={styles.input} 
                placeholder="Correo electrónico" 
                placeholderTextColor="#999" 
                keyboardType="email-address" 
                autoCapitalize="none" 
                value={email} 
                onChangeText={setEmail} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Palabra Clave Secreta" 
                placeholderTextColor="#999" 
                value={palabraSecreta} 
                onChangeText={setPalabraSecreta} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Nueva Contraseña" 
                placeholderTextColor="#999" 
                secureTextEntry 
                value={nuevaPassword} 
                onChangeText={setNuevaPassword} 
            />

            <View style={styles.btnWrapper}>
                <Button 
                    title={loading ? "Procesando..." : "Restablecer Contraseña"} 
                    color="#FF9800"
                    onPress={handleRecover} 
                    disabled={loading} 
                />
            </View>

            <TouchableOpacity onPress={onLogin} style={{ marginTop: 20 }}>
                <Text style={styles.linkText}>Volver al Inicio de Sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default function InicioSesionScreen({ onLoginSuccess }) {
  const [pantalla, setPantalla] = useState("splash");

  useEffect(() => {
    const init = async () => {
      await usuarioController.initialize();
      setTimeout(() => setPantalla("login"), 2000);
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      {pantalla === "splash" && <SplashScreen />}
      
      {pantalla === "login" && (
        <LoginScreen
          onRegister={() => setPantalla("register")}
          onRecover={() => setPantalla("recover")}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      
      {pantalla === "register" && (
        <RegisterScreen onLogin={() => setPantalla("login")} />
      )}

      {pantalla === "recover" && (
        <ForgotPasswordScreen onLogin={() => setPantalla("login")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bff0ea",
  },
  splashBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo:{
    height:250,
    width:250
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#30472eff",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  emojiLogo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0b3d3a",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  btnWrapper: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  linkText: {
    color: "#00796b",
    textAlign: "center",
    fontSize: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#0b3d3a',
    marginBottom: 5,
    marginTop: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  }
});