# Portfolio Website with AI Chat

A modern portfolio website built with React, TypeScript, and Vite, featuring an AI-powered chat assistant that helps visitors learn about skills, projects, and experience.

## Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **AI Chat Assistant**: Powered by OpenRouter API with LLM integration
- **Dynamic Content**: Data fetched from Supabase backend
- **Responsive Design**: Optimized for all devices
- **Animations**: Smooth transitions and animations with Framer Motion
- **SEO Friendly**: Optimized for search engines

## AI Chat Features

- Context-aware conversations about portfolio content
- Markdown formatting for better readability
- Retrieval-augmented generation using Supabase data
- Clear conversation functionality
- Typing indicators and loading states

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Integration**: OpenRouter API with various LLM models
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18+)
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
