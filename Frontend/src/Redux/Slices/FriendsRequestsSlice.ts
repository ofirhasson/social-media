// import { PayloadAction } from "@reduxjs/toolkit";
// import { UserModel } from "../../Models/UserModel";

// type FriendRequest = {
//     sender: UserModel;
//     receiver: UserModel;
// };

// export function sendFriendRequest(state: Map<string, UserModel>, action: PayloadAction<FriendRequest>): Map<string, UserModel> {

//     const newState = new Map(state);

//     // Get sender and receiver from the action payload
//     const { sender, receiver } = action.payload;

//     // Update sender's sentFriendRequests
//     if (newState.has(sender._id)) {
//         const senderUser = newState.get(sender._id);
//         if (senderUser) {
//             const newSentFriendRequests = new Map(senderUser.sentFriendRequests);
//             newSentFriendRequests.set(receiver._id, receiver);

//             // Create a new UserModel instance with updated sentFriendRequests
//             newState.set(sender._id, {
//                 ...senderUser,
//                 sentFriendRequests: newSentFriendRequests
//             });
//         }
//     }

//     // Update receiver's friendRequests
//     if (newState.has(receiver._id)) {
//         const receiverUser = newState.get(receiver._id);
//         if (receiverUser) {
//             const newFriendRequests = new Map(receiverUser.friendRequests);
//             newFriendRequests.set(sender._id, sender);

//             // Create a new UserModel instance with updated friendRequests
//             newState.set(receiver._id, {
//                 ...receiverUser,
//                 friendRequests: newFriendRequests
//             });
//         }
//     }

//     return newState;
// }

// export function acceptFriendRequest(
//     state: Map<string, UserModel>,
//     action: PayloadAction<FriendRequest>
// ): Map<string, UserModel> {
//     const newState = new Map(state);

//     const { sender, receiver } = action.payload;

//     // Update sender's friends and sentFriendRequests
//     if (newState.has(sender._id)) {
//         const senderUser = newState.get(sender._id);
//         if (senderUser) {
//             const newFriends = new Map(senderUser.friends);
//             newFriends.set(receiver._id, receiver);

//             const newSentFriendRequests = new Map(senderUser.sentFriendRequests);
//             newSentFriendRequests.delete(receiver._id);

//             newState.set(sender._id, {
//                 ...senderUser,
//                 friends: newFriends,
//                 sentFriendRequests: newSentFriendRequests
//             });
//         }
//     }

//     // Update receiver's friends and friendRequests
//     if (newState.has(receiver._id)) {
//         const receiverUser = newState.get(receiver._id);
//         if (receiverUser) {
//             const newFriends = new Map(receiverUser.friends);
//             newFriends.set(sender._id, sender);

//             const newFriendRequests = new Map(receiverUser.friendRequests);
//             newFriendRequests.delete(sender._id);

//             newState.set(receiver._id, {
//                 ...receiverUser,
//                 friends: newFriends,
//                 friendRequests: newFriendRequests
//             });
//         }
//     }

//     return newState;
// }

// export function declineFriendRequest(
//     state: Map<string, UserModel>,
//     action: PayloadAction<{ senderId: string, receiverId: string }>
// ): Map<string, UserModel> {
//     const newState = new Map(state);

//     const { senderId, receiverId } = action.payload;

//     // Update sender's sentFriendRequests
//     if (newState.has(senderId)) {
//         const senderUser = newState.get(senderId);
//         if (senderUser) {
//             const newSentFriendRequests = new Map(senderUser.sentFriendRequests);
//             newSentFriendRequests.delete(receiverId);

//             newState.set(senderId, {
//                 ...senderUser,
//                 sentFriendRequests: newSentFriendRequests
//             });
//         }
//     }

//     // Update receiver's friendRequests
//     if (newState.has(receiverId)) {
//         const receiverUser = newState.get(receiverId);
//         if (receiverUser) {
//             const newFriendRequests = new Map(receiverUser.friendRequests);
//             newFriendRequests.delete(senderId);

//             newState.set(receiverId, {
//                 ...receiverUser,
//                 friendRequests: newFriendRequests
//             });
//         }
//     }

//     return newState;
// }
export class ffff{
    
}