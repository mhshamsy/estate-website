import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image.findMany();

  for (const image of images) {
    // اگه url به صورت آبجکته
    if (typeof image.url === "object" && image.url !== null) {
      const fixedUrl = (image.url as any).url || String(image.url);

      await prisma.image.update({
        where: { id: image.id },
        data: { url: fixedUrl },
      });

      console.log(`✅ Fixed image ${image.id}: ${fixedUrl}`);
    }
  }

  console.log("🎉 همه عکس‌ها اصلاح شدن!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
