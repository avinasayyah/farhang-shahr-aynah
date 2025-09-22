import { BookingData } from '../types/booking';

export const calculateTotalPrice = (bookingData: BookingData): number => {
  let total = 0;
  
  // Base duration price
  if (bookingData.duration === 1) total += 5000000;
  else if (bookingData.duration === 2) total += 8000000;
  else if (bookingData.duration === 5) total += 15000000;
  
  // Two-way experience adds 2M
  if (bookingData.experienceType === 'two-way') {
    total += 2000000;
  }
  
  // Non-Mashhad cities add 8M
  if (bookingData.userInfo.city !== 'مشهد') {
    total += 8000000;
  }
  
  return total;
};

export const calculateDeposit = (city: string): number => {
  return city === 'مشهد' ? 1000000 : 3000000;
};