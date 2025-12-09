import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const route = useRoute();
  const showBottomNav = ['Dashboard', 'History', 'Upgrade'].includes(route.name);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Resume Blaster</Text>
      </View>
      <View style={styles.inner}>{children}</View>
      {showBottomNav && <BottomNav />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
});
