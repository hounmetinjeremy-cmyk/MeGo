import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import { ApiError, register, setApiToken } from "@/lib/shared/api-client";
import { setActiveRole } from "@/lib/shared/active-role";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

/**
 * Field set copied from the real Enatega customer app's Register screen
 * (screens/Register/Register.js): email, first/last name, password with an
 * eye toggle, phone. The country-code picker widget is dropped — MeGo's
 * phone field is a plain optional input, not a required field.
 */
export default function ClientRegisterScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const prefilledEmail = Array.isArray(params.email) ? params.email[0] : params.email;

  const [email, setEmail] = useState(prefilledEmail ?? "");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim() || !firstname.trim() || !lastname.trim() || password.length < 8) {
      setError("E-mail, prénom, nom et un mot de passe d'au moins 8 caractères sont requis.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { token } = await register({
        email: email.trim().toLowerCase(),
        password,
        name: `${firstname.trim()} ${lastname.trim()}`.trim(),
        role: "customer",
        phone: phone.trim() || undefined,
      });
      await setApiToken(token);
      await setActiveRole("client");
      router.replace("/client");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de créer le compte, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🛍️</Text>
        <Text style={styles.title}>Commençons</Text>
        <Text style={styles.subtitle}>Crée ton compte pour passer commande</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={enatega.fontSecondColor}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          placeholderTextColor={enatega.fontSecondColor}
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          placeholderTextColor={enatega.fontSecondColor}
          value={lastname}
          onChangeText={setLastname}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mot de passe"
            placeholderTextColor={enatega.fontSecondColor}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ marginLeft: -36, marginBottom: 6 }}>
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color={enatega.fontFourthColor}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Téléphone (optionnel)"
          placeholderTextColor={enatega.fontSecondColor}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={enatega.black} /> : <Text style={styles.buttonText}>S&apos;inscrire</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/client/login")}>
          <Text style={styles.link}>J&apos;ai déjà un compte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
