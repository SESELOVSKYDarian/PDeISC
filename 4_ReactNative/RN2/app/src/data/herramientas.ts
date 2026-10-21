import {
  Activity,
  BatteryCharging,
  Camera,
  Clipboard,
  Compass,
  Fingerprint,
  Image,
  MapPin,
  Orbit,
  ScanLine,
  Smartphone,
  Vibrate,
  LucideIcon,
} from "lucide-react-native";

export interface Herramienta {
  ruta: string;
  titulo: string;
  detalle: string;
  icono: LucideIcon;
  color: string;
  seccion: string;
}

// unica fuente de verdad: la usan el inicio y el router
export const herramientas: Herramienta[] = [
  { ruta: "camara", titulo: "Cámara", detalle: "Fotos y video", icono: Camera, color: "#8E8E93", seccion: "Imagen" },
  { ruta: "escaner", titulo: "Lector de códigos", detalle: "QR y códigos de barras", icono: ScanLine, color: "#34C759", seccion: "Imagen" },
  { ruta: "galeria", titulo: "Galería", detalle: "Elegir o sacar una foto", icono: Image, color: "#FF9500", seccion: "Imagen" },
  { ruta: "ubicacion", titulo: "Ubicación y GPS", detalle: "Coordenadas en vivo", icono: MapPin, color: "#007AFF", seccion: "Movimiento" },
  { ruta: "acelerometro", titulo: "Acelerómetro", detalle: "Fuerza en tres ejes", icono: Activity, color: "#FF3B30", seccion: "Movimiento" },
  { ruta: "giroscopio", titulo: "Giroscopio", detalle: "Velocidad de giro", icono: Orbit, color: "#AF52DE", seccion: "Movimiento" },
  { ruta: "brujula", titulo: "Brújula y presión", detalle: "Magnetómetro y barómetro", icono: Compass, color: "#30B0C7", seccion: "Movimiento" },
  { ruta: "biometria", titulo: "Biometría", detalle: "Huella o rostro", icono: Fingerprint, color: "#FF2D55", seccion: "Seguridad" },
  { ruta: "bateria", titulo: "Batería y red", detalle: "Energía y conexión", icono: BatteryCharging, color: "#30D158", seccion: "Teléfono" },
  { ruta: "vibracion", titulo: "Vibración", detalle: "Respuesta háptica", icono: Vibrate, color: "#5856D6", seccion: "Teléfono" },
  { ruta: "dispositivo", titulo: "Dispositivo", detalle: "Modelo, sistema y memoria", icono: Smartphone, color: "#636366", seccion: "Teléfono" },
  { ruta: "portapapeles", titulo: "Portapapeles", detalle: "Copiar, pegar y compartir", icono: Clipboard, color: "#FFCC00", seccion: "Teléfono" },
];

export function seccionesDeHerramientas(): { nombre: string; items: Herramienta[] }[] {
  const nombres = [...new Set(herramientas.map((h) => h.seccion))];
  return nombres.map((nombre) => ({ nombre, items: herramientas.filter((h) => h.seccion === nombre) }));
}
