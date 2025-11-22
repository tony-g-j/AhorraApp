import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PresupuestosS from '../screens/PresupuestoScreen';
import RegistroGastosS from '../screens/registroGastosScreen';
import GraficasS from '../screens/graficasScreen';

const Tab = createBottomTabNavigator();

export default function TabsNav(){
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name='Presupuestos' component={PresupuestosS} />
            <Tab.Screen name='Graficas' component={GraficasS}/>
            <Tab.Screen name='Registro' component={RegistroGastosS}/>
        </Tab.Navigator>
    )
}