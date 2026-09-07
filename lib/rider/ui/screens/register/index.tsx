// Core
import { Formik } from "formik";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// React Native
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Icon
import { FontAwesome6 } from "@expo/vector-icons";

// Schemas
import { SignUpSchema } from "@/lib/rider/utils/schema";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

// Hooks
import useRegister from "@/lib/rider/hooks/useRegister";

// Interface
import { useApptheme } from "@/lib/rider/context/global/theme.context";
import { ISignUpInitialValues } from "@/lib/rider/utils/interfaces";
import { CustomContinueButton } from "../../useable-components";

const initialValues: ISignUpInitialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { onRegister, isRegistering } = useRegister();

  if (isRegistering) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("Loading...")}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: appTheme.themeBackground }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={SignUpSchema}
            onSubmit={onRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="flex-1 w-full p-5 items-center justify-center gap-y-2">
                <FontAwesome6 name="motorcycle" size={30} color={appTheme.fontMainColor} />

                <Text
                  className="text-center text-xl font-semibold"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {t("Créer un compte livreur")}
                </Text>
                <Text
                  className="text-center text-sm mb-5"
                  style={{ color: appTheme.fontSecondColor }}
                >
                  {t("Renseigne tes informations pour commencer à livrer")}
                </Text>

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ borderColor: appTheme.borderLineColor, backgroundColor: appTheme.themeBackground }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Nom complet")}
                    placeholderTextColor={appTheme.fontSecondColor}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                </View>
                {errors.name && <Text className="mb-2 text-sm text-red-500">{errors.name}</Text>}

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ borderColor: appTheme.borderLineColor, backgroundColor: appTheme.themeBackground }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Email")}
                    placeholderTextColor={appTheme.fontSecondColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                </View>
                {errors.email && <Text className="mb-2 text-sm text-red-500">{errors.email}</Text>}

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ borderColor: appTheme.borderLineColor, backgroundColor: appTheme.themeBackground }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Téléphone (optionnel)")}
                    placeholderTextColor={appTheme.fontSecondColor}
                    keyboardType="phone-pad"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                  />
                </View>

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ backgroundColor: appTheme.themeBackground, borderColor: appTheme.borderLineColor }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Mot de passe")}
                    secureTextEntry={!passwordVisible}
                    placeholderTextColor={appTheme.fontSecondColor}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} className="ml-2">
                    <FontAwesome6
                      name={passwordVisible ? "eye-slash" : "eye"}
                      size={14}
                      color={appTheme.fontMainColor}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text className="mb-2 text-sm text-red-500">{errors.password}</Text>}

                <CustomContinueButton
                  title={t("Créer mon compte")}
                  onPress={() => handleSubmit()}
                  disabled={isRegistering}
                  className="self-center"
                />

                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                  <Text className="text-sm" style={{ color: appTheme.primary }}>
                    {t("J'ai déjà un compte, me connecter")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
