import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
  try {
    // Basic client-side validation
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const response = await fetch(`https://perfume-backend-nine.vercel.app/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || "Signup failed. Please try again.";
      throw new Error(message);
    }

    setError("");
    Alert.alert(
      "Signup Successful",
      "You can now log in with your credentials.",
      [{ text: "OK", onPress: () => navigation.navigate('Login') }]
    );

  } catch (err) {
    const errMsg = err.message || "An unexpected error occurred";
    setError(errMsg);
    Alert.alert("Signup Error", errMsg);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Welcome</Text>
      <Text style={styles.login}>Create your account</Text>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <TextInput
        style={styles.inputContainer}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.inputContainer}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputContainer}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
        <Text style={styles.loginText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signin}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },
  hello: {
    fontSize: width * 0.08, // ~32 on standard width
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: height * 0.015,
  },
  login: {
    fontSize: width * 0.045, // ~18
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  inputContainer: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: width * 0.03, // ~12
    height: height * 0.065,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loginButton: {
    backgroundColor: '#1e90ff',
    height: height * 0.065,
    borderRadius: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.025,
    elevation: 2,
  },
  loginText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  signin: {
    fontSize: width * 0.04,
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: height * 0.015,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontSize: width * 0.035,
  },
});