import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  error?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photo,
  onPhotoChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onPhotoChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        Photo de l'étudiant <span className="text-destructive">*</span>
      </label>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          error ? 'border-destructive bg-destructive/5' : 'border-muted-foreground/25 hover:border-primary/50',
          photo && 'border-solid border-primary bg-accent'
        )}
      >
        {photo ? (
          <div className="relative">
            <img
              src={photo}
              alt="Preview"
              className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center gap-2"
            onClick={() => inputRef.current?.click()}
          >
            <div className="rounded-full bg-muted p-4">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Cliquez pour ajouter votre photo
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">La photo est obligatoire</p>
      )}
    </div>
  );
};
