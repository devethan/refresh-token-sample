import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  RouteScreen,
  MainScreen,
  SignInScreen,
  ProtectedScreen,
} from './screens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Route'}
        screenOptions={{animationEnabled: false}}>
        <Stack.Screen name={'Route'} component={RouteScreen} />
        <Stack.Screen name={'Main'} component={MainScreen} />
        <Stack.Screen name={'Protected'} component={ProtectedScreen} />
        <Stack.Screen name={'SignIn'} component={SignInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
