import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  // Mode testing - uncomment baris di bawah untuk testing
  const TESTING_MODE = false; // Set ke true untuk testing
  const TEST_WARNING_TIME = 10 * 1000; // 10 detik untuk testing
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const checkSession = () => {
      const session = sessionStorage.getItem('adminSession');
      if (!session) return;

      try {
        const sessionData = JSON.parse(session);
        const timeSinceActivity = Date.now() - sessionData.lastActivity;
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        const WARNING_TIME = TESTING_MODE ? TEST_WARNING_TIME : 5 * 60 * 1000; // 5 minutes before timeout

        const remainingTime = SESSION_TIMEOUT - timeSinceActivity;

        console.log('🔍 SessionTimeout Debug:', {
          timeSinceActivity: Math.round(timeSinceActivity / 1000 / 60) + ' minutes',
          remainingTime: Math.round(remainingTime / 1000 / 60) + ' minutes',
          showWarning,
          remainingTime <= WARNING_TIME && remainingTime > 0,
          testingMode: TESTING_MODE
        });

        if (remainingTime <= WARNING_TIME && remainingTime > 0) {
          setShowWarning(true);
          setTimeLeft(Math.ceil(remainingTime / 1000 / 60));
        } else if (remainingTime <= 0) {
          // Session expired, logout
          console.log('⏰ Session expired, logging out...');
          sessionStorage.removeItem('adminSession');
          localStorage.removeItem('adminLastLogin');
          localStorage.removeItem('adminSessionId');
          navigate('/admin/login');
        } else {
          setShowWarning(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    // Check session every minute (or every 5 seconds in testing mode)
    const interval = setInterval(checkSession, TESTING_MODE ? 5000 : 60000);
    checkSession(); // Initial check

    return () => clearInterval(interval);
  }, [navigate, showWarning]);

  const extendSession = () => {
    console.log('🔄 Extending session...');
    const session = sessionStorage.getItem('adminSession');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        sessionData.lastActivity = Date.now();
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        setShowWarning(false);
        console.log('✅ Session extended successfully');
      } catch (error) {
        console.error('Error extending session:', error);
      }
    } else {
      console.error('❌ No session found to extend');
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminLastLogin');
    localStorage.removeItem('adminSessionId');
    navigate('/admin/login');
  };

  // Debug: Force show warning for testing
  useEffect(() => {
    if (TESTING_MODE) {
      console.log('🧪 Testing mode enabled - forcing warning to show');
      setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(2);
      }, 2000); // Show warning after 2 seconds
    }
  }, [TESTING_MODE]);

  // Development mode: Add test button
  if (IS_DEVELOPMENT && !showWarning) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            setShowWarning(true);
            setTimeLeft(2);
            console.log('🧪 Force triggering session warning for testing');
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors shadow-lg"
          title="Test Session Timeout Warning"
        >
          🧪 Test Session Warning
        </button>
      </div>
    );
  }

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              {TESTING_MODE ? '🧪 TESTING: ' : ''}Session Akan Berakhir
            </h3>
            <p className="text-sm text-gray-500">
              Session Anda akan berakhir dalam {timeLeft} menit karena tidak ada aktivitas.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button
            onClick={extendSession}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lanjutkan Session
          </button>
          <button
            onClick={logout}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Session akan berakhir setelah 30 menit tidak aktif untuk keamanan.
          {TESTING_MODE && (
            <div className="mt-1 text-red-500 font-bold">
              🧪 TESTING MODE: Warning muncul setelah 10 detik tidak aktif
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout; 