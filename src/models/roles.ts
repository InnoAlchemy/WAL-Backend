import { Schema, model, Document } from "mongoose";

// Define the Role document interface
export interface RoleDocument extends Document {
  name: string;  // Role name, e.g., "Owner", "Admin", "Organizer", "Client"
}

// Create the Role schema with just the name field
const roleSchema = new Schema<RoleDocument>({
  name: {
    type: String,
    required: true,
    unique: true,  // Ensures each role is unique
  }
}, { timestamps: true });

export default model<RoleDocument>("Role", roleSchema);
