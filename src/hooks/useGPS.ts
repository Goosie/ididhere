import { useEffect, useState } from 'react';

export type GPSStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export interface GPSPosition {
  lat: number;
  lon: number;
  accuracy: number; // meters
}

export interface GPSState {
  status: GPSStatus;
  position: GPSPosition | null;
  isOnWifi: boolean;
}

export function useGPS(): GPSState {
  const [status, setStatus] = useState<GPSStatus>('idle');
  const [position, setPosition] = useState<GPSPosition | null>(null);

  // Detecteer WiFi via Network Information API (niet alle browsers)
  const isOnWifi = (() => {
    const nav = navigator as Navigator & { connection?: { type?: string } };
    return nav.connection?.type === 'wifi' || false;
  })();

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      return;
    }

    setStatus('requesting');

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus('granted');
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { status, position, isOnWifi };
}
