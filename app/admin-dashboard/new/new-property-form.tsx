// app/admin-dashboard/new/new-property-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { propertySchema } from "@/validation/propertySchema";
import z from "zod";
import PropertyForm from "@/components/property-form";
import { PlusCircleIcon } from "lucide-react";
import { uploadImages, updatePropertiesImages } from "../actions";
import createProperty from "./actions";

const NewPropertyForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmitFn = async (data: z.infer<typeof propertySchema>) => {
    try {
      let newPropertyId: string | null = null;
      let imageUrls: string[] = [];

      // ✅ مرحله ۱: ساخت ملک خالی
      const createResponse = await createProperty({
        ...data,
        images: [],
      });

      if (createResponse.error || !createResponse.data) {
        throw new Error(createResponse.message);
      }
      newPropertyId = createResponse.data.id;

      // ✅ 2. استخراج فایل‌های خالص از data.images
      // data.images حالا از نوع ImageUpload[] هست
      const filesToUpload = data.images
        .map((img) => img.file) // فقط فایل‌ها رو بگیر
        .filter((file): file is File => file !== undefined); // فیلتر کردن undefined

      if (filesToUpload.length > 0) {
        const uploadResult = await uploadImages(newPropertyId, filesToUpload);

        if (!uploadResult.success || !uploadResult.urls) {
          throw new Error(uploadResult.message);
        }
        imageUrls = uploadResult.urls;
      }

      // ✅ مرحله ۳: آپدیت ملک با آدرس‌های تصاویر
      if (imageUrls.length > 0) {
        const updateResponse = await updatePropertiesImages(newPropertyId, {
          newImages: imageUrls,
        });

        if (updateResponse.error) {
          throw new Error(updateResponse.message);
        }
      }

      toast({
        title: "Success!",
        description: "Property Created",
        variant: "success",
      });

      router.push("/admin-dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error!",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
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
