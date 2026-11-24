import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { cores } from "../theme/cores";

// Mostra a "rodinha" girando enquanto o app espera a API responder.
// Uso: <Carregando mensagem="Buscando receitas..." />
export default function Carregando({ mensagem = "Carregando..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  texto: {
    marginTop: 12,
    fontSize: 16,
    color: cores.textoSuave,
    textAlign: "center", // termos longos quebram em duas linhas centralizadas
  },
});
