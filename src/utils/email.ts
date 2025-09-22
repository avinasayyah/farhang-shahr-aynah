import emailjs from '@emailjs/browser';
import { BookingData } from '../types/booking';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

export const sendBookingEmail = async (
  bookingData: BookingData,
  totalPrice: number,
  deposit: number
) => {
  try {
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

    const formattedDate = bookingData.date 
      ? format(new Date(bookingData.date), "PPP", { locale: faIR })
      : '';

    const emailContent = `
      <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right; background: linear-gradient(135deg, #ec4899, #f59e0b); padding: 20px; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <h1 style="color: #ec4899; font-size: 32px; text-align: center; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
            ✨ رزرو جدید - فرهنگ شهر آینه ✨
          </h1>
          
          <div style="background: linear-gradient(145deg, rgba(236, 72, 153, 0.1), rgba(245, 158, 11, 0.1)); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #f59e0b;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">📋 جزئیات رزرو:</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>نوع تجربه:</strong> ${getExperienceTitle()}</li>
              <li style="margin-bottom: 10px;"><strong>مدت زمان:</strong> ${getDurationLabel()}</li>
              <li style="margin-bottom: 10px;"><strong>تاریخ:</strong> ${formattedDate}</li>
              <li style="margin-bottom: 10px;"><strong>ساعت:</strong> ${bookingData.time}</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(145deg, rgba(236, 72, 153, 0.1), rgba(245, 158, 11, 0.1)); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #ec4899;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">👤 اطلاعات مشتری:</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>نام:</strong> ${bookingData.userInfo.name}</li>
              <li style="margin-bottom: 10px;"><strong>شماره تماس:</strong> ${bookingData.userInfo.phone}</li>
              <li style="margin-bottom: 10px;"><strong>شهر:</strong> ${bookingData.userInfo.city}</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(145deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.1)); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #f59e0b;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">💰 اطلاعات مالی:</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>هزینه کل:</strong> ${totalPrice.toLocaleString('fa-IR')} تومان</li>
              <li style="margin-bottom: 10px;"><strong>مبلغ بیعانه:</strong> ${deposit.toLocaleString('fa-IR')} تومان</li>
            </ul>
          </div>
          
          <div style="text-align: center; background: rgba(236, 72, 153, 0.1); padding: 20px; border-radius: 15px; border: 2px dashed #ec4899;">
            <p style="color: #1f2937; font-size: 16px; margin: 0;">
              📱 منتظر رسید پرداخت در تلگرام: @avinasayah
            </p>
          </div>
        </div>
      </div>
    `;

    const templateParams = {
      to_email: 'avinasayyah@gmail.com',
      subject: `رزرو جدید - ${bookingData.userInfo.name}`,
      html_content: emailContent,
      from_name: 'سیستم رزرو فرهنگ شهر آینه',
      customer_name: bookingData.userInfo.name,
      customer_phone: bookingData.userInfo.phone,
      customer_city: bookingData.userInfo.city,
      experience_type: getExperienceTitle(),
      duration: getDurationLabel(),
      booking_date: formattedDate,
      booking_time: bookingData.time,
      total_price: totalPrice.toLocaleString('fa-IR'),
      deposit: deposit.toLocaleString('fa-IR')
    };

    // EmailJS configuration (you'll need to set up EmailJS service)
    const result = await emailjs.send(
      'service_booking', // Replace with your EmailJS service ID
      'template_booking', // Replace with your EmailJS template ID
      templateParams,
      'user_public_key' // Replace with your EmailJS public key
    );

    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};