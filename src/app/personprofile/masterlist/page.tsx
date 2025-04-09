"use client"
import { fetchProfiles } from "@/components/_dal/profiles";
import { fetchReviewApproveDecline } from "@/components/_dal/review_approve_decline";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonView } from "@/components/actions/button-view";
import { AppTable } from "@/components/app-table";
import { IPersonProfile } from "@/components/interfaces/personprofile";
import LoadingScreen from "@/components/general/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useRouter } from "next/navigation";
// import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
const baseUrl = 'personprofile/masterlist'
export default function PersonProfileMasterlist() {
    const [profiles, setProfiles] = useState<IPersonProfile[]>([]);
    const [reviewApproveDecline, setReviewApproveDecline] = useState([]);
    const [approvalStatuses, setApprovalStatus] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(true);
    const [forReviewApprove, setForReviewApprove] = useState(false);
    const [selectedCFWID, setSetSelectedCFWID] = useState("");

    const router = useRouter();
    // const [data, setData] = useState([]);
    const handleEligible = (id: string) => {

    }
    useEffect(() => {
        async function loadProfiles() {
            try {
                // const data = await fetchProfiles();
                // setProfiles(data);

                // const review_approve_decline_data = await fetchReviewApproveDecline();
                // setReviewApproveDecline(review_approve_decline_data);
                // debugger;
                // // Create a lookup object: { "record_id": "status" }
                // const statusMap = review_approve_decline_data.reduce((acc: any, item: any) => {
                //     acc[item.record_id] = item.status; // status: Pending, Review, Approve, Decline, For Revision
                //     return acc;
                // }, {});

                // setApprovalStatus(statusMap);

                // console.log("RAD ", review_approve_decline_data);





                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open
                const dexie_person_profile = await dexieDb.person_profile.toArray();
                setProfiles(dexie_person_profile);


                const firstNames = dexie_person_profile.map(profile => profile.first_name);
                console.log("First Names: ", firstNames);
                // const existingRecords = await dexieDb.attachments.toArray();
                console.log("😘Existing Records: ", dexie_person_profile);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadProfiles();
    }, []);

    if (loading) {
        return <>
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
    }
    const handleApprove = (id: string) => {

    }
    const handleForReview = (id: string) => {
        setForReviewApprove(!forReviewApprove);
        // alert(id + forReviewApprove);
    }
    const handleDisapprove = (id: string) => {
        alert(id);
    }
    const handleDecline = (id: string) => {
        alert(id);
    }


    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/${row.id}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord', newRecord)
    };
    return (
        <div className="p-2">
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
                            <Button onClick={() => handleEligible(selectedCFWID)} variant={"green"}>Eligible</Button>
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
                    <AppTable
                        data={profiles}
                        columns={profiles[0] ? Object.keys(profiles[0]).map((key, idx) => ({
                            id: key,
                            header: key,
                            accessorKey: key,
                            filterType: 'text',
                            sortable: true,
                        })) : []}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRowClick={handleRowClick}
                        onAddNewRecord={handleAddNewRecord}
                    />
                </div>
            </div>





        </div >
    )

}