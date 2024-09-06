import { RequestHandler } from "express";
import Blog from "#/models/blog"; // Assuming you have this path for models
import { CommentPayload } from "#/@types/user";
import { isValidObjectId } from "mongoose";

export const createBlog: RequestHandler = async (req, res) => {
  try {
    const { title, files, tags, description } = req.body;

    // Create a new blog post
    const blog = await Blog.create({
      title,
      files,
      tags,
      description,
    });

    res.status(201).json({ blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(400).json({ error: "Failed to create blog post" });
  }
};

export const getBlogById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the blog post by ID
      const blog = await Blog.findById(id);
  
      // If the blog post is not found, return 404
      if (!blog) {
        return res.status(404).json({ error: "Blog post not found" });
      }
  
      // Return the blog details
      res.status(200).json({
        id: blog._id,
        title: blog.title,
        files: blog.files,
        tags: blog.tags,
        description: blog.description,
        likes: blog.likes || 0,  // Assuming you may have a likes field in the future
        comments: blog.comments || 0,  // Assuming a comments feature
      });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const updateBlog: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, files, tags, description } = req.body;
  
      // Only update fields that are provided in the request body
      const updateData: any = {};
      if (title) updateData.title = title;
      if (files) updateData.files = files;
      if (tags) updateData.tags = tags;
      if (description) updateData.description = description;
  
      // Find the blog post by ID and update it with the provided data
      const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true, // Ensure schema validation
      });
  
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      res.status(200).json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(400).json({ error: 'Bad request' });
    }
  };

 export const deleteBlog: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the blog post by ID and delete it
      const deletedBlog = await Blog.findByIdAndDelete(id);
  
      // If the blog post doesn't exist, return a 404 error
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const likeBlogPost: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the blog post by ID
      const blogPost = await Blog.findById(id);
  
      // If the blog post doesn't exist, return a 404 error
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      // Increment the like count
      blogPost.likes += 1;
  
      // Save the updated blog post
      await blogPost.save();
  
      res.status(200).json({ message: 'Like added to blog post' });
    } catch (error) {
      console.error('Error liking blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const addCommentToBlogPost: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, comment }: CommentPayload = req.body;
  
      // Validate ObjectId
      if (!isValidObjectId(id) || !isValidObjectId(user_id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
  
      // Find the blog post by ID
      const blogPost = await Blog.findById(id);
  
      // If the blog post doesn't exist, return a 404 error
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      // Add the new comment
      blogPost.comments.push({ user: user_id, comment });
  
      // Save the updated blog post
      await blogPost.save();
  
      res.status(201).json({ message: 'Comment added to blog post' });
    } catch (error) {
      console.error('Error adding comment to blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const addViewToBlogPost: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate ObjectId
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
  
      // Find the blog post by ID
      const blogPost = await Blog.findById(id);
  
      // If the blog post doesn't exist, return a 404 error
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      // Increment the views count
      blogPost.views += 1;
  
      // Save the updated blog post
      await blogPost.save();
  
      res.status(200).json({ message: 'View added to blog post' });
    } catch (error) {
      console.error('Error adding view to blog post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  