import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "../components/AppText";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PhotoGrid } from "../components/PhotoGrid";
import { RevealOnMount } from "../components/RevealOnMount";
import { SectionTitle } from "../components/SectionTitle";
import { TextField } from "../components/TextField";
import { LoadingScreen } from "./LoadingScreen";
import { useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useMissionaries } from "../context/MissionaryContext";
import { useSaveFeedback } from "../hooks";
import { avatarOptionsMock } from "../mocks/avatarOptions";
import { galleryOptionsMock } from "../mocks/galleryOptions";
import { spacing } from "../theme/spacing";
import { isValidAge, isValidCity, isValidSocialUrl } from "../utils/validation";
import { MAX_GALLERY_PHOTOS } from "../constants";

/**
 * Edição do próprio perfil — acessível apenas ao missionário
 * autenticado. Foto e galeria são escolhidas de um pool de imagens
 * mock (não há upload real nesta etapa); os demais campos seguem
 * exatamente o escopo definido: cidade, idade, redes sociais e
 * biografia (opcional).
 */
export const EditProfileScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { getById, updateProfile, isLoading } = useMissionaries();

  const missionary = user ? getById(user.id) : undefined;

  const [photoUrl, setPhotoUrl] = useState(missionary?.photoUrl ?? "");
  const [city, setCity] = useState(missionary?.city ?? "");
  const [age, setAge] = useState(missionary?.age ? String(missionary.age) : "");
  const [bio, setBio] = useState(missionary?.bio ?? "");
  const [instagram, setInstagram] = useState(missionary?.social.instagram ?? "");
  const [whatsapp, setWhatsapp] = useState(missionary?.social.whatsapp ?? "");
  const [facebook, setFacebook] = useState(missionary?.social.facebook ?? "");
  const [gallery, setGallery] = useState<string[]>(missionary?.gallery ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isSaving, savedFeedback, runSave } = useSaveFeedback();

  if (isLoading || !missionary || !user) {
    return <LoadingScreen message="Carregando perfil..." />;
  }

  const toggleGalleryPhoto = (uri: string) => {
    setGallery((prev) => {
      if (prev.includes(uri)) return prev.filter((item) => item !== uri);
      if (prev.length >= MAX_GALLERY_PHOTOS) return prev;
      return [...prev, uri];
    });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!isValidCity(city)) nextErrors.city = "Informe uma cidade válida.";
    if (!isValidAge(age)) nextErrors.age = "Informe uma idade entre 12 e 99.";
    if (!isValidSocialUrl(instagram)) nextErrors.instagram = "Link inválido (use http:// ou https://).";
    if (!isValidSocialUrl(whatsapp)) nextErrors.whatsapp = "Link inválido (use http:// ou https://).";
    if (!isValidSocialUrl(facebook)) nextErrors.facebook = "Link inválido (use http:// ou https://).";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await runSave(async () => {
      await updateProfile(user.id, {
        photoUrl,
        city: city.trim(),
        age: Number(age),
        bio: bio.trim() || undefined,
        social: {
          instagram: instagram.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          facebook: facebook.trim() || undefined,
        },
        gallery,
      });
    });
    setTimeout(() => router.back(), 700);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.lg }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginRight: spacing.sm }}>
          <Icon name="chevron-back" size={22} color={theme.textPrimary} />
        </Pressable>
        <AppText variant="h1">Editar perfil</AppText>
      </View>

      <RevealOnMount>
        <Card style={{ alignItems: "center" }}>
          <Avatar uri={photoUrl} size={92} />
          <AppText variant="caption" color={theme.textSecondary} style={{ marginTop: spacing.sm, marginBottom: spacing.xs }}>
            Toque em uma foto para definir como sua foto de perfil
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
            {avatarOptionsMock.map((uri) => (
              <Pressable key={uri} onPress={() => setPhotoUrl(uri)} style={{ marginRight: spacing.sm }}>
                <Avatar
                  uri={uri}
                  size={52}
                  borderColor={uri === photoUrl ? theme.primary : theme.border}
                />
              </Pressable>
            ))}
          </ScrollView>
        </Card>
      </RevealOnMount>

      <RevealOnMount delay={60} style={{ marginTop: spacing.lg }}>
        <SectionTitle title="Informações" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <TextField
            label="Cidade"
            value={city}
            onChangeText={setCity}
            placeholder="Ex: Porto Feliz - SP"
            errorMessage={errors.city}
          />
          <TextField
            label="Idade"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="Ex: 20"
            errorMessage={errors.age}
          />
          <TextField
            label="Biografia (opcional)"
            value={bio}
            onChangeText={setBio}
            placeholder="Conte um pouco sobre você..."
            multiline
            numberOfLines={4}
            style={{ height: 96, paddingTop: spacing.sm, textAlignVertical: "top" }}
          />
        </View>
      </RevealOnMount>

      <RevealOnMount delay={120} style={{ marginTop: spacing.md }}>
        <SectionTitle title="Redes sociais" subtitle="Exibidas como ícones clicáveis no seu perfil" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <TextField
            label="Instagram"
            value={instagram}
            onChangeText={setInstagram}
            placeholder="https://instagram.com/seuusuario"
            autoCapitalize="none"
            errorMessage={errors.instagram}
          />
          <TextField
            label="WhatsApp"
            value={whatsapp}
            onChangeText={setWhatsapp}
            placeholder="https://wa.me/55..."
            autoCapitalize="none"
            errorMessage={errors.whatsapp}
          />
          <TextField
            label="Facebook"
            value={facebook}
            onChangeText={setFacebook}
            placeholder="https://facebook.com/seuusuario"
            autoCapitalize="none"
            errorMessage={errors.facebook}
          />
        </View>
      </RevealOnMount>

      <RevealOnMount delay={180} style={{ marginTop: spacing.md }}>
        <SectionTitle
          title="Galeria de fotos"
          subtitle={`Escolha até ${MAX_GALLERY_PHOTOS} fotos (${gallery.length}/${MAX_GALLERY_PHOTOS})`}
        />
        <PhotoGrid photos={galleryOptionsMock} selectedUris={gallery} onToggle={toggleGalleryPhoto} />
      </RevealOnMount>

      <RevealOnMount delay={240} style={{ marginTop: spacing.xl }}>
        <Button
          label={savedFeedback ? "Salvo!" : isSaving ? "Salvando..." : "Salvar alterações"}
          onPress={handleSave}
          disabled={isSaving || savedFeedback}
        />
      </RevealOnMount>
    </ScrollView>
  );
};
