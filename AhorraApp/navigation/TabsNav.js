import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PresupuestosS from '../screens/PresupuestoScreen';
import RegistroGastosS from '../screens/registroGastosScreen';
import GraficasS from '../screens/graficasScreen';

const Tab = createBottomTabNavigator();

export default function TabsNav({ activeUserId, onLogout }){
    return(
        <Tab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen 
                name='Presupuestos' 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                }}
            >
                {(props) => <PresupuestosS {...props} usuarioId={activeUserId} />}
            </Tab.Screen>

            <Tab.Screen 
                name='Graficas' 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart-outline" size={size} color={color} />
                    ),
                }}
            >
                {(props) => <GraficasS {...props} usuarioId={activeUserId} />}
            </Tab.Screen>

            <Tab.Screen 
                name='Registro' 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            >
                {(props) => <RegistroGastosS {...props} usuarioId={activeUserId} />}
            </Tab.Screen>
            
        </Tab.Navigator>
    )
}