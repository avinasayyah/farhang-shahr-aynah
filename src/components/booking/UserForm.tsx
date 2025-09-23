import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { persianCities } from '../../utils/cities';
import { digitsFaToEn, digitsEnToFa } from '@persian-tools/persian-tools';

interface UserFormProps {
  userInfo: {
    name: string;
    phone: string;
    city: string;
  };
  onSubmit: (userInfo: { name: string; phone: string; city: string }) => void;
  onBack: () => void;
}

const formSchema = z.object({
  name: z.string()
    .min(1, 'نام الزامی است')
    .max(100, 'نام نباید بیش از ۱۰۰ کاراکتر باشد')
    .regex(/^[\u0600-\u06FF\s]+$/, 'فقط حروف فارسی مجاز است'),
  phone: z.string()
    .min(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد')
    .max(13, 'شماره تلفن نباید بیش از ۱۳ رقم باشد')
    .regex(/^[\u06F0-\u06F90-9]+$/, 'فقط اعداد مجاز است'),
  city: z.string().min(1, 'انتخاب شهر الزامی است'),
});

type FormData = z.infer<typeof formSchema>;

const UserForm = ({ userInfo, onSubmit, onBack }: UserFormProps) => {
  const [citySearch, setCitySearch] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: userInfo,
  });

  const watchedPhone = watch('phone');

  const onFormSubmit = (data: FormData) => {
    // Convert Persian digits to English for processing
    const normalizedData = {
      name: data.name,
      phone: digitsFaToEn(data.phone),
      city: data.city
    };
    onSubmit(normalizedData);
  };

  const handlePhoneChange = (value: string) => {
    // Allow both Persian and English digits
    const cleanValue = value.replace(/[^\u06F0-\u06F90-9]/g, '');
    setValue('phone', cleanValue);
  };

  // Filter cities based on search
  const filteredCities = persianCities.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-lalezar text-white mb-4">
          اطلاعات تماس شما
        </h2>
        <p className="text-white/90">
          اطلاعات شما محرمانه خواهد ماند 🔒
        </p>
      </div>

      <Card className="bg-card-gradient border-2 border-fantasy-gold shadow-fantasy backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-lalezar text-fantasy-black text-center">
            📝 فرم اطلاعات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-fantasy-black font-bold">نام</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="نام خود را وارد کنید"
                    className="border-2 border-fantasy-pink focus:border-fantasy-gold text-right"
                    dir="rtl"
                  />
                )}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-fantasy-black font-bold">شماره تلفن</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    {...field}
                    value={digitsEnToFa(value)}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="border-2 border-fantasy-pink focus:border-fantasy-gold text-center text-lg"
                    dir="ltr"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-destructive text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-fantasy-black font-bold">شهر</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-2 border-fantasy-pink focus:border-fantasy-gold text-right">
                      <SelectValue placeholder="شهر خود را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-white">
                      <div className="p-2 sticky top-0 bg-white border-b z-50">
                        <Input
                          placeholder="جستجوی شهر..."
                          className="mb-2 text-right bg-gray-50 border-fantasy-pink/30 focus:border-fantasy-gold"
                          dir="rtl"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                        />
                      </div>
                      <div className="city-list max-h-48 overflow-y-auto">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <SelectItem 
                              key={city} 
                              value={city} 
                              className="text-right hover:bg-fantasy-gold/10"
                            >
                              {city}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            شهری یافت نشد
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <p className="text-destructive text-sm">{errors.city.message}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="border-2 border-white bg-white/60 text-white hover:bg-white hover:text-fantasy-black font-bold"
              >
                بازگشت
              </Button>
              
              <Button
                type="submit"
                className="bg-button-gradient hover:scale-105 transform transition-all duration-200 shadow-glow text-white font-bold px-8"
              >
                ثبت اطلاعات ✨
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserForm;