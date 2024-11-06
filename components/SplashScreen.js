// components/SplashScreen.js

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Muda para a LoginScreen após o tempo
    }, 3000);

    const animate = () => {
      scaleValue.setValue(1);
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(animate);
      });
    };

    animate();

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { transform: [{ scale: scaleValue }] }]}
        resizeMode="contain"
      />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});
