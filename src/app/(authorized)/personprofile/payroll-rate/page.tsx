"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { AppTable } from '@/components/app-table';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

const _session = await getSession() as SessionPayload;
const baseUrl = 'personprofile/daily-time-record'

const columns = [
    {
        id: 'name',
        header: 'Region',
        accessorKey: 'name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'value',
        header: 'Rate',
        accessorKey: 'rate',
        filterType: 'number',
        sortable: true,
    },
]

const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;
const cache: Record<string, any> = {};
function newAbortSignal(timeoutMs: number) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}

export default function DailyTimeRecordPage() {

    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [session, setSession] = useState<SessionPayload>();

    useEffect(() => {
        (async () => {
            handleOnRefresh()
        })();
    }, [session])

    useEffect(() => {
        console.log('DTR: session', _session)
        debugger;
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session)
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            console.log('_session', _session)
        })();
    }, [])

    const fetchData = useCallback(async (key: string, endpoint: string, updateOptions: (data: any) => void) => {
        if (cache[key]) {
            updateOptions(cache[key]);
            return;
        }
        const signal = newAbortSignal(5000);
        try {
            const response = await fetch(endpoint, {
                // signal,
                headers: {
                    Authorization: `Bearer ${KeyToken}`,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            if (data?.status) {
                cache[key] = data;
                updateOptions(data);
            }

        } catch (error: any) {
            if (error.name === "AbortError") {
                console.log("Request canceled", error.message);
            } else {
                console.error("Error fetching data:", error);
            }
        }
    }, []);

    useEffect(() => {
        handleOnRefresh()
    }, []);


    const handleOnRefresh = async () => {
        try {
            if (!session) {
                console.log('handleOnRefresh > session is not available');
                return;
            }

            fetchData("regions", "/api-libs/psgc/regions", (data) => {
                if (data?.status) {
                    console.log('data', data)
                    setData(data.data)
                }
            });

        } catch (error) {
            console.error('Error syncing time records:', error);
            toast({
                variant: "warning",
                title: "Unable to Fetch Latest Data",
                description: error instanceof Error
                    ? `Error: ${error.message}`
                    : "Unable to sync DTR records. Please try logging out and back in to refresh your session.",
            });
        }
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row); 
    };
    
    const handleAddNewRecord = (row: any) => {
        console.log('Row clicked:', row); 
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                    </div>

                    {/* Title Section */}
                    <div className="text-lg font-semibold mt-2 md:mt-0">
                        Payroll Rate
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent>

                <div className="min-h-screen">
                    <div className="min-h-screen">
                        <AppTable
                            data={data}
                            columns={columns}
                            onRowClick={handleRowClick}
                            onRefresh={handleOnRefresh} 
                            onEditRecord={handleAddNewRecord}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}