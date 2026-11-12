import React, { createContext, useContext, useEffect, useState } from 'react';
import { PLACES } from '../data/places';

// AsyncStorage guarda los puntos que agrega el usuario para que sigan al reabrir la app
let AsyncStorage = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

const STORAGE_KEY = 'user_places_v1';

export const PlacesContext = createContext({ places: PLACES, addPlace: async () => {} });

// Junta los lugares fijos (data/places.js) con los que agrega el usuario
export function PlacesProvider({ children }) {
  const [userPlaces, setUserPlaces] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!AsyncStorage) return;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw || !active) return;
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) setUserPlaces(saved);
      } catch (e) {
        // si no se puede leer, arrancamos sin puntos guardados
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function addPlace(place) {
    const next = userPlaces.concat([place]);
    setUserPlaces(next);
    if (!AsyncStorage) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // el punto igual queda visible mientras la app esté abierta
    }
  }

  const places = PLACES.concat(userPlaces);

  return (
    <PlacesContext.Provider value={{ places, addPlace }}>{children}</PlacesContext.Provider>
  );
}

export function usePlaces() {
  return useContext(PlacesContext);
}
