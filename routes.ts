import { Router } from "express";
import * as userController from "./src/controllers/usersControllers";
import * as postsController from "./src/controllers/postsControllers"
import * as requestsController from "./src/controllers/requestsControllers"
import * as chatController from "./src/controllers/chatControllers"
import * as academicEventsController from "./src/controllers/academicEventsController"

const router = Router();

// User routes
router.get('/user/me', userController.getMyUser);
router.post('/user/register', userController.RegisterUser);
router.post('/user/login', userController.LoginUser);

// Posts routes
router.get('/posts', postsController.getPosts);
router.get('/posts/:id', postsController.getPostsById);
router.get('/posts/summary', postsController.summaryIAPosts);
router.post('/posts', postsController.createPosts);
router.delete('/posts/:id', postsController.deletePosts);
router.post('/posts/:id/emoji', postsController.emojiPosts);

// Requests Routes
router.get('/requests', requestsController.getAllRequests);
router.get('/requests/my', requestsController.getMyRequests);
router.post('/requests', requestsController.postRequests);
router.put('/requests/:id', requestsController.updateRequests);

// ChatRooms Routes
router.get('/chat/rooms', chatController.getChatRoom);
router.get('/chat/rooms/:roomId/messages', chatController.getMessagesRoom);

// AcademicEvents Routes
router.get('/academic-events', academicEventsController.getAcademicEvents);
router.get('/academic-events/date/:calendar', academicEventsController.getAcademicEventByCalendar);

export default router;