"use client";

import { useRef, useState } from "react";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import { uploadStoreImage } from "@/lib/api-client";

/**
 * Simplified port of Enatega admin's CustomUploadImageComponent
 * (lib/ui/useable-components/upload/upload-image) — same PrimeReact
 * FileUpload + preview box, but uploads straight to MeGo's own
 * /api/store/upload instead of the GraphQL uploadImageToS3 mutation.
 */
export default function CustomUploadImageComponent({
  existingImageUrl,
  onUploaded,
}: {
  existingImageUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const handleSelect = async (event: FileUploadSelectEvent) => {
    const file = event.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    setError(null);
    try {
      const { url } = await uploadStoreImage(file);
      onUploaded(url);
    } catch {
      setError("Échec de l'envoi de la photo");
    } finally {
      setIsUploading(false);
      fileUploadRef.current?.clear();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <span className="mx-auto self-start text-sm font-[600]">Photo du produit</span>
      <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <FontAwesomeIcon icon={faUpload} />
            <p className="w-36 text-center text-xs">Glisse une image ici</p>
          </div>
        )}
      </div>
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        accept="image/*"
        auto
        chooseLabel={isUploading ? "Envoi…" : "Choisir une photo"}
        onSelect={handleSelect}
        disabled={isUploading}
      />
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
