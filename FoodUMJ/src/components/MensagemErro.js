import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores } from "../theme/cores";

// Mostra uma mensagem de erro e, se receber a função onTentarNovamente,
// um botão para o usuário repetir a requisição.
// Uso: <MensagemErro mensagem="Não foi possível carregar." onTentarNovamente={carregar} />
export default function MensagemErro({
  mensagem = "Algo deu errado.",
  onTentarNovamente,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>😕</Text>
      <Text style={styles.texto}>{mensagem}</Text>

      {onTentarNovamente && (
        <Pressable
          onPress={onTentarNovamente}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.textoBotao}>Tentar novamente</Text>
        </Pressable>
      )}
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
  icone: {
    fontSize: 48,
    marginBottom: 12,
  },
  texto: {
    fontSize: 16,
    color: cores.texto,
    textAlign: "center",
    marginBottom: 20,
  },
  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: cores.textoSobrePrimaria,
    fontSize: 16,
    fontWeight: "600",
  },
});
