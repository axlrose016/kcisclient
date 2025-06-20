/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AppTable } from "@/components/app-table";
import {
  ICFWAssessment,
  IPersonProfileCfwFamProgramDetails,
  IPersonProfileDisability,
  IPersonProfileFamilyComposition,
  IPersonProfileSector,
  IWorkPlan,
} from "@/components/interfaces/personprofile";
import LoadingScreen from "@/components/general/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useRouter } from "next/navigation";
// import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
const baseUrl = "/personprofile/work-plan";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { IAttachments } from "@/components/interfaces/general/attachments";

const _session = (await getSession()) as SessionPayload;

// "raw_id": 0,
// "created_date": "2025-05-06T07:51:31.946Z", ✅
// "created_by": "string",
// "last_modified_date": "2025-05-06T07:51:31.946Z",
// "last_modified_by": "string",
// "deleted_date": "2025-05-06T07:51:31.946Z",
// "deleted_by": "string",
// "remarks": "string",
// "synced_date": "2025-05-06T07:51:31.946Z",
// "is_deleted": true,
// "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
// "immedidiate_supervisor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "alternative_supervisor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "area_focal_person_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "objectives": "string",✅
// "no_of_days_program_engagement": 2147483647, ✅
// "approved_work_schedule_from": "2025-05-06",✅
// "approved_work_schedule_to": "2025-05-06",✅
// "status_id": 2147483647, ✅
// "push_status_id": 2147483647,
const columnsWorkPlan = [
  {
    id: "status",
    header: "Status",
    accessorKey: "status_id",
    filterType: "select",
    filterOptions: [null, 2, 15, 10],
    sortable: true,
    align: "center",
    cell: (value: any) => (
      <Badge
        variant={
          value == 2
            ? "green"
            : value == null || value == 0
              ? "warning"
              : value == 15
                ? "destructive"
                : "default"
        }
      >
        {value == 0 || value == null ? "Pending" : "Approved"}
      </Badge>
    ), //for change
  },
  {
    id: "work_plan_title",
    header: "Title",
    accessorKey: "work_plan_title",
    sortable: true,
    align: "left",
  },
  {
    id: "objectives",
    header: "Objectives",
    accessorKey: "objectives",
    filterType: "text",
    sortable: true,
    align: "left",
    cell: null,
  },
  {
    id: "no_of_days_program_engagement",
    header: "# of Days Program Engagement",
    accessorKey: "no_of_days_program_engagement",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "approved_work_schedule_from",
    header: "Approved Work Schedule From",
    accessorKey: "approved_work_schedule_from",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "approved_work_schedule_to",
    header: "Approved Work Schedule To",
    accessorKey: "approved_work_schedule_to",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "no_of_beneficiaries",
    header: "Number of Beneficiaries",
    accessorKey: "no_of_beneficiaries",
    filterType: "text",
    sortable: true,
    align: "center",
    cell: null,
  },
  {
    id: "created_date",
    header: "Created At",
    accessorKey: "created_date",
    filterType: "text",
    sortable: true,
    align: "left",
    cell: null,
  },
  // {
  //     id: 'area_focal_person_id',
  //     header: 'Focal Person',
  //     accessorKey: 'area_focal_person_id',
  //     filterType: 'text',
  //     sortable: true,
  //     align: "left",
  //     cell: null,
  // },
  // {
  //     id: 'immedidiate_supervisor_id',
  //     header: 'Immediate Supervisor',
  //     accessorKey: 'immedidiate_supervisor_id',
  //     filterType: 'text',
  //     sortable: true,
  //     align: "left",
  //     cell: null,
  // },
  // {
  //     id: 'alternative_supervisor_id',
  //     header: 'Alternate Supervisor',
  //     accessorKey: 'alternative_supervisor_id',
  //     filterType: 'text',
  //     sortable: true,
  //     align: "left",
  //     cell: null,
  // },
];
import LoginService from "@/app/login/LoginService";
export default function WorkPlanMasterList() {
  const [dataWorkPlan, setDataWorkPlan] = useState<IWorkPlan[]>([]);
  const [selectedPWorkPlan, setSelectedWorkPlan] = useState<IWorkPlan[]>([]);

  const [profilesSector, setProfilesSector] = useState<IPersonProfileSector[]>(
    []
  );
  const [profilesFamCom, setProfilesFamCom] = useState<
    IPersonProfileFamilyComposition[]
  >([]);
  const [profilesAttachments, setProfilesAttachments] = useState<
    IAttachments[]
  >([]);
  const [profilesCfwFamProgramDetails, setProfileCfwFamProgramDetails] =
    useState<IPersonProfileCfwFamProgramDetails[]>([]);
  const [profilesDisabilities, setProfileCfwDisabilities] = useState<
    IPersonProfileDisability[]
  >([]);
  const [assessmentDetails, setAssessmentDetials] = useState<ICFWAssessment[]>(
    []
  );

  const [reviewApproveDecline, setReviewApproveDecline] = useState([]);
  const [approvalStatuses, setApprovalStatus] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [forReviewApprove, setForReviewApprove] = useState(false);
  const [selectedCFWID, setSetSelectedCFWID] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const router = useRouter();
  // const [data, setData] = useState([]);
  const handleEligible = (selectedCFWID?: string) => { };

  const handleCreateNewWorkPlan = () => {
    router.push(baseUrl + "/new");
  };

  function mapApiToDexieWorkPlan(data: any): IWorkPlan {
    debugger
    return {
      id: data.id,
      work_plan_title: data.work_plan_title,
      immediate_supervisor_id: data.immediate_supervisor_id,
      office_name: data.division_office_name ?? "",
      objectives: data.objectives,
      no_of_days_program_engagement: data.no_of_days_program_engagement,
      approved_work_schedule_from: data.approved_work_schedule_from,
      approved_work_schedule_to: data.approved_work_schedule_to,
      status_id: data.status_id ?? null,
      created_date: data.created_date,
      created_by: data.created_by,
      last_modified_date: data.last_modified_date ?? null,
      last_modified_by: data.last_modified_by ?? null,
      push_status_id: data.push_status_id,
      push_date: data.push_date ?? null,
      deleted_date: data.deleted_date ?? null,
      deleted_by: data.deleted_by ?? null,
      is_deleted: data.is_deleted ?? null,
      remarks: data.remarks ?? null,
      alternate_supervisor_id: data.alternate_supervisor_id,
      area_focal_person_id: data.area_focal_person_id,
      total_number_of_bene: data.total_of_beneficiaries ?? 0,
    }
  }



  const loadWorkPlan = async () => {
    try {
      const fetchData = async (endpoint: string) => {
        try {
          debugger;
          const onlinePayload = await LoginService.onlineLogin(
            "dsentico@dswd.gov.ph",
            "Dswd@123"
          );

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Authorization: `bearer ${onlinePayload.token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.log(response);
          } else {
            debugger;
            const data = await response.json();

            const workPlans: IWorkPlan[] = data.map(mapApiToDexieWorkPlan);
            await dexieDb.work_plan.bulkPut(workPlans);

            setDataWorkPlan(data);

            console.log("🗣️Work Plan from API ", data);
            console.log("🗣️Work Plan from API ", data.length);

            if (data.length == 0 || data == undefined) {
              setDataWorkPlan([]);
            } else {
              setDataWorkPlan(data);
            }
          }
        } catch (error: any) {
          if (error.name === "AbortError") {
            console.log("Request canceled", error.message);
            alert("Request canceled" + error.message);
          } else {
            console.error("Error fetching data:", error);
            alert("Error fetching data:" + error);
          }
        }
      };
      // alert(_session.id)
      fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/by_id/" + _session.id + "/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWorkPlanFromDexieDb = async () => {
    loadWorkPlan();

    // const supervisorId = _session.id;
    // // alert(supervisorId)
    // const workPlans = await dexieDb.work_plan
    //   .where("immediate_supervisor_id")
    //   .equals(supervisorId)
    //   .toArray();
    // setDataWorkPlan(workPlans);
    // console.log("Work Plan list", workPlans);
  };
  useEffect(() => {
    setLoading(false);
    fetchDataWorkPlanFromDexieDb();
    // Array of matching work plans

    // async function loadWorkPlan() {
    //     try {
    //         const fetchData = async (endpoint: string) => {
    //             const cacheKey = `${endpoint}_page_${page}`;
    //             if (cache[cacheKey]) {
    //                 console.log("Using cached data for:", cacheKey);
    //                 setDataWorkPlan(cache[cacheKey]);
    //                 return;
    //             }

    //             const signal = newAbortSignal(5000);
    //             try {
    //                 debugger;
    //                 const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

    //                 const response = await fetch(endpoint, {
    //                     method: "GET",
    //                     headers: {
    //                         Authorization: `bearer ${onlinePayload.token}`,
    //                         "Content-Type": "application/json",
    //                     },
    //                     // body: JSON.stringify({
    //                     //     "page_number": 1,
    //                     //     "page_size": 1000
    //                     // })
    //                 });

    //                 if (!response.ok) {
    //                     console.log(response);
    //                 } else {
    //                     debugger;
    //                     const data = await response.json();

    //                     console.log("🗣️Work Plan from API ", data?.data);
    //                     console.log("🗣️Work Plan from API ", data.length);

    //                     cache[cacheKey] = data?.data; // Cache the data
    //                     if (data.length == 0 || data == undefined) {
    //                         setDataWorkPlan([])
    //                     } else {

    //                         setDataWorkPlan(data?.data);
    //                     }
    //                 }
    //             } catch (error: any) {
    //                 if (error.name === "AbortError") {
    //                     console.log("Request canceled", error.message);
    //                     alert("Request canceled" + error.message);
    //                 } else {
    //                     console.error("Error fetching data:", error);
    //                     alert("Error fetching data:" + error);
    //                 }
    //             }
    //         };

    //         fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/");
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    // loadWorkPlan();
  }, []);

  if (loading) {
    return (
      <>
        <LoadingScreen
          isLoading={loading}
          text={"Loading... Please wait."}
          style={"dots"}
          fullScreen={true}
          progress={0}
          timeout={0}
          onTimeout={() => console.log("Loading timed out")}
        />
      </>
    );
  }
  const handleRefresh = async () => {
    loadWorkPlan()
  }
  const handleRowClick = (row: any) => {
    // check if mayroon sa dexiedb n record ng supervisor
    // if yes, load it
    // if no then get from api
    console.log("Row clicked:", row);
    const workPlanId = row.id;
    if (row.status_id == 0) {
      // 0=edit (url: url: /personprofile/workplan/uuid), 1=approved (viewing - url: /personprofile/workplan/uuid)

      router.push("/personprofile/work-plan/" + workPlanId + "/edit");
    } else if (row.status_id == 1) {
      // viewing 1=approved (viewing - url: /personprofile/workplan/uuid)
      router.push("/personprofile/work-plan/" + workPlanId);
    }
    return;

    // dexieD
    // try {

    //     const fetchSelectedData = async (endpoint: string) => {
    //         const signal = newAbortSignal(5000);
    //         try {
    //             debugger;
    //             const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
    //             const response = await fetch(endpoint, {

    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `bearer ${onlinePayload.token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             });

    //             if (!response.ok) {
    //                 console.log("Work Plan > view > error ", response);

    //             } else {
    //                 const lsUserIdViewOnly = localStorage.getItem("userIdViewOnly");
    //                 if (lsUserIdViewOnly) {
    //                     const parsedUserIdViewOnly = JSON.parse(lsUserIdViewOnly);
    //                 }
    //                 localStorage.setItem("userIdViewOnly", JSON.stringify(row.id));
    //                 debugger;
    //                 const data = await response.json();
    //                 console.log("Person profile > view > success ", data)
    //                 setSelectedWorkPlan(data);
    //                 setProfilesSector(data.person_profile_sector);
    //                 setProfileCfwDisabilities(data.person_profile_disability ?? []);
    //                 setProfilesFamCom(data.person_profile_family_composition);
    //                 setProfilesAttachments(data.attachments);
    //                 setAssessmentDetials(data.cfw_assessment);
    //                 setProfileCfwFamProgramDetails(data.person_profile_cfw_fam_program_details);
    //                 console.log("😘Person Profile Family Composition: ", data.person_profile_family_composition);
    //                 console.log("😊Person Profile Attachments: ", data.attachments);
    //                 console.log("😂Person Profile CFW Family Program Details: ", data.person_profile_cfw_fam_program_details);
    //                 console.log("❤️Person Profile ID: ", data.id);

    //                 console.log("✅✅Person Profile Sector: ", data.person_profile_sector);
    //                 console.log("Last Name: ", data.last_name)

    //                 // save to dexiedb
    //                 dexieDb.open();
    //                 dexieDb.transaction('rw', [
    //                     dexieDb.person_profile,
    //                     dexieDb.person_profile_sector,
    //                     dexieDb.person_profile_disability,
    //                     dexieDb.person_profile_family_composition,
    //                     dexieDb.attachments,
    //                     dexieDb.cfwassessment,
    //                     dexieDb.person_profile_cfw_fam_program_details], async () => {
    //                         try {
    //                             const existingRecord = await dexieDb.person_profile.get(data.id);
    //                             if (existingRecord) {
    //                                 await dexieDb.person_profile.update(data.id, data);
    //                                 await dexieDb.person_profile_sector.update(data.id, data.person_profile_sector);
    //                                 await dexieDb.person_profile_disability.update(data.id, data.person_profile_disability ?? []);
    //                                 await dexieDb.person_profile_family_composition.update(data.id, data.person_profile_family_composition ?? []);
    //                                 await dexieDb.attachments.update(data.id, data.attachments ?? []);
    //                                 await dexieDb.cfwassessment.update(data.id, data.cfw_assessment ?? []);
    //                                 await dexieDb.person_profile_cfw_fam_program_details.update(data.id, data.person_profile_cfw_fam_program_details ?? []);
    //                                 console.log("Record updated in DexieDB:", data.id);
    //                             } else {
    //                                 await dexieDb.person_profile.add(data);
    //                                 await dexieDb.cfwassessment.add(data.cfw_assessment);
    //                                 if (data.person_profile_disability.length !== 0) {
    //                                     await dexieDb.person_profile_disability.bulkAdd(data.person_profile_disability);
    //                                 }
    //                                 if (data.person_profile_family_composition.length !== 0) {
    //                                     for (let i = 0; i < data.person_profile_family_composition.length; i++) {
    //                                         const family = data.person_profile_family_composition[i];
    //                                         await dexieDb.person_profile_family_composition.add(family); // Save the object without raw_id
    //                                     }
    //                                 }
    //                                 if (data.person_profile_sector.length !== 0) {
    //                                     for (let i = 0; i < data.person_profile_sector.length; i++) {
    //                                         await dexieDb.person_profile_sector.bulkAdd(data.person_profile_sector);
    //                                     }
    //                                 }
    //                                 if (data.attachments.length !== 0) {
    //                                     for (let i = 0; i < data.attachments.length; i++) {
    //                                         await dexieDb.attachments.bulkAdd(data.attachments);
    //                                     }

    //                                 }
    //                                 if (data.person_profile_cfw_fam_program_details) {
    //                                     for (let i = 0; i < data.person_profile_cfw_fam_program_details.length; i++) {
    //                                         await dexieDb.person_profile_cfw_fam_program_details.bulkAdd(data.person_profile_cfw_fam_program_details);
    //                                     }
    //                                 }
    //                                 console.log("➕New record added to DexieDB:", data.id);
    //                             }
    //                         } catch (error) {
    //                             console.log("Error saving to DexieDB:", error);
    //                         }
    //                     });

    //                 router.push(`/${baseUrl}/${row.id}`);
    //             }

    //         } catch (error: any) {
    //             console.log("Error fetching data:", error);
    //             if (error.name === "AbortError") {
    //                 console.log("Request canceled", error.message);
    //                 alert("Request canceled" + error.message);
    //             } else {
    //                 console.error("Error fetching data:", error);
    //                 alert("Error fetching data:" + error);
    //             }
    //         }
    //     }
    //     fetchSelectedData("https://kcnfms.dswd.gov.ph/api/person_profile/view/" + row.id);
    // }
    // catch (error) {
    //     console.log("Error fetching data:", error);
    // }
    // router.push(`/${baseUrl}/${row.user_id}`);
    // router.push(`/${baseUrl}/${row.id}`);
  };

  return (
    <div className="p-2">
      {/* Person Profile ID{_session.id}  */}
      {/* //02af6e24-1bec-4568-b9bf-8133e7faa3dc */}
      {/* Work Plans: {JSON.stringify(dataWorkPlan)} */}
      <Dialog open={forReviewApprove} onOpenChange={setForReviewApprove}>
        <DialogContent className="w-[400px] shadow-lg z-50 pb-[50px]">
          <DialogTitle>Approval Confirmation</DialogTitle>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approval Confirmation</DialogTitle>
            </DialogHeader>
            <Textarea placeholder="Input Assessment" className="mt-5" />
            {/* <p>Record ID: { } has been approved.</p> */}
            <DialogFooter>
              <Button variant={"outline"}>Close</Button>
              <Button
                onClick={() => handleEligible(selectedCFWID)}
                variant={"default"}
              >
                Eligible
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogContent>
      </Dialog>
      {/* {!forReviewApprove ?
                (
                    <Card className="w-[400px] shadow-lg z-50">
                        <CardHeader>
                            <CardTitle>Approval Confirmation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Input Assessment"></Textarea>
                            <p>Record ID: { } has been approved.</p>
                        </CardContent>
                        <CardFooter>
                            <Button  >Close</Button>
                        </CardFooter>
                    </Card>
                )
                        columns={profiles[0] ? Object.keys(profiles[0])
                            .filter(key => !['id', 'modality'].includes(key)) // Simplified hiding logic
                            .map(key => ({

                : null
            } */}

      <div className="min-h-screen">
        <div className="min-h-screen">
          {/* <Button onClick={(e) => fetchData("http://10.10.10.162:9000/api/person_profiles/view/pages/")}>Test</Button> */}

          <AppTable
            // data={[]}
            data={dataWorkPlan != undefined ? dataWorkPlan : []}
            columns={columnsWorkPlan}
            // onEditRecord={handleEdit}
            onClickAddNew={handleCreateNewWorkPlan}
            onRowClick={handleRowClick}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}
