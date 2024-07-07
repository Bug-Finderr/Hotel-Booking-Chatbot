import OpenAI from "openai";
import dotenv from "dotenv";
import {
    cancelBooking,
    createBooking,
    getAvailableRooms,
    getBookingByUserId,
    getBookingDetails,
    sendBookingConfirmation,
} from "./bookingController";


// Define structure of a message
type Message = {
    role: string;
    content?: string;
    function_call?: {
        name: string;
        arguments: string;
    };
};


// Define structure of a function call
type FunctionCall = {
    function_call: {
        name: string;
        arguments: string;
    };
    userId: string;
};


// Define the list of functions that the chatbot can call
const functions = [
    {
        name: "booking",
        description: "Books a room for a customer and returns the booking ID",
        parameters: {
            type: "object",
            properties: {
                customerName: { type: "string" },
                roomId: { type: "string" },
                checkInDate: { type: "string" },
                checkOutDate: { type: "string" },
            },
            required: ["customerName", "roomId", "checkInDate", "checkOutDate"],
        },
    },
    {
        name: "getBooking",
        description: "Retrieves the booking details based on the booking ID",
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
        description: "Retrieves the booking details based on the user ID",
    },
    {
        name: "getAvailableRooms",
        description: "Returns a list of available rooms based on the check-in and check-out dates",
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
        description: "Cancels the booking based on the booking ID",
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
        description: "Sends a confirmation email to the customer based on the booking ID",
    },
];


dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// Main function to interact with the chatbot
const talkToBot = async ({ messages, userId }: { messages: Message[], userId: string }) => {
    while (true) {
        // Get the completion from OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            functions: functions,
        });

        // Extract the message from the completion
        const message = completion.choices[0].message as Message;
        messages.push(message);
        console.log(message);

        // If there's no function call, return the last message
        if (!message.function_call) {
            return messages[messages.length - 1];
        }

        // Call the appropriate function and get the result
        const result = await callFunction({
            function_call: message.function_call,
            userId,
        });

        // Create a new message with the function result
        const newMessage = {
            role: "function",
            name: message.function_call.name,
            content: JSON.stringify(result),
        };

        messages.push(newMessage);
        console.log(newMessage);
        console.log();
    }
};


// Function to call the appropriate function based on the function call
async function callFunction({ function_call, userId }: FunctionCall) {
    const args = JSON.parse(function_call.arguments);

    switch (function_call.name) {
        case "booking":
            return await createBooking(
                args["roomId"],
                userId,
                args["checkInDate"],
                args["checkOutDate"]
            );

        case "getBooking":
            return await getBookingDetails({
                bookingId: args["bookingId"],
                userId,
            });

        case "getAvailableRooms":
            return await getAvailableRooms(args["checkInDate"], args["checkOutDate"]);

        case "getBookingByUserId":
            return await getBookingByUserId(userId);

        case "cancelBooking":
            return await cancelBooking({
                bookingId: args["bookingId"],
                userId,
            });

        case "sendConfirmationEmail":
            return await sendBookingConfirmation({
                userId,
            });

        default:
            throw new Error("No function found");
    }
}


export { talkToBot };
