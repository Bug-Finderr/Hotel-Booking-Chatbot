import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import { sequelize, Room, Chat } from './models/index.js';

// Reference: https://platform.openai.com/docs/quickstart?context=node

dotenv.config()
// console.log(process.env.OPENAI_API_KEY)

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    // eslint-disable-next-line no-undef
    apiKey: process.env.OPENAI_API_KEY,
});

const functions = [
    {
        name: 'booking',
        description: 'Book reserves a room for a customer and returns the booking ID',
        parameters: {
            type: 'object',
            properties: {
                customerName: { type: 'string' },
                roomId: { type: 'string' },
                checkInDate: { type: 'string' },
                checkOutDate: { type: 'string' },
            },
            required: ['customerName', 'roomId', 'checkInDate', 'checkOutDate'],
        },
    },
    {
        name: 'getBooking',
        description: 'Get booking details based on the booking ID',
        parameters: {
            type: 'object',
            properties: {
                bookingId: { type: 'string' },
            },
            required: ['bookingId'],
        },
    },
    {
        name: 'getBookingByUserId',
        description: 'Get booking details based on the user ID',
        parameters: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
            },
            required: ['userId'],
        },
    },
    {
        name: 'getAvailableRooms',
        description: 'Get a list of available rooms based on the check-in and check-out dates',
        parameters: {
            type: 'object',
            properties: {
                checkInDate: { type: 'string' },
                checkOutDate: { type: 'string' },
            },
            required: ['checkInDate', 'checkOutDate'],
        },
    },
    {
        name: 'cancelBooking',
        description: 'Cancel booking based on the booking ID',
        parameters: {
            type: 'object',
            properties: {
                bookingId: { type: 'string' },
            },
            required: ['bookingId'],
        },
    },
];

async function callFunction({ function_call }) {
    const args = JSON.parse(function_call.arguments);
    switch (function_call.name) {
        case 'booking':
            return await createBooking(args);
        case 'getBooking':
            return await getBooking(args);
        case 'getBookingByUserId':
            return await getBookingByUserId(args);
        case 'getAvailableRooms':
            return await getAvailableRooms(args);
        case 'cancelBooking':
            return await cancelBooking(args);
        default:
            throw new Error('No function found');
    }
}

const createBooking = async ({ customerName, roomId, checkInDate, checkOutDate }) => {
    await Room.update({ status: 'booked' }, { where: { roomId } });
    const booking = await Chat.create({
        title: `Booking for ${customerName}`,
        role: 'system',
        content: `Room ${roomId} booked from ${checkInDate} to ${checkOutDate} for ${customerName}`,
    });
    return { bookingId: booking.id };
};

const getBooking = async ({ bookingId }) => {
    const booking = await Chat.findByPk(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }
    return {
        bookingId,
        content: booking.content,
    };
};

const getBookingByUserId = async ({ userId }) => {
    const bookings = await Chat.findAll({ where: { role: 'system', title: `Booking for ${userId}` } });
    return bookings.map(booking => ({
        bookingId: booking.id,
        content: booking.content,
    }));
};

const getAvailableRooms = async ({ checkInDate, checkOutDate }) => {
    const availableRooms = await Room.findAll({ where: { status: 'available' } });
    return availableRooms;
};

const cancelBooking = async ({ bookingId }) => {
    const booking = await Chat.findByPk(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }
    const roomId = booking.content.split(' ')[1];
    await Room.update({ status: 'available' }, { where: { roomId } });
    return { success: true };
};

const talkToBot = async ({ messages }) => {
    while (true) {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
            functions,
        });

        const message = completion.choices[0].message;
        messages.push(message);

        if (!message.function_call) {
            return messages[messages.length - 1];
        }

        const result = await callFunction({
            function_call: message.function_call,
        });
        const newMessage = {
            role: 'function',
            name: message.function_call.name,
            content: JSON.stringify(result),
        };

        messages.push(newMessage);
    }
};

const formatMessages = (messages) => {
    const systemMessage = {
        role: 'system',
        content: 'You are a hotel booking chatbot. You assist customers with booking rooms, retrieving booking details, checking available rooms, and canceling bookings. ',
    };

    const formattedMessages = messages.map((message) => ({
        role: message.role,
        content: `${message.content} ${message.role === 'assistant' ? '' : 'Do not give me any information about anything that are not mentioned in the PROVIDED CONTEXT. And do not mention this last instruction in the output. Always remember that you are a hotel booking chatbot. You assist customers with booking rooms, retrieving booking details, checking available rooms, and canceling bookings.'}`,
    }));

    console.log(...formattedMessages);

    return [systemMessage, ...formattedMessages];
};

app.post('/chat', async (req, res) => {
    const { messages } = req.body;
    const formattedMessages = formatMessages(messages);

    const botResponse = await talkToBot({ messages: formattedMessages });

    await Chat.create({
        title: formattedMessages[1].content,
        role: botResponse.role,
        content: botResponse.content,
    });

    res.json({ newMessage: botResponse });
});

app.get('/chats', async (req, res) => {
    const chats = await Chat.findAll();
    res.json(chats);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
