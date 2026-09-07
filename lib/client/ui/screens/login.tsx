import { useRef, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ApiError, emailExists, login, setApiToken } from "@/lib/shared/api-client";
import { setActiveRole } from "@/lib/shared/active-role";
import { clientStyles as styles } from "@/lib/client/ui/styles";
import { enatega } from "@/lib/client/ui/theme";

/**
 * Two-step flow copied from the real Enatega customer app's Login screen
 * (screens/Login/Login.js + useLogin.js): first check whether the email is
 * registered, then reveal the password field, or send to Register if not.
 */
export default function ClientLoginScreen() {
  const [email, setEmail] = useState("");
  const emailRef = useRef("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetEmail = (value: string) => {
    setEmail(value);
    emailRef.current = value;
    if (error) setError(null);
  };

  const checkEmailExist = async () => {
    if (!emailRef.current.trim()) {
      setError("Merci de renseigner un e-mail.");
      return;
    }
    setChecking(true);
    setError(null);
    try {
      const { exists } = await emailExists(emailRef.current.trim().toLowerCase());
      if (exists) {
        setRegisteredEmail(true);
      } else {
        router.push({ pathname: "/client/register", params: { email: emailRef.current.trim() } });
      }
    } catch {
      setError("Impossible de vérifier cet e-mail, réessayez.");
    } finally {
      setChecking(false);
    }
  };

  const loginAction = async () => {
    setLoggingIn(true);
    setError(null);
    try {
      // Any account can browse/order here, whatever its base role — a vendor
      // or rider account is not "not a client account" in the unified model.
      const { token } = await login(emailRef.current.trim().toLowerCase(), password);
      await setApiToken(token);
      await setActiveRole("client");
      router.replace("/client");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Email ou mot de passe invalide"
          : "Impossible de se connecter, réessayez.",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const loading = checking || loggingIn;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🛍️</Text>
        <Text style={styles.title}>
          {registeredEmail ? "Entrez votre mot de passe" : "Entrez votre e-mail"}
        </Text>
        <Text style={styles.subtitle}>
          {registeredEmail ? "Ce compte existe déjà" : "Nous vérifierons si vous avez un compte"}
        </Text>

        {!registeredEmail ? (
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor={enatega.fontSecondColor}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={handleSetEmail}
          />
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={enatega.fontSecondColor}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Text style={styles.link}>{showPassword ? "Masquer" : "Afficher"} le mot de passe</Text>
            </TouchableOpacity>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => (registeredEmail ? loginAction() : checkEmailExist())}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={enatega.black} />
          ) : (
            <Text style={styles.buttonText}>{registeredEmail ? "Connexion" : "Continuer"}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/client/register")}>
          <Text style={styles.link}>Créer un compte</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/client")}>
          <Text style={styles.link}>Continuer sans compte pour parcourir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
