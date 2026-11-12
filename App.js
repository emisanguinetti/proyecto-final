import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { PlacesProvider } from './src/context/PlacesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlacesProvider>
          <AppNavigator />
        </PlacesProvider>
        <StatusBar barStyle="light-content" backgroundColor="#2d6a4f" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
