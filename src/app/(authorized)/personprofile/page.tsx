"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { SessionPayload } from "@/types/globals";
import { getSession } from "@/lib/sessions-client";
import { IPersonProfile, IPersonProfileFamilyComposition, IPersonProfileSector } from "@/components/interfaces/personprofile";
import { v4 as uuidv4, validate } from 'uuid';
import { CalendarDays, HandCoins, Loader2, Pause, TrendingUpIcon, UserX2 } from "lucide-react";
import { set } from "date-fns";
import clsx from "clsx";
import PersonProfileService from "./form/PersonProfileService";
import GeneratePDF from "@/components/PDF/CFW-Booklet";


//import pdfviewer from "../../components/PDF/pdfviewer";
export default function PersonProfileDashboard() { 

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-2">

          <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-2">


            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Total Number of Remaining Days</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">30</CardTitle>
                <div className="absolute right-4 top-4">
                  <CalendarDays size={40} className="h-10 w-12 text-muted-foreground mr-2" />
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Steady performance <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">Last Attendance [01-12-2025]</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Total Number of Absent</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">5</CardTitle>
                <div className="absolute right-4 top-4">
                  <UserX2 size={40} className="h-10 w-12 text-muted-foreground mr-2" />
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Steady performance <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">Last Absent [01-12-2025]</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Total Recieved Payout</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">₱10,678</CardTitle>
                <div className="absolute right-4 top-4">
                  <HandCoins size={40} className="h-10 w-12 text-muted-foreground mr-2" />
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Steady performance <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">Beneficiary financial assistance</div>
              </CardFooter>
            </Card>

          </div>
          {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
}


