import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioSesionScreen from "../screens/InicioSesionScreen";
import TabsNav from "./TabsNav";
import React, {useState} from 'react';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNav() {
    const [currentUser, setCurrentUser] = useState(null);

    const handleLoginSuccess = (usuario) => {
        console.log("Sesión iniciada:", usuario.nombre);
        setCurrentUser(usuario);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {currentUser ? (
                <Stack.Screen name="Main">
                    {(props) => (
                        <TabsNav 
                            {...props} 
                            activeUserId={currentUser.id} 
                            onLogout={handleLogout} 
                        />
                    )}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="Auth">
                    {(props) => (
                        <InicioSesionScreen 
                            {...props} 
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    );
}