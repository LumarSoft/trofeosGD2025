const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = "admin@trofeosgd.com";
    const adminPassword = "admin123!!";

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log("El usuario administrador ya existe");
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el usuario administrador
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        // Si has añadido el campo is_admin a la base de datos:
        // is_admin: true
      },
    });

    console.log("Usuario administrador creado con éxito:", admin.id);
  } catch (error) {
    console.error("Error al crear usuario administrador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
