import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

// Campo de texto con etiqueta, ícono opcional y mensaje de error.
// Recibe cualquier prop de TextInput (value, onChangeText, secureTextEntry, etc.)
export default function AppInput({ label, icon, error, ...props }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {icon ? (
          <Ionicons name={icon} size={20} color={COLORS.primaryMid} style={styles.icon} />
        ) : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  fieldError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: COLORS.text,
  },
  error: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
