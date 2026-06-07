'use client';

import { Property } from '@/types/property';
import PropertyForm from '@/components/property-form';
import { propertyDataSchema } from '@/validation/propertySchema';
import { SaveIcon } from 'lucide-react';
import z from 'zod';
import { updateProperty } from './actions'; // مسیر صحیح فایل اکشن
import { useRouter } from 'next/navigation'; // ✅ استفاده از next/navigation
import { useToast } from '@/hooks/use-toast';

type Props = Property;

const EditPropertyForm = ({
  id,
  address1,
  address2,
  city,
  postcode,
  price,
  bedrooms,
  bathrooms,
  description,
  status,
}: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const submitHandler = async (data: z.infer<typeof propertyDataSchema>) => {
    const response = await updateProperty(id, data);

    if (response.error) {
      toast({
        title: 'Error!',
        description: response.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success!',
      description: 'Property Updated', // ✅ اصلاح غلط املایی: Uptated -> Updated
      variant: 'success',
    });

    // ✅ هدایت به صفحه داشبورد
    router.push('/admin-dashboard');
  };

  return (
    <div>
      <PropertyForm
        submitHandler={submitHandler}
        submitButtonLabel={
          <>
            <SaveIcon className="mr-2 h-4 w-4" /> Save Property
          </>
        }
        defaultValues={{
          address1,
          address2: address2 || '',
          city,
          postcode,
          price,
          bedrooms,
          bathrooms,
          description: description || '',
          status,
        }}
      />
    </div>
  );
};

export default EditPropertyForm;
