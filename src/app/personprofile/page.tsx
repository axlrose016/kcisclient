"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { SessionPayload } from "@/types/globals";
import { getSession } from "@/lib/sessions-client";
import { IPersonProfile, IPersonProfileFamilyComposition, IPersonProfileSector } from "@/components/interfaces/personprofile";
import { v4 as uuidv4, validate } from 'uuid';
import { Loader2, Pause } from "lucide-react";
import { set } from "date-fns";
import clsx from "clsx";
import GeneratePDF from "@/components/pdf/CFW-Booklet";


//import pdfviewer from "../../components/PDF/pdfviewer";
export default function PersonProfileDashboard() {
    const [isPaused, setIsPaused] = useState(false)
    const [session, setSession] = useState<SessionPayload | null>(null);
    const [encodingPercentage, setEncodingPercentage] = useState(0);
    const [encodingStatus, setEncodingStatus] = useState("");
    const [profile, setProfile] = useState<IPersonProfile | null>(null);
    useEffect(() => {
        setEncodingPercentage(0);
        const fetchUser = async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session);
        }
        fetchUser();
    }, [])

    useEffect((() => {
        const fetchData = async () => {
            try {
              debugger;
              await dexieDb.open();
              await dexieDb.transaction('r', [dexieDb.person_profile,
              dexieDb.person_profile_sector, dexieDb.person_profile_disability, dexieDb.person_profile_family_composition,
              dexieDb.attachments, dexieDb.person_profile_cfw_fam_program_details], async () => {
                if (session != null || session != undefined) {
        
                  // Fetch Profile (Dexie first, then LocalStorage)
                  let profile: IPersonProfile | null = (await dexieDb.person_profile.where("user_id").equals(session.id).first()) || null;
                  debugger;
                  if (!profile) {
                    profile = JSON.parse(localStorage.getItem("person_profile") || "null");
                  }
      
                  if (profile && profile.user_id === session.id) {
                    setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
                    setEncodingStatus("Saved as Draft");
                    setProfile(profile);
                  } else {
                    setEncodingStatus("No Profile Found");
                  }
        
                  // Fetch Sectors (LocalStorage first, then Dexie)
                  let sectors: IPersonProfileSector[] | [] = (await dexieDb.person_profile_sector.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
      
                  if (!Array.isArray(sectors) || sectors.length === 0) {
                    sectors = JSON.parse(localStorage.getItem("person_profile_sector") || "[]") || [];
                  }
                  
                  const userSectors = sectors.filter((sector) => sector.person_profile_id === profile?.id);
                  if (userSectors.length > 0) {
                    setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
                  }

                //   // Fetch Family Composition (LocalStorage first, then Dexie)
                  let family: IPersonProfileFamilyComposition[] | [] = (await dexieDb.person_profile_family_composition.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
                  if (!Array.isArray(family) || family.length === 0) {
                    family = JSON.parse(localStorage.getItem("person_profile_family_composition") || "[]") || [];
                  }
      
                  const userFamily = family.filter((member) => member.person_profile_id === profile?.id);
                  if (userFamily.length > 0) {
                    setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
                  }
                  
                  // debugger;
                  const person_attachments = await dexieDb.attachments.where('file_type').notEqual('').and(x => x.record_id == profile?.id).toArray();
                  if (person_attachments !== null && person_attachments !== undefined && person_attachments.length > 0) {
                    setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
                  }
                }
              }
              );
            } catch (error) {
              console.error("Error fetching Person Profile from IndexedDB", error);
            }
          };
          fetchData();
    }), [session])

    return (
        <div className="max-w-full mx-auto p-4 space-y-6">
            {/* <GeneratePDF/> */}
            <Card
                className={clsx(
                    "rounded-xl shadow-md transition-all",
                    encodingPercentage === 100 ? "bg-green-400" : "bg-red-400"
                )}
                >
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div>
                <CardTitle className="text-xl">Encoding Status</CardTitle>
                <CardDescription>Person Profile Information</CardDescription>
                    {/* <CardDescription>3 of 5 files completed</CardDescription> */}
                </div>
                <div className="flex items-center gap-2">
                <Badge variant={isPaused ? "outline" : "secondary"} className="px-3">
                    {encodingStatus}
                </Badge>
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <span className="font-medium">{encodingPercentage}%</span>
            <div className="w-full bg-green-200 rounded-full h-3 mt-2">
                <div
                    className="bg-green-700 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${encodingPercentage}%` }}
                />
            </div>
            </CardContent>
            <CardFooter>
                {encodingPercentage === 100 ? <GeneratePDF /> : null}
            </CardFooter>
            </Card>
            <Card
                className={clsx(
                    "rounded-xl shadow-md transition-all",
                    profile?.push_status_id == 2 ? "bg-red-400" : profile?.push_status_id == 1 ? "bg-green-400" : "bg-red-600"
                )}
                >
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div>
                <CardTitle className="text-xl">Uploading Status</CardTitle>
                <CardDescription>Person Profile</CardDescription>
                    {/* <CardDescription>3 of 5 files completed</CardDescription> */}
                </div>
                <div className="flex items-center gap-2">
                <Badge variant={isPaused ? "outline" : "secondary"} className="px-3">
                    {profile?.push_status_id == 2 ? "For Upload" : profile?.push_status_id == 1 ? "Uploaded" : "Not Uploaded"}
                </Badge>
                </div>
            </div>
            </CardHeader>
            </Card>
        </div>
    );
}


