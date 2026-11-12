import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import { COLORS } from '../utils/colors';
import { notify } from '../utils/alert';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      notify('Error', error.message);
    }
  };

  const email = user && user.email ? user.email : '';
  const initial = email ? email.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <Text style={styles.label}>Correo electrónico</Text>
        <View style={styles.emailRow}>
          <Ionicons name="mail-outline" size={18} color={COLORS.primaryMid} />
          <Text style={styles.emailText}>{email || 'No disponible'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton title="Cerrar sesión" variant="danger" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: COLORS.tint,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 38,
    fontWeight: '800',
  },
  label: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  emailText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  buttonContainer: {
    width: '100%',
  },
});
