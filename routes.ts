 import { Router } from "express";
import * as userController from "./src/controllers/usersControllers";
import * as postsController from "./src/controllers/postsControllers"
import * as academicEventsController from "./src/controllers/academicEventsController"
import * as linksController from "./src/controllers/linksControllers"
import { authenticate, authorize } from "./src/middlewares/authMiddleware";

const router = Router();

// Public User routes
router.post('/user/register', userController.RegisterUser);
router.post('/user/login', userController.LoginUser);

// Protected User routes
router.get('/user/me', authenticate, userController.getMyUser);

// Public Posts routes (read-only)
router.get('/posts', postsController.getPosts);
router.get('/posts/:id', postsController.getPostsById);

// Protected Posts routes (write operations)
router.get('/posts/summary', authenticate, authorize('TEACHER', 'COORDINATOR', 'ADMIN'), postsController.summaryIAPosts);
router.post('/posts', authenticate, authorize('TEACHER', 'COORDINATOR', 'ADMIN'), postsController.createPosts);
router.delete('/posts/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), postsController.deletePosts);
router.post('/posts/:id/emoji', authenticate, postsController.emojiPosts);

// Public AcademicEvents Routes (read-only)
router.get('/academic-events', academicEventsController.getAcademicEvents);
router.get('/academic-events/date/:calendar', academicEventsController.getAcademicEventByCalendar);

// Protected AcademicEvents Routes (write operations)
router.post('/academic-events', authenticate, authorize('COORDINATOR', 'ADMIN'), academicEventsController.createAcademicEvent);
router.delete('/academic-events/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), academicEventsController.deleteAcademicEvent);

// Public Links Routes (read-only)
router.get('/links', linksController.getLinks);

// Protected Links Routes (write operations)
router.post('/links', authenticate, authorize('COORDINATOR', 'ADMIN'), linksController.createLink);
router.put('/links/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), linksController.updateLink);
router.delete('/links/:id', authenticate, authorize('COORDINATOR', 'ADMIN'), linksController.deleteLink);

export default router;