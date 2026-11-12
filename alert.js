import { Alert, Platform } from 'react-native';

// Alert.alert no hace nada en la versión web, así que ahí usamos window.alert / window.confirm.

export function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(title + '\n\n' + message);
    return;
  }
  Alert.alert(title, message);
}

// Pregunta de confirmación (por ejemplo para cerrar sesión)
export function confirmAction(title, message, confirmText, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(title + '\n\n' + message)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
