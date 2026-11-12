import { View, Text, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import { notify, confirmAction } from '../utils/alert';

const Drawer = createDrawerNavigator();

// Contenido del menú lateral: cabecera verde con el usuario, las pantallas y cerrar sesión
function CustomDrawerContent(props) {
  const { user, logout } = useAuth();
  const email = user && user.email ? user.email : '';
  const initial = email ? email.charAt(0).toUpperCase() : '?';

  function confirmLogout() {
    confirmAction('Cerrar sesión', '¿Seguro que querés salir?', 'Salir', async () => {
      try {
        await logout();
      } catch (error) {
        notify('Error', error.message);
      }
    });
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.hello}>¡Hola!</Text>
        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>
      </View>

      <View style={styles.items}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <DrawerItem
          label="Cerrar sesión"
          labelStyle={styles.logoutLabel}
          icon={({ size }) => <Ionicons name="log-out-outline" size={size} color={COLORS.error} />}
          onPress={confirmLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// Navegación para cuando SÍ hay sesión
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '800' },
        drawerActiveTintColor: COLORS.primaryDark,
        drawerActiveBackgroundColor: COLORS.tint,
        drawerInactiveTintColor: COLORS.textLight,
        drawerLabelStyle: { fontWeight: '700', marginLeft: -8 },
        drawerStyle: { backgroundColor: COLORS.background, width: 290 },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={TabNavigator}
        options={{
          title: 'Naturaleza Argentina',
          drawerLabel: 'Inicio',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: 0,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderBottomRightRadius: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  hello: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  email: {
    fontSize: 13,
    color: COLORS.tint,
    marginTop: 2,
  },
  items: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginHorizontal: 12,
    paddingTop: 6,
    marginBottom: 12,
  },
  logoutLabel: {
    color: COLORS.error,
    fontWeight: '700',
    marginLeft: -8,
  },
});
