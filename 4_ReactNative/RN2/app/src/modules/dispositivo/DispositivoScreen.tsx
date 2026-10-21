import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { mbOGb } from "@/utils/formato";

const TIPO_DISPOSITIVO: Record<number, string> = {
  [Device.DeviceType.PHONE]: "Teléfono",
  [Device.DeviceType.TABLET]: "Tablet",
  [Device.DeviceType.DESKTOP]: "Computadora",
  [Device.DeviceType.TV]: "TV",
  [Device.DeviceType.UNKNOWN]: "Desconocido",
};

export default function DispositivoScreen() {
  return (
    <Pantalla>
      <Grupo titulo="Equipo">
        <Fila etiqueta="Marca" valor={Device.brand ?? "–"} />
        <Fila etiqueta="Modelo" valor={Device.modelName ?? "–"} />
        <Fila etiqueta="Tipo" valor={Device.deviceType ? (TIPO_DISPOSITIVO[Device.deviceType] ?? "–") : "–"} />
        <Fila etiqueta="Memoria RAM" valor={mbOGb(Device.totalMemory)} />
        <Fila etiqueta="Año de clase" valor={Device.deviceYearClass ? String(Device.deviceYearClass) : "–"} />
        <Fila etiqueta="Dispositivo físico" valor={Device.isDevice ? "Sí" : "Emulador"} />
      </Grupo>

      <Grupo titulo="Sistema">
        <Fila etiqueta="Sistema" valor={Device.osName ?? "–"} />
        <Fila etiqueta="Versión" valor={Device.osVersion ?? "–"} />
        <Fila etiqueta="Procesador" valor={Device.supportedCpuArchitectures?.join(", ") ?? "–"} />
      </Grupo>

      <Grupo titulo="Aplicación">
        <Fila etiqueta="Nombre" valor={Application.applicationName ?? "SensorLab"} />
        <Fila etiqueta="Versión" valor={Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? "–"} />
        <Fila etiqueta="SDK de Expo" valor={Constants.expoConfig?.sdkVersion ?? "–"} />
      </Grupo>
    </Pantalla>
  );
}
