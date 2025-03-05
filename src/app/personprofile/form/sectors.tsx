
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

export default function SectorDetails({ errors }: { errors: any }) {
    const [selectedPersonsWithDisability, setSelectedPersonsWithDisability] = useState("");
    const [selectedIP, setSelectedIP] = useState(""); //this is for showing and hiding group of IPs
    // const [typeOfDisabilityOptions, setTypeOfDisabilityOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfDisability, setSelectedTypeOfDisability] = useState("");
    const [selectedTypeOfDisabilityId, setSelectedTypeOfDisabilityId] = useState<number | null>(null);

    const [selectedSector, setSelectedSector] = useState("");
    const [sectorOptions, setSectorOptions] = useState<LibraryOption[]>([]);

    const [selectedSectors, setSelectedSectors] = useState<{ [key: string]: boolean }>({});
    const [capturedData1, setCapturedData] = useState("");


    const [ipGroupsOptions, setIpGroupsOptions] = useState<LibraryOption[]>([]);
    const [selectedIpGroup, setselectedIpGroup] = useState("");
    const [selectedIpGroupId, setselectedIpGroupId] = useState(0);

    // useEffect(() => {
    //     console.log("Data is : " + typeof selectedIpGroupId);
    // }, [selectedIpGroupId])

    // const [sectorsArrayfromLS, setSectorsArrayfromLS] = useState<Sector[]>([]);
    // () => {
    // if (typeof window !== "undefined") {
    //     const sect = localStorage.getItem("sectors");
    //     console.log("Sect value is ", sect);
    //     return (sect) ? JSON.parse(sect) : {}
    // }
    // return {};
    // });

    // useEffect(() => {
    //     localStorage.setItem("sectors", JSON.stringify(sectorsArrayfromLS))
    // }, [sectorsArrayfromLS])
    // const [selectedDisabilties, setSelectedDisabilties] = useState<string[]>([])
    const [selectedDisabilities, setSelectedDisabilities] = React.useState<string[]>([])
    const [disabilityOptions, setDisabilityOptions] = useState<{ id: number; name: string }[]>([])

    const [storedSect, setStoredSect] = useState<any[]>(() => {
        if (typeof window === "undefined") return []; // Prevents SSR issues
        const data = localStorage.getItem("sectors");
        if (data !== null) {
            try {
                return JSON.parse(data); // Ensure it's parsed correctly
            } catch (error) {
                console.error("Error parsing storedSect:", error);
                return []; // Return empty array if parsing fails
            }
        }
        return []; // Return empty array when data is null
    });


    const [commonData, setCommonData] = useState(() => {
        if (typeof window !== "undefined") {
            const cd = localStorage.getItem("common_data");
            return cd ? JSON.parse(cd) : {};
        }
        return {};
    })

    // useEffect(() => {
    //     localStorage.setItem("commonData", JSON.stringify(commonData));
    // }, [commonData]);

    const handleIPGroupChange = (id: number) => {
        setselectedIpGroupId(id);
        console.log("IP Group ID is " + id);
        localStorage.setItem("ipgroup_id", id.toString());
    }

    const handleDisabilitiesChange = (updatedDisabilities: string[]) => {
        // debugger;
        setSelectedDisabilities(updatedDisabilities); // Update state directly
        const dis = localStorage.getItem("disabilities");
        (dis !== null) ? localStorage.removeItem("disabilities") : "";
        localStorage.setItem("disabilities", JSON.stringify(updatedDisabilities));
        // const formData = localStorage.getItem("formData");
        // const prevData = formData ? JSON.parse(formData) : { cfw: [{}, {}, {}] };

        // const updatedData = {
        //     ...prevData,
        //     cfw: prevData.cfw.map((cfwItem: any, index: number) => {
        //         if (index !== 2) return cfwItem; // Only modify index 2

        //         // Update the disabilities array directly with the new values
        //         return { ...cfwItem, disabilities: updatedDisabilities };
        //     }),
        // };

        // localStorage.setItem("formData", JSON.stringify(updatedData));
        // setCapturedData(updatedData); // Update your local state if necessary
    };


    const handleSectorChange = (sectorId: any, value: string) => {
        console.log("The sector id is " + sectorId + " and value is " + value);

        const storedSectors = localStorage.getItem("sectors");
        let sectorsObj = storedSectors ? JSON.parse(storedSectors) : {};

        // Update the selected sector
        sectorsObj[sectorId - 1] = { id: sectorId, name: sectorsObj[sectorId - 1].name, answer: value };


        if (sectorId === 3 && value === "Yes") {
            // console.log("visible");
            setSelectedPersonsWithDisability("Yes");

        } else if (sectorId === 3 && value === "No") {
            setSelectedPersonsWithDisability("No");
        }
        // debugger;
        setselectedIpGroupId(0);
        if (sectorId === 4 && value === "Yes") {
            setSelectedIP("Yes");
            localStorage.setItem("ipgroup_id", "0");
        } else if (sectorId === 4 && value === "No") {
            setSelectedIP("No");            
            localStorage.removeItem("ipgroup_id");
        }
        // setSectorsArrayfromLS(sectorsObj);
        // console.log("A ", sectorsArrayfromLS);
        // Save the updated data back to localStorage
        setStoredSect(sectorsObj);
        // console.log(storedSect);
        localStorage.setItem("sectors", JSON.stringify(sectorsObj));
        console.log("Sectors: ", JSON.stringify(sectorsObj));


    }

    // useEffect(() => {
    //     console.log("Updated storedSect:", storedSect);
    // }, [storedSect]); // Runs whenever storedSect changes


    const handleSectorChange1 = (sectorId: any, value: string) => {
        const updatedData = [...parsedData1]; // Copy the data to avoid mutation
        const sectorIndex = updatedData.findIndex((sector: Record<string, any>) => Number(sector.id) === Number(sectorId));
        if (sectorIndex !== -1) {
            (updatedData[sectorIndex] as Record<string, any>).answer = value; // Update the answer for the sector
        }
        setParsedData(updatedData); // Update the state with the modified data
        console.log("Parsed Data 1: ", parsedData1);


        const formData = localStorage.getItem("formData");
        const prevData = formData
            ? JSON.parse(formData)
            : {
                cfw: [
                    { sectors: [] },
                    { program_details: [] },
                    { disabilities: [] },
                    { family_composition: [] },
                    {}
                ],
            };

        // Check if sectors exist; if not, initialize with default structure
        // const sectors = prevData.cfw.sectors.length > 0
        //     ? prevData.cfw.sectors
        //     : [{ id: sectorId, answer: "" }];

        // Map and update the sectors array
        // const updatedSectors = sectors.map((sector: { id: string; answer?: string }) => {
        //     // console.log("Sector ID loop: " + typeof sector.id);
        //     if (Number(sector.id) === Number(sectorId)) {
        //         return { ...sector, answer: value.trim() === "Yes" ? "Yes" : "" };
        //     }
        //     return sector;
        // });

        // If sectorId is not found, add a new entry
        // if (!sectors.some((sector: { id: string }) => Number(sector.id) === Number(sectorId))) {
        //     updatedSectors.push({ id: sectorId, answer: value.trim() === "Yes" ? "Yes" : "" });
        // }

        // const updatedFormData = {
        //     ...prevData,
        //     cfw: [
        //         { ...prevData.cfw, sectors: updatedSectors }, // Only update cfw.sectors
        //         ...prevData.cfw.slice(1), // Keep the rest of cfw unchanged
        //     ],
        // };
        if (sectorId === 3 && value === "Yes") {
            console.log("visible");
            setSelectedPersonsWithDisability("Yes");

        } else {
            setSelectedPersonsWithDisability("No");
        }
        // console.log("sector id: " + sectorId + " selected Persons with dis: " + value);
        // localStorage.setItem("formData", JSON.stringify(updatedFormData));
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
                const sectors = await getSectorsLibraryOptions();
                setSectorOptions(sectors);

                // check if there is value from localstorage
                let storedSectors = localStorage.getItem("sectors");
                if (!storedSectors) {
                    let sectorFields = sectors.map((sector, index) => ({
                        id: sector.id,
                        name: sector.name,
                        answer: ""
                    }))
                    const stringedSectors = JSON.stringify(sectorFields);
                    localStorage.setItem("sectors", stringedSectors);
                    storedSectors = stringedSectors;
                }

                // const sectorsFromLS = localStorage.getItem("sectors");
                setStoredSect(JSON.parse(storedSectors));
                console.log("Stored Sectors;  ", storedSectors);


                const type_of_disability = await getTypeOfDisabilityLibraryOptions();
                console.log("Disability Options: " + JSON.stringify(type_of_disability));
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

                const ip_groups = await getIPGroupLibraryOptions();
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
    return (
        <>
            <div className="space-y-12">
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 gap-y-5 gap-x-[50px] mb-2">
                    {

                        commonData.modality_id !== undefined && commonData.modality_id === 25 ? (
                            (Array.isArray(storedSect) ? storedSect : []).map((sector: any, index: number) => (
                                sector.id >= 1 && sector.id <= 9 ? (
                                    <div className="p-2" key={index}>
                                        <Label htmlFor={`sector${sector.id}`} className="block text-sm font-medium">{sector.name}</Label>
                                        <div className="mt-1 flex items-center gap-4">
                                            <Input
                                                className="mr-0 w-4 h-4"
                                                type="radio"
                                                id={`sector${sector.id}Yes`}
                                                name={`sector${sector.id}`}
                                                value="Yes"
                                                // checked="Yes"
                                                checked={sector.answer === "Yes"}
                                                // checked={sector.answer === "Yes" || ""}
                                                onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                            // onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                            />
                                            <Label htmlFor={`sector${sector.id}Yes`} className="mr-4">Yes</Label>

                                            <Input
                                                className="w-4 h-4"
                                                type="radio"
                                                id={`sector${sector.id}No`}
                                                name={`sector${sector.id}`}
                                                value="No"
                                                checked={sector.answer === "No"}
                                                // checked={sectorsArrayfromLS[sector.id].answer === "No" || false}
                                                onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                                            />
                                            <Label htmlFor={`sector${sector.id}No`}>No</Label>

                                        </div>
                                        {
                                            errors?.[`sector${sector.id}`] && (
                                                <p className="mt-2 text-sm text-red-500">{errors[`sector${sector.id}`]}</p>
                                            )
                                        }
                                    </div>

                                ) : null
                            ))

                        ) : null

                    }
                    {/* dto natapos sa pagdisplay ng disabilities, need dn ng pang IP */}
                    {storedSect.length > 2 && storedSect[2]?.answer === "Yes" && (
                        <div className="p-2  ">
                            <Label htmlFor="type_of_disabilities" className="block text-sm font-medium">Type of Disability</Label>
                            <div className="mt-1">
                                <FormMultiDropDown
                                    options={disabilityOptions}
                                    selectedValues={selectedDisabilities}
                                    onChange={handleDisabilitiesChange}
                                />


                            </div>
                            {errors?.type_of_disabilities && (
                                <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities}</p>
                            )}
                        </div>
                    )}
                    {storedSect.length > 3 && storedSect[3].answer === "Yes" && (
                        <div className="p-2  ">
                            <Label htmlFor="ip_group" className="block text-sm font-medium">IP Group</Label>
                            <div className="mt-1">
                                <FormDropDown
                                    id="ip_group"
                                    options={ipGroupsOptions}
                                    onChange={handleIPGroupChange}
                                    selectedOption={selectedIpGroupId}
                                    // selectedOption={Number(selectedIpGroupId)}
                              
                                />
                            </div>
                            {errors?.ip_group && (
                                <p className="mt-2 text-sm text-red-500">{errors.ip_group}</p>

                            )}


                        </div>


                    )}

                </div>





            </div >


        </>
    )
}