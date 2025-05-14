'use client';

import React, { useState, ReactEffect, useEffect, ReactNode } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from '@/components/ui/tooltip';
import { RefreshCw, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBulkSyncStore } from '@/lib/state/bulksync-store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { syncTask } from '@/lib/bulksync';

type Props = {
    children: ReactNode;
};

export function SyncSummaryDrawer({ children }: Props) {
    const [open, setOpen] = useState(false);
    const [loadingTag, setLoadingTag] = useState<string | null>(null);
    const [loadingAll, setLoadingAll] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const [session, setSession] = useState<SessionPayload | null>(null);
     
    const {
        progressStatus,   
        summary,
        startSync,
        resetAllTasks,
        resetSummary,
    } = useBulkSyncStore();

    useEffect(() => {
        const fetchUser = async () => {
            const _session = await getSession();
            setSession(_session as SessionPayload);
        };
        fetchUser(); 
    }, [open]);


    const tasks = Object.values(progressStatus); 
    const overallPercentage = summary.overallPercentage

    const handleResync = async (tag?: string) => {
        if (!session) return;

        if (tag) {
            setLoadingTag(tag);
            resetSummary();
            await startSync(session, tag);
            setLoadingTag(null);
        } else {
            setLoadingAll(true);
            resetAllTasks();
            await startSync(session);
            setLoadingAll(false);
        }
    };

    const totalSynced = tasks.reduce((acc, cur) => acc + cur.success, 0);
    const totalErrors = tasks.reduce((acc, cur) => acc + cur.failed, 0);
    const totalRecords = totalSynced + totalErrors;

    const lastSyncedAt = tasks.length
        ? Math.max(
            ...tasks.map((t: any) => new Date(t.created_date || summary.lastSyncedAt || Date.now()).getTime())
        )
        : null;

    return (
        <Drawer
            direction={isDesktop ? 'right' : 'bottom'}
            open={open}
            onOpenChange={setOpen}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>

            <DrawerContent className="px-4 pb-6">
                <DrawerHeader>
                    <DrawerTitle className="text-center text-lg">Sync Summary</DrawerTitle>
                </DrawerHeader>
                <div className="space-y-4 sm:h-[100vh] h-[60vh] overflow-y-auto px-2 mt-4">
                    {tasks.map((task) => {
                        const { tag, success, failed, state } = task;
                        const total = success + failed;
                        const percentage = total ? Math.floor((success / total) * 100) : 0;
                        const taskErrors = summary.errorList?.filter((e) => e.tag === tag);

                        return (
                            <div
                                key={tag}
                                className="border rounded-md p-4 bg-muted flex items-center justify-between gap-4"
                            >
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{tag}</span>
                                        {failed > 0 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-4 h-4 text-destructive" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <div className="text-sm text-red-500 max-w-sm">
                                                            {taskErrors?.map((e, i) => (
                                                                <div key={i} className="mb-2">
                                                                    <strong>ID:</strong> {e.record_id}
                                                                    <br />
                                                                    <strong>Error:</strong> {e.error_message}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>

                                    <Progress value={percentage} className="bg-green-100" />

                                    <p className="text-xs text-muted-foreground">
                                        Synced: {success} / {total} &bull; Errors: {failed}
                                    </p>
                                </div>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                disabled={loadingTag === tag}
                                                onClick={() => handleResync(tag)}
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Resync</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        );
                    })}
                </div>

                <div className="p-2 space-y-2 text-sm text-muted-foreground">
                    <p className="text-lg">
                        Overall Progress: <strong>{overallPercentage}</strong>
                    </p>
                    <Progress value={parseInt(overallPercentage)} className="bg-green-100" />

                    <p>
                        Total Records: <strong>{totalRecords}</strong> | Synced:{' '}
                        <strong>{totalSynced}</strong> | Errors:{' '}
                        <strong>{totalErrors}</strong>
                    </p>

                    {lastSyncedAt && (
                        <p className="text-xs">
                            Last synced:{' '}
                            {formatDistanceToNow(new Date(lastSyncedAt), { addSuffix: true })}
                        </p>
                    )}
                </div>

                <div className="mt-6 px-2">
                    <Button className="w-full" disabled={loadingAll} onClick={() => handleResync()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync All
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
}