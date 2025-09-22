import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgeVerification from './booking/AgeVerification';
import ExperienceSelection from './booking/ExperienceSelection';
import DurationSelection from './booking/DurationSelection';
import DateTimeSelection from './booking/DateTimeSelection';
import UserForm from './booking/UserForm';
import FinalBooking from './booking/FinalBooking';
import TelegramButton from './booking/TelegramButton';
import { BookingData } from '../types/booking';

const BookingSystem = () => {
  const [step, setStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    isOver20: false,
    experienceType: null,
    duration: null,
    date: null,
    time: null,
    userInfo: {
      name: '',
      phone: '',
      city: ''
    }
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const steps = [
    <AgeVerification 
      key="age"
      onVerified={(isOver20) => {
        if (isOver20) {
          updateBookingData({ isOver20 });
          nextStep();
        }
      }} 
    />,
    <ExperienceSelection 
      key="experience"
      selected={bookingData.experienceType}
      onSelect={(type) => {
        updateBookingData({ experienceType: type });
        nextStep();
      }}
      onBack={prevStep}
    />,
    <DurationSelection 
      key="duration"
      selected={bookingData.duration}
      onSelect={(duration) => {
        updateBookingData({ duration });
        nextStep();
      }}
      onBack={prevStep}
    />,
    <DateTimeSelection 
      key="datetime"
      selectedDate={bookingData.date}
      selectedTime={bookingData.time}
      onSelect={(date, time) => {
        updateBookingData({ date, time });
        nextStep();
      }}
      onBack={prevStep}
    />,
    <UserForm 
      key="form"
      userInfo={bookingData.userInfo}
      onSubmit={(userInfo) => {
        updateBookingData({ userInfo });
        nextStep();
      }}
      onBack={prevStep}
    />,
    <FinalBooking 
      key="final"
      bookingData={bookingData}
      onBack={prevStep}
    />
  ];

  return (
    <div className="min-h-screen bg-fantasy-gradient font-vazir">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-lalezar text-white drop-shadow-lg mb-4">
            ✨ فرهنگ شهر آینه ✨
          </h1>
          <p className="text-xl text-white/90 font-medium">
            تجربه‌ای فانتزی و لاکچری منتظر شماست
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto"
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      <TelegramButton />
    </div>
  );
};

export default BookingSystem;