import { useCallback, useEffect, useRef, useState } from "react";

interface UseSaveFeedbackResult {
  isSaving: boolean;
  savedFeedback: boolean;
  runSave: (action: () => Promise<void>, feedbackDurationMs?: number) => Promise<void>;
}

/**
 * Controla o padrão "Salvando... / Salvo!" usado nos botões de salvar
 * do app (Edição de Perfil, Diário): mostra estado de carregamento
 * durante a ação assíncrona e um feedback temporário de sucesso ao
 * concluir, sem duplicar essa lógica em cada tela.
 */
export function useSaveFeedback(): UseSaveFeedbackResult {
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    },
    []
  );

  const runSave = useCallback(async (action: () => Promise<void>, feedbackDurationMs = 1600) => {
    setIsSaving(true);
    try {
      await action();
      setSavedFeedback(true);
      feedbackTimeout.current = setTimeout(() => setSavedFeedback(false), feedbackDurationMs);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { isSaving, savedFeedback, runSave };
}
