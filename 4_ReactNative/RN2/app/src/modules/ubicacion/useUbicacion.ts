import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

function armarDireccion(a: Location.LocationGeocodedAddress): string {
  const calle = [a.street, a.streetNumber].filter(Boolean).join(" ");
  return [calle || a.name, a.city ?? a.subregion, a.region].filter(Boolean).join(", ");
}

export function useUbicacion() {
  const [permiso, pedirPermiso] = Location.useForegroundPermissions();
  const [posicion, setPosicion] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  // sigo el GPS mientras haya permiso
  useEffect(() => {
    if (!permiso?.granted) return;
    let suscripcion: Location.LocationSubscription | null = null;
    let cancelado = false;

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
      setPosicion,
      (mensaje) => setError(mensaje),
    )
      .then((s) => {
        if (cancelado) s.remove();
        else suscripcion = s;
      })
      .catch(() => setError("No pude leer el GPS. Revisá que la ubicación esté activada."));

    return () => {
      cancelado = true;
      suscripcion?.remove();
    };
  }, [permiso?.granted]);

  const buscarDireccion = useCallback(async () => {
    if (!posicion) return;
    setBuscando(true);
    try {
      const { latitude, longitude } = posicion.coords;
      const resultado = await Location.reverseGeocodeAsync({ latitude, longitude });
      setDireccion(resultado[0] ? armarDireccion(resultado[0]) : "Sin dirección para este punto");
    } catch {
      setDireccion("No se pudo obtener la dirección (¿hay internet?)");
    } finally {
      setBuscando(false);
    }
  }, [posicion]);

  return { permiso, pedirPermiso, posicion, error, direccion, buscando, buscarDireccion };
}
