import { ReactElement, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InfoProveedor, listarProveedores } from "../../services/oauth";
import { useTema } from "../../theme/ThemeProvider";
import { Proveedor } from "../../types/usuario";
import { DiscordIcon, GoogleIcon, MetaIcon } from "../common/BrandIcons";
import PressableScale from "../common/PressableScale";

interface Props {
  ocupado: boolean;
  onElegir: (proveedor: Proveedor) => void;
}

const ICONOS: Record<Proveedor, ReactElement> = {
  google: <GoogleIcon />,
  facebook: <MetaIcon />,
  discord: <DiscordIcon />,
};

export default function SocialButtons({ ocupado, onElegir }: Props) {
  const { colores } = useTema();
  const [proveedores, setProveedores] = useState<InfoProveedor[]>([]);

  useEffect(() => {
    listarProveedores().then(setProveedores);
  }, []);

  const disponibles = proveedores.filter((p) => p.disponible);
  if (disponibles.length === 0) return null;

  return (
    <View style={estilos.grupo}>
      <View style={estilos.separador}>
        <View style={[estilos.linea, { backgroundColor: colores.borde }]} />
        <Text style={[estilos.o, { color: colores.textoSuave }]}>o</Text>
        <View style={[estilos.linea, { backgroundColor: colores.borde }]} />
      </View>
      {disponibles.map((p) => (
        <PressableScale
          key={p.nombre}
          disabled={ocupado}
          onPress={() => onElegir(p.nombre)}
          accessibilityRole="button"
          accessibilityLabel={`Continuar con ${p.label}`}
          style={[
            estilos.boton,
            { backgroundColor: colores.superficie, borderColor: colores.bordeControl },
            ocupado && estilos.inactivo,
          ]}
        >
          {ICONOS[p.nombre]}
          <Text style={[estilos.texto, { color: colores.texto }]}>Continuar con {p.label}</Text>
        </PressableScale>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: 12 },
  separador: { flexDirection: "row", alignItems: "center", gap: 14, marginVertical: 6 },
  linea: { flex: 1, height: 1 },
  o: { fontSize: 15 },
  boton: {
    minHeight: 54,
    borderRadius: 27,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  inactivo: { opacity: 0.6 },
  texto: { fontSize: 17, fontWeight: "600" },
});
