import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getDeploymentAreaLibraryOptions, getTypeOfWorkLibraryOptions } from "@/components/_dal/options";
export default function PrefferedDeploymentArea({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");

    const [deploymentAreaOptions, setDeploymentAreaOptions] = useState<LibraryOption[]>([]);
    const [selectedDeploymentArea, setSelectedDeploymentArea] = useState("");
    const [selectedDeploymentAreaId, setSelectedDeploymentAreaId] = useState<number | null>(null);
    const [typeOfWorkOptions, setTypeOfWorkOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfWork, setSelectedTypeOfWork] = useState("");
    const [selectedTypeOfWorkId, setSelectedTypeOfWorkId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deployment_area = await getDeploymentAreaLibraryOptions();
                setDeploymentAreaOptions(deployment_area);

                const type_of_work = await getTypeOfWorkLibraryOptions();
                setTypeOfWorkOptions(type_of_work);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDeploymentAreaChange = (id: number) => {
        console.log("Selected Deployment Area ID:", id);
        setSelectedDeploymentAreaId(id);
    };
    const handleTypeOfWorkChange = (id: number) => {
        console.log("Selected Type of Work ID:", id);
        setSelectedTypeOfWorkId(id);
    };

    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="deployment_area_id" className="block text-sm font-medium">Name of Office</Label>
                        <FormDropDown
                            id="deployment_area_id"
                            options={deploymentAreaOptions}
                            selectedOption={selectedDeploymentAreaId}
                            onChange={handleDeploymentAreaChange}
                        />
                        {errors?.deployment_area_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.deployment_area_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="deployment_area_address" className="block text-sm font-medium">Office Address</Label>
                        <Textarea
                            id="deployment_area_address"
                            name="deployment_area_address"
                            placeholder="Enter Office Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                        />
                        {errors?.deployment_area_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.deployment_area_address[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="preffered_type_of_work_id" className="block text-sm font-medium">Preferred Type of Work</Label>
                        <FormDropDown
                            id="preffered_type_of_work_id"
                            options={typeOfWorkOptions}
                            selectedOption={selectedTypeOfWorkId}
                            onChange={handleTypeOfWorkChange}
                        />
                        {errors?.preffered_type_of_work_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.preffered_type_of_work_id[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}