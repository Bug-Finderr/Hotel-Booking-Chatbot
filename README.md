# Hotel Booking ChatBot

This project implements a Hotel Booking ChatBot using React for the front-end interface and Node.js with Express for the back-end server. It leverages OpenAI's API for natural language processing and SQLite for data storage of chat history. The project includes features such as:

- **Interactive Chat Interface:** Users can interact with the ChatBot to inquire about hotel rooms and make bookings.
- **Dynamic Chat History:** Previous conversations are stored in an SQLite database (`database.sqlite`) and displayed in the chat interface.
- **Real-time Communication:** Utilizes asynchronous fetch requests to communicate between the React front-end and Node.js back-end.
- **Scrolling and Navigation:** The chat interface dynamically updates and scrolls to the latest messages for a seamless user experience.
- **Customizable UI:** The UI resembles a chat application, providing a familiar and intuitive experience for users.

## Demo Video
[Watch the Demo Video](https://drive.google.com/file/d/1l4QqShuVpd4qP710r8j4Gju8jJd0-vXe/view)

## Technologies Used
- **Front-end:** React, CSS
- **Back-end:** Node.js, Express
- **Database:** SQLite
- **API:** OpenAI API for natural language processing

## Getting Started
To run the project locally:

1. Clone this repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Remove the .example extension from .env.example file.
5. In the .env file replace the `PASTE_YOUR_API_KEY_HERE` with your Open AI API key.
6. Start the development server:
   - Open up a terminal, run `npm run start:backend` to start the Node.js server.
   - Open another terminal and run `npm run dev` to start the React front-end server.
7. Ensure the API keys and environment variables are properly set up for OpenAI and any other necessary configurations.

## Additional Notes
- This project assumes prior setup of necessary API keys and environment variables.
- Modify `.env` files and configurations as per your environment and needs.

## License
This project is licensed under the [MIT License](LICENSE).
