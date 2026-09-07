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
import Icon from "react-native-vector-icons/FontAwesome6";

// Schemas
import { SignUpSchema } from "@/lib/store/utils/schema";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

// Hooks
import useRegister from "@/lib/store/hooks/useRegister";

// Interface
import { useApptheme } from "@/lib/store/context/theme.context";
import { ISignUpInitialValues } from "@/lib/store/utils/interfaces";
import { CustomContinueButton } from "../../useable-components";

const initialValues: ISignUpInitialValues = {
  name: "",
  email: "",
  storeName: "",
  phone: "",
  password: "",
};

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { onRegister, isRegistering } = useRegister();

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center h-full w-full"
      style={{ backgroundColor: appTheme.themeBackground }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                <Icon name="store" size={30} color={appTheme.primary} />

                <Text
                  className="text-center text-xl font-semibold"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {t("Créer un compte vendeur")}
                </Text>
                <Text
                  className="text-center text-sm mb-5"
                  style={{ color: appTheme.fontSecondColor }}
                >
                  {t("Renseigne tes informations pour vendre sur MeGo")}
                </Text>

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ backgroundColor: appTheme.themeBackground, borderColor: appTheme.borderLineColor }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Nom complet")}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                </View>
                {errors.name && (
                  <Text style={{ color: appTheme.textErrorColor, marginBottom: 8, fontSize: 14 }}>
                    {errors.name}
                  </Text>
                )}

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ backgroundColor: appTheme.themeBackground, borderColor: appTheme.borderLineColor }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                </View>
                {errors.email && (
                  <Text style={{ color: appTheme.textErrorColor, marginBottom: 8, fontSize: 14 }}>
                    {errors.email}
                  </Text>
                )}

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ backgroundColor: appTheme.themeBackground, borderColor: appTheme.borderLineColor }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Nom de la boutique")}
                    value={values.storeName}
                    onChangeText={handleChange("storeName")}
                    onBlur={handleBlur("storeName")}
                  />
                </View>
                {errors.storeName && (
                  <Text style={{ color: appTheme.textErrorColor, marginBottom: 8, fontSize: 14 }}>
                    {errors.storeName}
                  </Text>
                )}

                <View
                  className="flex-row items-center border rounded-lg px-3 mb-[-4]"
                  style={{ backgroundColor: appTheme.themeBackground, borderColor: appTheme.borderLineColor }}
                >
                  <TextInput
                    className="flex-1 h-12 text-base"
                    style={{ color: appTheme.fontMainColor }}
                    placeholder={t("Téléphone (optionnel)")}
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
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} className="ml-2">
                    <Icon name={passwordVisible ? "eye-slash" : "eye"} size={14} color={appTheme.fontMainColor} />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={{ color: appTheme.textErrorColor, marginBottom: 8, fontSize: 14 }}>
                    {errors.password}
                  </Text>
                )}

                <CustomContinueButton
                  title={t("Créer mon compte")}
                  disabled={isRegistering}
                  isLoading={isRegistering}
                  onPress={() => handleSubmit()}
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
