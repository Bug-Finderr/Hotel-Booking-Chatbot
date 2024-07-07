import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from "./config/database.js";
import {createRoom, getAllRooms, sendMessage, getAllMessages} from "./controllers/chatController.ts";

dotenv.config();

const app = express();
const PORT = 6969;
app.use(cors());
app.use(bodyParser.json());

// Define routes
const router = express.Router();

router.post('/', createRoom);       // Create new chat room
router.get('/', getAllRooms);       // Get all chat rooms
router.post('/messages', sendMessage); // Send message to chat room
router.get(':id', getAllMessages);     // Get messages from chat room

app.use("/chat", router);

app.get("/", (_req: Request, res: Response) => {
    res.send("Hotel Booking Chatbot");
});

// Start server and sync database
sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is active on PORT ${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error(error);
    });
