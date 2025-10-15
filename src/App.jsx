import {Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PageLayout from './Layouts/PageLayout/PageLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase'
import './utils/consoleUtils'; // Import console utilities

export default function App() {
  const [authUser, loading] = useAuthState(auth)
  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <PageLayout>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/auth" replace />} />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" replace />} />
        <Route path='/:username' element={authUser ? <ProfilePage /> : <Navigate to="/auth" replace />} />
      </Routes>
    </PageLayout>
  );
}
