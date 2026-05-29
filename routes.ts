import { Router } from "express";
import * as userController from "./src/controllers/usersControllers";
import * as postsController from "./src/controllers/postsControllers"
import * as requestsController from "./src/controllers/requestsControllers"
import * as chatController from "./src/controllers/chatControllers"
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
router.get('/posts/summary', authenticate, authorize('TEACHER', 'COORDINATOR', 'DIRECTOR', 'ADMIN'), postsController.summaryIAPosts);
router.post('/posts', authenticate, authorize('TEACHER', 'COORDINATOR', 'DIRECTOR', 'ADMIN'), postsController.createPosts);
router.delete('/posts/:id', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), postsController.deletePosts);
router.post('/posts/:id/emoji', authenticate, postsController.emojiPosts);

// Protected Requests Routes
router.get('/requests', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), requestsController.getAllRequests);
router.get('/requests/my', authenticate, requestsController.getMyRequests);
router.post('/requests', authenticate, authorize('STUDENT', 'TEACHER'), requestsController.postRequests);
router.put('/requests/:id', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), requestsController.updateRequests);

// Protected ChatRooms Routes
router.get('/chat/rooms', authenticate, chatController.getChatRoom);
router.get('/chat/rooms/:roomId/messages', authenticate, chatController.getMessagesRoom);

// Public AcademicEvents Routes (read-only)
router.get('/academic-events', academicEventsController.getAcademicEvents);
router.get('/academic-events/date/:calendar', academicEventsController.getAcademicEventByCalendar);

// Protected AcademicEvents Routes (write operations)
router.post('/academic-events', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), academicEventsController.createAcademicEvent);
router.delete('/academic-events/:id', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), academicEventsController.deleteAcademicEvent);

// Public Links Routes (read-only)
router.get('/links', linksController.getLinks);

// Protected Links Routes (write operations)
router.post('/links', authenticate, authorize('COORDINATOR', 'DIRECTOR', 'ADMIN'), linksController.createLink);

export default router;