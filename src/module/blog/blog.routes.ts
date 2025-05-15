import express from 'express';
import BlogController from './blog.controller';
import validationRequest from '../../middleware/validationRequest';
import BlogValidationSchema from './blog.zod.validation';
import { uploadBlog } from '../../app/multer/blog.multer';

const router = express.Router()

router.get('/getAllBlog',
    BlogController.getAllBlog
)

router.post('/create-blog',
    validationRequest(BlogValidationSchema.createBlogValidation),
    uploadBlog.single('blogImage'),
    BlogController.createNewBlog
)

router.patch('/update-blog',
    validationRequest(BlogValidationSchema.updateBlogValidation),
    uploadBlog.single('blogImage'),
    BlogController.updateBlog
)

router.delete('/delete-blog',
    validationRequest(BlogValidationSchema.deleteBlogValidation),
    BlogController.deleteBlog
)

router.delete('/delete-all-blog',
    BlogController.deleteAllBlog
)

export const BlogRouter = router
