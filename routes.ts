 import { Router } from "express";
import * as userController from "./src/controllers/usersControllers";
import * as postsController from "./src/controllers/postsControllers"
import * as academicEventsController from "./src/controllers/academicEventsController"
import * as linksController from "./src/controllers/linksControllers"
import * as reactionsController from "./src/controllers/reactionsControllers"
import * as authController from "./src/controllers/authControllers"
import { authenticate, authorize } from "./src/middlewares/authMiddleware";

const router = Router();

// rotas publicas de user
router.post('/user/register', userController.RegisterUser);
router.post('/user/login', userController.LoginUser);

// rotas protegidas de user
router.get('/user/me', authenticate, userController.getMyUser);

// rotas publicas de posts (leitura)
router.get('/posts', postsController.getPosts);
router.get('/posts/:id', postsController.getPostsById);

// rotas protegidas de posts (escrita)
router.get('/posts/summary', authenticate, authorize('TEACHER', 'COORDINATOR', 'ADMIN'), postsController.summaryIAPosts);
router.post('/posts', authenticate, authorize('TEACHER', 'COORDINATOR', 'ADMIN'), postsController.createPosts);
router.put('/posts/:id', authenticate, authorize('TEACHER', 'COORDINATOR', 'ADMIN'), postsController.updatePosts);
router.delete('/posts/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), postsController.deletePosts);
router.post('/posts/:id/emoji', authenticate, postsController.emojiPosts);

// rotas publicas de academic events (leitura)
router.get('/academic-events', academicEventsController.getAcademicEvents);
router.get('/academic-events/date/:calendar', academicEventsController.getAcademicEventByCalendar);

// rotas protegidas de academic events (escrita)
router.post('/academic-events', authenticate, authorize('COORDINATOR', 'ADMIN'), academicEventsController.createAcademicEvent);
router.delete('/academic-events/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), academicEventsController.deleteAcademicEvent);

// rotas publicas de links (leitura)
router.get('/links', linksController.getLinks);

// rotas protegidas de links (escrita)
router.post('/links', authenticate, authorize('COORDINATOR', 'ADMIN'), linksController.createLink);
router.put('/links/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), linksController.updateLink);
router.delete('/links/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), linksController.deleteLink);

// rotas publicas de reactions (leitura)
router.get('/reactions/:postId', reactionsController.getReactionsByPostId);

// rotas protegidas de reactions (escrita)
router.post('/reactions/:postId', authenticate, reactionsController.createOrUpdateReaction);
router.delete('/reactions/:postId', authenticate, authorize('COORDINATOR', 'ADMIN'), reactionsController.deleteReactionsByPostId);

// Rotas de autenticação
router.post('/auth/change-password', authenticate, authController.changePassword);
router.post('/auth/forgot-password', authController.forgotPassword);

export default router;