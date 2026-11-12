// Cada función devuelve un texto con el error, o '' si el valor es válido.

export function validateUsername(username) {
  const value = username.trim();
  if (value.length === 0) return 'El usuario es obligatorio';
  if (value.length < 3) return 'El usuario debe tener al menos 3 caracteres';
  if (value.length > 20) return 'El usuario no puede superar los 20 caracteres';
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return 'Solo se permiten letras, números y guión bajo';
  }
  return '';
}

export function validateEmail(email) {
  const value = email.trim();
  if (value.length === 0) return 'El correo es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresá un correo válido';
  return '';
}

export function validatePassword(password) {
  if (password.length === 0) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (!/[a-zA-Z]/.test(password)) return 'La contraseña debe incluir al menos una letra';
  if (!/[0-9]/.test(password)) return 'La contraseña debe incluir al menos un número';
  return '';
}

export function validateConfirmPassword(password, confirm) {
  if (confirm.length === 0) return 'Repetí la contraseña';
  if (password !== confirm) return 'Las contraseñas no coinciden';
  return '';
}
