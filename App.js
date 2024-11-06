import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import * as Notifications from 'expo-notifications';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import ProgressoScreen from './components/ProgressoScreen';
import FavoritosScreen from   './components/FavoritosScreen';
import ConfiguracoesScreen from './components/ConfiguracoesScreen';
import LeituraHqScreen from './components/LeituraHqScreen';
import CadastroScreen from './components/CadastroScreen';
import InserirHQScreen from './components/InserirHQScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'HQs',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Progresso" 
        component={ProgressoScreen} 
        options={{ 
          title: 'Progresso',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Favoritos" 
        component={FavoritosScreen} 
        options={{ 
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Configuracoes" 
        component={ConfiguracoesScreen} 
        options={{ 
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  async function registerForPushNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permissão de notificação negada!');
      return;
    }

    try {
      const token = await getToken(); // Obter o token usando o serviço
      console.log(token);
    } catch (error) {
      console.error('Erro ao obter o token:', error);
    }
  }

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LeituraHqScreen" 
          component={LeituraHqScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{ title: 'Cadastro' }} 
        />
        <Stack.Screen 
          name="InserirHQ" 
          component={InserirHQScreen} 
          options={{ title: 'Adicionar HQ' }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
