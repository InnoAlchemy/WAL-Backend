import { Router } from 'express';
import {  addCategory, deleteCategory, getCategoryByType, getAllTypes, getCategoryById,updateCategory } from '#/controllers/category';
import { validate } from '#/middleware/validator';
import { CategoryIdParamSchema, CreateCategorySchema, updateCategorySchema } from '#/utils/validationSchema';
import { isAuth } from '#/middleware/auth';

const router = Router();

router.post('/', isAuth, validate(CreateCategorySchema), addCategory);

router.post('/getCategoryByType', isAuth,  getCategoryByType);

router.get('/:id', isAuth, validate(CategoryIdParamSchema, 'params'), getCategoryById);

router.get('/getAllTypes', isAuth, getAllTypes);

router.put('/:id', isAuth, validate(CategoryIdParamSchema, 'params'), validate(updateCategorySchema), updateCategory);

router.delete('/:id', isAuth, validate(CategoryIdParamSchema, 'params'), deleteCategory);



export default router;
