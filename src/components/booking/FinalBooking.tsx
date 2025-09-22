import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { BookingData } from '../../types/booking';
import { useToast } from '@/hooks/use-toast';
import { sendBookingEmail } from '../../utils/email';
import { calculateTotalPrice, calculateDeposit } from '../../utils/pricing';

interface FinalBookingProps {
  bookingData: BookingData;
  onBack: () => void;
}

const FinalBooking = ({ bookingData, onBack }: FinalBookingProps) => {
  const { toast } = useToast();
  
  const cardNumber = '۶۲۱۹۸۶۱۹۰۶۸۷۱۹۳۳';
  const cardOwner = 'متین مهربان';
  const telegramId = '@avinasayah';
  
  const totalPrice = calculateTotalPrice(bookingData);
  const deposit = calculateDeposit(bookingData.userInfo.city);
  const isFromMashhad = bookingData.userInfo.city === 'مشهد';

  const copyCardNumber = () => {
    const englishCardNumber = '6219861906871933';
    navigator.clipboard.writeText(englishCardNumber);
    toast({
      title: "کپی شد! 💖",
      description: "شماره کارت کپی شد!",
      duration: 3000,
    });
  };

  useEffect(() => {
    // Send email automatically when component mounts
    sendBookingEmail(bookingData, totalPrice, deposit);
  }, []);

  const getExperienceTitle = () => {
    return bookingData.experienceType === 'one-way' 
      ? 'تجربه یک‌طرفه فانتزی' 
      : 'تجربه دوطرفه فانتزی';
  };

  const getDurationLabel = () => {
    const hours = bookingData.duration;
    if (hours === 1) return 'یک ساعت';
    if (hours === 2) return 'دو ساعت';
    if (hours === 5) return 'پنج ساعت';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-lalezar text-white mb-4">
          🎉 رزرو شما آماده است!
        </h2>
        <p className="text-white/90">
          اطلاعات پرداخت و جزئیات رزرو
        </p>
      </div>

      {/* Deposit Amount */}
      <Card className="bg-fantasy-gold/90 border-2 border-fantasy-gold shadow-glow backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-lalezar text-fantasy-black mb-2">
            💰 مبلغ بیعانه
          </h3>
          <div className="text-4xl font-bold text-fantasy-black">
            {deposit.toLocaleString('fa-IR')} تومان
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="bg-card-gradient border-2 border-fantasy-pink shadow-fantasy backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-lalezar text-fantasy-black text-center">
            💳 اطلاعات پرداخت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            onClick={copyCardNumber}
            className="bg-fantasy-black/10 p-4 rounded-lg border-2 border-fantasy-gold cursor-pointer hover:bg-fantasy-gold/20 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fantasy-black/70">شماره کارت:</p>
                <p className="text-2xl font-bold text-fantasy-black font-mono tracking-wider">
                  {cardNumber}
                </p>
                <p className="text-sm text-fantasy-black/70 mt-1">
                  به نام: {cardOwner}
                </p>
              </div>
              <Copy className="h-6 w-6 text-fantasy-gold group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <p className="text-center text-fantasy-black/70 text-sm">
            برای کپی شدن شماره کارت، روی آن کلیک کنید
          </p>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card className="bg-card-gradient border-2 border-fantasy-gold shadow-fantasy backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-lalezar text-fantasy-black text-center">
            📋 جزئیات رزرو شما
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-fantasy-black/70">نوع تجربه:</p>
              <p className="font-bold text-fantasy-black">{getExperienceTitle()}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">مدت زمان:</p>
              <p className="font-bold text-fantasy-black">{getDurationLabel()}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">تاریخ:</p>
              <p className="font-bold text-fantasy-black">
                {bookingData.date && format(new Date(bookingData.date), "PPP", { locale: faIR })}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">ساعت:</p>
              <p className="font-bold text-fantasy-black">{bookingData.time}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">نام:</p>
              <p className="font-bold text-fantasy-black">{bookingData.userInfo.name}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">شماره تماس:</p>
              <p className="font-bold text-fantasy-black">{bookingData.userInfo.phone}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">شهر:</p>
              <p className="font-bold text-fantasy-black">{bookingData.userInfo.city}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-fantasy-black/70">هزینه کل:</p>
              <Badge className="bg-fantasy-pink text-white font-bold text-lg">
                {totalPrice.toLocaleString('fa-IR')} تومان
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Instructions */}
      <Card className="bg-fantasy-pink/90 border-2 border-fantasy-pink shadow-glow backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-lalezar text-white mb-4">
            📤 مرحله نهایی
          </h3>
          <p className="text-white/90 mb-4 leading-relaxed">
            پس از پرداخت، رسید بانکی را در تلگرام بفرستید تا قرار ملاقاتتان فیکس شود.
          </p>
          <Button
            onClick={() => window.open(`https://t.me/${telegramId.replace('@', '')}`, '_blank')}
            className="bg-white text-fantasy-pink hover:bg-fantasy-gold hover:text-fantasy-black font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {telegramId} 📱
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-fantasy-black"
        >
          بازگشت برای ویرایش
        </Button>
      </div>
    </motion.div>
  );
};

export default FinalBooking;