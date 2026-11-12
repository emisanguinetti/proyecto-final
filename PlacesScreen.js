import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlaceCard from '../components/PlaceCard';
import PlaceModal from '../components/PlaceModal';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../utils/colors';

export default function PlacesScreen() {
  const { places } = usePlaces();
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PlaceCard place={item} onPress={() => setSelectedPlace(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Ionicons name="trail-sign-outline" size={26} color={COLORS.primary} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Explorá la naturaleza</Text>
              <Text style={styles.headerSubtitle}>Tocá un lugar para ver sus fotos</Text>
            </View>
          </View>
        }
      />

      <PlaceModal
        visible={selectedPlace !== null}
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tint,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
