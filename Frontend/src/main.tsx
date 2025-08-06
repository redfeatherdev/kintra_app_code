import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster position="top-center" />
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
