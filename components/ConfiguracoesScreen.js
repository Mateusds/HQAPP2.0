import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // Ajuste o caminho conforme necessário
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig'; // Ajuste o caminho conforme necessário

const ConfiguracoesScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIfUserIsAdmin = async (userId) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsAdmin(userData.isAdmin === true);
      } else {
        console.log('Usuário não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      checkIfUserIsAdmin(user.uid);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Adicionando logout do Firebase
      Alert.alert('Logout', 'Você foi desconectado com sucesso!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      Alert.alert('Erro', 'Não foi possível desconectar.');
    }
  };

  const handleAbout = () => {
    Alert.alert('Sobre', 'Esta é uma aplicação de HQs, desenvolvida para você.');
  };

  const handleInsertHQ = () => {
    navigation.navigate('InserirHQ'); // Use o nome correto aqui
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      {isAdmin && (
        <TouchableOpacity style={styles.button} onPress={handleInsertHQ}>
          <Text style={styles.buttonText}>Inserir HQ</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAbout}>
        <Text style={styles.buttonText}>Sobre</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131212',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BD001C',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ConfiguracoesScreen;
