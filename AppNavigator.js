import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import DrawerNavigator from './DrawerNavigator';
import StackNavigator from './StackNavigator';
import { COLORS } from '../utils/colors';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Con sesión: Drawer (que contiene los Tabs). Sin sesión: Stack de Login / Registro.
  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <StackNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
