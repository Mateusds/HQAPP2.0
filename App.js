import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Stack Navigator
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'; // Importando o Firebase Auth

// Importando as telas
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import ProgressoScreen from './components/ProgressoScreen';
import FavoritosScreen from './components/FavoritosScreen';
import ConfiguracoesScreen from './components/ConfiguracoesScreen';
import LeituraHqScreen from './components/LeituraHqScreen';
import CadastroScreen from './components/CadastroScreen'; 
import InserirHQScreen from './components/InserirHQScreen';

// Criando o Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificando o status de autenticação ao carregar o app
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true); // Se o usuário estiver autenticado
      } else {
        setIsAuthenticated(false); // Caso contrário, redireciona para Login
      }
    });

    return () => unsubscribe(); // Limpeza do ouvinte
  }, []);

  // Exibe a tela de Splash ao iniciar, e depois redireciona conforme autenticação
  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }} // Esconde o header na tela de splash
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} // Esconde o header na tela de login
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignupScreen} // Corrigido o nome da tela de cadastro
            options={{ headerShown: false }} // Esconde o header na tela de cadastro
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Caso esteja autenticado, exibe a navegação por abas
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#fff', // Cor de fundo da barra de navegação
          },
          tabBarActiveTintColor: '#FF6347', // Cor dos ícones quando ativos
          tabBarInactiveTintColor: '#A9A9A9', // Cor dos ícones quando inativos
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
