import { Dialog } from "primereact/dialog";
import CustomButton from "./button";

/** Simplified port of Enatega admin's CustomDialog (delete-dialog). */
export default function ConfirmDialog({
  visible,
  message,
  loading,
  onHide,
  onConfirm,
}: {
  visible: boolean;
  message: string;
  loading?: boolean;
  onHide: () => void;
  onConfirm: () => void;
}) {
  const footer = (
    <div className="space-x-2">
      <CustomButton
        label="Annuler"
        icon="pi pi-times"
        onClick={onHide}
        className="h-9 rounded border border-gray-300 bg-transparent px-5 text-black"
      />
      <CustomButton
        loading={loading}
        label="Confirmer"
        icon="pi pi-check"
        className="h-9 rounded bg-red-500 px-4 text-white"
        onClick={onConfirm}
      />
    </div>
  );

  return (
    <Dialog
      className="border"
      visible={visible}
      style={{ width: "28rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmer la suppression"
      modal
      footer={footer}
      onHide={onHide}
    >
      <span>{message}</span>
    </Dialog>
  );
}
