import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const prisma = new PrismaClient();

async function seedProduction() {
  console.log("─────────────────────────────────────────────────────────────────");
  console.log("ANVESHAKHUB ENTERPRISE PRODUCTION INITIALIZATION");
  console.log("─────────────────────────────────────────────────────────────────");

  const adminEmail = "anveshakhub26@gmail.com";
  const adminPassword = "Anveshak";

  // 1. Check or Provision Admin User in Supabase Auth
  console.log(`1. Auto-provisioning Administrator Account (${adminEmail})...`);
  
  let authUserId = null;
  const { data: usersList } = await supabase.auth.admin.listUsers();
  
  const existingAuthUser = usersList?.users?.find(u => u.email === adminEmail);

  if (existingAuthUser) {
    authUserId = existingAuthUser.id;
    console.log("✅ Admin user already exists in Supabase Auth! ID:", authUserId);
  } else {
    const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "AnveshakHub Super Administrator",
        role: "SUPER_ADMIN",
      }
    });

    if (createError) {
      console.error("❌ Failed to create Admin in Supabase Auth:", createError.message);
    } else {
      authUserId = newAuthUser.user.id;
      console.log("✅ Admin user created in Supabase Auth! ID:", authUserId);
    }
  }

  // 2. Ensure Admin User Record Exists in Supabase PostgreSQL via Prisma
  if (authUserId) {
    const dbUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        role: "SUPER_ADMIN",
        name: "AnveshakHub Super Administrator",
      },
      create: {
        email: adminEmail,
        name: "AnveshakHub Super Administrator",
        role: "SUPER_ADMIN",
      }
    });
    console.log("✅ Admin User synced in Supabase PostgreSQL! ID:", dbUser.id);
  }

  // 3. Seed Industry Types
  console.log("2. Seeding enterprise Industry Types...");
  const industryTypes = [
    { code: "AEROSPACE", name: "Aerospace & Defense", description: "Avionics, Hypersonics, Satellite Tech, Drone Flight Software" },
    { code: "CLEAN_ENERGY", name: "Clean Energy & Smart Grid", description: "Solar Micro-Grids, Solid-State Relays, Power Electronics" },
    { code: "BIOTECH", name: "Biotechnology & Healthcare", description: "Bioreactors, Medical Devices, Clinical AI Diagnostics" },
    { code: "ROBOTICS_IOT", name: "Robotics & Hardware IoT", description: "ROS2 Autonomous Rovers, Sensor Fusion, Embedded Firmware" },
    { code: "SOFTWARE_AI", name: "Enterprise Software & AI", description: "Multi-Agent Systems, High-Performance Computing, Cyber Security" },
  ];

  for (const it of industryTypes) {
    await prisma.industryType.upsert({
      where: { code: it.code },
      update: { name: it.name, description: it.description },
      create: { code: it.code, name: it.name, description: it.description }
    });
  }
  console.log("✅ Industry Types seeded successfully!");

  // 4. Seed Expert Categories
  console.log("3. Seeding Expert Categories...");
  const expertCategories = [
    { code: "TECHNICAL_CONSULTANT", name: "Technical Consultant", group: "TECHNICAL", description: "Deep-tech domain experts and hardware architects" },
    { code: "ACADEMIC_RESEARCHER", name: "Academic Researcher", group: "ACADEMIC", description: "IIT/IISc professors, Ph.D. scholars, and lab directors" },
    { code: "INDUSTRY_ADVISOR", name: "Industry Executive", group: "ADVISORY", description: "VP Engineering, CTOs, and compliance advisors" },
    { code: "IP_LEGAL_EXPERT", name: "Patent & Legal Advisor", group: "PROFESSIONAL", description: "Intellectual Property attorneys and NDA/MOU specialists" },
  ];

  for (const ec of expertCategories) {
    await prisma.expertCategory.upsert({
      where: { code: ec.code },
      update: { name: ec.name, group: ec.group, description: ec.description },
      create: { code: ec.code, name: ec.name, group: ec.group, description: ec.description }
    });
  }
  console.log("✅ Expert Categories seeded successfully!");

  console.log("─────────────────────────────────────────────────────────────────");
  console.log("PRODUCTION INITIALIZATION COMPLETE — SYSTEM IS READY!");
  console.log("  Admin Login: anveshakhub26@gmail.com / Anveshak");
  console.log("─────────────────────────────────────────────────────────────────");

  await prisma.$disconnect();
}

seedProduction().catch(err => {
  console.error("❌ Seed Error:", err);
  prisma.$disconnect();
});
