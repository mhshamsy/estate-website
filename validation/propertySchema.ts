import { z } from "zod";

export const propertyDataSchema = z.object({
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  postcode: z.string(),
  price: z.coerce.number().positive("price must be greater than zero"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  description: z.string().optional(),
  status: z.enum(["draft", "for_sale", "withdrawn", "sold"]),
});

export const propertyImageSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
});

export const propertySchema = propertyDataSchema.and(propertyImageSchema);
//.extend({images: z.array(propertyImageSchema).optional().default([]),});

export type PropertySchema = z.infer<typeof propertyDataSchema>;
export type PropertyImageSchema = z.infer<typeof propertySchema>;
