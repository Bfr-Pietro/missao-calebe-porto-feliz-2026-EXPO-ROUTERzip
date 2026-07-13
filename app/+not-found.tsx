import React from "react";
import { router } from "expo-router";
import { ErrorScreen } from "../src/screens/ErrorScreen";

/**
 * Rota especial do Expo Router, exibida quando nenhuma rota conhecida
 * corresponde ao caminho acessado (ex.: link profundo inválido ou
 * digitado incorretamente). Reaproveita a `ErrorScreen` já existente
 * no projeto, com um botão para voltar ao início.
 */
export default function NotFoundScreen() {
  return (
    <ErrorScreen
      title="Página não encontrada"
      message="O link acessado não existe ou não está mais disponível."
      onRetry={() => router.replace("/")}
    />
  );
}
