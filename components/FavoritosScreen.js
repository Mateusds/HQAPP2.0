// components/FavoritosScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const favoritosData = await AsyncStorage.getItem('favoritos');
        if (favoritosData !== null) {
          setFavoritos(JSON.parse(favoritosData));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos', error);
      }
    };

    fetchFavoritos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hqContainer}
      onPress={() => navigation.navigate('LeituraHqScreen', { hq: item })} // Navega para a tela de leitura
    >
      <Image source={{ uri: item.imageUrl }} style={styles.hqImage} />
      <Text style={styles.hqTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favoritos.length === 0 ? (
        <Text style={styles.emptyMessage}>Você ainda não favoritou nenhum HQ.</Text>
      ) : (
        <FlatList
          data={favoritos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2} // Exibe em 2 colunas
          columnWrapperStyle={styles.row} // Ajusta o espaçamento entre as colunas
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131212',
    padding: 10,
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
  hqImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  hqTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
