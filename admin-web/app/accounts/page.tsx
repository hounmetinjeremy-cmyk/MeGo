"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";

import CustomButton from "@/components/button";
import CustomPasswordTextField from "@/components/password-field";
import {
  clearApiToken,
  createAccount,
  getApiToken,
  listUsersByRole,
  me,
  type MeGoManagedUser,
} from "@/lib/api-client";

/**
 * In the real Enatega, riders and vendors don't self-register — an admin
 * creates their account (super-admin/riders, super-admin/vendor). MeGo's
 * POST /api/auth/register still accepts these roles directly (kept simple,
 * no extra lockdown), but there was no UI anywhere to actually do it. This
 * page is that missing "admin onboards a rider or vendor" screen.
 */
const AccountSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  email: Yup.string().email("E-mail invalide").required("E-mail requis"),
  password: Yup.string().min(8, "8 caractères minimum").required("Mot de passe requis"),
  phone: Yup.string(),
  storeName: Yup.string(),
});

function AccountsTable({
  role,
  reloadKey,
}: {
  role: "rider" | "store";
  reloadKey: number;
}) {
  const [users, setUsers] = useState<MeGoManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listUsersByRole(role)
      .then(({ users }) => setUsers(users))
      .finally(() => setLoading(false));
  }, [role, reloadKey]);

  return (
    <DataTable value={users} loading={loading} emptyMessage="Aucun compte pour le moment.">
      <Column field="name" header="Nom" />
      <Column field="email" header="E-mail" />
      {role === "store" ? <Column field="store_name" header="Boutique" /> : null}
      <Column field="phone" header="Téléphone" />
      <Column header="Créé le" body={(u: MeGoManagedUser) => new Date(u.created_at).toLocaleDateString("fr-FR")} />
    </DataTable>
  );
}

export default function AccountsPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formRole, setFormRole] = useState<"rider" | "store">("store");
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const token = getApiToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    me()
      .then(({ user }) => {
        if (user.role !== "admin") router.replace("/login");
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const openCreateForm = (role: "rider" | "store") => {
    setFormRole(role);
    setError(null);
    setFormVisible(true);
  };

  const onSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
    storeName: string;
  }) => {
    setSaving(true);
    setError(null);
    try {
      await createAccount({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        name: values.name.trim(),
        role: formRole,
        phone: values.phone.trim() || undefined,
        storeName: formRole === "store" ? values.storeName.trim() || undefined : undefined,
      });
      // createAccount returns a fresh token for the NEW account — never
      // store it here, that would log the admin out of their own session.
      setFormVisible(false);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du compte");
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    clearApiToken();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">MeGo Admin — Comptes</h1>
          <Link href="/zones" className="text-sm text-blue-600 underline">
            Zones de livraison
          </Link>
        </div>
        <CustomButton
          label="Se déconnecter"
          className="h-9 rounded border border-gray-300 bg-transparent px-4 text-black"
          onClick={onLogout}
        />
      </div>

      {error ? <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <TabView>
        <TabPanel header="Vendeurs">
          <div className="mb-4 flex justify-end">
            <CustomButton
              label="+ Créer un compte vendeur"
              className="h-10 rounded bg-[#18181B] px-6 text-white"
              onClick={() => openCreateForm("store")}
            />
          </div>
          <AccountsTable role="store" reloadKey={reloadKey} />
        </TabPanel>

        <TabPanel header="Livreurs">
          <div className="mb-4 flex justify-end">
            <CustomButton
              label="+ Créer un compte livreur"
              className="h-10 rounded bg-[#18181B] px-6 text-white"
              onClick={() => openCreateForm("rider")}
            />
          </div>
          <AccountsTable role="rider" reloadKey={reloadKey} />
        </TabPanel>
      </TabView>

      <Dialog
        header={formRole === "store" ? "Créer un compte vendeur" : "Créer un compte livreur"}
        visible={formVisible}
        style={{ width: "28rem" }}
        breakpoints={{ "960px": "85vw", "641px": "95vw" }}
        onHide={() => setFormVisible(false)}
      >
        <Formik
          initialValues={{ name: "", email: "", password: "", phone: "", storeName: "" }}
          validationSchema={AccountSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, handleChange }) => (
            <Form className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-[500]">Nom</label>
                <InputText
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
                {errors.name ? <div className="text-xs text-red-600">{errors.name}</div> : null}
              </div>
              <div>
                <label className="text-sm font-[500]">E-mail</label>
                <InputText
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email ? <div className="text-xs text-red-600">{errors.email}</div> : null}
              </div>
              <div>
                <label className="text-sm font-[500]">Mot de passe</label>
                <CustomPasswordTextField
                  className="mt-1 w-full"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password ? <div className="text-xs text-red-600">{errors.password}</div> : null}
              </div>
              <div>
                <label className="text-sm font-[500]">Téléphone (optionnel)</label>
                <InputText
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                />
              </div>
              {formRole === "store" ? (
                <div>
                  <label className="text-sm font-[500]">Nom de la boutique</label>
                  <InputText
                    className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    name="storeName"
                    value={values.storeName}
                    onChange={handleChange}
                  />
                </div>
              ) : null}

              <CustomButton
                className="mt-2 h-10 w-full rounded bg-[#18181B] text-white"
                label={saving ? "Création…" : "Créer le compte"}
                type="submit"
                loading={saving}
              />
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
