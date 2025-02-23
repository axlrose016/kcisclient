import { useEffect, useState } from 'react';

const useNetwork = (url: string, testFileSizeInBytes = 500000) => {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [apiStatus, setApiStatus] = useState<null | boolean>(null);  // Initially null to show loading state
  const [networkSpeed, setNetworkSpeed] = useState<number | null>(null); // Speed in Mbps, initially null for loading

  useEffect(() => {
    const updateNetwork = () => {
      setIsOnline(window.navigator.onLine);
    };

    const checkApi = async () => {
      if (!url) return;

      try {
        const startTime = performance.now();
        const response = await fetch(url, { 
          method: 'GET', 
          cache: 'no-cache', 
          headers: { 'Accept': 'application/octet-stream' } 
        }); // Fetch the resource

        const endTime = performance.now();

        if (response.ok) {
          setApiStatus(true);

          // Calculate speed: (file size in bits) / (time in seconds)
          const timeTakenSeconds = (endTime - startTime) / 1000; // Convert milliseconds to seconds
          const fileSizeBits = testFileSizeInBytes * 8; // Bytes to bits
          const speedMbps = (fileSizeBits / timeTakenSeconds) / 1e6; // Convert bits/sec to Mbps

          setNetworkSpeed(parseFloat(speedMbps.toFixed(2))); // Round to 2 decimal places
        } else {
          setApiStatus(false);
        }
      } catch (error) {
        console.error('API check failed:', error);
        setApiStatus(false);
        setNetworkSpeed(0);
      }
    };

    // Only check API if online
    if (isOnline) checkApi();

    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);

    // Clean up event listeners
    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  }, [url, testFileSizeInBytes, isOnline]);

  return { isOnline, apiStatus, networkSpeed };
};

export default useNetwork;
