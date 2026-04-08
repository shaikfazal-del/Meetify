import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import HomeComponent from './pages/home';
import History from './pages/history';
import Features from './pages/features';
import Roadmap from './pages/roadmap';
import About from './pages/about';
import Profile from './pages/profile';
import NotFound from './pages/notFound';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/auth' element={<Authentication />} />
              <Route path='/home' element={<HomeComponent />} />
              <Route path='/history' element={<History />} />
              <Route path='/features' element={<Features />} />
              <Route path='/roadmap' element={<Roadmap />} />
              <Route path='/about' element={<About />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/:url' element={<VideoMeetComponent />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
