import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

// Las imágenes pueden ser una URL (texto) o un archivo local (require(...))
function toImageSource(image) {
  return typeof image === 'string' ? { uri: image } : image;
}

// Tarjeta de un lugar para la lista. Al tocarla se ejecuta onPress.
export default function PlaceCard({ place, onPress }) {
  const hasImage = place.images && place.images.length > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {hasImage ? (
        <Image source={toImageSource(place.images[0])} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imageEmpty]}>
          <Ionicons name="image-outline" size={40} color={COLORS.primaryLight} />
        </View>
      )}

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{place.type}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {place.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={15} color={COLORS.primaryMid} />
          <Text style={styles.province}>{place.province}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {place.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.tint,
  },
  imageEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 8,
  },
  province: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryMid,
    marginLeft: 3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textLight,
  },
});
