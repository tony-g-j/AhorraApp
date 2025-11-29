import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PresupuestosS from '../screens/PresupuestoScreen';
import RegistroGastosS from '../screens/registroGastosScreen';
import GraficasS from '../screens/graficasScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabsNav(){
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
                component={PresupuestosS}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Graficas' 
                component={GraficasS}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bar-chart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Registro' 
                component={RegistroGastosS}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}