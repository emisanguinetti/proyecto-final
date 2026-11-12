import { Modal, View, Text, FlatList, Image, StyleSheet, useWindowDimensions } from 'react-native';
import AppButton from './AppButton';
import { COLORS } from '../utils/colors';

// Las imágenes pueden ser una URL (texto) o un archivo local (require(...))
function toImageSource(image) {
  return typeof image === 'string' ? { uri: image } : image;
}

// Modal con la información y las imágenes de un lugar.
// Se muestra cuando visible es true; si place es null no dibuja contenido.
export default function PlaceModal({ visible, place, onClose }) {
  const { width } = useWindowDimensions();
  const imageWidth = width - 40; // 20 de margen a cada lado

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {place ? (
          <View style={styles.card}>
            <FlatList
              data={place.images || []}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item }) => (
                <Image
                  source={toImageSource(item)}
                  style={{ width: imageWidth, height: 220, backgroundColor: COLORS.tint }}
                  resizeMode="cover"
                />
              )}
            />
            <View style={styles.body}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{place.type}</Text>
              </View>
              <Text style={styles.title}>{place.name}</Text>
              <Text style={styles.subtitle}>{place.province}</Text>
              <Text style={styles.description}>{place.description}</Text>
              <Text style={styles.hint}>Deslizá las fotos hacia el costado para ver más</Text>
              <AppButton title="Cerrar" onPress={onClose} />
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11,37,24,0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: 'hidden',
  },
  body: {
    padding: 20,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.tint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  chipText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.primaryMid,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: COLORS.placeholder,
    marginBottom: 14,
  },
});
