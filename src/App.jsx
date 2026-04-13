import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ConfigPage from './pages/ConfigPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/configuracoes" element={<ConfigPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}