"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { MoveIcon, XIcon, AlertCircle } from "lucide-react";

export type ImageUpload = {
  id: string;
  url: string;
  file?: File;
};

type Props = {
  images?: ImageUpload[];
  onImagesChange: (images: ImageUpload[]) => void;
  urlFormater: (image: ImageUpload) => string;
  maxFiles?: number;
  maxFileSizeMB?: number;
};

const MultiImageUploader = ({
  images = [],
  onImagesChange,
  urlFormater,
  maxFiles = 5,
  maxFileSizeMB = 2,
}: Props) => {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // پاک کردن خطای قبلی
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // 1. بررسی تعداد کل فایل‌ها (قدیمی + جدید)
    if (images.length + files.length > maxFiles) {
      setError(
        `حداکثر ${maxFiles} عکس مجاز است. شما ${
          images.length + files.length
        } عکس انتخاب کرده‌اید.`
      );
      // ریست کردن اینپوت برای اجازه انتخاب مجدد
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
      return;
    }

    // 2. بررسی حجم هر فایل جدید
    const oversizedFiles = files.filter(
      (file) => file.size > maxFileSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      const names = oversizedFiles.map((f) => f.name).join(", ");
      setError(
        `حجم فایل‌های زیر بیش از ${maxFileSizeMB} مگابایت است: ${names}`
      );
      // فقط فایل‌های سالم را اضافه کن
      const validFiles = files.filter(
        (file) => file.size <= maxFileSizeMB * 1024 * 1024
      );

      if (validFiles.length > 0) {
        const newImages = validFiles.map((file, index) => ({
          id: `${Date.now()}-${index}-${file.name}`,
          url: URL.createObjectURL(file),
          file,
        }));
        onImagesChange([...images, ...newImages]);
      }

      // ریست کردن اینپوت
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
      return;
    }

    // 3. اگر همه چیز OK بود، فایل‌ها را اضافه کن
    const newImages = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      url: URL.createObjectURL(file),
      file,
    }));

    onImagesChange([...images, ...newImages]);

    // ریست کردن اینپوت برای اجازه انتخاب مجدد
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(images);
    const [reorderedImage] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedImage);
    onImagesChange(items);
  };

  const handleDelete = (id: string) => {
    const updatedImages = images.filter((image) => image.id !== id);
    onImagesChange(updatedImages);
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      {/* نمایش پیام خطا */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <input
        className="hidden"
        ref={uploadInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
      />

      <Button
        className="w-full"
        variant="outline"
        onClick={() => uploadInputRef?.current?.click()}
        type="button"
      >
        Upload Images
      </Button>

      {/* نمایش لیست فایل‌های انتخاب شده (اگر تعداد زیاد است یا برای شفافیت بیشتر) */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-slate-500">
            {images.length} از {maxFiles} عکس انتخاب شده است.
          </p>
          <ul className="space-y-1 text-xs text-slate-600">
            {images.map((img, idx) => (
              <li key={img.id} className="flex justify-between">
                <span>{img.file?.name || `Image ${idx + 1}`}</span>
                <span>
                  {img.file ? (img.file.size / 1024 / 1024).toFixed(2) : "-"} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="property-images" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="relative p-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden rounded-lg bg-gray-100">
                        <div className="relative size-16">
                          <Image
                            src={urlFormater ? urlFormater(image) : image.url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="grow">
                          <p className="text-sm font-medium">
                            Image{index + 1}
                          </p>
                          {index === 0 && (
                            <Badge variant="success">Featured Image</Badge>
                          )}
                        </div>
                        <div className="flex items-center p-2">
                          <div className="text-gray-500">
                            <MoveIcon />
                          </div>
                          <button
                            className="p-2 text-red-500"
                            onClick={() => handleDelete(image.id)}
                          >
                            <XIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default MultiImageUploader;
