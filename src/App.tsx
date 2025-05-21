import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AIChatButton from './components/AIChatButton';
import AIChat from './components/AIChat';
import ScrollToTop from './components/ScrollToTop';
import { AIChatProvider } from './context/AIChatContext';

function App() {
  return (
    <AIChatProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
        <AIChatButton />
        <AIChat />
      </Router>
    </AIChatProvider>
  );
}

export default App
