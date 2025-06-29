import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "Academics Notes",
    slug: "academics-notes",
    description: "Lecture notes, study materials, and academic resources"
  },
  {
    name: "Gate Notes",
    slug: "gate-notes",
    description: "GATE exam preparation materials and study guides"
  },
  {
    name: "Quantum",
    slug: "quantum",
    description: "Quantum computing and quantum mechanics resources"
  },
  {
    name: "Placement Resources",
    slug: "placement-resources",
    description: "Interview preparation, resume templates, and career resources"
  },
  {
    name: "Others",
    slug: "others",
    description: "Miscellaneous resources and materials"
  }
];

async function seedProductionCategories() {
  try {
    console.log('🌱 Starting production category seeding...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const category of defaultCategories) {
      const existingCategory = await prisma.category.findUnique({
        where: {
          slug: category.slug
        }
      });
      
      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
        createdCount++;
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
        skippedCount++;
      }
    }
    
    console.log('\n🎉 Production seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Created: ${createdCount} categories`);
    console.log(`   - Skipped: ${skippedCount} categories`);
    console.log(`   - Total: ${createdCount + skippedCount} categories`);
    
  } catch (error) {
    console.error('❌ Error during production seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedProductionCategories(); 