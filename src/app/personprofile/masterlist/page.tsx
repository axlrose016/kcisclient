"use client"
import { fetchProfiles } from "@/components/_dal/profiles";
import { fetchReviewApproveDecline } from "@/components/_dal/review_approve_decline";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonView } from "@/components/actions/button-view";
import LoadingScreen from "@/components/general/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useEffect, useState } from "react";

export default function PersonProfileMasterlist() {
    const [profiles, setProfiles] = useState([]);
    const [reviewApproveDecline, setReviewApproveDecline] = useState([]);
    const [approvalStatuses, setApprovalStatus] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(true);
    const [forReviewApprove, setForReviewApprove] = useState(false);
    const [selectedCFWID, setSetSelectedCFWID] = useState("");

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

                : null
            } */}

            <Table className="table-fixed w-full text-left">
                <TableCaption>A list of all Users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">First Name</TableHead>
                        <TableHead className="w-[200px]">Middle Name</TableHead>
                        <TableHead className="w-[200px]">Last Name</TableHead>
                        <TableHead className="w-[110px]">Push Status</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="text-right w-[350px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {profiles.map((profile: any) => {
                        const status = approvalStatuses[profile.id] || "Pending"; // Default to "Pending" if not found

                        return (
                            <TableRow key={profile.id}>
                                <TableCell className="font-medium">{profile.first_name}</TableCell>
                                <TableCell className="font-medium">{profile.middle_name}</TableCell>
                                <TableCell className="font-medium">{profile.last_name}</TableCell>
                                <TableCell className="font-medium">{profile.push_status_id}</TableCell>

                                {/* Badge Based on Status */}
                                <TableCell className="font-medium">
                                    {status === "Approved" ? (
                                        <Badge variant="green">Approved</Badge>
                                    ) : null}
                                    {status === "Declined" ? (
                                        <Badge variant="destructive">Declined</Badge>
                                    ) : null}
                                    {status === "for Review" || status === "Pending" || status === "for Compliance" ? (
                                        <Badge variant="warning">for Review</Badge>
                                    ) : null}



                                </TableCell>

                                {/* Action Buttons */}
                                <TableCell className="text-right">
                                    {/* <ButtonView path={`/personprofile/form?id=${profile.id}`} label="View" /> */}

                                    {status === "Approved" ? (
                                        <Button className="mx-2" variant="destructive" onClick={() => handleDisapprove(profile.id)}>
                                            Disapprove
                                        </Button>
                                    ) : null}
                                    {status === "Declined" ? (
                                        <Button className="mx-2" onClick={() => handleApprove(profile.id)}>
                                            Approve
                                        </Button>
                                    ) : null}
                                    {status === "for Review" || status === "Pending" || status === "for Compliance" ? (
                                        <Button className="mx-2" onClick={() => handleForReview(profile.id)}>
                                            For Review
                                        </Button>
                                    ) : null}
                                    {/* {status === "Pending" ? (
                                    <Badge variant="secondary">Pending</Badge>
                                ) : null} */}
                                    {/* <Button className="mx-2" onClick={() => handleApprove(profile.id)}>
                                    Approve
                                </Button>

                                <Button variant="destructive" onClick={() => handleDecline(profile.id)}>Decline</Button> */}
                                </TableCell>
                            </TableRow>
                        );
                    })}

                </TableBody>
            </Table>



        </div >
    )

}