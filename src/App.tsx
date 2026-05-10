import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import S01Landing from './pages/S01Landing';
import S02SeedPhrase from './pages/S02SeedPhrase';
import S03Wallet from './pages/S03Wallet';
import S04Welcome from './pages/S04Welcome';
import S05Map from './pages/S05Map';
import S06LocationDetail from './pages/S06LocationDetail';
import S07Checkin from './pages/S07Checkin';
import S08GooseReceived from './pages/S08GooseReceived';
import S09CreateTrip from './pages/S09CreateTrip';
import S10Bucketlist from './pages/S10Bucketlist';
import S14Profile from './pages/S14Profile';
import S17CreateLocation from './pages/S17CreateLocation';
import S19HorecaClaim from './pages/S19HorecaClaim';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<S01Landing />} />
        <Route path="/onboarding/keys" element={<S02SeedPhrase />} />
        <Route path="/onboarding/wallet" element={<S03Wallet />} />
        <Route path="/onboarding/welcome" element={<S04Welcome />} />
        <Route path="/home" element={<S05Map />} />
        <Route path="/map" element={<S05Map />} />
        <Route path="/place/:id" element={<S06LocationDetail />} />
        <Route path="/checkin/:id" element={<S07Checkin />} />
        <Route path="/goose/:id" element={<S08GooseReceived />} />
        <Route path="/trip/new" element={<S09CreateTrip />} />
        <Route path="/bucket" element={<S10Bucketlist />} />
        <Route path="/profile" element={<S14Profile />} />
        <Route path="/location/new" element={<S17CreateLocation />} />
        <Route path="/claim/:id" element={<S19HorecaClaim />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
