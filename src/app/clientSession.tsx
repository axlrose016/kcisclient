'use client';  // Mark this as a client-side component

import { useEffect, useState } from 'react';
import { getSession } from '@/lib/sessions-client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'; 
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/general/loading-screen';
import LoginPage from './login/page';

const ClientSessionCheck = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const session = await getSession();
        console.log('Session result:', session);

        // Update the authentication state
        setIsAuthenticated(session != null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setIsAuthenticated(false); // Set to false if there's an error
      } finally {
        setLoading(false); // Stop loading once session is checked
      }
    };

    checkSession();
  }, []); // Empty dependency array means this only runs once when component mounts

  if (loading) {
    return <div>
      <LoadingScreen
        isLoading={loading}
        text={"Loading... Please wait."}
        style={"dots"}
        fullScreen={true}
        progress={0}
        timeout={0}
        onTimeout={() => console.log("Loading timed out")}
      />
    </div>; // Show loading state until session is checked
  }

  console.log('Current isAuthenticated state:', isAuthenticated); // Debugging state changes

  // Render based on authentication state
  return isAuthenticated ? (
    <SidebarProvider> 
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 items-center border-b px-4 no-print">
          <SidebarTrigger className="mr-2" />
          {/* <h1 className="text-lg font-medium">Beneficiary Profile Form</h1> */}
        </header>
        <main className="flex-1 overflow-x-hidden p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <LoginPage />
  );
};

export default ClientSessionCheck;
