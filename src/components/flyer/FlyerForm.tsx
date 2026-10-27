import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, GraduationCap, Clock, MapPin, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlyerData } from '@/types/flyer';
import { PhotoUpload } from './PhotoUpload';
import { JuryFields } from './JuryFields';

interface FlyerFormProps {
  data: FlyerData;
  onChange: (data: FlyerData) => void;
  errors: Record<string, boolean>;
}

const years = Array.from({ length: 41 }, (_, i) =>
  (new Date().getFullYear() + 10 - i).toString()
);

const fields = [
  'Génie Logiciel',
  'Génie Réseau et Télécommunications',
] as const;

const times = Array.from({ length: 24 }, (_, h) =>
  [`${h.toString().padStart(2, '0')}:00`, `${h.toString().padStart(2, '0')}:30`]
).flat();

const locations = ['Salle 15BS1', 'Salle 17BS1'] as const;

export const FlyerForm: React.FC<FlyerFormProps> = ({ data, onChange, errors }) => {
  const updateField = <K extends keyof FlyerData>(field: K, value: FlyerData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Section Photo */}
      <PhotoUpload
        photo={data.photo}
        onPhotoChange={(photo) => updateField('photo', photo)}
        error={errors.photo}
      />

      {/* Section Informations Personnelles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Informations Personnelles</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Noms et Prénoms <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Ex: DUPONT Jean-Pierre"
            value={data.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className={cn(errors.fullName && 'border-destructive')}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">Ce champ est obligatoire</p>
          )}
        </div>
      </div>

      {/* Section Académique */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Informations Académiques</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Année de Soutenance</Label>
            <Select
              value={data.year}
              onValueChange={(value) => updateField('year', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Axe de Formation <span className="text-destructive">*</span></Label>
            <Select
              value={data.field}
              onValueChange={(value) =>
                updateField('field', value as FlyerData['field'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thesisTitle">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Thème du Mémoire <span className="text-destructive">*</span>
            </div>
          </Label>
          <Textarea
            id="thesisTitle"
            placeholder="Saisissez le thème de votre mémoire..."
            value={data.thesisTitle}
            onChange={(e) => updateField('thesisTitle', e.target.value)}
            className={cn('min-h-[100px]', errors.thesisTitle && 'border-destructive')}
          />
          {errors.thesisTitle && (
            <p className="text-sm text-destructive">Ce champ est obligatoire</p>
          )}
        </div>
      </div>

      {/* Section Jury */}
      <JuryFields
        jury={data.jury}
        onJuryChange={(jury) => updateField('jury', jury)}
      />

      {/* Section Logistique */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Logistique de la Soutenance</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Date de Soutenance <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !data.date && 'text-muted-foreground',
                    errors.date && 'border-destructive'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.date
                    ? format(data.date, 'PPP', { locale: fr })
                    : 'Sélectionner une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.date}
                  onSelect={(date) => updateField('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">La date est obligatoire</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heure de Soutenance
              </div>
            </Label>
            <Select
              value={data.time}
              onValueChange={(value) => updateField('time', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {times.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Lieu de Soutenance <span className="text-destructive">*</span>
            </div>
          </Label>
          <Select
            value={data.location}
            onValueChange={(value) => updateField('location', value)}
          >
            <SelectTrigger className={cn(errors.location && 'border-destructive')}>
              <SelectValue placeholder="Sélectionner une salle" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && (
            <p className="text-sm text-destructive">Ce champ est obligatoire</p>
          )}
        </div>
      </div>
    </div>
  );
};
