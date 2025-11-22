import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import RootNav from './navigation/RootNav'


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <NavigationContainer>
          <RootNav/>
        </NavigationContainer>
      </MenuProvider>
    </GestureHandlerRootView>
  );
};
