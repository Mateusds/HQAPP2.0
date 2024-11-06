import React from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview'; // Para iOS
import { useState } from 'react';
import Pdf from 'react-native-pdf'; // Para Android (biblioteca adicional)

export default function LeituraHqScreen({ route }) {
  const { hq } = route.params;
  const [loading, setLoading] = useState(true); // Para indicar quando o PDF está carregando

  // Função para baixar e abrir o HQ
  const downloadAndOpenHq = async () => {
    try {
      let fileName = hq.title.endsWith('.pdf') ? hq.title : `${hq.title}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      const downloadResumable = FileSystem.createDownloadResumable(
        hq.fileUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      if (await FileSystem.getInfoAsync(uri)) {
        if (Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri); // Abre a interface de compartilhamento para o usuário
        } else {
          Alert.alert('Download concluído', 'HQ baixada, mas o compartilhamento não está disponível no dispositivo.');
        }
      }
    } catch (error) {
      console.error('Erro ao baixar HQ:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao baixar a HQ.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hq.title}</Text>

      {/* Verificação de plataforma para exibição correta */}
      {Platform.OS === 'ios' ? (
        <WebView
          style={styles.webview}
          source={{ uri: hq.fileUrl }}
          useWebKit={true}
          startInLoadingState={true}
        />
      ) : (
        <Pdf
          source={{ uri: hq.fileUrl }}
          onLoadComplete={() => setLoading(false)}
          onError={(error) => {
            console.log(error);
            Alert.alert('Erro', 'Falha ao carregar o PDF.');
          }}
          style={styles.pdf}
        />
      )}

      {loading && Platform.OS === 'android' && (
        <Text style={styles.loadingText}>Carregando HQ...</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Baixar e Abrir HQ" onPress={downloadAndOpenHq} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
