# AI-Powered Customer Support Assistant

This project is an automated customer support system designed to handle incoming user feedback and inquiries via email. It leverages the power of Google's Gemini AI to understand user messages, maintain conversational context, and generate professional, helpful, and structured responses instantly.

## The Problem: Manual Email Overload

In any customer-facing business, managing the inbox can be a significant challenge. Support teams are often swamped with repetitive queries, leading to slower response times and inconsistent communication. Manually categorizing emails, looking up past conversations, and drafting thoughtful replies takes valuable time that could be better spent on complex issues.

This project was built to tackle this exact problem by creating an intelligent first line of defense for customer support, ensuring every user receives a prompt and relevant acknowledgment.

## The Power of AI: Why Google Gemini is the Engine

The core of this application is its ability to intelligently process and respond to emails. Simply filtering by keywords is not enough for modern customer support. This is where Google's Gemini AI comes in.

*   **Natural Language Understanding:** Gemini can comprehend the intent and sentiment behind a user's email, whether it's a complaint, a question, or a feature request.
*   **Context-Aware Conversations:** A key challenge in support is linking follow-up emails to the original issue. As shown in `services/isContextRelated.js`, this app uses a dedicated AI check to determine if a new email is part of an ongoing conversation. This allows the AI to reference past interactions for a seamless and human-like experience.
*   **Structured & Professional Responses:** The prompt engineering in `services/aiService.js` is carefully crafted to guide Gemini into acting as a professional support agent for "OnlineStore". It ensures every reply is formal, empathetic, and requests all necessary information (like an order ID or error message) to move the support ticket forward.

Without a powerful LLM like Gemini, building a system that can understand context and generate high-quality, non-robotic responses would be nearly impossible.

## How It Works: A Look Under the Hood

![A simple flowchart illustrating the data flow from incoming email to outgoing reply.](https://i.imgur.com/example-flowchart.png "Application Flow")

*A simple flowchart illustrating the data flow from incoming email to outgoing reply.*

1.  **Incoming Email & Webhook:** A user sends an email to a designated support address (e.g., `feedbacksonlinestore@gmail.com`). A service like Postmark or a similar provider is configured to capture this inbound email and forward its contents (From, Subject, Body) as a JSON payload to our application's `/webhook` endpoint.
2.  **Server Receives Payload:** The Express server (`server.js`) listens for POST requests on the `/webhook` endpoint.
3.  **AI Analysis & Context Check:** The route handler in `routes/webhook.js` passes the email content to the `aiService`. The service first queries the MongoDB database to find the last message from that user. It then uses Gemini to check if the new email is related to the previous one.
4.  **Generates AI Response:** A detailed prompt is constructed, including the previous conversation if relevant, and sent to the Gemini API. Gemini generates a complete, professional email response.
5.  **Database Logging:** The original email and the AI's generated response are saved to the MongoDB `Feedback` collection for record-keeping and future context.
6.  **Sends Automated Reply:** The `postmarkService.js` (utilizing Nodemailer and Gmail for SMTP) sends the AI-crafted email back to the user.
7.  **Confirmation:** The server sends a `200 OK` status back to the webhook provider, confirming successful receipt and processing.

## Code in Action: A Deeper Dive

The project's logic is cleanly separated into services:

*   **`routes/webhook.js`**: This is the central controller. It orchestrates the entire flow, from receiving the request to calling the AI and email services.
*   **`services/aiService.js`**: The brain of the operation. It contains the detailed prompt that defines the AI's persona and response structure. It also handles the logic for retrieving and including conversational context.
*   **`services/isContextRelated.js`**: A clever micro-service that enhances the user experience by enabling the AI to "remember" past conversations, making the interaction feel more natural and less repetitive.
*   **`models/feedback.js`**: Defines the Mongoose schema for storing every interaction in MongoDB, creating a persistent memory for the application.
*   **`services/postmarkService.js`**: Despite its name, this file uses the robust **Nodemailer** library to send the final reply via a Gmail account, demonstrating a simple and effective SMTP integration.

## Key Features

*   **Instantaneous Responses:** Acknowledges user emails immediately, improving customer satisfaction.
*   **24/7 Availability:** Provides a first line of support around the clock, without human intervention.
*   **Context-Aware Conversations:** Remembers previous interactions with a user for more relevant and helpful replies.
*   **Professional & Consistent Tone:** Ensures every initial response adheres to a predefined standard of quality and professionalism.
*   **Scalable Architecture:** Built with Node.js and Express, the application can easily handle a high volume of incoming webhooks.

---

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose
*   **AI:** Google Generative AI (Gemini)
*   **Email Sending:** Nodemailer (with Gmail SMTP)
*   **Webhook Source (Assumed):** Postmark or any service that can forward inbound emails as a webhook.
*   **Development:** Nodemon for live server reloading.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js and npm installed
*   A MongoDB Atlas account or a local MongoDB instance
*   A Google AI API Key
*   A Gmail account with an App Password enabled

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd devchallengepostmark
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the root of the project and add the following environment variables.

    ```env
    # --- Server Configuration ---
    PORT=3000

    # --- MongoDB Configuration ---
    MONGO_URI=your_mongodb_connection_string

    # --- Google AI Configuration ---
    GOOGLE_API_KEY=your_google_ai_api_key

    # --- Nodemailer (Gmail) Configuration ---
    GMAIL_USER=your_email@gmail.com
    GMAIL_APP_PASSWORD=your_gmail_app_password
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`. You should see "Server running on port 3000" and "MongoDB connected" in your console.
