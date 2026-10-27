export interface JuryMember {
  role: 'Président' | 'Examinateur' | 'Rapporteur';
  title: string;
  name: string;
}

export interface FlyerData {
  fullName: string;
  photo: string | null;
  year: string;
  field: 'Génie Logiciel' | 'Génie Réseau et Télécommunications';
  thesisTitle: string;
  jury: JuryMember[];
  date: Date | undefined;
  time: string;
  location: string;
}

export const initialFlyerData: FlyerData = {
  fullName: '',
  photo: null,
  year: new Date().getFullYear().toString(),
  field: 'Génie Logiciel',
  thesisTitle: '',
  jury: [
    { role: 'Président', title: 'Dr.', name: '' },
    { role: 'Examinateur', title: 'Dr.', name: '' },
    { role: 'Rapporteur', title: 'Dr.', name: '' },
  ],
  date: undefined,
  time: '10:00',
  location: '',
};
