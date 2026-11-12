import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

// Cabecera verde que comparten las pantallas de Login y Registro
export default function AuthHeader({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <View style={styles.logo}>
        <Ionicons name="leaf" size={38} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 70,
    paddingBottom: 56,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.tint,
    marginTop: 4,
  },
});
