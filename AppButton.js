import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

// Botón reutilizable.
// variant: 'primary' (relleno verde), 'outline' (solo borde), 'danger' (rojo) o 'text' (solo texto, como un link)
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const isDisabled = disabled || loading;
  const loaderColor = variant === 'primary' || variant === 'danger' ? COLORS.white : COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        variant === 'text' && styles.textButton,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <Text
          style={[
            styles.text,
            (variant === 'primary' || variant === 'danger') && styles.textLight,
            (variant === 'outline' || variant === 'text') && styles.textGreen,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textLight: {
    color: COLORS.white,
  },
  textGreen: {
    color: COLORS.primary,
  },
});
