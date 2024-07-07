import { Request, Response } from 'express';
import ChatRoom from '../models/chatRoom.js';
import Message from '../models/messages.js';
import { format } from "../config/format.js";
import { talkToBot } from "./botController.js";


// Function to create a new chat room
const createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        const userId = req.userId;
        // console.log(userId, message);

        const chatRoom = await ChatRoom.create({
            name: message.split(" ").slice(0, 3).join(" "),
            userId,
        });

        const botMessage = await talkToBot({
            messages: await format(chatRoom.id),
            userId,
        });

        const newMessage = await Message.create({
            roomId: chatRoom.id,
            userId: null,
            content: botMessage.content,
            isBot: true,
        });

        res.json({ message: newMessage, chatRoom });
    } catch (error) {
        console.error("Error creating chat room:", error);
    }
};


// Function to get all chat rooms for a specific user
const getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        const chatRooms = await ChatRoom.findAll({
            where: {
                userId: req.userId,
            },
            order: [["createdAt", "DESC"]],
        });

        res.json({ chatRooms });
    } catch (error) {
        console.error("Error getting all chat rooms:", error);
    }
};


// Function to send a chat message
const sendMessage = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { chatRoomId, _message } = req.body;      // todo: review this line
        const userId = req.userId;

        // console.log("chatRoomId: ", chatRoomId, "message: ", message, "userId: ", userId);

        const chatRoom = await ChatRoom.findByPk(chatRoomId);

        if (chatRoom) {
            const botMessage = await talkToBot({
                messages: await format(chatRoomId),
                userId,
            });

            const newMessage = await Message.create({
                roomId: chatRoomId,
                userId: null,
                content: botMessage.content,
                isBot: true,
            });

            res.json({message: newMessage});
        } else {
            return res.status(404).json({message: "Missing chat room"});
        }
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};


// Function to get chat messages for a specific chat room by ID
const getAllMessages = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { id } = req.params;

        const chatRoom = await ChatRoom.findByPk(id);

        if (chatRoom) {
            const chatMessages = await Message.findAll({
                where: {
                    roomId: id,
                },
                order: [["createdAt", "ASC"]],
            });
            res.json({chatMessages: chatMessages.slice(1)});
        } else {
            return res.status(404).json({message: "Chat room not found"});
        }
    } catch (error) {
        console.error("Error getting all chat messages:", error);
    }
};


export { createRoom, getAllRooms, sendMessage, getAllMessages };
