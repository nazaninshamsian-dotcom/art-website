import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.painting.count();
  if (count > 0) {
    console.log('Paintings already exist, skipping seed.');
    return;
  }

  await prisma.painting.createMany({
    data: [
      {
        title: 'Low Tide',
        description: 'A study of the coastline at dusk, worked in loose, weighted brushstrokes.\nPainted on location over three sessions.',
        medium: 'Oil on canvas',
        dimensions: '24 x 30 in',
        year: 2025,
        priceCents: 85000,
        imageUrl: 'https://picsum.photos/seed/lowtide/1000/1250',
        status: 'available',
      },
      {
        title: 'Interior, Morning Light',
        description: 'Quiet domestic scene exploring the way early light falls across a room.',
        medium: 'Oil on linen',
        dimensions: '18 x 24 in',
        year: 2024,
        priceCents: 62000,
        imageUrl: 'https://picsum.photos/seed/interior/1000/1250',
        status: 'available',
      },
      {
        title: 'Orchard Study No. 4',
        description: 'Part of an ongoing series painted in the same orchard across four seasons.',
        medium: 'Acrylic on panel',
        dimensions: '12 x 16 in',
        year: 2024,
        priceCents: 34000,
        imageUrl: 'https://picsum.photos/seed/orchard/1000/1250',
        status: 'sold',
      },
    ],
  });

  console.log('Seeded 3 paintings.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
