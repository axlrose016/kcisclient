'use client';  // Mark this as a client-side component

import React, { useEffect, useState } from 'react';
import { getSession } from '@/lib/sessions-client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/general/loading-screen';
import LoginPage from './login/page';
import { useBulkSync } from '@/hooks/use-bulksync';
import { SessionPayload } from '@/types/globals';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { IAttachments } from '@/components/interfaces/general/attachments';

const ClientSessionCheck = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter();

  const { setTasks, startSync,state , summary } = useBulkSync();

  useEffect(() => {  
   setTimeout(() => {
      startSync(session) 
    }, 200)
  }, [session])

  useEffect(() => {
    console.log('summary', summary)
  }, [state])


  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const session = await getSession();

        setSession(session)

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

    (async () => {
      setTasks([
        {
          tag: "Person Profile",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile/create/`,
          module: await dexieDb.person_profile,
        },
        {
          tag: "Person Profile > CFW attendance log",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `cfwtimelogs/create/`,
          module: await dexieDb.cfwtimelogs,
        },
        {
          tag: "Person Profile > person_profile_disability",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile_disability/create/`,
          module: await dexieDb.person_profile_disability,
        },
        {
          tag: "Person Profile > person_profile_family_composition",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile_family_composition/create/`,
          module: await dexieDb.person_profile_family_composition,
        },
        {
          tag: "Person Profile > person_profile_sector",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile_sector/create/`,
          module: await dexieDb.person_profile_sector,
        },
        {
          tag: "Person Profile > person_profile_cfw_fam_program_details",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile_engagement_history/create/`,
          module: await dexieDb.person_profile_cfw_fam_program_details,
        },
        {

          tag: "Person Profile > attachments",
          url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `attachments/create/`,
          module: await dexieDb.attachments,
          formdata: (record) => {
            console.log('Person Profile > attachments > record', record)
            return ({
              [`${record.record_id}##${record.file_id}##${record.module_path}##${record.user_id == "" ? record.record_id : record.user_id}##${record.created_by == "" ? "error" : record.created_by}##${record.created_date}##${record.remarks}##${record.file_type}`]: record.file_path, // should be a File or Blob
            })
          },
          onSyncRecordResult: (record, result) => {
            if (result.success) {
              console.log('✅ attachments synced:', { record, result });
              (async () => {
                if (result.response.length !== 0) {
                  const newRecord = {
                    ...record as IAttachments,
                    file_id: result.response.file_name,
                    file_path: result.response.file_path,
                    push_status_id: 1,
                    push_date: new Date().toISOString()
                  }
                  console.log('✅ attachments synced:', { record, result });
                  await dexieDb.attachments.put(newRecord, "id")
                }
              })();
            } else {
              console.error('❌ Order failed:', record.id, '-', result.error);
            }
          },
        },
      ])
    })();
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
