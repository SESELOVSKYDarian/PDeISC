import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Copy, ExternalLink, MapPin, Search } from "lucide-react-native";
import { ActivityIndicator, Linking, View } from "react-native";
import { Aviso } from "@/components/common/Aviso";
import { Boton } from "@/components/common/Boton";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { PermisoGate } from "@/components/common/PermisoGate";
import { Valor } from "@/components/common/Valor";
import { useMensaje } from "@/hooks/useMensaje";
import { useTema } from "@/theme/ThemeProvider";
import { decimales } from "@/utils/formato";
import { useUbicacion } from "./useUbicacion";

export default function UbicacionScreen() {
  const { colores } = useTema();
  const { permiso, pedirPermiso, posicion, error, direccion, buscando, buscarDireccion } = useUbicacion();
  const { mensaje, mostrar } = useMensaje();

  if (!permiso) {
    return (
      <Pantalla>
        <ActivityIndicator color={colores.acento} />
      </Pantalla>
    );
  }

  if (!permiso.granted) {
    return (
      <Pantalla>
        <PermisoGate
          icono={MapPin}
          color={colores.acento}
          titulo="Ubicación"
          detalle="Necesitamos tu ubicación para mostrar el GPS en vivo."
          puedePreguntar={permiso.canAskAgain}
          onPermitir={pedirPermiso}
        />
      </Pantalla>
    );
  }

  const c = posicion?.coords;
  const kmh = c && c.speed !== null && c.speed >= 0 ? c.speed * 3.6 : 0;

  async function copiar() {
    if (!c) return;
    await Clipboard.setStringAsync(`${c.latitude}, ${c.longitude}`);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    mostrar("exito", "Coordenadas copiadas");
  }

  function abrirMapa() {
    if (!c) return;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`).catch(() =>
      mostrar("error", "No pude abrir el mapa"),
    );
  }

  return (
    <Pantalla>
      {error ? <Aviso clase="error" texto={error} /> : null}
      {mensaje ? <Aviso clase={mensaje.clase} texto={mensaje.texto} /> : null}

      <Valor numero={decimales(kmh, 0)} unidad="km/h" etiqueta={c ? "Velocidad" : "Buscando señal GPS…"} />

      <Grupo titulo="Posición">
        <Fila etiqueta="Latitud" valor={c ? decimales(c.latitude, 6) : "–"} />
        <Fila etiqueta="Longitud" valor={c ? decimales(c.longitude, 6) : "–"} />
        <Fila etiqueta="Altitud" valor={c?.altitude != null ? `${decimales(c.altitude, 0)} m` : "–"} />
        <Fila etiqueta="Precisión" valor={c?.accuracy != null ? `± ${decimales(c.accuracy, 0)} m` : "–"} />
        <Fila etiqueta="Rumbo" valor={c?.heading != null && c.heading >= 0 ? `${decimales(c.heading, 0)}°` : "–"} />
      </Grupo>

      {direccion ? (
        <Grupo titulo="Dirección">
          <Fila etiqueta="Cerca de" valor={direccion} />
        </Grupo>
      ) : null}

      <View style={{ gap: 12 }}>
        <Boton texto="Ver dirección" icono={Search} cargando={buscando} deshabilitado={!c} onPress={buscarDireccion} />
        <Boton texto="Abrir en mapas" icono={ExternalLink} variante="suave" deshabilitado={!c} onPress={abrirMapa} />
        <Boton texto="Copiar coordenadas" icono={Copy} variante="suave" deshabilitado={!c} onPress={copiar} />
      </View>
    </Pantalla>
  );
}
