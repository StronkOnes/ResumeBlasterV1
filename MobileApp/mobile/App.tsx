import './src/setupPolyfills';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import EditResumeScreen from './src/screens/EditResumeScreen';
import OptimizationScreen from './src/screens/OptimizationScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import { TabNavigator } from './src/TabNavigator';
import { Header } from './src/components/Header';

// Create a wrapper component for the protected screens
const AppNavigator = () => {
  const { user, loading } = useAuth();
  const Stack = createNativeStackNavigator();

  if (loading) {
    // You might want to show a splash screen or loader here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!user ? "Login" : "MainApp"}>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainApp"
              component={TabNavigator}
              options={({ route }) => ({
                header: () => <Header title="Resume Blaster" />,
              })}
            />
            <Stack.Screen
              name="EditResume"
              component={EditResumeScreen}
              options={{ title: 'Edit Resume' }}
            />
            <Stack.Screen
              name="Optimization"
              component={OptimizationScreen}
              options={{ title: 'Optimize Resume' }}
            />
            <Stack.Screen
              name="Preview"
              component={PreviewScreen}
              options={{ title: 'Preview Resume' }}
            />
          </>
        )}
        {/* Admin screens are available when needed, but not as initial routes */}
        <Stack.Screen
          name="AdminLogin"
          component={require('./src/screens/AdminLogin').default}
          options={{ title: 'Admin Login' }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={require('./src/screens/AdminDashboard').default}
          options={{ title: 'Admin Dashboard' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
