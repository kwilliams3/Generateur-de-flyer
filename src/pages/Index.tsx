import React, { useState, useRef } from 'react';
import { toBlob } from 'html-to-image';
import { A3_WIDTH_PX, A3_HEIGHT_PX, FLYER_WIDTH, FLYER_HEIGHT, withPrintResolution } from '@/lib/flyer-export';
import { Download, FileImage, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlyerForm } from '@/components/flyer/FlyerForm';
import { FlyerPreview } from '@/components/flyer/FlyerPreview';
import { FlyerData, initialFlyerData } from '@/types/flyer';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [formData, setFormData] = useState<FlyerData>(initialFlyerData);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {
      photo: !formData.photo,
      fullName: !formData.fullName.trim(),
      thesisTitle: !formData.thesisTitle.trim(),
      date: !formData.date,
      location: !formData.location.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const waitForFlyerAssets = async (root: HTMLElement) => {
    // Wait for fonts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fonts = (document as any).fonts;
    if (fonts?.ready) {
      try {
        await fonts.ready;
      } catch {
        // ignore
      }
    }

    // Wait for all images inside the flyer to be fully loaded
    const imgs = Array.from(root.querySelectorAll('img'));
    await Promise.all(
      imgs.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
      )
    );
  };

  const handleDownload = async () => {
    if (!validateForm()) {
      toast({
        title: 'Formulaire incomplet',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    if (!flyerRef.current) return;

    setIsDownloading(true);
    try {
      await waitForFlyerAssets(flyerRef.current);

      const width = FLYER_WIDTH;
      const height = FLYER_HEIGHT;

      const image = await toBlob(flyerRef.current, {
        pixelRatio: 1,
        canvasWidth: A3_WIDTH_PX,
        canvasHeight: A3_HEIGHT_PX,
        width,
        height,
        style: {
          transform: 'none',
          position: 'relative',
          top: '0',
          left: '0',
        },
      });

      if (!image) throw new Error('La génération du PNG a échoué.');
      const imageUrl = URL.createObjectURL(await withPrintResolution(image));

      const link = document.createElement('a');
      link.download = `flyer-soutenance-A3-${formData.fullName.replace(/\s+/g, '-')}.png`;
      link.href = imageUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);

      toast({
        title: 'Téléchargement réussi !',
        description: 'Votre flyer a été téléchargé avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du téléchargement.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-xl bg-primary p-2">
              <FileImage className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Générateur de Flyers de Soutenance
              </h1>
              <p className="text-sm text-muted-foreground">
                Créez votre flyer professionnel en quelques clics
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Informations du Flyer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FlyerForm data={formData} onChange={setFormData} errors={errors} />
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-8 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Aperçu du Flyer</CardTitle>
                </CardHeader>
                <CardContent>
                  <FlyerPreview ref={flyerRef} data={formData} />
                </CardContent>
              </Card>

              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Download className="h-5 w-5" />
                {isDownloading ? 'Génération en cours...' : 'Télécharger le Flyer (PNG)'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">A3 portrait · 297 × 420 mm · 300 dpi</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} • Conçu par Ing. Franck Doteu
        </p>
      </footer>
    </div>
  );
};

export default Index;
