
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormMultiDropDown } from "@/components/forms/form-multi-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { getIPGroupLibraryOptions, getSectorsLibraryOptions, getTypeOfDisabilityLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import React from "react";
import { parse } from "path";
import { constructNow } from "date-fns";
import { getOfflineLibIPGroup, getOfflineLibSectorsLibraryOptions, getOfflineLibTypeOfDisability } from "@/components/_dal/offline-options";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { IPersonProfile, IPersonProfileDisability, IPersonProfileSector } from "@/components/interfaces/personprofile";
import { v4 as uuidv4 } from 'uuid';
import { flushAllTraces } from "next/dist/trace";
import { person_profile } from "@/db/schema/personprofile";

export default function SectorDetails({ errors, capturedData, sectorData, disabilitiesData, selectedModality, updateFormData, updateSectorData, updateDisabilityData, session }: {
    errors: any; capturedData: Partial<IPersonProfile>; sectorData: Partial<IPersonProfileSector>[]; disabilitiesData: Partial<IPersonProfileDisability>[]; selectedModality: any;
    updateFormData: (newData: Partial<IPersonProfile>) => void;
    updateSectorData: (newData: Partial<IPersonProfileSector>[]) => void;
    updateDisabilityData: (newData: Partial<IPersonProfileDisability>[]) => void;
    session: any;
}) {
    const [selectedPersonsWithDisability, setSelectedPersonsWithDisability] = useState("");
    const [selectedIP, setSelectedIP] = useState(""); //this is for showing and hiding group of IPs
    // const [typeOfDisabilityOptions, setTypeOfDisabilityOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfDisability, setSelectedTypeOfDisability] = useState("");
    const [selectedTypeOfDisabilityId, setSelectedTypeOfDisabilityId] = useState<number | null>(null);

    const [selectedSector, setSelectedSector] = useState("");
    const [sectorOptions, setSectorOptions] = useState<LibraryOption[]>([]);

    const [selectedSectors, setSelectedSectors] = useState<{ [key: string]: boolean }>({});
    const [ipGroupsOptions, setIpGroupsOptions] = useState<LibraryOption[]>([]);
    const [selectedIpGroup, setselectedIpGroup] = useState("");
    const [selectedIpGroupId, setselectedIpGroupId] = useState(0);

    const [selectedDisabilities, setSelectedDisabilities] = React.useState<string[]>([])
    const [disabilityOptions, setDisabilityOptions] = useState<{ id: number; name: string }[]>([])

    const handleIPGroupChange = (id: number) => {
        setselectedIpGroupId(id);
        console.log("IP Group ID is " + id);
        localStorage.setItem("ipgroup_id", id.toString());
        updateFormData({ ip_group_id: id });
    }

    const handleDisabilitiesChange = (updatedDisabilities: string[]) => {
        console.log("Selected Disabilities", updatedDisabilities);

        // Store updated disabilities in local storage
        // localStorage.setItem("disabilities", JSON.stringify(updatedDisabilities));

        // Track existing disability IDs
        const existingDisabilityIds = disabilitiesData.map(d => d.type_of_disability_id?.toString());

        // Mark deleted disabilities
        const updatedData = disabilitiesData.map(disability => {
            const isExisting = updatedDisabilities.includes(disability.type_of_disability_id?.toString() ?? "");
            return {
                ...disability,
                is_deleted: !isExisting,
            };
        });

        // Add new disabilities if they do not exist
        const newDisabilities = updatedDisabilities.filter(id => !existingDisabilityIds.includes(id)).map(id => ({
            id: uuidv4(),
            type_of_disability_id: Number(id),
            is_deleted: false,
            created_by: session.userData.email,
            person_profile_id: capturedData.id,
        }));

        // Combine updated and new data
        const finalData = [...updatedData, ...newDisabilities];

        // Update the disability data
        localStorage.setItem("person_disabilities", JSON.stringify(finalData));
        updateDisabilityData(finalData);
    };

    const handleSectorChange = (sectorId: number, isSelected: boolean): void => {
        console.log(`${isSelected ? 'Adding' : 'Removing'} sector id:`, sectorId);

        const currentData: Partial<IPersonProfileSector>[] = Array.isArray(sectorData) ? sectorData : [];

        const existingSector = currentData.find((sector) => sector.sector_id === sectorId);

        if (isSelected) {
            if (existingSector) {
                if (existingSector.is_deleted) {
                    existingSector.is_deleted = false; // Restore if deleted
                    console.log("Sector restored:", sectorId);
                } else {
                    console.log("Sector already exists");
                }
            } else {
                const newSector: Partial<IPersonProfileSector> = {
                    id: uuidv4(),
                    sector_id: sectorId,
                    is_deleted: false,
                    created_by: session.userData.email,
                    person_profile_id: capturedData.id,
                };
                currentData.push(newSector);
                console.log("New sector added:", newSector);
            }
        } else {
            if (existingSector) {
                existingSector.is_deleted = true;
                console.log("Sector marked as deleted:", sectorId);
            } else {
                const newSector: Partial<IPersonProfileSector> = {
                    id: uuidv4(),
                    sector_id: sectorId,
                    is_deleted: true,
                    created_by: session.userData.emaill,
                    person_profile_id: capturedData.id,
                };
                currentData.push(newSector);
                console.log("New sector added as deleted:", newSector);
            }
        }
        if (existingSector?.sector_id === 3) {
            updateFormData({ is_pwd: isSelected })
        }
        if (existingSector?.sector_id === 4) {
            updateFormData({ is_ip: isSelected })
        }
        updateSectorData([...currentData]);
    };

    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });

    const [parsedData1, setParsedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // debugger;
                const sectors = await getOfflineLibSectorsLibraryOptions(); //await getSectorsLibraryOptions();
                setSectorOptions(sectors);

                // check if there is value from localstorage
                let storedSectors = localStorage.getItem("person_sectors");
                if (!storedSectors) {
                    let sectorFields = sectors.map((sector, index) => ({
                        id: sector.id,
                        name: sector.name,
                        answer: ""
                    }))
                    const stringedSectors = JSON.stringify(sectorFields);
                    storedSectors = stringedSectors;
                }

                console.log("Stored Sectors;  ", storedSectors);

                const type_of_disability = await getOfflineLibTypeOfDisability(); //await getTypeOfDisabilityLibraryOptions();
                console.log("Disability Options: ", JSON.stringify(type_of_disability));
                const convertedData = type_of_disability.map((item: { id: number; name: string }) => ({
                    id: item.id,  // Convert id to string
                    name: item.name,
                }))
                setDisabilityOptions(convertedData)  // Now it matches the expected format
                // console.log("Disability Options: " + convertedData);
                // setDisabilityOptions(type_of_disability);

                // debugger;
                const storedDisabs = localStorage.getItem("disabilities");
                if (storedDisabs !== null) {
                    setSelectedDisabilities(JSON.parse(storedDisabs));
                }

                const ip_groups = await getOfflineLibIPGroup();
                setIpGroupsOptions(ip_groups);

                // debugger;
                const ip_group_id = localStorage.getItem("ipgroup_id");
                if (ip_group_id) {

                    setselectedIpGroupId(Number(ip_group_id));
                    console.log("IP Group Id is " + ip_group_id);
                    console.log("Type of IP Group Id is " + typeof ip_group_id);
                } else {
                    localStorage.setItem("ipgroup_id", "0");
                }



            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleTypeOfDisabilityChange = (id: number) => {
        console.log("Selected Type of Disability ID:", id);
        setSelectedTypeOfDisabilityId(id);
    };

    const isSectorSelected = (sectorId: number): boolean => {
        const currentData: Partial<IPersonProfileSector>[] = Array.isArray(sectorData) ? sectorData : [];
        const sector = currentData.find((sector) => sector.sector_id === sectorId);
        return !!sector && !sector.is_deleted;
    };

    const isSectorUnselected = (sectorId: number): boolean => {
        const currentData: Partial<IPersonProfileSector>[] = Array.isArray(sectorData) ? sectorData : [];
        const sector = currentData.find((sector) => sector.sector_id === sectorId);
        return !!sector && sector.is_deleted === true;
    };
    return (
        <>
            <div className="space-y-12">
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 gap-y-5 gap-x-[50px] mb-2">
                    {/* <div className="flex"> */}
                    {selectedModality === 25 && Array.isArray(sectorOptions) &&
                        sectorOptions
                            .filter((sector) => sector.id >= 1 && sector.id <= 19)
                            .map((sector) => (
                                <React.Fragment key={sector.id}>
                                    <div className={`p-2`} >
                                        <Label htmlFor={`sector${sector.id}`} className="block text-sm font-medium">{sector.name}</Label>
                                        <div className="mt-1 flex items-center gap-4" key={sector.id + 0.01}>
                                            {["Yes", "No"].map((value) => (
                                                <div key={sector.id + value} className="flex items-center gap-1">
                                                    <Input
                                                        className="w-4 h-4"
                                                        type="radio"
                                                        id={`sector${sector.id}${value}`}
                                                        name={`sector${sector.id}`}
                                                        value={value}
                                                        checked={value === "Yes" ? isSectorSelected(sector.id) : isSectorUnselected(sector.id)}
                                                        onChange={() => handleSectorChange(sector.id, value === "Yes")}
                                                    />
                                                    <Label htmlFor={`sector${sector.id}${value}`}>{value}</Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors?.[`sector${sector.id}`] && <p className="mt-2 text-sm text-red-500">{errors[`sector${sector.id}`]}</p>}
                                    </div>

                                    {sector.id == 6 && capturedData.is_pwd && (
                                        <div className="p-2" >
                                            <Label htmlFor="type_of_disabilities" className="block text-sm font-medium">Type of Disability</Label>
                                            <FormMultiDropDown
                                                options={disabilityOptions}
                                                selectedValues={disabilitiesData
                                                    .filter((d) => !d.is_deleted && d.type_of_disability_id)
                                                    .map((d) => d.type_of_disability_id!.toString())}
                                                onChange={handleDisabilitiesChange}
                                            />
                                            {errors?.type_of_disabilities && <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities}</p>}
                                        </div>
                                    )}

                                    {sector.id == (capturedData.is_pwd ? 6 : 7) && capturedData.is_ip && (
                                        <div className="p-2">
                                            <Label htmlFor="ip_group" className="block text-sm font-medium">IP Group</Label>
                                            <FormDropDown
                                                id="ip_group"
                                                options={ipGroupsOptions}
                                                onChange={handleIPGroupChange}
                                                selectedOption={selectedIpGroupId}
                                            />
                                            {errors?.ip_group && <p className="mt-2 text-sm text-red-500">{errors.ip_group}</p>}
                                        </div>
                                    )}



                                </React.Fragment>
                            ))}




                </div>
            </div >


        </>
    )
}