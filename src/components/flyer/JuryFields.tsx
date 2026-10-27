import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JuryMember } from '@/types/flyer';
import { Users } from 'lucide-react';

interface JuryFieldsProps {
  jury: JuryMember[];
  onJuryChange: (jury: JuryMember[]) => void;
}

const titles = ['Dr.', 'Pr.', 'M.', 'Mme', 'Ing.'];

export const JuryFields: React.FC<JuryFieldsProps> = ({ jury, onJuryChange }) => {
  const updateMember = (index: number, field: keyof JuryMember, value: string) => {
    const newJury = [...jury];
    newJury[index] = { ...newJury[index], [field]: value };
    onJuryChange(newJury);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Membres du Jury</h3>
      </div>
      <div className="space-y-4">
        {jury.map((member, index) => (
          <div
            key={member.role}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <Label className="mb-3 block font-medium text-primary">
              {member.role}
            </Label>
            <div className="flex gap-3">
              <Select
                value={member.title}
                onValueChange={(value) => updateMember(index, 'title', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Nom complet"
                value={member.name}
                onChange={(e) => updateMember(index, 'name', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
