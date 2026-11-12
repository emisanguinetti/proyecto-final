import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from './AppInput';
import AppButton from './AppButton';
import { notify } from '../utils/alert';
import { COLORS } from '../utils/colors';

// expo-image-picker se carga con protección: si el paquete no está, la app no se rompe
let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  ImagePicker = null;
}

const MAX_PHOTOS = 3;
const IS_WEB = Platform.OS === 'web';

// Formulario para agregar un punto turístico. Se dibuja encima del mapa (no es un Modal,
// porque en iOS la cámara no puede abrirse desde adentro de un Modal).
export default function AddPlaceForm({ coord, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function addPhotos(assets) {
    let next = photos.slice();
    for (let i = 0; i < assets.length; i++) {
      if (next.length >= MAX_PHOTOS) break;
      next = next.concat([assets[i].uri]);
    }
    setPhotos(next);
  }

  async function takePhoto() {
    if (!ImagePicker) {
      notify('Cámara no disponible', 'Falta instalar el paquete expo-image-picker.');
      return;
    }
    if (photos.length >= MAX_PHOTOS) {
      notify('Límite de fotos', 'Podés agregar hasta ' + MAX_PHOTOS + ' fotos.');
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        notify('Permiso necesario', 'Necesitamos permiso para usar la cámara.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (!result.canceled && result.assets) addPhotos(result.assets);
    } catch (e) {
      notify('Error', 'No pudimos abrir la cámara.');
    }
  }

  async function pickFromGallery() {
    if (!ImagePicker) {
      notify('Galería no disponible', 'Falta instalar el paquete expo-image-picker.');
      return;
    }
    if (photos.length >= MAX_PHOTOS) {
      notify('Límite de fotos', 'Podés agregar hasta ' + MAX_PHOTOS + ' fotos.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.6,
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS - photos.length,
      });
      if (!result.canceled && result.assets) addPhotos(result.assets);
    } catch (e) {
      notify('Error', 'No pudimos abrir la galería.');
    }
  }

  async function handleSave() {
    const newErrors = {
      name: name.trim().length < 3 ? 'Poné un nombre de al menos 3 letras' : '',
      comment: comment.trim().length === 0 ? 'Escribí un comentario sobre el lugar' : '',
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.comment) return;

    setSaving(true);
    await onSave({ name: name.trim(), comment: comment.trim(), photos: photos });
    setSaving(false);
  }

  // Miniaturas de las fotos elegidas (armadas con un for)
  function buildThumbs() {
    const thumbs = [];
    for (let i = 0; i < photos.length; i++) {
      thumbs.push(<Image key={photos[i]} source={{ uri: photos[i] }} style={styles.thumb} />);
    }
    return thumbs;
  }

  return (
    <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nuevo punto turístico</Text>

        <View style={styles.coordBox}>
          <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
          <Text style={styles.coordText}>
            Ubicación: {coord.latitude.toFixed(4)}, {coord.longitude.toFixed(4)}
          </Text>
        </View>

        <AppInput
          icon="flag-outline"
          placeholder="Nombre del lugar"
          value={name}
          onChangeText={setName}
          autoCapitalize="sentences"
          error={errors.name}
        />
        <AppInput
          placeholder="Tu comentario sobre el lugar"
          value={comment}
          onChangeText={setComment}
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
          error={errors.comment}
          style={styles.multiline}
        />

        <Text style={styles.sectionLabel}>
          Fotos ({photos.length}/{MAX_PHOTOS})
        </Text>
        <View style={styles.photoButtons}>
          {IS_WEB ? null : (
            <View style={styles.photoButton}>
              <AppButton title="Cámara" variant="outline" onPress={takePhoto} />
            </View>
          )}
          <View style={styles.photoButton}>
            <AppButton title="Galería" variant="outline" onPress={pickFromGallery} />
          </View>
        </View>

        {photos.length > 0 ? (
          <View style={styles.thumbRow}>{buildThumbs()}</View>
        ) : (
          <Text style={styles.noPhotos}>Todavía no agregaste fotos</Text>
        )}
        {photos.length > 0 ? (
          <AppButton title="Quitar fotos" variant="text" onPress={() => setPhotos([])} />
        ) : null}

        <View style={styles.actions}>
          <AppButton title="Guardar punto" onPress={handleSave} loading={saving} />
          <AppButton title="Cancelar" variant="text" onPress={onCancel} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 14,
  },
  coordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tint,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  coordText: {
    marginLeft: 8,
    color: COLORS.primaryDark,
    fontWeight: '600',
    fontSize: 14,
  },
  multiline: {
    flex: 1,
    minHeight: 100,
    paddingVertical: 13,
    fontSize: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  photoButton: {
    flex: 1,
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  thumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: COLORS.tint,
  },
  noPhotos: {
    color: COLORS.placeholder,
    fontSize: 13,
    marginTop: 12,
  },
  actions: {
    marginTop: 24,
  },
});
