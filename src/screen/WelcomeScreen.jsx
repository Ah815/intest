import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome to KDys Lab Pvt. Ltd.</Text>
      <Text style={styles.subtitle}>Take your career to the next level with KDys Lab Pvt. Ltd.</Text>

      
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },
 title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#111',
    textAlign: 'center',
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
});
