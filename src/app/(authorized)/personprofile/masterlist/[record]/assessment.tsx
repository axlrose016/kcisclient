import { getOfflineLibStatuses } from "@/components/_dal/offline-options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Card, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react"
import { json } from "stream/consumers";

export default function Assessment() {
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);
    const [assessment, setAssessment] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {

                const statuses = await getOfflineLibStatuses();
                const filteredStatuses = statuses.filter(status => [1, 16, 10, 20].includes(status.id));
                setStatusesOptions(filteredStatuses);

                const lsAssessment = localStorage.getItem("assessment");
                if (!lsAssessment) {
                    const lsAssessmentFields = {
                        status_id: 0,
                        assessment: "",
                    }
                    localStorage.setItem("assessment", JSON.stringify(lsAssessmentFields));
                }
                if (lsAssessment) {
                    const parsedlsAssessment = JSON.parse(lsAssessment);
                    setSelectedStatus(parsedlsAssessment.status_id);
                    setAssessment(parsedlsAssessment.assessment);
                }
            } catch (error) {

            }

        };
        fetchData();

    },[]);

    const updateAssessment = (e: string) => {
        setAssessment(e);
        const lsAssessment = localStorage.getItem("assessment");
        if (lsAssessment) {
            const assessmentdata = {
                status_id: selectedStatus,
                assessment: e
            }
            localStorage.setItem("assessment", JSON.stringify(assessmentdata));
        }
    }
    // Removed redundant useEffect block as updateAssessment already handles localStorage updates.
    const updateEligibleStatus = (e: number) => {
        setSelectedStatus(e);
        const lsAssessment = localStorage.getItem("assessment");
        if (lsAssessment) {
            const assessmentdata = {
                status_id: e,
                assessment: assessment
            }
            localStorage.setItem("assessment", JSON.stringify(assessmentdata));
        }
    }
    return (
        <div className="w-full">

            <div id="assessment_parent">
                <div className="flex grid sm:col-span-3 sm:grid-cols-3">


                    <div className="p-2 col-span-4">
                        <Label htmlFor="assessment" className="block text-sm font-medium">Assessment</Label>
                        <Textarea
                            value={assessment}
                            id="assessment"
                            name="assessment"
                            placeholder="Enter Assessment"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            onChange={(e) => updateAssessment(e.target.value)}
                        />

                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="statuses" className="block text-sm font-medium">Eligibility Status<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="statuses"
                            options={statusesOptions}
                            selectedOption={selectedStatus}
                            onChange={(e) => updateEligibleStatus(e)}
                        />

                    </div>

                </div>
            </div >

        </div>
    )
}