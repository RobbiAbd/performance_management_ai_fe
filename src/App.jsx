import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Analytics from './pages/Analytics'
import DataSembako from './pages/DataSembako'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/data-sembako" element={<DataSembako />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
