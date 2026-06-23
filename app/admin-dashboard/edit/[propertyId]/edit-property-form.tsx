"use client";

import { Property } from "@/types/property";
import PropertyForm from "@/components/property-form";
import { propertySchema } from "@/validation/propertySchema";
import { SaveIcon } from "lucide-react";
import z from "zod";
import { updateProperty } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { updatePropertiesImages, uploadImages } from "../../actions";

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
  images = [],
}: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const submitHandler = async (data: z.infer<typeof propertySchema>) => {
  try {
    const { images: newImages, ...propertyData } = data;

    // ✅ مرحله ۱: آپدیت اطلاعات ملک
    const updateResponse = await updateProperty(id, propertyData);

    if (updateResponse.error) {
      toast({
        title: "Error!",
        description: updateResponse.message,
        variant: "destructive",
      });
      return;
    }

    // ✅ تشخیص عکس‌های حذف شده
    const currentImageIds = images.map((img: any) => img.id);
    const newImageIds = newImages
      ?.filter(img => img.id) // عکس‌هایی که id دارن (قدیمی)
      .map(img => img.id);
    
    const deletedImageIds = currentImageIds.filter(
      id => !newImageIds?.includes(id)
    );

    // ✅ تشخیص عکس‌های جدید
    const filesToUpload = newImages
      ?.filter(img => img.file) // عکس‌هایی که file دارن (جدید)
      .map(img => img.file)
      .filter((file): file is File => file !== undefined);

    let uploadedUrls: string[] = [];

    if (filesToUpload && filesToUpload.length > 0) {
      const uploadResult = await uploadImages(id, filesToUpload);
      if (!uploadResult.success || !uploadResult.urls) {
        throw new Error(uploadResult.message);
      }
      uploadedUrls = uploadResult.urls;
    }

    // ✅ آپدیت عکس‌ها (حذف + اضافه)
    if (deletedImageIds.length > 0 || uploadedUrls.length > 0) {
      const saveImagesResponse = await updatePropertiesImages(id, {
        newImages: uploadedUrls,
        deletedImageIds: deletedImageIds,
      });

      if (saveImagesResponse.error) {
        throw new Error(saveImagesResponse.message);
      }
    }
      toast({
        title: "Success!",
        description: "Property Updated",
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
        submitHandler={submitHandler}
        submitButtonLabel={
          <>
            <SaveIcon className="mr-2 h-4 w-4" /> Save Property
          </>
        }
        defaultValues={{
          address1,
          address2: address2 || "",
          city,
          postcode,
          price,
          bedrooms,
          bathrooms,
          description: description || "",
          status,
          images: images.map((image: any) => ({
            id: image.id,
            url: image.url,
          })),
        }}
      />
    </div>
  );
};

export default EditPropertyForm;
