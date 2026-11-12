import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import AuthHeader from '../components/AuthHeader';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validations';
import { COLORS } from '../utils/colors';
import { notify } from '../utils/alert';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password || newErrors.confirm) return;

    try {
      setLoading(true);
      await register(email.trim(), password);
      notify(
        '¡Registro exitoso!',
        'Si tenés habilitada la confirmación por correo en Supabase, revisá tu casilla para confirmar la cuenta.'
      );
    } catch (error) {
      notify('Error de registro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader title="Crear cuenta" subtitle="Sumate a la comunidad naturaleza" />

        <View style={styles.form}>
          <AppInput
            icon="mail-outline"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <AppInput
            icon="lock-closed-outline"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <AppInput
            icon="shield-checkmark-outline"
            placeholder="Repetir contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirm}
          />

          <AppButton title="Registrarme" onPress={handleRegister} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tenés cuenta?</Text>
            <AppButton
              title="Iniciá sesión"
              variant="text"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
  },
  form: {
    padding: 24,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});
