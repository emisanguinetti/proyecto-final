# Naturaleza Argentina

App móvil (React Native + Expo) con registro, login, sesión persistente, mapa con marcadores y modal con información e imágenes.

## Cómo ponerla a andar

1. Crear el proyecto base de Expo:

```bash
npx create-expo-app@latest proyecto-final --template blank
cd proyecto-final
```

2. Instalar las librerías (usá `expo install` para que elija las versiones compatibles):

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @react-native-async-storage/async-storage react-native-maps expo-location @expo/vector-icons
```

Si al abrir la app Metro se queja de que falta `react-native-worklets`, instalalo con `npx expo install react-native-worklets`.

3. Copiar a la carpeta del proyecto la carpeta `src/` y el archivo `App.js` de este zip (reemplazá el `App.js` que trae Expo).

4. Correr la app y abrirla con Expo Go en el celular (escaneando el QR):

```bash
npx expo start
```

## Estructura

```
App.js                    Envuelve todo con AuthProvider y muestra AppNavigator
src/
  context/AuthContext.js  Usuario, registro, login, logout y sesión persistente (AsyncStorage)
  utils/validations.js    Validaciones del registro
  utils/colors.js         Paleta de colores
  data/places.js          Lugares: nombre, provincia, coordenadas, descripción, imágenes
  components/             AppInput, AppButton, PlaceModal (+ PlaceCard)
  screens/                Login, Register, Map, Places, Profile
  navigation/             StackNavigator (sin sesión), DrawerNavigator (con sesión),
                          TabNavigator (2 tabs), AppNavigator (decide cuál mostrar)
```

## Cómo funciona

- **Sin sesión**: Stack con Login y Registro.
- **Con sesión**: Drawer con "Inicio" (las 2 tabs: Mapa y Lugares) y "Perfil". El menú lateral tiene "Cerrar sesión".
- **Sesión persistente**: al abrir la app, `AuthContext` lee la sesión guardada en AsyncStorage. Mientras lo hace se muestra un indicador de carga.
- **Mapa**: un marcador por cada lugar de `places.js`. Al tocar uno se abre `PlaceModal` con las fotos (se deslizan) y la información.
- **Ubicación y permisos**: `MapScreen` pide permiso con `expo-location`. Si lo aceptás, se ve tu posición y aparece el botón "Mi ubicación". Si lo rechazás, se muestra un aviso con acceso a los ajustes.
- **Sin Touchable ni .map**: botones con `Pressable`, listas con `FlatList` y marcadores armados con un `for`.

## Antes de entregar

- Reemplazar las imágenes de relleno de `src/data/places.js` por fotos reales (carpeta `assets/places/` y `require(...)`).
- Revisar las coordenadas de cada lugar en Google Maps (son aproximadas).
- Las contraseñas se guardan sin cifrar en el celular. Para un trabajo de la escuela alcanza, pero conviene poder explicarlo en la defensa.
- Subir el proyecto a GitHub.

## Para la defensa oral (4 a 5 minutos)

1. Mostrar el registro con una validación fallando y luego una cuenta creada.
2. Login, cerrar la app por completo y volver a abrirla: la sesión sigue.
3. Mapa: aceptar el permiso, tocar un marcador, deslizar las fotos del modal.
4. Explicar en una pantalla `AuthContext` y cómo `AppNavigator` elige entre Stack y Drawer.
5. Cerrar sesión desde el Drawer.
