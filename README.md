# Modern Portfolio Website

A beautiful, responsive portfolio website with dark accents, glowing shadows, and modern UI principles. This project includes AI integration via Deepseek API through OpenRouter.

## Features

- **Modern UI Design**: Dark theme with glowing accents and glass-morphism effects
- **Responsive Layout**: Fully responsive design that works on all devices
- **AI Integration**: Chat assistant powered by Deepseek API via OpenRouter
- **Project Showcase**: Dynamic project display with filtering capabilities
- **Animations**: Smooth animations and transitions using Framer Motion
- **Admin Panel**: (Coming soon) Admin interface for managing projects and content

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: React Icons
- **AI Integration**: Deepseek API via OpenRouter

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## AI Integration

To enable the AI chat functionality, you'll need to:

1. Get an API key from OpenRouter for Deepseek API access
2. Create a `.env` file in the project root with:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

## Project Structure

```
/src
  /assets       # Images, fonts, and other static assets
  /components   # Reusable UI components
  /context      # React context for state management
  /hooks        # Custom React hooks
  /pages        # Page components
  /services     # API services and utilities
  /utils        # Helper functions
```

## Future Enhancements

- Admin panel for managing projects and content
- Database integration for storing projects
- Authentication system for the admin panel
- Blog section with markdown support
- Dark/light theme toggle

## License

MIT
