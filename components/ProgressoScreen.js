import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressoScreen({ navigation }) {
  const [progresso, setProgresso] = useState([]);

  // Função para carregar o progresso salvo do AsyncStorage
  const carregarProgresso = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem('progresso')) || [];
      setProgresso(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    carregarProgresso(); // Carrega o progresso ao montar a tela
  }, []);

  // Função para calcular a porcentagem de leitura
  const calcularPorcentagem = (paginaAtual, totalPaginas) => {
    if (totalPaginas === 0) return '0%';
    return `${Math.floor((paginaAtual / totalPaginas) * 100)}%`;
  };

  // Renderiza cada item da lista de progresso
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate('LeituraHqScreen', { hq: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.porcentagem}>
        Progresso: {calcularPorcentagem(item.pagina, 100)} {/* Aqui seria o total de páginas */}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={progresso}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum HQ em progresso</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#131212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  porcentagem: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
  },
});
