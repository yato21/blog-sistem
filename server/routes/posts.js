const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

router.get('/stats', postController.getStats);
router.get('/', postController.getAllPosts);
router.post('/', authMiddleware, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/comments', authMiddleware, postController.createComment);

module.exports = router; 