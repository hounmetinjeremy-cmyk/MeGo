import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  username: Yup.string().required("Username is Required"),
  password: Yup.string().required("Password cannot be empty"),
});

export const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  email: Yup.string().email("E-mail invalide").required("E-mail requis"),
  storeName: Yup.string().required("Le nom de la boutique est requis"),
  phone: Yup.string(),
  password: Yup.string().min(8, "8 caractères minimum").required("Mot de passe requis"),
});
