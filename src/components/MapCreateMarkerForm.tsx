import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { MarkerTypeChip } from "./MarkerTypeChip";
import { TextField } from "./TextField";
import { useAppTheme } from "../context/ThemeContext";
import { CREATABLE_MARKER_TYPES } from "../constants/mapMeta";
import { MapMarkerType } from "../types";
import { spacing } from "../theme/spacing";

interface MapCreateMarkerFormProps {
  coordinate: { latitude: number; longitude: number };
  onSubmit: (data: { type: MapMarkerType; familyName: string; address: string; notes?: string }) => void;
  isSaving: boolean;
}

/**
 * Formulário de criação de marcador — acessível apenas ao
 * administrador (`useAuth().isAdmin`), a partir do FAB "Novo
 * marcador" do Mapa Missionário. A localização já vem definida pelo
 * ponto tocado no mapa (`coordinate`).
 */
export const MapCreateMarkerForm: React.FC<MapCreateMarkerFormProps> = ({
  coordinate,
  onSubmit,
  isSaving,
}) => {
  const { theme } = useAppTheme();
  const [type, setType] = useState<MapMarkerType>("visitar");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const isChurch = type === "igreja";

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(isChurch ? "Informe o nome da igreja." : "Informe o nome da família.");
      return;
    }
    if (!address.trim()) {
      setError("Informe o endereço.");
      return;
    }
    setError("");
    onSubmit({
      type,
      familyName: name.trim(),
      address: address.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
      <AppText variant="h3">Novo marcador</AppText>
      <AppText variant="caption" color={theme.textSecondary} style={{ marginTop: spacing.xxs, marginBottom: spacing.md }}>
        Localização definida pelo toque no mapa ({coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}).
      </AppText>

      <AppText variant="caption" color={theme.textSecondary} style={{ marginBottom: spacing.xs }}>
        Tipo
      </AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm }}>
        {CREATABLE_MARKER_TYPES.map((markerType) => (
          <MarkerTypeChip
            key={markerType}
            type={markerType}
            active={markerType === type}
            onPress={() => setType(markerType)}
            height={36}
            pill
            style={{ marginRight: spacing.xs, marginBottom: spacing.xs }}
          />
        ))}
      </View>

      <TextField
        label={isChurch ? "Nome da igreja" : "Nome da família"}
        placeholder={isChurch ? "Ex: IASD Porto Feliz — Central" : "Ex: Família Souza"}
        value={name}
        onChangeText={setName}
      />
      <TextField
        label="Endereço"
        placeholder="Rua, número, bairro"
        value={address}
        onChangeText={setAddress}
      />
      <TextField
        label="Observações (opcional)"
        placeholder="Detalhes sobre a visita ou contato"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={{ height: 80, paddingTop: spacing.sm, textAlignVertical: "top" }}
      />

      {error ? (
        <AppText variant="caption" color={theme.danger} style={{ marginBottom: spacing.sm }}>
          {error}
        </AppText>
      ) : null}

      <Button
        label={isSaving ? "Salvando..." : "Adicionar marcador"}
        onPress={handleSubmit}
        disabled={isSaving}
        style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
      />
    </ScrollView>
  );
};
