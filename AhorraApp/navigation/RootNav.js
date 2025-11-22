import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioSesionS from "../screens/InicioSesionScreen";
import TabsNav from "./TabsNav";

const stack = createNativeStackNavigator();

export default function RootNav({ isLoged }) {
    isLoged = true;
  return (
    <stack.Navigator>
      {isLoged ? (
        <stack.Screen name="Main" component={TabsNav} options={{headerShown: false}}/>
      ) : (
        <stack.Screen name="Auth" component={InicioSesionS} options={{headerShown: false}} />
      )}
    </stack.Navigator>
  );
}