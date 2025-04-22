import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getDeploymentAreaLibraryOptions, getTypeOfWorkLibraryOptions } from "@/components/_dal/options";
import { getOfflineLibDeploymentArea, getOfflineLibTypeOfWork } from "@/components/_dal/offline-options";
import { IPersonProfile } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
export default function PrefferedDeploymentArea({ errors, capturedData, updateFormData, user_id_viewing }: { errors: any; capturedData: Partial<IPersonProfile>; updateFormData: (newData: Partial<IPersonProfile>) => void, user_id_viewing: string }) {
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [deploymentAreaOptions, setDeploymentAreaOptions] = useState<LibraryOption[]>([]);
    const [selectedDeploymentArea, setSelectedDeploymentArea] = useState("");
    const [selectedDeploymentAreaId, setSelectedDeploymentAreaId] = useState<number | null>(null);
    const [typeOfWorkOptions, setTypeOfWorkOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfWork, setSelectedTypeOfWork] = useState("");
    const [selectedTypeOfWorkId, setSelectedTypeOfWorkId] = useState<number | null>(null);
    const [selectedAssignedDeploymentAreaId, setSelectedAssignedDeploymentAreaId] = useState(0);

    const [immediateSupervisorOptions, setImmediateSupervisorOptions] = useState<LibraryOption[]>([]);
    const [selectedImmediateSupervisorName, setSelectedImmediateSupervisorName] = useState("");
    const [selectedImmediateSupervisorId, setSelectedImmediateSupervisorId] = useState("");
    const [alternateSupervisorOptions, setAlternateSupervisorOptions] = useState<LibraryOption[]>([]);
    const [selectedAlternateSupervisorName, setSelectedAlternateSupervisorName] = useState("");
    const [selectedAlternateSupervisorId, setSelectedAlternateSupervisorId] = useState("");


    const initialPreferredDeployment = {
        deployment_area_id: 0,
        deployment_area_name: "",
        deployment_area_address: "",
        preffered_type_of_work_id: 0,
        assigned_deployment_area_id: 0,
        assigned_deployment_area_name: "",
        immediate_supervisor_id: 0,
        immediate_supervisor_name: "",
        alternate_supervisor_id: 0,
        alternate_supervisor_name: "",

    }

    const [preferredDeployment, setPreferredDeployment] = useState(initialPreferredDeployment);
    const updatingData = (field: any, value: any) => {

        setPreferredDeployment((prev: any) => {
            const updatedData = { ...prev, [field]: value };

            // Update localStorage
            localStorage.setItem("preferred_deployment", JSON.stringify(updatedData));

            return updatedData;
        });

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deployment_area = await getOfflineLibDeploymentArea(); //await getDeploymentAreaLibraryOptions();
                setDeploymentAreaOptions(deployment_area);

                const type_of_work = await getOfflineLibTypeOfWork(); //await getTypeOfWorkLibraryOptions();
                setTypeOfWorkOptions(type_of_work);
                if (typeof window !== "undefined") {
                    const storedPrefferedDeployment = localStorage.getItem("preferred_deployment");
                    if (storedPrefferedDeployment) {
                        setPreferredDeployment(JSON.parse(storedPrefferedDeployment));
                    }
                }


                // create an admin localstorage that will be used for assessment and eligibility, assigned deployment area, 
                const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
                if (!lsAssignedDeploymentArea) {
                    const lsAssignedDeploymentAreaFields = {
                        assigned_deployment_area_id: 0,
                        immediate_supervisor_id: "",
                        alternate_supervisor_id: "",
                    }
                    localStorage.setItem("assigned_deployment_area", JSON.stringify(lsAssignedDeploymentAreaFields));
                }
                if (lsAssignedDeploymentArea) {
                    const parsedLsAssignedDeploymentArea = JSON.parse(lsAssignedDeploymentArea);
                    setSelectedAssignedDeploymentAreaId(parsedLsAssignedDeploymentArea.assigned_deployment_area_id);
                    setSelectedImmediateSupervisorId(parsedLsAssignedDeploymentArea.immediate_supervisor_id);
                    setSelectedAlternateSupervisorId(parsedLsAssignedDeploymentArea.alternate_supervisor_id);
                }

                debugger;
                try {


                    dexieDb.open();
                    dexieDb.transaction('rw', [dexieDb.users], async () => {
                        try {
                            const usersWithRole = await dexieDb.users
                                .where('role_id')
                                .equals('3d735b9c-f169-46e0-abd1-59f66db1943c')
                                .toArray();
                            setImmediateSupervisorOptions(usersWithRole.map(user => ({
                                id: user.id,
                                name: user.username,
                                label: user.username,
                            })));
                        } catch (error) {
                            console.error("Error retrieving data of users from IndexedDB", error);
                        }
                    });

                    dexieDb.transaction('rw', [dexieDb.users], async () => {
                        try {
                            const usersWithRole = await dexieDb.users
                                .where('role_id')
                                .equals('eed84e85-cd50-49eb-ab19-a9d9a2f3e374')
                                .toArray();
                            setAlternateSupervisorOptions(usersWithRole.map(user => ({
                                id: user.id,
                                name: user.username,
                                label: user.username,
                            })));
                        } catch (error) {
                            console.error("Error retrieving data of users from IndexedDB", error);
                        }
                    });
                } catch (error) {
                    console.error("Error retrieving data of users from IndexedDB", error);
                }


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDeploymentAreaChange = (id: number) => {
        console.log("Selected Deployment Area ID:", id);
        setSelectedDeploymentAreaId(id);
        updatingData("deployment_area_id", id);
        updateFormData({ deployment_area_id: id });
    };
    const handleTypeOfWorkChange = (id: number) => {
        console.log("Selected Type of Work ID:", id);
        // updateCapturedData("cfw", "preffered_type_of_work_id", id, 4);
        setSelectedTypeOfWorkId(id);
        updatingData("preffered_type_of_work_id", id);
        updateFormData({ preffered_type_of_work_id: id });
    };


    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("preferred_deployment_info_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);

    const updateAssignedDeploymentArea = (deploymentAreaId: number) => {
        const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
        const parsedlsAssignedDeploymentArea = lsAssignedDeploymentArea
            ? JSON.parse(lsAssignedDeploymentArea)
            : { assigned_deployment_area_id: 0 };
        parsedlsAssignedDeploymentArea.assigned_deployment_area_id = deploymentAreaId;
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedlsAssignedDeploymentArea));
        setSelectedAssignedDeploymentAreaId(deploymentAreaId);

    }
    const updateImmediateSupervisor = (immediateSupervisorId: string) => {
        const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
        const parsedlsAssignedDeploymentArea = lsAssignedDeploymentArea
            ? JSON.parse(lsAssignedDeploymentArea)
            : { assigned_deployment_area_id: 0 };
        parsedlsAssignedDeploymentArea.immediate_supervisor_id = immediateSupervisorId;
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedlsAssignedDeploymentArea));
        setSelectedImmediateSupervisorId(immediateSupervisorId);

    }
    const updateAlternateSupervisor = (alternateSupervisorId: string) => {
        const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
        const parsedlsAssignedDeploymentArea = lsAssignedDeploymentArea
            ? JSON.parse(lsAssignedDeploymentArea)
            : { assigned_deployment_area_id: 0 };
        parsedlsAssignedDeploymentArea.alternate_supervisor_id = alternateSupervisorId;
        localStorage.setItem("assigned_deployment_area", JSON.stringify(parsedlsAssignedDeploymentArea));
        setSelectedAlternateSupervisorId(alternateSupervisorId);
    }
    return (
        <div >
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}>
                <div className="p-2 col-span-4">
                    <Label htmlFor="assigned_deployment_area_id" className="block text-sm font-medium mb-1">Assigned Deployment Area <span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="assigned_deployment_area_id"
                        options={deploymentAreaOptions}
                        selectedOption={selectedAssignedDeploymentAreaId}
                        onChange={(e) => updateAssignedDeploymentArea(e)}
                    // selectedOption={Number(capturedData.assigned_deployment_area_id) || 0}
                    // onChange={(value) => updateFormData({ assigned_deployment_area_id: value.target.value })}
                    />
                </div>
            </div>
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 hidden`}>
            {/* <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}> */}
                <div className="p-2 col-span-4">
                    <Label htmlFor="immediate_supervisor" className="block text-sm font-medium mb-1">Immediate Supervisor <span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="immediate_supervisor"
                        options={immediateSupervisorOptions}
                        selectedOption={setSelectedImmediateSupervisorId}
                        onChange={(e) => updateImmediateSupervisor(e)}
                    // selectedOption={Number(capturedData.assigned_deployment_area_id) || 0}
                    // onChange={(value) => updateFormData({ assigned_deployment_area_id: value.target.value })}
                    />
                </div>
            </div>
            <div className={`flex grid sm:col-span-3 sm:grid-cols-3 hidden`}>
            {/* <div className={`flex grid sm:col-span-3 sm:grid-cols-3 ${userIdViewing ? "" : "hidden"}`}> */}
                <div className="p-2 col-span-4">
                    <Label htmlFor="alternate_supervisor" className="block text-sm font-medium mb-1">Alternate Supervisor <span className='text-red-500'> *</span></Label>
                    <FormDropDown
                        id="alternate_supervisor"
                        options={alternateSupervisorOptions}
                        selectedOption={selectedAlternateSupervisorId}
                        onChange={(e) => updateAlternateSupervisor(e)}
                    // selectedOption={Number(capturedData.assigned_deployment_area_id) || 0}
                    // onChange={(value) => updateFormData({ assigned_deployment_area_id: value.target.value })}
                    />
                </div>
            </div>
            <div id="preferred_deployment_info_form">
                <div className="flex grid sm:col-span-3 sm:grid-cols-3">

                    <div className="p-2 col-span-4">
                        <Label htmlFor="deployment_area_id" className="block text-sm font-medium mb-1">Preferred Office <span className='text-red-500'> *</span></Label>
                        <Input
                            value={capturedData.deployment_area_name || ""}
                            onChange={(e) => updateFormData({ deployment_area_name: e.target.value })}
                            id="deployment_area_id"
                            name="deployment_area_id"
                            placeholder="Enter Name of Office"

                        />
                        {/* <FormDropDown

                            id="deployment_area_id"
                            options={deploymentAreaOptions}
                            // selectedOption={preferredDeployment.deployment_area_id}
                            // onChange={handleDeploymentAreaChange}
                            selectedOption={capturedData.deployment_area_id}
                            onChange={handleDeploymentAreaChange}
                        /> */}
                        {errors?.deployment_area_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.deployment_area_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="deployment_area_address" className="block text-sm font-medium">Office Address</Label>
                        <Textarea
                            value={capturedData.deployment_area_address}
                            id="deployment_area_address"
                            name="deployment_area_address"
                            placeholder="Enter Office Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            onChange={(e) => updateFormData({ deployment_area_address: e.target.value })}
                        />
                        {errors?.deployment_area_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.deployment_area_address[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="preffered_type_of_work_id" className="block text-sm font-medium">Preferred Type of Work<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="preffered_type_of_work_id"
                            options={typeOfWorkOptions}
                            selectedOption={capturedData.preffered_type_of_work_id}
                            onChange={handleTypeOfWorkChange}
                        />
                        {errors?.preffered_type_of_work_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.preffered_type_of_work_id[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </div>
    )
}