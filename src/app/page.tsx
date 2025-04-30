"use client"

import Image from "next/image";
import ClientSessionCheck from "./clientSession";
import { useEffect, useState } from "react";
import BulkService, { ISummary } from "./BulkService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pause, RefreshCcwDot, TrendingUpIcon } from "lucide-react";
import { IPersonProfile, IPersonProfileFamilyComposition, IPersonProfileSector } from "@/components/interfaces/personprofile";
import { SessionPayload } from "@/types/globals";
import { getSession } from "@/lib/sessions-client";
import PersonProfileService from "./(authorized)/personprofile/form/PersonProfileService";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import CFWBooklet from "@/components/PDF/cfw-booklet";


function page() {

  const [summary, setSummary] = useState<ISummary>()
  useEffect(() => {
    (async () => {
      BulkService.setTasks([
        {
        tag: "CFW attendance log",
        url: `http://10.10.10.162:9000/api/cfwtimelogs/create/`,
        module: await dexieDb.cfwtimelogs,
        cleanup: (record: any) => {
          const { id, ...cleaned } = record;
          return { ...cleaned, status_id: 0, log_out: (cleaned.log_out == "" || cleaned.log_out == "-") ? null : cleaned.log_out };
        }
      },
      {
        tag: "Person Profile",
        url: `https://kcnfms.dswd.gov.ph/api/person_profile/create/`,
        module: await dexieDb.person_profile,
        cleanup: (record: any) => {
          const { id, ...cleaned } = record;
          return { ...cleaned };
        }
      },
      {
        tag: "Person Profile > person_profile_disability",
        url: `https://kcnfms.dswd.gov.ph/api/person_profile_disability/create/`,
        module: await dexieDb.person_profile_disability,
        cleanup: (record: any) => {
          const { id, ...cleaned } = record;
          return { ...cleaned };
        }
      },
      {
        tag: "Person Profile > person_profile_family_composition",
        url: `https://kcnfms.dswd.gov.ph/api/person_profile_family_composition/create/`,
        module: await dexieDb.person_profile_family_composition,
        cleanup: (record: any) => {
          const { id, ...cleaned } = record;
          return { ...cleaned };
        }
      },
      {
        tag: "Person Profile > person_profile_sector",
        url: `https://kcnfms.dswd.gov.ph/api/person_profile_sector/create/`,
        module: await dexieDb.person_profile_sector,
        cleanup: (record: any) => {
          const { id, ...cleaned } = record;
          return { ...cleaned };
        }
      },
      {
        tag: "Person Profile > person_profile_cfw_fam_program_details",
        url: `https://kcnfms.dswd.gov.ph/api/person_profile_engagement_history/create/`,
        module: await dexieDb.person_profile_cfw_fam_program_details,
        cleanup: (record: any) => {
          const { id, ...cleaned } = record;
          return { ...cleaned };
        }
      },

      ])
      const r = await BulkService.status()
      console.log('summary', r)
      setSummary(r)
    })();
  }, [])



  const [isPaused, setIsPaused] = useState(false)
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [encodingPercentage, setEncodingPercentage] = useState(0);
  const [encodingStatus, setEncodingStatus] = useState("");
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const [profile, setProfile] = useState<IPersonProfile | null>(null);
  const [personSynching, setPersonSynching] = useState(false);
  useEffect(() => {
    setEncodingPercentage(0);
    const fetchUser = async () => {
      const _session = await getSession() as SessionPayload;
      setSession(_session);
    }
    fetchUser();
  }, [])

  useEffect(() => {
    const syncData = async () => {
      if (personSynching) {
        const syncStatus = await PersonProfileService.syncBulkData();
        console.log("Person Profile", syncStatus);
        const syncDisabilitiesStatus = await PersonProfileService.syncBulkDisabilities();
        console.log("Person Disabilities", syncDisabilitiesStatus);
        const syncFamilyComStatus = await PersonProfileService.syncBulkFamilyComposition();
        console.log("Person Profile Family Composition", syncFamilyComStatus);
        const syncSectorsStatus = await PersonProfileService.syncBulkSectors();
        console.log("Person Profile Sector", syncSectorsStatus);
        const syncProgramDetailsStatus = await PersonProfileService.syncBulkProgramDetails();
        console.log("Person Profile Program Details", syncProgramDetailsStatus);
        setPersonSynching(false);
      }
    }
    syncData();
  }, [personSynching]);

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
              if (profile.push_status_id == 1) {
                setUploadingPercentage(25);
              }
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
              const perc = Math.floor(25 / userSectors.length);
              setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
              for (let i = 0; i < userSectors.length; i++) {
                if (userSectors[i].push_status_id == 1) {
                  setUploadingPercentage(prev => prev + perc); // this would increase by 10 each time
                }
              }
            }

            //   // Fetch Family Composition (LocalStorage first, then Dexie)
            let family: IPersonProfileFamilyComposition[] | [] = (await dexieDb.person_profile_family_composition.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
            if (!Array.isArray(family) || family.length === 0) {
              family = JSON.parse(localStorage.getItem("person_profile_family_composition") || "[]") || [];
            }

            const userFamily = family.filter((member) => member.person_profile_id === profile?.id);
            if (userFamily.length > 0) {
              const perc = Math.floor(25 / userFamily.length);
              setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
              for (let i = 0; i < userFamily.length; i++) {
                if (userFamily[i].push_status_id == 1) {
                  setUploadingPercentage(prev => prev + perc); // this would increase by 10 each time
                }
              }
            }

            // debugger;
            const person_attachments = await dexieDb.attachments.where('file_type').notEqual('').and(x => x.record_id == profile?.id).toArray();
            if (person_attachments !== null && person_attachments !== undefined && person_attachments.length > 0) {
              const perc = Math.floor(25 / person_attachments.length);
              setEncodingPercentage(prev => prev + 25); // this would increase by 10 each time
              for (let i = 0; i < person_attachments.length; i++) {
                if (person_attachments[i].push_status_id == 1) {
                  setUploadingPercentage(prev => prev + perc); // this would increase by 10 each time
                }
              }
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
    <ClientSessionCheck>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-2">

            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-2">
              <Card className="@container/card bg-[hsl(var(--sidebar-background))]">
                <CardHeader className="relative">
                  <CardDescription>Total Sync Status</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{summary?.overallPercentage}%</CardTitle>
                  <div className="absolute right-4 top-4">
                    <RefreshCcwDot size={40} className="h-10 w-12 text-muted-foreground mr-2" />
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Steady performance <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">Syncing Progress</div>
                </CardFooter>
              </Card>

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
                  {encodingPercentage === 100 ? <CFWBooklet /> : null}
                </CardFooter>
              </Card>
              <Card
                className={clsx(
                  "rounded-xl shadow-md transition-all",
                  uploadingPercentage < 100 ? "bg-red-400" : uploadingPercentage == 100 ? "bg-green-400" : "bg-red-600", !personSynching ? "cursor-pointer hover:shadow-lg" : "cursor-not-allowed"
                )}
                onClick={() => {
                  if (!personSynching) {
                    setPersonSynching(true);
                  }
                }}
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
                        {personSynching ? (
                          <Loader2 className="animate-spin" />
                        ) : uploadingPercentage === 100 ? (
                          <>
                            <Pause className="animate-pulse" />
                            <span>Uploaded</span>
                          </>
                        ) : (
                          "For Upload"
                        )}

                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <span className="font-medium">{uploadingPercentage}%</span>
                  <div className="w-full bg-green-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-green-700 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${uploadingPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>




          </div>
        </div>
      </div>
    </ClientSessionCheck>
  );
}

export default page