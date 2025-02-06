import useNetwork from '@/hooks/use-network';
import React from 'react';
import { Badge } from './badge';

const ServerStatus = () => {
  const { isOnline, apiStatus, networkSpeed } = useNetwork('http://127.0.0.1:8000/',500000);

//   return (
//     <div>
//       <p>Network status: {isOnline ? 'Online' : 'Offline'}</p>
//       <p>API status: {apiStatus === null ? 'Checking...' : apiStatus ? 'Available' : 'Unavailable'}</p>
//     </div>
//   );

  return (
    <Badge variant="green">
        <p>Server Status: {apiStatus === null ? 'Checking...' : apiStatus ? 'Available' : 'Unavailable'}</p>
        <p>Network speed: {networkSpeed ? `${networkSpeed} Mbps` : 'Calculating...'}</p>
    </Badge>
  )
 
};

export default ServerStatus;
