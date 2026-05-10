import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import S01Landing from './pages/S01Landing';
import S02SeedPhrase from './pages/S02SeedPhrase';
import S03Wallet from './pages/S03Wallet';
import S04Welcome from './pages/S04Welcome';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<S01Landing />} />
        <Route path="/onboarding/keys" element={<S02SeedPhrase />} />
        <Route path="/onboarding/wallet" element={<S03Wallet />} />
        <Route path="/onboarding/welcome" element={<S04Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
