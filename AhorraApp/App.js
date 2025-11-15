import { GestureHandlerRootView } from "react-native-gesture-handler";
import MenuScreen from "./screens/MenuScreen";


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuScreen />
    </GestureHandlerRootView>
  );
}
