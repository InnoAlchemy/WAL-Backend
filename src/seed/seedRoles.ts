import mongoose from "mongoose";
import Role from "../models/roles"; // Adjust the path based on your project structure
import dotenv from "dotenv";

// Load environment variables (if you're using .env for your DB connection)
dotenv.config();

// Define an array of default roles
const roles = [
  { name: "Admin" },
  { name: "Organizer" },
  { name: "Client" }
];

// Function to seed roles
async function seedRoles() {
  try {
    // Connect to your database (No need for useNewUrlParser and useUnifiedTopology in Mongoose 6+)
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to database");

    // Iterate through each role and check if it exists in the DB
    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        // Create the role if it doesn't exist
        await Role.create(roleData);
        console.log(`Role ${roleData.name} created`);
      } else {
        console.log(`Role ${roleData.name} already exists`);
      }
    }

    console.log("Roles seeding completed!");
  } catch (error) {
    console.error("Error seeding roles:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Run the seed function
// npx ts-node src/seed/seedRoles.ts

seedRoles();
