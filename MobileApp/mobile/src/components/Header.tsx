import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icons } from './Icons';
import { supabase } from '../services/supabaseService';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ title }) => {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener in App.tsx will handle the navigation
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
        borderBottomColor: isDarkMode ? '#444444' : '#eee'
      }
    ]}>
      <Text style={[
        styles.title,
        { color: isDarkMode ? '#fff' : '#333' }
      ]}>
        {title}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Icons.Sun size={24} color={isDarkMode ? '#FFD700' : '#666'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Icons.LogOut size={24} color={isDarkMode ? '#fff' : '#666'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
  },
});
