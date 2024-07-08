import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'

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
        description: 'book reserves a room for a customer and returns the booking ID',
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
      name: "getBooking",
      description:
        "getBooking retrieves the booking details based on the booking ID",
      parameters: {
        type: "object",
        properties: {
          bookingId: { type: "string" },
        },
        required: ["bookingId"],
      },
    },
    {
      name: "getBookingByUserId",
      description:
        "getBookingByUserId retrieves the booking details based on the userId",
    },
    {
      name: "getAvailableRooms",
      description:
        "getAvailableRooms returns a list of available rooms based on the check-in and check-out dates",
      parameters: {
        type: "object",
        properties: {
          checkInDate: { type: "string" },
          checkOutDate: { type: "string" },
        },
        required: ["checkInDate", "checkOutDate"],
      },
    },
    {
      name: "cancelBooking",
      description: "cancelBooking cancels the booking based on the booking ID",
      parameters: {
        type: "object",
        properties: {
          bookingId: { type: "string" },
        },
        required: ["bookingId"],
      },
    },
    {
      name: "sendConfirmationEmail",
      description:
        "sendConfirmationEmail sends a confirmation email to the customer based on the booking ID",
    },
];

async function callFunction({ function_call }) {
    const args = JSON.parse(function_call.arguments);
    switch (function_call.name) {
        case 'booking':
            return await createBooking(args);
        default:
            throw new Error('No function found');
    }
}

const createBooking = async ({ roomId, checkInDate, checkOutDate }) => {
    console.log(roomId, checkInDate, checkOutDate);
    return 'Booking id 123';
};

const talkToBot = async ({ messages }) => {
    // eslint-disable-next-line no-constant-condition
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
        content: 'You are a hotel booking chatbot',
    };

    const formattedMessages = messages.map((message) => ({
        role: message.role,
        content: `${message.content} ${message.role === 'assistant' ? '' : 'Do not give me any information about procedures and service features that are not mentioned in the PROVIDED CONTEXT.'}`,
    }));

    return [systemMessage, ...formattedMessages];
};

app.post('/chat', async (req, res) => {
    const { messages } = req.body;
    const formattedMessages = formatMessages(messages);
    const botResponse = await talkToBot({ messages: formattedMessages });
    res.json({ newMessage: botResponse });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
