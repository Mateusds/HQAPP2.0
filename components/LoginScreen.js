import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebaseConfig'; // Ajuste o caminho conforme necessário
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      navigation.replace('Home'); // Direciona para a tela Home, independente do tipo de usuário
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    Alert.alert('Login com Facebook ainda não implementado.');
  };

  const handleGoogleLogin = async () => {
    Alert.alert('Login com Google ainda não implementado.');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>HQ</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
          <Text style={styles.showPasswordText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.signupText}>Criar uma conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialgoogleButton} onPress={handleGoogleLogin}>
        <Icon name="google" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialButtonText}>Continue com o Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialfacebookButton} onPress={handleFacebookLogin}>
        <Icon name="facebook" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialButtonText}>Continue com o Facebook</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#1c1c1c',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
  },
  showPasswordButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  showPasswordText: {
    color: '#BD001C',
  },
  button: {
    backgroundColor: '#BD001C',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingIndicator: {
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signupText: {
    color: '#fff',
    marginTop: 15,
    marginBottom: 30,
  },
  socialgoogleButton: {
    flexDirection: 'row',
    backgroundColor: '#4381F0',
    padding: 15,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  socialfacebookButton: {
    flexDirection: 'row',
    backgroundColor: '#4364AF',
    padding: 15,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 0,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
