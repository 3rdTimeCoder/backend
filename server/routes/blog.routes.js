import express from 'express';
import blogCtrl from '../controllers/blog.controller.js';


const router = express.Router()


router.route('/api/blogs')
    .get(blogCtrl.list)
    .post(blogCtrl.create)


router.route('/api/blogs/search')
    .post(blogCtrl.search)
    

router.route('/api/blogs/:blogId')
    .get(blogCtrl.read)
    .put(blogCtrl.update)
    .delete(blogCtrl.remove)


router.param('blogId', blogCtrl.blogByID)


export default router
