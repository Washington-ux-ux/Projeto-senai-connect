import { Router } from "express";
import * as userController from "./src/controllers/usersControllers";
import * as postsController from "./src/controllers/postsControllers"
import * as requestsController from "./src/controllers/requestsControllers"
import * as chatController from "./src/controllers/chatControllers"
import * as academicEventsController from "./src/controllers/academicEventsController"
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
router.get('/posts/summary', authenticate, postsController.summaryIAPosts);
router.post('/posts', authenticate, authorize('TEACHER', 'COORDINATOR', 'DIRECTOR', 'ADMIN'), postsController.createPosts);
router.delete('/posts/:id', authenticate, authorize('TEACHER', 'COORDINATOR', 'DIRECTOR', 'ADMIN'), postsController.deletePosts);
router.post('/posts/:id/emoji', authenticate, postsController.emojiPosts);

// Protected Requests Routes
router.get('/requests', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), requestsController.getAllRequests);
router.get('/requests/my', authenticate, requestsController.getMyRequests);
router.post('/requests', authenticate, requestsController.postRequests);
router.put('/requests/:id', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), requestsController.updateRequests);

// Protected ChatRooms Routes
router.get('/chat/rooms', authenticate, chatController.getChatRoom);
router.get('/chat/rooms/:roomId/messages', authenticate, chatController.getMessagesRoom);

// Public AcademicEvents Routes
router.get('/academic-events', academicEventsController.getAcademicEvents);
router.get('/academic-events/date/:calendar', academicEventsController.getAcademicEventByCalendar);

export default router;