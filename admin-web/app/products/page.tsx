"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { TabView, TabPanel } from "primereact/tabview";

import CustomButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import CustomUploadImageComponent from "@/components/upload-image";
import {
  clearApiToken,
  createProduct,
  deleteProduct,
  getApiToken,
  listMyProducts,
  listStoreOrders,
  updateProduct,
  updateStoreOrderStatus,
  type MeGoOrder,
  type MeGoProduct,
} from "@/lib/api-client";

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis").max(60),
  description: Yup.string().max(300),
  price: Yup.number().moreThan(0, "Le prix doit être supérieur à 0").required("Le prix est requis"),
});

const STATUS_LABEL: Record<MeGoOrder["status"], string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  PREPARING: "En préparation",
  READY_FOR_PICKUP: "Prête (attend un livreur)",
  PICKED_UP: "Récupérée par le livreur",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const NEXT_STATUS: Partial<Record<MeGoOrder["status"], "ACCEPTED" | "PREPARING" | "READY_FOR_PICKUP">> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY_FOR_PICKUP",
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<MeGoProduct[]>([]);
  const [orders, setOrders] = useState<MeGoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<MeGoProduct | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MeGoProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [productsRes, ordersRes] = await Promise.all([listMyProducts(), listStoreOrders()]);
      setProducts(productsRes.products);
      setOrders(ordersRes.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getApiToken()) {
      router.replace("/login");
      return;
    }
    void load();
  }, [router, load]);

  const openAddForm = () => {
    setEditing(null);
    setImageUrl(null);
    setFormVisible(true);
  };

  const openEditForm = (product: MeGoProduct) => {
    setEditing(product);
    setImageUrl(product.image_url);
    setFormVisible(true);
  };

  const onSubmitProduct = async (values: { name: string; description: string; price: number }) => {
    setSaving(true);
    try {
      const priceCents = Math.round(values.price * 100);
      if (editing) {
        await updateProduct(editing.id, {
          name: values.name.trim(),
          description: values.description.trim(),
          price_cents: priceCents,
          image_url: imageUrl ?? undefined,
        });
      } else {
        await createProduct({
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          price_cents: priceCents,
          image_url: imageUrl ?? undefined,
        });
      }
      setFormVisible(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const onToggleAvailable = async (product: MeGoProduct) => {
    try {
      await updateProduct(product.id, { is_available: !product.is_available });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const onAdvanceOrder = async (order: MeGoOrder) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateStoreOrderStatus(order.id, next);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  const onCancelOrder = async (order: MeGoOrder) => {
    try {
      await updateStoreOrderStatus(order.id, "CANCELLED");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  const onLogout = () => {
    clearApiToken();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">MeGo Vendeur</h1>
        <CustomButton
          label="Se déconnecter"
          className="h-9 rounded border border-gray-300 bg-transparent px-4 text-black"
          onClick={onLogout}
        />
      </div>

      {error ? <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <TabView>
        <TabPanel header="Produits">
          <div className="mb-4 flex justify-end">
            <CustomButton
              label="+ Ajouter un produit"
              className="h-10 rounded bg-[#18181B] px-6 text-white"
              onClick={openAddForm}
            />
          </div>
          <DataTable value={products} loading={loading} emptyMessage="Aucun produit pour le moment.">
            <Column
              header="Photo"
              body={(product: MeGoProduct) =>
                product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-200" />
                )
              }
            />
            <Column field="name" header="Nom" />
            <Column field="description" header="Description" />
            <Column header="Prix" body={(product: MeGoProduct) => formatPrice(product.price_cents)} />
            <Column
              header="Disponible"
              body={(product: MeGoProduct) => (
                <InputSwitch checked={!!product.is_available} onChange={() => onToggleAvailable(product)} />
              )}
            />
            <Column
              header="Actions"
              body={(product: MeGoProduct) => (
                <div className="flex gap-3">
                  <button className="text-sm text-blue-600" onClick={() => openEditForm(product)}>
                    Modifier
                  </button>
                  <button className="text-sm text-red-600" onClick={() => setDeleteTarget(product)}>
                    Supprimer
                  </button>
                </div>
              )}
            />
          </DataTable>
        </TabPanel>

        <TabPanel header="Commandes">
          <DataTable value={orders} loading={loading} emptyMessage="Aucune commande pour le moment.">
            <Column field="customer_name" header="Client" />
            <Column field="delivery_address" header="Adresse" />
            <Column header="Total" body={(order: MeGoOrder) => formatPrice(order.total_cents)} />
            <Column header="Statut" body={(order: MeGoOrder) => STATUS_LABEL[order.status]} />
            <Column
              header="Paiement"
              body={(order: MeGoOrder) => (order.payment_method === "FEDAPAY" ? "FedaPay" : "À la livraison")}
            />
            <Column
              header="Actions"
              body={(order: MeGoOrder) => (
                <div className="flex gap-3">
                  {NEXT_STATUS[order.status] ? (
                    <button className="text-sm text-green-600" onClick={() => onAdvanceOrder(order)}>
                      {order.status === "PENDING" ? "Accepter" : "Étape suivante"}
                    </button>
                  ) : null}
                  {["PENDING", "ACCEPTED", "PREPARING"].includes(order.status) ? (
                    <button className="text-sm text-red-600" onClick={() => onCancelOrder(order)}>
                      Annuler
                    </button>
                  ) : null}
                </div>
              )}
            />
          </DataTable>
        </TabPanel>
      </TabView>

      <Dialog
        header={editing ? "Modifier le produit" : "Ajouter un produit"}
        visible={formVisible}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        onHide={() => setFormVisible(false)}
      >
        <Formik
          initialValues={{
            name: editing?.name ?? "",
            description: editing?.description ?? "",
            price: editing ? editing.price_cents / 100 : 0,
          }}
          enableReinitialize
          validationSchema={ProductSchema}
          onSubmit={onSubmitProduct}
        >
          {({ values, errors, handleChange, setFieldValue }) => (
            <Form className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-[500]">Nom du produit</label>
                <InputText
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
                {errors.name ? <div className="text-xs text-red-600">{errors.name}</div> : null}
              </div>
              <div>
                <label className="text-sm font-[500]">Description</label>
                <InputTextarea
                  className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  name="description"
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-[500]">Prix (€)</label>
                <InputNumber
                  className="mt-1 w-full"
                  inputClassName="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                  value={values.price}
                  onValueChange={(e) => setFieldValue("price", e.value ?? 0)}
                  mode="decimal"
                  minFractionDigits={2}
                  maxFractionDigits={2}
                />
                {errors.price ? <div className="text-xs text-red-600">{errors.price}</div> : null}
              </div>

              <CustomUploadImageComponent existingImageUrl={imageUrl} onUploaded={setImageUrl} />

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
        message={`Supprimer "${deleteTarget?.name}" ?`}
        onHide={() => setDeleteTarget(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
