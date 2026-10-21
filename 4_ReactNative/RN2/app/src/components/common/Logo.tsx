import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  tamano?: number;
  color: string;
}

// logo de SensorLab: una S hecha de dos órbitas y la bolita del sensor
export function Logo({ tamano = 64, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="64 24 132 208" accessibilityLabel="Logo de SensorLab">
      <Path
        fill={color}
        d="M156 37.5A56 56 0 1 0 128 142A28 28 0 1 1 100 170A14 14 0 0 0 72 170A56 56 0 1 0 128 114A28 28 0 1 1 142 61.75A14 14 0 0 0 156 37.5Z"
      />
      <Circle cx={172} cy={88} r={16} fill={color} />
    </Svg>
  );
}
