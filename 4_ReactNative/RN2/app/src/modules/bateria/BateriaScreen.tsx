import { BatteryState, useBatteryLevel, useBatteryState, useLowPowerMode } from "expo-battery";
import { getIpAddressAsync, NetworkStateType, useNetworkState } from "expo-network";
import { useEffect, useState } from "react";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { Valor } from "@/components/common/Valor";
import { useTema } from "@/theme/ThemeProvider";
import { BarraNivel } from "./BarraNivel";

const TEXTO_ESTADO: Record<BatteryState, string> = {
  [BatteryState.UNKNOWN]: "Desconocido",
  [BatteryState.UNPLUGGED]: "Descargando",
  [BatteryState.CHARGING]: "Cargando",
  [BatteryState.FULL]: "Completa",
  [BatteryState.NOT_CHARGING]: "Enchufada, sin cargar",
};

const TEXTO_RED: Partial<Record<NetworkStateType, string>> = {
  [NetworkStateType.WIFI]: "Wi-Fi",
  [NetworkStateType.CELLULAR]: "Datos móviles",
  [NetworkStateType.ETHERNET]: "Ethernet",
  [NetworkStateType.VPN]: "VPN",
  [NetworkStateType.BLUETOOTH]: "Bluetooth",
  [NetworkStateType.NONE]: "Sin conexión",
};

export default function BateriaScreen() {
  const { colores } = useTema();
  const nivel = useBatteryLevel();
  const estado = useBatteryState();
  const ahorro = useLowPowerMode();
  const red = useNetworkState();
  const [ip, setIp] = useState("–");

  // la IP cambia cuando cambia la red
  useEffect(() => {
    getIpAddressAsync()
      .then(setIp)
      .catch(() => setIp("–"));
  }, [red.type]);

  const conocido = nivel >= 0;
  const porcentaje = conocido ? Math.round(nivel * 100) : 0;
  const color = !conocido ? colores.textoSecundario : nivel <= 0.2 ? colores.peligro : colores.exito;

  return (
    <Pantalla>
      <Valor numero={conocido ? String(porcentaje) : "–"} unidad="%" etiqueta={TEXTO_ESTADO[estado]} />
      <BarraNivel nivel={conocido ? nivel : 0} color={color} />

      <Grupo titulo="Batería">
        <Fila etiqueta="Estado" valor={TEXTO_ESTADO[estado]} />
        <Fila etiqueta="Ahorro de energía" valor={ahorro ? "Activado" : "Desactivado"} />
      </Grupo>

      <Grupo titulo="Red">
        <Fila etiqueta="Conexión" valor={red.type ? (TEXTO_RED[red.type] ?? "Otra") : "–"} />
        <Fila
          etiqueta="Internet"
          valor={red.isInternetReachable === undefined ? "–" : red.isInternetReachable ? "Disponible" : "Sin acceso"}
          color={red.isInternetReachable === false ? colores.peligro : undefined}
        />
        <Fila etiqueta="Dirección IP" valor={ip} />
      </Grupo>
    </Pantalla>
  );
}
