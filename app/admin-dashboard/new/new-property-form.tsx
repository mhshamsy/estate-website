'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { propertySchema } from '@/validation/propertySchema';
import z from 'zod';
import PropertyForm from '@/components/property-form';
import { PlusCircleIcon } from 'lucide-react';
import createProperty from './actions';
import { updateProperty, uploadImages } from '../actions';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 2; // مگابایت
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const NewPropertyForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

 const handleSubmitFn = async (data: z.infer<typeof propertySchema>) => {
   setIsLoading(true);

   try {
     let newPropertyId: string | null = null;
     let imageUrls: string[] = [];

     // --- مرحله ۱: بررسی فایل‌ها (انتقال از handleFileChange) ---
     if (selectedFiles.length > 0) {
       // 1. بررسی تعداد
       if (selectedFiles.length > MAX_FILES) {
         throw new Error(
           `حداکثر ${MAX_FILES} عکس مجاز است. شما ${selectedFiles.length} عکس انتخاب کرده‌اید.`
         );
       }

       // 2. بررسی حجم هر فایل (تکی)
       const oversizedFiles = selectedFiles.filter(
         (file) => file.size > MAX_FILE_SIZE_BYTES
       );
       if (oversizedFiles.length > 0) {
         const names = oversizedFiles.map((f) => f.name).join(', ');
         throw new Error(
           `حجم فایل‌های زیر بیش از ${MAX_FILE_SIZE_MB} مگابایت است: ${names}`
         );
       }
     }

     // --- مرحله ۲: ساخت ملک خالی ---
     const createResponse = await createProperty({
       ...data,
       images: [], // آرایه خالی
     });

     if (createResponse.error || !createResponse.data) {
       throw new Error(createResponse.message);
     }
     newPropertyId = createResponse.data.id;

     // --- مرحله ۳: آپلود تصاویر (اگر فایلی انتخاب شده) ---
     if (selectedFiles.length > 0) {
       const uploadResult = await uploadImages(newPropertyId, selectedFiles);

       if (!uploadResult.success || !uploadResult.urls) {
         throw new Error(uploadResult.message);
       }
       imageUrls = uploadResult.urls;
     }

     // --- مرحله ۴: آپدیت ملک با آدرس‌های تصاویر ---
     if (imageUrls.length > 0) {
       const updateResponse = await updateProperty(newPropertyId, {
         newImages: imageUrls,
       });

       if (updateResponse.error) {
         throw new Error(updateResponse.message);
       }
     }

     toast({
       title: 'موفق!',
       description: 'ملک و تصاویر با موفقیت ثبت شدند.',
       variant: 'success',
     });

     router.push('/admin-dashboard');
   } catch (error: any) {
     console.error(error);
     toast({
       title: 'خطا!',
       description: error.message || 'متاسفانه خطایی رخ داد.',
       variant: 'destructive',
     });
   } finally {
     setIsLoading(false);
   }
 };

  return (
    <div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">
          تصاویر ملک (حداکثر {MAX_FILES} عکس، هر کدام حداکثر {MAX_FILE_SIZE_MB}{' '}
          مگابایت)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setSelectedFiles(Array.from(e.target.files));
            }
          }}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
        />
        {selectedFiles.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-xs text-slate-500">
              {selectedFiles.length} از {MAX_FILES} عکس انتخاب شده است.
            </p>
            <ul className="space-y-1 text-xs text-slate-600">
              {selectedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between"
                >
                  <span>{file.name}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <PropertyForm
        submitHandler={handleSubmitFn}
        submitButtonLabel={
          <>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create Property
          </>
        }
      />
    </div>
  );
};

export default NewPropertyForm;
