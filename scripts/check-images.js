// scripts/check-images.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image.findMany();
  let problemCount = 0;

  for (const image of images) {
    if (typeof image.url === "object" || image.url.startsWith("{")) {
      console.log(`❌ مشکل: ${image.id} -> ${image.url}`);
      problemCount++;
    } else {
      console.log(`✅ درست: ${image.id} -> ${image.url}`);
    }
  }

  console.log(`\n📊 مجموع: ${images.length} رکورد`);
  console.log(`❌ مشکل دار: ${problemCount}`);
  console.log(`✅ سالم: ${images.length - problemCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
