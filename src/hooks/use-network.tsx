import { useEffect, useState } from 'react';

const useNetwork = (url:string, testFileSizeInBytes = 500000) => {
  const [isOnline, setNetwork] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);
  const [apiStatus, setApiStatus] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState(0); // Speed in Mbps

  useEffect(() => {
    const updateNetwork = () => {
      setNetwork(window.navigator.onLine);
    };

    const checkApi = async () => {
      if (!url) return;

      try {
        const startTime = performance.now();
        const response = await fetch(url, { method: 'GET', cache: 'no-cache' }); // Fetch the resource
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
        setApiStatus(false);
        setNetworkSpeed(0);
      }
    };

    if (isOnline) checkApi();

    window.addEventListener("offline", updateNetwork);
    window.addEventListener("online", updateNetwork);

    return () => {
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("online", updateNetwork);
    };
  }, [url, testFileSizeInBytes, isOnline]);

  return { isOnline, apiStatus, networkSpeed };
};

export default useNetwork;
