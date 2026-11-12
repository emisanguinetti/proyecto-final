import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';
import { COLORS } from '../utils/colors';

// Si algo dentro de este componente falla al dibujarse (por ejemplo el mapa),
// en lugar de cerrar la app mostramos un mensaje y un botón para reintentar.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log('ErrorBoundary:', error && error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={56} color={COLORS.primaryMid} />
          <Text style={styles.title}>{this.props.title || 'Algo salió mal'}</Text>
          <Text style={styles.text}>
            {this.props.message || 'No pudimos mostrar esta pantalla.'}
          </Text>
          <AppButton title="Reintentar" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
});
