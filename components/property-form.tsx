"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema } from "@/validation/propertySchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultiImageUploader, { ImageUpload } from "./multi-image-uploader";

type Props = {
  submitButtonLabel: React.ReactNode;
  submitHandler: (data: z.infer<typeof propertySchema>) => void;
  defaultValues?: Partial<z.infer<typeof propertySchema>>;
};

export default function PropertyForm({
  submitHandler,
  submitButtonLabel,
  defaultValues,
}: Props) {
  const combinedDefaultValues: z.infer<typeof propertySchema> = {
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    status: "draft",
    description: "",
    images: [],
    ...defaultValues,
  };

  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: combinedDefaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <fieldset
            className="flex flex-col gap-2"
            disabled={form.formState.isSubmitting}
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="for_sale">ForSale</SelectItem>
                        <SelectItem value="withdrawn">WithDrawn</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          <fieldset
            className="flex flex-col gap-2"
            disabled={form.formState.isSubmitting}
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      //min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      //min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiImageUploader
                  onImagesChange={(images: ImageUpload[]) => {
                    form.setValue("images", images);
                  }}
                  images={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mx-auto mt-2 flex w-full max-w-md gap-2"
          disabled={form.formState.isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
}
