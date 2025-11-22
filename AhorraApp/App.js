import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import MenuScreen from "./screens/MenuScreen";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <NavigationContainer>
          <MenuScreen />
        </NavigationContainer>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}
