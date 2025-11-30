import React, { useState } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioSesionS from "../screens/InicioSesionScreen";
import TabsNav from "./TabsNav";
import { Alert } from 'react-native';

const stack = createNativeStackNavigator();

const initialUsers = [
    { id: '1', name: 'Admin', email: 'admin@upq.mx', password: '123' },
    { id: '2', name: 'Maria', email: 'maria@upq.mx', password: '456' },
];

export default function RootNav() {
    const [activeUserId, setActiveUserId] = useState(null); 
    const [users, setUsers] = useState(initialUsers);

    const handleLoginSuccess = (userId) => {
        setActiveUserId(userId);
    };

    const handleRegisterSuccess = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
    };

    const handleRecoverAttempt = (email) => {
        const userExists = users.some(u => u.email === email);
        if (userExists) {
             Alert.alert('Éxito', `Se simula el envío de correo de recuperación a ${email}.`);
        } else {
             Alert.alert('Error', 'Correo no encontrado en el sistema.');
        }
    };
    
    const handleLogout = () => {
        setActiveUserId(null);
    };

    const isLoged = !!activeUserId;

    return (
        <stack.Navigator>
            {isLoged ? (
                <stack.Screen name="Main" options={{headerShown: false}}>
                    {(props) => <TabsNav {...props} activeUserId={activeUserId} onLogout={handleLogout} />}
                </stack.Screen>
            ) : (
                <stack.Screen name="Auth" options={{headerShown: false}}>
                    {(props) => (
                        <InicioSesionS 
                            {...props} 
                            onLoginSuccess={handleLoginSuccess}
                            onRegisterSuccess={handleRegisterSuccess}
                            onRecoverAttempt={handleRecoverAttempt}
                            users={users}
                        />
                    )}
                </stack.Screen>
            )}
        </stack.Navigator>
    );
}