import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Colors, API_BASE_URL, STORAGE_KEYS } from '../constants/Config';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, email);
        setIsLoggedIn(true);
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Login Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.ADMIN_EMAIL);
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to Moda Scanner</Text>
          <Text style={styles.subtitle}>Gate Management System</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => router.push('/scanner')}
          >
            <Text style={styles.buttonText}>START SCANNING</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>Admin Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    color: Colors.text,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.primary,
    fontSize: 16,
    marginTop: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  menuContainer: {
    gap: 20,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  loginBox: {
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loginTitle: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.error,
    fontSize: 14,
  },
});
