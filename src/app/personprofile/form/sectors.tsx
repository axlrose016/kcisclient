
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormMultiDropDown } from "@/components/forms/form-multi-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { getSectorsLibraryOptions, getTypeOfDisabilityLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import React from "react";

export default function SectorDetails({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [selectedPersonsWithDisability, setSelectedPersonsWithDisability] = useState("");
    const [selectedIP, setSelectedIP] = useState(""); //this is for showing and hiding group of IPs
    // const [typeOfDisabilityOptions, setTypeOfDisabilityOptions] = useState<LibraryOption[]>([]);
    const [selectedTypeOfDisability, setSelectedTypeOfDisability] = useState("");
    const [selectedTypeOfDisabilityId, setSelectedTypeOfDisabilityId] = useState<number | null>(null);

    const [selectedSector, setSelectedSector] = useState("");
    const [sectorOptions, setSectorOptions] = useState<LibraryOption[]>([]);

    const [selectedSectors, setSelectedSectors] = useState<{ [key: string]: boolean }>({});
    const [capturedData1, setCapturedData] = useState("");

    // const [selectedDisabilties, setSelectedDisabilties] = useState<string[]>([])
    const [selectedDisabilities, setSelectedDisabilities] = React.useState<string[]>([])
    const [disabilityOptions, setDisabilityOptions] = useState<{ id: number; name: string }[]>([])

    const handleDisabilitiesChange = (updatedDisabilities: string[]) => {
        setSelectedDisabilities(updatedDisabilities); // Update state directly

        const formData = localStorage.getItem("formData");
        const prevData = formData ? JSON.parse(formData) : { cfw: [{}, {}, {}] };

        const updatedData = {
            ...prevData,
            cfw: prevData.cfw.map((cfwItem: any, index: number) => {
                if (index !== 2) return cfwItem; // Only modify index 2

                // Update the disabilities array directly with the new values
                return { ...cfwItem, disabilities: updatedDisabilities };
            }),
        };

        localStorage.setItem("formData", JSON.stringify(updatedData));
        setCapturedData(updatedData); // Update your local state if necessary
    };
    const handleSectorChange = (sectorId: string, value: string) => {
        // debugger;
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

        const updatedSectors = prevData.cfw[0].sectors.map((sector: { id: string; }) => {
            if (sector.id === sectorId) {
                return { ...sector, answer: value.trim() === "Yes" ? "Yes" : "" };
            }
            return sector;
        });

        const updatedFormData = {
            ...prevData,
            cfw: [
                { ...prevData.cfw[0], sectors: updatedSectors }, // Only update cfw[0].sectors
                ...prevData.cfw.slice(1), // Keep the rest of cfw unchanged
            ],
        };

        localStorage.setItem("formData", JSON.stringify(updatedFormData));
        console.log("Updated formData:", updatedFormData); // For debugging
    };



    const handleSectorChange1 = (sectorId: string, value: string) => {
        const formData = localStorage.getItem("formData");
        const prevData = formData ? JSON.parse(formData) : { cfw: [{ sectors: [] }] };

        // const updatedData = {
        //     ...prevData,
        //     cfw: prevData.cfw.map((cfwItem: any, index: number) => {
        //         if (index !== 0) return cfwItem; // Only modify the first element

        //         const sectors = cfwItem.sectors || [];
        //         const sectorExists = sectors.some((sector: any) => sector.sector_id === sectorId);

        //         const updatedSectors = sectorExists
        //             ? sectors.map((sector: any) =>
        //                 sector.sector_id === sectorId ? { ...sector, value } : sector
        //             )
        //             : [...sectors, { sector_id: sectorId, value }];

        //         return { ...cfwItem, sectors: updatedSectors };
        //     }),
        // };






        // localStorage.setItem("formData", JSON.stringify(updatedData));

        // setCapturedData(updatedData); // Optional: Update state if needed

        // console.log("Sector ID " + sectorId + " Value " + value);
        // if (sectorId === "3" && value === "Yes") {
        //     setSelectedPersonsWithDisability("Yes");
        //     updateCapturedData("cfw","is_need_pwd_id","Yes",4)
        // } else {
        //     setSelectedPersonsWithDisability("");
        //     updateCapturedData("cfw","is_need_pwd_id","No",4)
        // }
    };



    // const handleSectorChange = (sectorId: string, value: string) => {
    //     const updateSectorData = (updateFn: (prevData: any) => any) => {
    //       const formData = localStorage.getItem("formData");
    //       const prevData = formData ? JSON.parse(formData) : { cfw: [{ sectors: [] }] };

    //       const updatedData = updateFn(prevData);

    //       localStorage.setItem("formData", JSON.stringify(updatedData));
    //       // Uncomment this if you want to update the state as well
    //       // setCapturedData(updatedData);
    //     };
    // };      

    // const handleSectorChange = (sectorId: string, value: string) => {

    //     const numericValue = value === "Yes" ? 1 : 0;

    //     // Update or add the sector in the sectors array
    //     updateCapturedData("cfw", "sectors", { sector_id: sectorId, value: numericValue }, 0);


    // console.log(`Sector: ${sectorId}, Selected: ${value}`);
    // value === "Yes" ? "1" : 0;
    // updateCapturedData("cfw", "sector_id", value, 0);
    // // You can update your state here to capture the selection
    // setSelectedSectors((prev) => ({
    //     ...prev,
    //     [sectorId]: Boolean(value) // true for "Yes", false for "No"
    // }));


    // };


    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const type_of_disability = await getTypeOfDisabilityLibraryOptions();
                console.log("Disability Options: " + JSON.stringify(type_of_disability));
                const convertedData = type_of_disability.map((item: { id: number; name: string }) => ({
                    id: item.id,  // Convert id to string
                    name: item.name,
                }))
                setDisabilityOptions(convertedData)  // Now it matches the expected format
                // console.log("Disability Options: " + convertedData);
                // setDisabilityOptions(type_of_disability);



                const sectors = await getSectorsLibraryOptions();
                setSectorOptions(sectors);

                const updatedFormData = { ...formData };
                updatedFormData.cfw[0].sectors = sectors.map((sector) => ({
                    id: sector.id,
                    name: sector.name,
                    answer: "",
                }));

                setFormData(updatedFormData);
                localStorage.setItem("formData", JSON.stringify(updatedFormData));


                console.log(sectors);

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
                        selectedModalityId === 25 ? (
                            sectorOptions.map((sector, index) => (
                                sector.id >= 1 && sector.id <= 9 ? (

                                    <div className="p-2" key={index}>
                                        <Label htmlFor={`sector${sector.id}`} className="block text-sm font-medium">{sector.name}</Label>
                                        <div className="mt-1">
                                            <RadioGroup
                                                defaultValue={`sector${sector.id}No`}
                                                className="flex gap-4"
                                                onValueChange={(value) => handleSectorChange(`${sector.id}`, value)}
                                            >
                                                <div className="flex items-center">
                                                    <RadioGroupItem value="Yes" id={`sector${sector.id}Yes`} />
                                                    <Label htmlFor={`sector${sector.id}Yes`} className="ml-2">Yes</Label>
                                                </div>
                                                <div className="flex items-center">
                                                    <RadioGroupItem value="No" id={`sector${sector.id}No`} />
                                                    <Label htmlFor={`sector${sector.id}No`} className="ml-2">No</Label>
                                                </div>
                                            </RadioGroup>

                                        </div>
                                        {
                                            errors?.[`sector${sector.id}`] && (
                                                <p className="mt-2 text-sm text-red-500">{errors[`sector${sector.id}`]}</p>
                                            )}
                                        {/* <p key={sector.id}>{sector.name}</p> */}
                                    </div>

                                ) : null
                            ))
                        ) : null
                    }

                    {selectedPersonsWithDisability === "Yes" && (
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
                                <p className="mt-2 text-sm text-red-500">{errors.type_of_disabilities[0]}</p>
                            )}
                        </div>
                    )}

                </div>





            </div >


        </>
    )
}