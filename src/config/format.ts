import Message from "../models/messages.js";

// Define the structure of the formatted message
interface FormattedMessage {
    role: string;
    content: string;
}

// Formats messages for AI processing. Returns a promise that resolves to an array of formatted messages.
const format = async (roomId: number): Promise<FormattedMessage[]> => {
    // Retrieve messages from the database for the given roomId, ordered by creation date
    const messages = await Message.findAll({
        where: { roomId },
        order: [["createdAt", "ASC"]],
    });

    // Format messages for AI,
    return messages.map((message, index) => {
        let role: string;
        let content: string;

        // Set role based on the message position and sender
        if (index === 0) {
            role = "system";
            content = message.content; // The system message is taken as is
        } else if (message.isBot) {
            role = "assistant";
            content = message.content; // Bot's messages are taken as is
        } else {
            role = "user";
            content = `${message.content} Do not give me any information about procedures and service features that are not mentioned in the PROVIDED CONTEXT. Today Date is ${new Date().toISOString()}.`;
            // Refine for better processing next time
        }

        return {role, content};
    });
};

export { format };
