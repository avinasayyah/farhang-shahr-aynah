export interface BookingData {
  isOver20: boolean;
  experienceType: 'one-way' | 'two-way' | null;
  duration: 1 | 2 | 5 | null;
  date: string | null;
  time: string | null;
  userInfo: {
    name: string;
    phone: string;
    city: string;
  };
}

export interface ExperienceType {
  id: 'one-way' | 'two-way';
  title: string;
  description: string;
  price?: number;
}

export interface Duration {
  hours: 1 | 2 | 5;
  price: number;
  label: string;
}