# Home-Rento

A full-stack web application that replicates core features of HomeRento, built with Node.js, Express, MongoDB, and Tailwind CSS.

## Features

- User authentication and authorization
- Property listings management
- Image upload functionality
- Responsive design with Tailwind CSS
- Session-based authentication
- MongoDB database integration

## Tech Stack

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Express Session
  - Express Validator
  - Multer (for file uploads)
  - Bcryptjs (for password hashing)

- **Frontend:**
  - EJS (Embedded JavaScript templating)
  - Tailwind CSS
  - Custom CSS

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd homerento
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

4. Start the development server:
```bash
npm start
```

This will start both the Node.js server and the Tailwind CSS compiler in watch mode.

## Project Structure

```
├── app.js              # Main application file
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Database models
├── public/            # Static files
├── routes/            # Route definitions
├── uploads/           # Uploaded files
├── utils/             # Utility functions
└── views/             # EJS templates
```

## Available Scripts

- `npm start`: Starts the development server with nodemon and Tailwind CSS compiler
- `npm run tailwind`: Runs the Tailwind CSS compiler in watch mode
- `npm test`: Runs tests (currently not configured)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built as a learning project
- Inspired by homerento's functionality
- Uses various open-source packages and tools

