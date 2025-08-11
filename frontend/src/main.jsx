import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './tailwind.css';

// Force clear all caches and service workers on every deployment
if ('serviceWorker' in navigator) {
  // Clear all existing service workers first
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  }).then(() => {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      });
    }
  }).then(() => {
    // Register new service worker with unique name to force update
    const swUrl = `./sw.js?v=${Date.now()}`;
    return navigator.serviceWorker.register(swUrl);
  }).then((registration) => {
    console.log('✅ New SW registered successfully:', registration);
  }).catch((registrationError) => {
    console.log('❌ SW registration failed:', registrationError);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
)