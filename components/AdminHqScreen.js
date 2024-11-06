// components/AdminHqScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Button } from 'react-native';

export default function AdminHqScreen({ navigation }) {
  const [hqs, setHqs] = useState([]);

  useEffect(() => {
    // Simulação de fetch de HQs, substitua pela chamada de API real
    const fetchHqs = async () => {
      const hqsData = [
        { id: '1', title: 'HQ 1', fileUrl: 'https://example.com/hq1.pdf' },
        { id: '2', title: 'HQ 2', fileUrl: 'https://example.com/hq2.pdf' },
        { id: '3', title: 'HQ 3', fileUrl: 'https://example.com/hq3.pdf' },
      ];
      setHqs(hqsData);
    };

    fetchHqs();
  }, []);

  const handleDeleteHq = (id) => {
    Alert.alert(
      'Excluir HQ',
      'Tem certeza que deseja excluir este HQ?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            // Lógica para remover o HQ
            setHqs((prevHqs) => prevHqs.filter((hq) => hq.id !== id));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.hqContainer}>
      <Text style={styles.hqTitle}>{item.title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditarHqScreen', { hq: item })} // Navega para a tela de edição
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDeleteHq(item.id)} // Confirma exclusão do HQ
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Adicionar Novo HQ"
        onPress={() => navigation.navigate('AdicionarHqScreen')} // Navega para a tela de adicionar
      />
      <FlatList
        data={hqs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  hqContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  hqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});
