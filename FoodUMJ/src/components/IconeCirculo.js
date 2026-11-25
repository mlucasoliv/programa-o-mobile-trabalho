import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { cores } from "../theme/cores";

// Ícone laranja dentro de um círculo laranja-claro. Aparece no topo da tela inicial,
// nas listas vazias e nas mensagens de erro, para todas terem o mesmo visual.
//
// Props:
//   nome     → nome do ícone do Ionicons (lista em https://icons.expo.fyi)
//   tamanho  → diâmetro do círculo; o ícone ocupa quase a metade dele
//
// Uso: <IconeCirculo nome="search-outline" />
export default function IconeCirculo({ nome, tamanho = 88 }) {
  return (
    <View
      style={[
        styles.circulo,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
      ]}
    >
      <Ionicons name={nome} size={tamanho * 0.45} color={cores.primaria} />
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.primariaClara,
  },
});
