import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: 'Academics Notes',
    slug: 'academics-notes',
    description: 'Lecture notes, study materials, and academic resources'
  },
  {
    name: 'Gate Notes',
    slug: 'gate-notes',
    description: 'GATE exam preparation materials and study guides'
  },
  {
    name: 'Quantum',
    slug: 'quantum',
    description: 'Quantum computing and quantum mechanics resources'
  },
  {
    name: 'Placement Resources',
    slug: 'placement-resources',
    description: 'Interview preparation, resume templates, and career resources'
  },
  {
    name: 'Others',
    slug: 'others',
    description: 'Miscellaneous resources and materials'
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');
    
    for (const category of defaultCategories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug }
      });
      
      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    }
    
    console.log('🎉 Categories seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories(); 