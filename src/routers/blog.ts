import { Router } from 'express';
import { addCommentToBlogPost, addViewToBlogPost, createBlog, deleteBlog, getBlogById, likeBlogPost, updateBlog } from '#/controllers/blog';
import { validate } from '#/middleware/validator';
import { BlogIdParamSchema, CommentSchema, CreateBlogSchema, UpdateBlogSchema } from '#/utils/validationSchema';
import { isAuth } from '#/middleware/auth';

const router = Router();

// Create a new blog post
router.post('/', isAuth, validate(CreateBlogSchema), createBlog);
// Get blog post details by ID
router.get('/:id', isAuth, validate(BlogIdParamSchema, 'params'), getBlogById);

// Update blog post by ID
router.put('/:id', isAuth, validate(BlogIdParamSchema, 'params'), validate(UpdateBlogSchema), updateBlog);
// Delete a blog post by ID
router.delete('/:id', isAuth, validate(BlogIdParamSchema, 'params'), deleteBlog);

// Add a like to a blog post by ID
router.post('/like/:id', isAuth, validate(BlogIdParamSchema, 'params'), likeBlogPost);
// Add a comment to a blog post by ID
router.post('/comment/:id', isAuth, validate(BlogIdParamSchema, 'params'), validate(CommentSchema), addCommentToBlogPost);

// Add a view to a blog post
router.post('/view/:id', isAuth, addViewToBlogPost);

export default router;
