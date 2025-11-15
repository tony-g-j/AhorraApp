import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import MenuScreen from "./screens/MenuScreen";


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <MenuScreen />
      </MenuProvider>
    </GestureHandlerRootView>
  );
};
