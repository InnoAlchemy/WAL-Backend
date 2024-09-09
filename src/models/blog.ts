import { Schema, model, Document } from 'mongoose';

interface Comment {
  user: Schema.Types.ObjectId;
  comment: string;
}

interface Blog extends Document {
  title: string;
  files: string[];
  tags: string[];
  description: string;
  likes: number;
  comments: Comment[]; // Updated to be an array of comments
  views: number;
  category:string;
}

const blogSchema = new Schema<Blog>({
    title: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    }],
    views: {
      type: Number,
      default: 0, // Initialize with 0 views
    },
    category: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
const Blog = model<Blog>('Blog', blogSchema);
export default Blog;
