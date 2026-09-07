"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import CustomButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import {
  clearApiToken,
  createZone,
  deleteZone,
  getApiToken,
  listZones,
  me,
  updateZone,
  type MeGoZone,
} from "@/lib/api-client";

// Leaflet touches `window` at import time, so it must never run during
// Next's static build — load it lazily, client-side only.
const ZoneMapEditor = dynamic(() => import("@/components/zone-map-editor"), { ssr: false });

const ZoneSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis").max(35),
  description: Yup.string().max(100),
});

export default function ZonesPage() {
  const router = useRouter();
  const [zones, setZones] = useState<MeGoZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<MeGoZone | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [deleteTarget, setDeleteTarget] = useState<MeGoZone | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const { zones } = await listZones();
      setZones(zones);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getApiToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    me()
      .then(({ user }) => {
        if (user.role !== "admin") {
          router.replace("/login");
          return;
        }
        void load();
      })
      .catch(() => router.replace("/login"));
  }, [router, load]);

  const openAddForm = () => {
    setEditing(null);
    setCoordinates([]);
    setFormVisible(true);
  };

  const openEditForm = (zone: MeGoZone) => {
    setEditing(zone);
    setCoordinates(zone.coordinates);
    setFormVisible(true);
  };

  const onSubmitZone = async (values: { title: string; description: string }) => {
    if (coordinates.length < 3) {
      setError("Dessine une zone sur la carte (au moins 3 points) avant d'enregistrer.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { title: values.title.trim(), description: values.description.trim(), coordinates };
      if (editing) {
        await updateZone(editing.id, payload);
      } else {
        await createZone(payload);
      }
      setFormVisible(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteZone(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const onLogout = () => {
    clearApiToken();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">MeGo Admin — Zones de livraison</h1>
        <CustomButton
          label="Se déconnecter"
          className="h-9 rounded border border-gray-300 bg-transparent px-4 text-black"
          onClick={onLogout}
        />
      </div>

      {error ? <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="mb-4 flex justify-end">
        <CustomButton
          label="+ Ajouter une zone"
          className="h-10 rounded bg-[#18181B] px-6 text-white"
          onClick={openAddForm}
        />
      </div>

      <DataTable value={zones} loading={loading} emptyMessage="Aucune zone pour le moment.">
        <Column field="title" header="Titre" />
        <Column field="description" header="Description" />
        <Column header="Points" body={(zone: MeGoZone) => zone.coordinates.length} />
        <Column
          header="Actions"
          body={(zone: MeGoZone) => (
            <div className="flex gap-3">
              <button className="text-sm text-blue-600" onClick={() => openEditForm(zone)}>
                Modifier
              </button>
              <button className="text-sm text-red-600" onClick={() => setDeleteTarget(zone)}>
                Supprimer
              </button>
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={editing ? "Modifier la zone" : "Ajouter une zone"}
        visible={formVisible}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "85vw", "641px": "95vw" }}
        onHide={() => setFormVisible(false)}
      >
        <Formik
          initialValues={{ title: editing?.title ?? "", description: editing?.description ?? "" }}
          enableReinitialize
          validationSchema={ZoneSchema}
          onSubmit={onSubmitZone}
        >
          {({ values, errors, handleChange }) => (
            <Form className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-[500]">Titre</label>
                <InputText
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                />
                {errors.title ? <div className="text-xs text-red-600">{errors.title}</div> : null}
              </div>
              <div>
                <label className="text-sm font-[500]">Description</label>
                <InputTextarea
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="description"
                  rows={2}
                  value={values.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-[500]">
                  Zone (utilise l&apos;outil polygone en haut à droite de la carte)
                </label>
                <div className="mt-1">
                  <ZoneMapEditor coordinates={coordinates} onChange={setCoordinates} />
                </div>
              </div>

              <CustomButton
                className="mt-2 h-10 w-full rounded bg-[#18181B] text-white"
                label={saving ? "Enregistrement…" : "Enregistrer"}
                type="submit"
                loading={saving}
              />
            </Form>
          )}
        </Formik>
      </Dialog>

      <ConfirmDialog
        visible={!!deleteTarget}
        message={`Supprimer la zone "${deleteTarget?.title}" ?`}
        onHide={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
