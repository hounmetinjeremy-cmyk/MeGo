"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { Card } from "primereact/card";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import CustomButton from "@/components/button";
import CustomIconTextField from "@/components/icon-text-field";
import CustomPasswordTextField from "@/components/password-field";
import { ApiError, login, setApiToken } from "@/lib/api-client";

/**
 * Same layout as the real Enatega admin login screen
 * (enatega-multivendor-admin/lib/ui/screen-components/unprotected/authentication/sign-in-email-password) —
 * PrimeReact Card + Formik, minus the GraphQL mutation (swapped for MeGo's
 * REST /api/auth/login) and the Single Vendor Admin link.
 */
const SignInSchema = Yup.object().shape({
  email: Yup.string().email("E-mail invalide").required("E-mail requis"),
  password: Yup.string().required("Mot de passe requis"),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await login(values.email.trim().toLowerCase(), values.password);
      if (user.role !== "store") {
        setError("Ce compte n'est pas un compte vendeur.");
        return;
      }
      setApiToken(token);
      router.replace("/products");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Email ou mot de passe invalide"
          : "Impossible de se connecter, réessayez.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="w-full md:w-1/2 lg:w-[30%]">
        <Card className="border">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col items-center gap-y-[0.5rem] p-2">
              <span className="text-center text-3xl font-semibold">MeGo Vendeur</span>
              <span className="text-center text-base font-normal text-[#667085]">
                Connecte-toi pour gérer tes produits
              </span>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SignInSchema}
              onSubmit={onSubmitHandler}
              validateOnChange={false}
            >
              {({ values, handleChange }) => (
                <Form>
                  <div className="mb-2">
                    <CustomIconTextField
                      placeholder="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      icon={<FontAwesomeIcon icon={faEnvelope} />}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-2">
                    <CustomPasswordTextField
                      placeholder="Mot de passe"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </div>
                  {error ? <div className="mb-2 text-sm text-red-600">{error}</div> : null}
                  <CustomButton
                    className="h-10 w-full border border-black bg-[#18181B] px-32 text-white hover:bg-white hover:text-black"
                    label="Connexion"
                    type="submit"
                    loading={loading}
                  />
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </div>
    </div>
  );
}
