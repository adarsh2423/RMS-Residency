import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './utils/firebase';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Branches from './components/Branches';
import Availability from './components/Availability';
import FindUs from './components/FindUs';
import Footer from './components/Footer';
import Review from './components/Review';
import AdminPage from './admin/AdminPage';

const HomePage: React.FC = () => (
  <>
    <Header />
    <main>
      <Hero />
      <About />
      <Branches />
      <Availability />
      <FindUs />
      <Review />
    </main>
    <Footer />
  </>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          <Route 
            path="/admin" 
            element={
              user ? (
                <AdminPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;