import { Router } from "express";
import RelationshipController from "../controllers/relationshipController.js";

const router = Router();

router.get('/friend', RelationshipController.getFriends);
router.get('/follower', RelationshipController.getFollowers);
router.get('/subscription', RelationshipController.getSubscriptions);
router.get('/find', RelationshipController.getUsersByFullName);

router.patch('/friend', RelationshipController.createFollowerFromFriend);
router.delete('/subscription', RelationshipController.deleteRequestFriend);
router.patch('/follower', RelationshipController.createFriendFromFollower);
router.post('/person', RelationshipController.createRequestFriend); 

export default router;