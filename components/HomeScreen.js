import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';

export default function HomeScreen({ navigation }) {
  const [hqs, setHqs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredHqs, setFilteredHqs] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const fetchHqs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'hq'));
      const hqsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const thumbnail = await generateThumbnail(data.fileUrl);
        return {
          id: doc.id,
          title: data.nome,
          fileUrl: data.fileUrl,
          coverUrl: data.coverUrl,
          thumbnail,
        };
      }));

      setHqs(hqsData);
      setFilteredHqs(hqsData);
    } catch (error) {
      console.error('Erro ao buscar HQs:', error);
    } finally {
      setLoading(false); // Desativa o estado de carregamento quando os dados são carregados
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHqs();
    }, [])
  );

  const filterHqs = (text) => {
    const filteredData = hqs.filter((hq) =>
      hq.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredHqs(filteredData);
  };

  useEffect(() => {
    filterHqs(searchText);
  }, [searchText]);

  const generateThumbnail = async (url) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'tempPdf.pdf';
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return `data:application/pdf;base64,${base64}`;
    } catch (error) {
      console.error('Erro ao gerar miniatura:', error);
      return null;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hqContainer}
      onPress={() => navigation.navigate('LeituraHqScreen', { hq: item })}
    >
      <Text style={styles.hqTitle}>{item.title}</Text>
      {item.coverUrl && (
        <Image
          style={styles.thumbnail}
          source={{ uri: item.coverUrl }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando HQs...</Text>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar HQ..."
            placeholderTextColor="#fff"
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredHqs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131212',
    padding: 30,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 25,
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
  },
  hqContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 10,
  },
  hqTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  thumbnail: {
    width: 100,
    height: 150,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});
