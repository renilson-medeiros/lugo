"use client";

import { Upload, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PropertyPhotoManagerProps {
  photos: File[];
  photosPreviews: string[];
  existingPhotos: string[];
  onPhotosChange: (files: File[]) => void;
  onPreviewsChange: (previews: string[]) => void;
  onExistingPhotosChange: (photos: string[]) => void;
}

export function PropertyPhotoManager({
  photos,
  photosPreviews,
  existingPhotos,
  onPhotosChange,
  onPreviewsChange,
  onExistingPhotosChange,
}: PropertyPhotoManagerProps) {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);

      // Limitar a 8 fotos
      const totalPhotos = photos.length + newPhotos.length + existingPhotos.length;
      if (totalPhotos > 8) {
        toast.error('Máximo de 8 fotos permitidas');
        return;
      }

      onPhotosChange([...photos, ...newPhotos]);

      newPhotos.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          onPreviewsChange([...photosPreviews, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
    onPreviewsChange(photosPreviews.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    onExistingPhotosChange(existingPhotos.filter((_, i) => i !== index));
  };

  const totalCount = existingPhotos.length + photos.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row items-start md:items-center justify-start md:justify-between">
        <Label>
          Fotos do imóvel
          <span className="ml-2 text-xs text-muted-foreground">
            ({totalCount}/8 fotos)
          </span>
        </Label>
        {totalCount < 3 && (
          <span className="text-xs text-red-500">
            Mínimo 3 fotos necessárias
          </span>
        )}
        {totalCount >= 3 && totalCount <= 8 && (
          <div className="text-xs text-green-600 flex gap-1 items-center">
            <Check className="h-4 w-4" />
            <span>Quantidade válida</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Fotos existentes */}
        {existingPhotos.map((photo, index) => (
          <div key={`existing-${index}`} className="relative group">
            <img
              src={photo}
              alt={`Foto existente ${index + 1}`}
              className="h-24 w-24 rounded-lg object-cover border border-border"
            />
            <button
              type="button"
              onClick={() => removeExistingPhoto(index)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-destructive-foreground opacity-100 transition-opacity group-hover:opacity-100"
              aria-label="Remover foto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Novas fotos */}
        {photosPreviews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Foto ${index + 1}`}
              className="h-24 w-24 rounded-lg object-cover border border-border"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="cursor-pointer absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-destructive-foreground opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remover foto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Botão upload */}
        {totalCount < 8 && (
          <label
            htmlFor="photos"
            className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Upload className="h-6 w-6" aria-hidden="true" />
            <span className="mt-1 text-xs">Adicionar</span>
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="sr-only"
            />
          </label>
        )}
      </div>
    </div>
  );
}
