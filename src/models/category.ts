import { Schema, model, Document } from "mongoose";

interface Category extends Document {
    name: string;
    description: string;
    type: string;
 
}

const category = new Schema<Category>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    description: {
        type: String,
        trim:true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ['product', 'event', 'blog']
    },
});

export default model<Category>("Category", category);
