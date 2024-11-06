import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig'; // Importar o storage configurado no Firebase

const InserirHQScreen = ({ navigation, route }) => {
  const { addHq } = route.params || {};
  const [nomeHQ, setNomeHQ] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelection = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,  // Agora estamos garantindo que o arquivo seja salvo no cache.
      });

      if (res.type === 'success') {
        console.log('Arquivo selecionado:', res.uri); // Log do URI
        setArquivo(res);
        Alert.alert('Arquivo Selecionado', `Você selecionou: ${res.name}`);
      } else {
        console.log('Usuário cancelou a seleção');
      }
    } catch (err) {
      console.error('Erro ao selecionar o arquivo:', err);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const handleInsert = async () => {
    if (!nomeHQ.trim() || !arquivo) {
      Alert.alert('Erro', 'Por favor, preencha o nome da HQ e selecione um arquivo.');
      return;
    }

    setUploading(true);

    try {
      // Criar referência no Firebase Storage
      const fileRef = ref(storage, `arquivos/${uuidv4()}_${arquivo.name}`);
      
      // Ler o arquivo e fazer upload
      const fileContent = await fetch(arquivo.uri);
      console.log('Conteúdo do arquivo:', fileContent); // Log do conteúdo do arquivo
      const blob = await fileContent.blob(); // Converte para blob
      await uploadBytes(fileRef, blob);

      // Obter URL de download do arquivo carregado
      const fileUrl = await getDownloadURL(fileRef);

      const newHq = {
        id: uuidv4(),
        title: nomeHQ,
        imageUrl: 'https://via.placeholder.com/150', // Exemplo de URL para a imagem
        fileUrl: fileUrl, // URL do arquivo carregado
      };

      if (typeof addHq === 'function') {
        addHq(newHq);
      } else {
        console.error('addHq não está definido ou não é uma função');
      }

      Alert.alert('HQ Adicionada', `Você adicionou a HQ: ${nomeHQ}`);
      setNomeHQ('');
      setArquivo(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error.message); // Log do erro
      Alert.alert('Erro', `Ocorreu um erro ao fazer upload do arquivo: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar HQ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da HQ"
        value={nomeHQ}
        onChangeText={setNomeHQ}
      />
      <TouchableOpacity style={styles.button} onPress={handleFileSelection}>
        <Text style={styles.buttonText}>Selecionar Arquivo</Text>
      </TouchableOpacity>

      {arquivo && (
        <Text style={styles.fileName}>
          Arquivo selecionado: {arquivo.name}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleInsert} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Carregando...' : 'Adicionar'}</Text>
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
  input: {
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
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
  fileName: {
    color: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default InserirHQScreen;
