import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Linking, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AppButton from '../components/AppButton';
import AddPlaceForm from '../components/AddPlaceForm';
import PlaceModal from '../components/PlaceModal';
import ErrorBoundary from '../components/ErrorBoundary';
import { usePlaces } from '../context/PlacesContext';
import { notify } from '../utils/alert';
import { COLORS } from '../utils/colors';

// react-native-maps solo funciona en celular (Android / iOS).
// Lo cargamos únicamente si NO estamos en la web, y dentro de un try/catch,
// para que la app no se rompa si el módulo no está disponible.
const IS_WEB = Platform.OS === 'web';
let MapView = null;
let Marker = null;
if (!IS_WEB) {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  } catch (error) {
    MapView = null;
    Marker = null;
  }
}

// Región inicial: se ve toda la Argentina
const ARGENTINA_REGION = {
  latitude: -38.4,
  longitude: -63.6,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

// Mensaje que se muestra cuando no hay mapa disponible
function MapUnavailable() {
  return (
    <View style={styles.unavailable}>
      <Ionicons name="map-outline" size={60} color={COLORS.primaryMid} />
      <Text style={styles.unavailableTitle}>No pudimos cargar el mapa</Text>
      <Text style={styles.unavailableText}>
        Mientras tanto, podés ver los lugares en la pestaña "Lugares".
      </Text>
    </View>
  );
}

// Un lugar es válido para el mapa solo si tiene coordenadas numéricas
function hasValidCoords(place) {
  return (
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number' &&
    isFinite(place.latitude) &&
    isFinite(place.longitude)
  );
}

// ---------------------------------------------------------------------------
// Flujo para agregar un punto: 'idle' -> 'pick' (elegir ubicación) -> 'form' (datos y fotos)
// ---------------------------------------------------------------------------
function useAddPlaceFlow() {
  const { addPlace } = usePlaces();
  const [mode, setMode] = useState('idle'); // 'idle' | 'pick' | 'form'
  const [coord, setCoord] = useState(null);
  const [locating, setLocating] = useState(false);

  function start() {
    setCoord(null);
    setMode('pick');
  }

  function cancel() {
    setMode('idle');
    setCoord(null);
  }

  // Se llama al tocar el mapa; solo cuenta si estamos eligiendo ubicación
  function pickCoord(newCoord) {
    if (mode !== 'pick' || !newCoord) return;
    setCoord({ latitude: newCoord.latitude, longitude: newCoord.longitude });
    setMode('form');
  }

  async function useMyLocation() {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        notify('Permiso necesario', 'Sin permiso de ubicación, tocá el mapa para elegir el punto.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoord({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setMode('form');
    } catch (error) {
      notify('Ubicación', 'No pudimos obtener tu ubicación. Tocá el mapa para elegir el punto.');
    } finally {
      setLocating(false);
    }
  }

  async function save(data) {
    await addPlace({
      id: Date.now(),
      name: data.name,
      province: 'Aporte de la comunidad',
      type: 'Mi aporte',
      description: data.comment,
      latitude: coord.latitude,
      longitude: coord.longitude,
      images: data.photos,
      mine: true,
    });
    setMode('idle');
    setCoord(null);
    notify('¡Listo!', 'Tu punto turístico se agregó al mapa.');
  }

  return { mode, coord, locating, start, cancel, pickCoord, useMyLocation, save };
}

// Botón "Agregar punto", cartel de selección y formulario (se usa en el mapa web y en el nativo)
function AddPlaceUI({ flow }) {
  if (flow.mode === 'form' && flow.coord) {
    return <AddPlaceForm coord={flow.coord} onSave={flow.save} onCancel={flow.cancel} />;
  }

  if (flow.mode === 'pick') {
    return (
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Elegí la ubicación</Text>
        <Text style={styles.bannerText}>Tocá el mapa donde está el punto turístico.</Text>
        <AppButton
          title="Usar mi ubicación actual"
          onPress={flow.useMyLocation}
          loading={flow.locating}
        />
        <AppButton title="Cancelar" variant="outline" onPress={flow.cancel} />
      </View>
    );
  }

  return (
    <View style={styles.addFab}>
      <AppButton title="+ Agregar punto" onPress={flow.start} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Mapa web: Leaflet + OpenStreetMap dentro de un iframe
// ---------------------------------------------------------------------------
function buildLeafletHtml(places) {
  const data = [];
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    if (!hasValidCoords(place)) continue;
    data.push({
      id: place.id,
      name: place.name,
      province: place.province,
      lat: place.latitude,
      lng: place.longitude,
      mine: place.mine === true,
    });
  }
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; }
  .leaflet-tooltip { font-weight: 700; color: #1b4332; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var places = ${json};
  var map = new L.Map('map').setView([-38.4, -63.6], 4);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  for (var i = 0; i < places.length; i++) {
    (function (p) {
      var marker = L.circleMarker([p.lat, p.lng], {
        radius: 11,
        color: '#1b4332',
        weight: 3,
        fillColor: p.mine ? '#95d5b2' : '#40916c',
        fillOpacity: 0.95
      }).addTo(map);
      marker.bindTooltip(p.name + ' · ' + p.province);
      marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        window.parent.postMessage({ placeId: p.id }, '*');
      });
    })(places[i]);
  }
  map.on('click', function (e) {
    window.parent.postMessage({ pick: { latitude: e.latlng.lat, longitude: e.latlng.lng } }, '*');
  });
</script>
</body>
</html>`;
}

function WebMap() {
  const { places } = usePlaces();
  const flow = useAddPlaceFlow();
  const [selectedPlace, setSelectedPlace] = useState(null);

  // El iframe nos avisa cuando se toca un marcador o un punto vacío del mapa
  useEffect(() => {
    function onMessage(event) {
      const data = event.data;
      if (!data) return;

      if (data.pick) {
        flow.pickCoord(data.pick);
        return;
      }

      if (typeof data.placeId === 'number' && flow.mode === 'idle') {
        for (let i = 0; i < places.length; i++) {
          if (places[i].id === data.placeId) {
            setSelectedPlace(places[i]);
            return;
          }
        }
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  });

  return (
    <View style={styles.container}>
      {React.createElement('iframe', {
        srcDoc: buildLeafletHtml(places),
        title: 'Mapa de lugares',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        },
      })}

      <AddPlaceUI flow={flow} />

      <PlaceModal
        visible={selectedPlace !== null}
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Mapa nativo (Android / iOS)
// ---------------------------------------------------------------------------
function NativeMap() {
  const { places } = usePlaces();
  const flow = useAddPlaceFlow();
  const mapRef = useRef(null);
  const [permission, setPermission] = useState('pending'); // 'pending' | 'granted' | 'denied'
  const [myLocation, setMyLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Al abrir la pantalla pedimos permiso de ubicación.
  // "active" evita actualizar el estado si la pantalla ya se cerró.
  useEffect(() => {
    let active = true;

    async function askLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!active) return;
        if (status !== 'granted') {
          setPermission('denied');
          return;
        }
        setPermission('granted');
      } catch (error) {
        if (active) setPermission('denied');
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({});
        if (!active) return;
        setMyLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error) {
        // Sin GPS disponible: el mapa funciona igual, solo no podemos centrarlo en el usuario
      }
    }

    askLocation();
    return () => {
      active = false;
    };
  }, []);

  function goToMyLocation() {
    if (!myLocation || !mapRef.current) return;
    mapRef.current.animateToRegion(
      { ...myLocation, latitudeDelta: 0.5, longitudeDelta: 0.5 },
      800
    );
  }

  function openPlace(place) {
    if (flow.mode === 'idle') setSelectedPlace(place);
  }

  // Armamos los marcadores con un for (un marcador por cada lugar válido).
  // Los puntos agregados por el usuario tienen un verde más claro.
  function buildMarkers() {
    const markers = [];
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      if (!hasValidCoords(place)) continue;
      markers.push(
        <Marker
          key={place.id}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          title={place.name}
          description={place.province}
          pinColor={place.mine ? COLORS.primaryLight : COLORS.primary}
          onPress={() => openPlace(place)}
        />
      );
    }
    return markers;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={ARGENTINA_REGION}
        showsUserLocation={permission === 'granted'}
        onPress={(event) => flow.pickCoord(event.nativeEvent.coordinate)}
      >
        {buildMarkers()}
      </MapView>

      {permission === 'denied' && flow.mode === 'idle' ? (
        <View style={styles.permissionBanner}>
          <Text style={styles.bannerText}>
            No tenemos permiso de ubicación, así que no podemos mostrar dónde estás.
          </Text>
          <AppButton
            title="Abrir ajustes"
            variant="outline"
            onPress={() => Linking.openSettings()}
          />
        </View>
      ) : null}

      {permission === 'granted' && myLocation && flow.mode === 'idle' ? (
        <View style={styles.fab}>
          <AppButton title="Mi ubicación" onPress={goToMyLocation} />
        </View>
      ) : null}

      <AddPlaceUI flow={flow} />

      <PlaceModal
        visible={selectedPlace !== null}
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </View>
  );
}

export default function MapScreen() {
  if (IS_WEB) {
    return (
      <ErrorBoundary
        title="No pudimos cargar el mapa"
        message="Revisá tu conexión a internet y volvé a intentar."
      >
        <WebMap />
      </ErrorBoundary>
    );
  }
  if (!MapView || !Marker) {
    return <MapUnavailable />;
  }
  return (
    <ErrorBoundary
      title="No pudimos cargar el mapa"
      message="Revisá tu conexión y volvé a intentar."
    >
      <NativeMap />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  banner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 6,
  },
  permissionBanner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  bannerText: {
    color: COLORS.text,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
  },
  addFab: {
    position: 'absolute',
    bottom: 20,
    left: 16,
  },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 28,
  },
  unavailableTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  unavailableText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
