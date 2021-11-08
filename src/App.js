import React from "react"
// NavigationContainer
import { NavigationContainer } from "@react-navigation/native"
// createStackNavigator
import { createStackNavigator } from "@react-navigation/stack"
import UserScreen from "./screens/UserScreen"
import { PlaceProvider } from "./context/PlacesManager"

// Import MenuScreenModal component
import MenuScreenModal from './screens/MenuScreenModal';
// Import a new global style
import {MenuButtonLeft} from './styles';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Create the Stack
const Stack = createStackNavigator()

const App = () => {
  return (
    <PlaceProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="User"
            component={UserScreen}
            options={() => ({
              headerTitle: "Taxi App",
            })}
          />
          <Stack.Screen
              name="Menu"
              component={MenuScreenModal}
              options={({navigation}) => ({
                headerLeft: () => (
                  <MenuButtonLeft
                    onPress={() => navigation.goBack()}
                    testID="back-menu">
                    <FeatherIcon
                      name="x"
                      size={25}
                      color="#000"
                      testID="close-menu"
                    />
                  </MenuButtonLeft>
                ),
                headerTitle: '',
              })}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </PlaceProvider>
  )
}

export default App