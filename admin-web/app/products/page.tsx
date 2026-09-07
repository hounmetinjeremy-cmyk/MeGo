"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";

import CustomButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import CustomUploadImageComponent from "@/components/upload-image";
import {
  clearApiToken,
  createCategory,
  createProduct,
  createSubcategory,
  deleteCategory,
  deleteProduct,
  deleteSubcategory,
  getApiToken,
  listMyCategories,
  listMyProducts,
  listStoreOrders,
  updateProduct,
  updateStoreOrderStatus,
  type MeGoCategory,
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
  const [categories, setCategories] = useState<MeGoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<MeGoProduct | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MeGoProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const [categoryFormVisible, setCategoryFormVisible] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [newSubcategoryTitle, setNewSubcategoryTitle] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      setError(null);
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        listMyProducts(),
        listStoreOrders(),
        listMyCategories(),
      ]);
      setProducts(productsRes.products);
      setOrders(ordersRes.orders);
      setCategories(categoriesRes.categories);
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

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: category.title, value: category.id })),
    [categories],
  );

  const subcategoryOptionsFor = useCallback(
    (categoryId: string | null) => {
      const category = categories.find((c) => c.id === categoryId);
      return (category?.subcategories ?? []).map((sub) => ({ label: sub.title, value: sub.id }));
    },
    [categories],
  );

  const categoryTitleFor = (id: string | null) => categories.find((c) => c.id === id)?.title ?? "—";

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

  const onSubmitProduct = async (values: {
    name: string;
    description: string;
    price: number;
    category_id: string | null;
    subcategory_id: string | null;
  }) => {
    setSaving(true);
    try {
      const priceCents = Math.round(values.price * 100);
      const payload = {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        price_cents: priceCents,
        image_url: imageUrl ?? undefined,
        category_id: values.category_id ?? undefined,
        subcategory_id: values.subcategory_id ?? undefined,
      };
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
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

  const onAddCategory = async () => {
    if (!newCategoryTitle.trim()) return;
    setSavingCategory(true);
    try {
      await createCategory({ title: newCategoryTitle.trim() });
      setNewCategoryTitle("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout de la catégorie");
    } finally {
      setSavingCategory(false);
    }
  };

  const onDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const onAddSubcategory = async (categoryId: string) => {
    const title = newSubcategoryTitle[categoryId]?.trim();
    if (!title) return;
    try {
      await createSubcategory(categoryId, title);
      setNewSubcategoryTitle((prev) => ({ ...prev, [categoryId]: "" }));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout de la sous-catégorie");
    }
  };

  const onDeleteSubcategory = async (id: string) => {
    try {
      await deleteSubcategory(id);
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
            <Column header="Catégorie" body={(product: MeGoProduct) => categoryTitleFor(product.category_id)} />
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

        <TabPanel header="Catégories">
          <div className="mb-4 flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm font-[500]">Nouvelle catégorie</label>
              <InputText
                className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="Ex: Pizzas, Boissons…"
              />
            </div>
            <CustomButton
              label={savingCategory ? "Ajout…" : "+ Ajouter"}
              className="h-10 rounded bg-[#18181B] px-6 text-white"
              onClick={onAddCategory}
              loading={savingCategory}
            />
          </div>

          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune catégorie pour le moment.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <div key={category.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{category.title}</span>
                    <button className="text-sm text-red-600" onClick={() => onDeleteCategory(category.id)}>
                      Supprimer la catégorie
                    </button>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs"
                      >
                        {sub.title}
                        <button className="text-red-500" onClick={() => onDeleteSubcategory(sub.id)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <InputText
                      className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
                      placeholder="Sous-catégorie…"
                      value={newSubcategoryTitle[category.id] ?? ""}
                      onChange={(e) =>
                        setNewSubcategoryTitle((prev) => ({ ...prev, [category.id]: e.target.value }))
                      }
                    />
                    <button
                      className="text-xs font-medium text-blue-600"
                      onClick={() => onAddSubcategory(category.id)}
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            category_id: editing?.category_id ?? null,
            subcategory_id: editing?.subcategory_id ?? null,
          }}
          enableReinitialize
          validationSchema={ProductSchema}
          onSubmit={onSubmitProduct}
        >
          {({ values, errors, handleChange, setFieldValue }) => (
            <Form className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-[500]">Catégorie</label>
                <Dropdown
                  className="mt-1 w-full rounded-lg border border-gray-300 text-sm"
                  value={values.category_id}
                  options={categoryOptions}
                  placeholder="Sélectionner une catégorie"
                  showClear
                  onChange={(e) => {
                    setFieldValue("category_id", e.value);
                    setFieldValue("subcategory_id", null);
                  }}
                  panelFooterTemplate={() => (
                    <div className="p-2">
                      <button
                        type="button"
                        className="text-sm text-blue-600"
                        onClick={() => setCategoryFormVisible(true)}
                      >
                        + Ajouter une catégorie
                      </button>
                    </div>
                  )}
                />
              </div>
              {values.category_id ? (
                <div>
                  <label className="text-sm font-[500]">Sous-catégorie</label>
                  <Dropdown
                    className="mt-1 w-full rounded-lg border border-gray-300 text-sm"
                    value={values.subcategory_id}
                    options={subcategoryOptionsFor(values.category_id)}
                    placeholder="Sélectionner une sous-catégorie"
                    showClear
                    onChange={(e) => setFieldValue("subcategory_id", e.value)}
                  />
                </div>
              ) : null}
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

      <Dialog
        header="Ajouter une catégorie"
        visible={categoryFormVisible}
        style={{ width: "24rem" }}
        onHide={() => setCategoryFormVisible(false)}
      >
        <div className="flex flex-col gap-3">
          <InputText
            className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            placeholder="Ex: Pizzas, Boissons…"
          />
          <CustomButton
            label={savingCategory ? "Ajout…" : "Ajouter"}
            className="h-10 w-full rounded bg-[#18181B] text-white"
            loading={savingCategory}
            onClick={async () => {
              await onAddCategory();
              setCategoryFormVisible(false);
            }}
          />
        </div>
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
