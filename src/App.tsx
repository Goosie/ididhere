import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const S01Landing        = lazy(() => import('./pages/S01Landing'));
const S02SeedPhrase     = lazy(() => import('./pages/S02SeedPhrase'));
const S03Wallet         = lazy(() => import('./pages/S03Wallet'));
const S04Welcome        = lazy(() => import('./pages/S04Welcome'));
const S05Map            = lazy(() => import('./pages/S05Map'));
const S06LocationDetail = lazy(() => import('./pages/S06LocationDetail'));
const S07Checkin        = lazy(() => import('./pages/S07Checkin'));
const S08GooseReceived  = lazy(() => import('./pages/S08GooseReceived'));
const S09CreateTrip     = lazy(() => import('./pages/S09CreateTrip'));
const S10Bucketlist     = lazy(() => import('./pages/S10Bucketlist'));
const S14Profile        = lazy(() => import('./pages/S14Profile'));
const S17CreateLocation = lazy(() => import('./pages/S17CreateLocation'));
const S19HorecaClaim    = lazy(() => import('./pages/S19HorecaClaim'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <span className="animate-pulse text-5xl select-none">🪿</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                  element={<S01Landing />} />
          <Route path="/onboarding/keys"   element={<S02SeedPhrase />} />
          <Route path="/onboarding/wallet" element={<S03Wallet />} />
          <Route path="/onboarding/welcome" element={<S04Welcome />} />
          <Route path="/home"              element={<S05Map />} />
          <Route path="/map"               element={<S05Map />} />
          <Route path="/place/:id"         element={<S06LocationDetail />} />
          <Route path="/checkin/:id"       element={<S07Checkin />} />
          <Route path="/goose/:id"         element={<S08GooseReceived />} />
          <Route path="/trip/new"          element={<S09CreateTrip />} />
          <Route path="/bucket"            element={<S10Bucketlist />} />
          <Route path="/profile"           element={<S14Profile />} />
          <Route path="/location/new"      element={<S17CreateLocation />} />
          <Route path="/claim/:id"         element={<S19HorecaClaim />} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
