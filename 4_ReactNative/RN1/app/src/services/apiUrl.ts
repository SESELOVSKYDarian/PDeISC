import Constants from "expo-constants";
import { Platform } from "react-native";

const PUERTO = 3001;

// misma PC que Metro: saco su IP del hostUri; el emulador Android usa 10.0.2.2
export function apiUrl(): string {
  if (Platform.OS === "web") return `http://${window.location.hostname}:${PUERTO}/api`;
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  if (host) return `http://${host}:${PUERTO}/api`;
  return `http://${Platform.OS === "android" ? "10.0.2.2" : "localhost"}:${PUERTO}/api`;
}
