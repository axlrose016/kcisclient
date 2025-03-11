import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCFWTypeLibraryOptions } from "@/components/_dal/options";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Combobox } from "@/components/ui/combobox";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast";
import { year } from "drizzle-orm/mysql-core";
import { getOfflineLibCFWType } from "@/components/_dal/offline-options";

export default function CFWProgramDetails({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWFamBene, setSelectedIsCFWFamBene] = useState("");

    const [cFWTypeOptions, setCFWTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWType, setSelectedCFWType] = useState("");
    const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);

    const [yearServed, setYearServed] = useState("");
    // const [capturedData1, setCapturedData] = useState([]);
    const [capturedData1, setCapturedData] = useState<CapturedData[]>([]);
    const [parsedData1, setParsedData] = useState([]);
    const [SelectedCFWTypeName, setSelectedCFWTypeName] = useState<string | null>(null);

    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });
    // const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);
    const [selectedCFWTypeText, setSelectedCFWTypeText] = useState<string | null>(null);

    const [hasProgramDetails, setHasProgramDetails] = useState("");

    interface ProgramDetail {
        cfw_type_id: string; // Adjust the type as needed
        cfw_type: string;
        year_served: string;

    }
    const [programDetails, setProgramDetails] = useState<any[]>([]);

    // Function to add new entry
    const addProgramDetail = (newRecord: any) => {
        setProgramDetails((prev) => {
            const updatedList = [...prev, newRecord]; // ✅ Add new data properly
            localStorage.setItem("programDetails", JSON.stringify(updatedList)); // ✅ Update localStorage
            return updatedList;
        });
    };

    const loadProgramDetails = () => {
        const storedProgramDetails = localStorage.getItem("programDetails");

        if (storedProgramDetails) {
            setProgramDetails(JSON.parse(storedProgramDetails)); // ✅ Ensures proper data setting
        } else {
            setProgramDetails([]);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cfw_type = await getOfflineLibCFWType(); //await getCFWTypeLibraryOptions();
                const cfwTypes = localStorage.getItem("cfw_type");
                if (!cfwTypes) {
                    localStorage.setItem("cfw_type", JSON.stringify(cfw_type));
                }
                setCFWTypeOptions(cfw_type);

                const storedHasProgramDetails = localStorage.getItem("cfwHasProgramDetails");
                if (storedHasProgramDetails !== null) {
                    setHasProgramDetails(storedHasProgramDetails);
                    console.log("has Program Details? " + storedHasProgramDetails);
                }

                loadProgramDetails();
                // debugger;
                // const storedProgramDetails = localStorage.getItem("programDetails");

                // if (storedProgramDetails) {
                //     setProgramDetails(JSON.parse(storedProgramDetails));
                // }
                // else {
                //     setProgramDetails([]); // Reset if there's no data
                // }



                return;

                const formDataLS = localStorage.getItem("formData");

                // First, check if formDataLS exists
                if (formDataLS) {
                    const parsedData = JSON.parse(formDataLS || "");
                    console.log("Parsed Data: ", parsedData);
                    setCapturedData(parsedData);
                    // setCapturedData(parsedData.cfw[1].program_details);
                    console.log("Final Parsed Data: ", parsedData1);
                    // Check if sectors array exists and is not empty
                    // if (Array.isArray(parsedData.cfw[1].program_details) && parsedData.cfw[1].program_details.length > 0) {
                    //     console.log("Program details array is not empty:", setFormData(parsedData.cfw[1].program_details));
                    // }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCFWTypeChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value); // Get the value as a number
        const selectedText = event.target.options[event.target.selectedIndex].text; // Get the text

        console.log("Selected CFW Type ID:", selectedId);
        console.log("Selected CFW Type Text:", selectedText);

        setSelectedCFWTypeId(selectedId);
    };

    const [cfwType, setcfwType] = useState("");
    const handleCFWTypeChange = (id: number) => {
        console.log("Selected CFW Type ID:", id);

        setSelectedCFWTypeId(id);
    };

    const handleCFWTypeChange1 = (e: React.ChangeEvent<HTMLSelectElement>) => {

        console.log(e);
        // console.log(e.target);
        // console.log(e.target?.value);
        // const target = e.target as HTMLSelectElement;
        // console.log("Value: " + target.value);
        // const selectedId = Number(target.value); // Extract the selected ID (assuming it's a number)
        // const selectedText = target.options[target.selectedIndex].text; // Extract the selected text

        // console.log("Selected CFW Type ID:", selectedId);
        // console.log("Selected CFW Type:", selectedText);

        // setcfwType(selectedText);
        // setSelectedCFWTypeId(selectedId);
    };


    const handleIsCFWFamBene = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;
        setHasProgramDetails(value);


        const storedHasProgramDetails = localStorage.getItem("hasProgramDetails");
        if (storedHasProgramDetails !== null) {
            localStorage.removeItem("hasProgramDetails");
            localStorage.removeItem("programDetails");
            setProgramDetails([]);
        }

        localStorage.setItem("hasProgramDetails", value);

        return;


        // const values = event.target.value; 
        setSelectedIsCFWFamBene(value); //yes and no
        // console.log("is bene ", value);
        if (value === "no") {
            // updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 0, 4);
            // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
            // updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
            // updateCapturedData("cfw", "immediate_health_concern", "", 4);


        } else {
            // updateCapturedData("cfw", "has_immediate_health_concern", 1);
            // Updating cfw at index 4
            updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 1, 4);
        }

        // if (event.target.value === "no") {
        //     (document.getElementById("immediate_health_concern") as HTMLTextAreaElement).value = "";
        // }



        // console.log("IS Fam bene? " + value);
        // if (value === "No") {
        //     updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 0, 4);
        //     // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
        //     // updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
        // } else {
        //     // updateCapturedData("cfw", "has_immediate_health_concern", 1);
        //     // Updating cfw at index 4
        //     updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 1, 4);
        // }
    };

    const handleSaveFamBeneData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent default button behavior

        console.log("Selected Type is: " + selectedCFWTypeId);

        if (selectedCFWTypeId === null) {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a CFW Type!",
            })
            return;
        }
        if (yearServed === "") {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Year served required!",
            })
            return;
        }

        if (yearServed.length < 4) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please input a valid year served!",
            })
            return;
        }


        console.log("Year Served is: " + yearServed);

        const selectedText = cFWTypeOptions.find(option => option.id === selectedCFWTypeId)?.name;
        console.log("CFW TYPE " + selectedText);
        // const selectedText = e.target.options[e.target.selectedIndex].text; // Get the text
        const newRecord = {
            // Define your new data here
            cfw_type_id: selectedCFWTypeId?.toString(),
            cfw_type: selectedText,
            year_served: yearServed,

        };
        // debugger;
        const programDetails = localStorage.getItem("programDetails");
        const prevData = programDetails ? JSON.parse(programDetails) : [];
        // debugger;
        // Check if prevData is empty
        const isEmpty = Object.keys(prevData).length === 0;
        if (isEmpty) {
            // Insert new record

            addProgramDetail(newRecord);
            // localStorage.setItem("programDetails", JSON.stringify(newRecord));

            // setCapturedData(JSON.stringify(newRecord));
            // setProgramDetails([...prevData, newRecord]); // ✅ Correct way
            toast({
                variant: "green",
                title: "Success",
                description: "New entry has been saved!",
            })
        } else {
            // const selectedText = cFWTypeOptions.find(option => option.id === selectedCFWTypeId)?.name;
            // console.log("Selected Program CFW Type: " + selectedText);

            if (selectedCFWTypeId !== null && Number(selectedCFWTypeId) > 0) {
                console.log("selectedCFWTypeId is a valid positive number");
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please select a Program Type!",
                })
                return;
            }




            // const programArray = Array.isArray(prevData) ? prevData : Object.values(prevData);
            const programArray = Array.isArray(prevData) ? prevData : [prevData];
            console.log("Program array is " + typeof programArray);
            const matchingPrograms = programArray.filter((program: any) =>
                String(program.cfw_type_id) === String(selectedCFWTypeId) &&
                String(program.year_served) === String(yearServed)
            );

            if (matchingPrograms.length > 0) {
                console.log("Existing programs:", matchingPrograms);
                // console.log(localStorage.getItem("formData"));
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Record exists!",
                })
            } else {

                console.log("No matching programs found.");
                // Create new program object
                const newRecord = {
                    cfw_type_id: String(selectedCFWTypeId),
                    cfw_type: selectedText, // Change this if dynamic
                    year_served: String(yearServed),
                };

                // Append the new data to the array
                // programArray.push(newRecord);
                addProgramDetail(newRecord);

                // Save updated array to localStorage
                // localStorage.setItem("programDetails", JSON.stringify(programArray));

                // const programDetails = JSON.parse(localStorage.getItem("programDetails") || "[]");

                // setProgramDetails([...programDetails, newRecord]);
                // console.log("New program added:", newRecord);
                // console.log(localStorage.getItem("formData"));
                toast({
                    variant: "green",
                    title: "Success",
                    description: "New entry has been saved!",
                })
            }


        }





    };


    type ProgramDetails = {
        cfw_type: string;
        year_served: number;
    };
    type CFWItem = {
        program_details?: ProgramDetails[];
    };
    type CapturedData = {
        cfw: CFWItem[];
    };

    useEffect(() => {
        const storedValue = localStorage.getItem("hasProgramDetails");
        if (storedValue) {
            setHasProgramDetails(storedValue);
        }
    }, [hasProgramDetails]);

    const handleDelete = (cfwTypeId: string, yearServed: string) => {
        toast({
            variant: "destructive",
            title: "Are you sure?",
            description: "This action cannot be undone.",
            action: (
                <button
                    onClick={() => confirmDelete(cfwTypeId, yearServed)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Confirm
                </button>
            ),
        });
    };

    const confirmDelete = (cfwTypeId: string, yearServed: string) => {
        const updatedList = programDetails.filter(
            (program) => !(program.cfw_type_id === cfwTypeId && program.year_served === yearServed)
        );

        setProgramDetails(updatedList); // ✅ Updates state
        localStorage.setItem("programDetails", JSON.stringify(updatedList)); // ✅ Updates localStorage

        toast({
            variant: "green",
            title: "Success",
            description: "Record has been deleted!",
        });
    };
    return (
        <>
            <div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="cfw_program_details" className="block text-sm font-medium p-2">
                            Have you/or member/s of your family ever been a beneficiary of the Cash-for-Work Programs of the DSWD?
                        </Label>
                        <div className="mt-2 flex items-center space-x-6 p-2">
                            <div className="flex items-center">
                                <input
                                    checked={hasProgramDetails === "yes"}
                                    onChange={handleIsCFWFamBene}
                                    id="cfw_program_details_yes"
                                    name="cfw_program_details"
                                    type="radio"
                                    value="yes"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <Label htmlFor="cfw_program_details_yes" className="ml-2 text-sm font-medium text-gray-700">
                                    Yes
                                </Label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    checked={hasProgramDetails === "no"}
                                    onChange={handleIsCFWFamBene}
                                    id="cfw_program_details_no"
                                    name="cfw_program_details"
                                    type="radio"
                                    value="no"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <Label htmlFor="cfw_program_details_no" className="ml-2 text-sm font-medium text-gray-700">
                                    No
                                </Label>
                            </div>
                        </div>



                        {errors?.cfw_program_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.cfw_program_details[0]}</p>
                        )}
                    </div>


                    {hasProgramDetails !== null && hasProgramDetails === "yes" && (
                        <div className="p-2 sm:col-span-4">

                            <div className="flex justify-start mt-2 p-2">
                                {/* <Button onClick={handleSaveFamBeneData}>Add New</Button> */}

                                <Dialog modal={false}>
                                    <DialogTrigger asChild>
                                        <p className="border px-4 py-2 mr-2 rounded-md bg-blue-600 text-white text-center cursor-pointer hover:bg-blue-700 transition">
                                            Add New Entry
                                        </p>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-left mb-3">Beneficiary History</DialogTitle>
                                            <DialogDescription className="text-left text-justify mt-3">
                                                Please indicate if your family has ever been a beneficiary of the Cash-for-Work Program of DSWD (e.g., Tara Basa Program, CFW for Disaster, etc.). Write the year served.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="representative_extension_name_id" className="block text-sm font-medium mb-2">
                                                    Program Type
                                                </Label>
                                                <FormDropDown
                                                    options={cFWTypeOptions}
                                                    selectedOption={selectedCFWTypeId}
                                                    label="Select CFW Type"
                                                    onChange={(value) => handleCFWTypeChange(value)}
                                                    id="cfw-type-dropdown"
                                                />
                                                {errors?.representative_extension_name_id && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.representative_extension_name_id[0]}</p>
                                                )}
                                            </div>

                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="year_served" className="block text-sm font-medium">
                                                    Year Served
                                                </Label>
                                                <Input
                                                    type="number"
                                                    max={2025}
                                                    id="year_served"
                                                    name="year_served"
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setYearServed(e.target.value)}
                                                />
                                                {errors?.year_served && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.year_served}</p>
                                                )}
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            {/* <div>
                                                <p>New entry has been added!</p>
                                            </div> */}
                                            <Button onClick={handleSaveFamBeneData}>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>


                            </div>
                            <div className="p-2 col-span-4">
                                <Table className="border">
                                    {/* <TableCaption>A list of families that have previously been beneficiaries of the DSWD's CFW Program.</TableCaption> */}
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Program Type</TableHead>
                                            <TableHead>Year Served</TableHead>
                                            <TableHead>Action</TableHead>

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* {capturedData !== undefined ? "" : capturedData?.cfw[1].program_details[0].cfw_type_id} */}


                                        {
                                            programDetails && programDetails.length > 0 ? (
                                                programDetails.map((programDetail: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{programDetail.cfw_type}</TableCell>
                                                        <TableCell>{programDetail.year_served}</TableCell>
                                                        <TableCell>
                                                            <div className="flex space-x-2">
                                                                {/* <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Edit className="w-4 h-4" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Edit Record</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider> */}
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button onClick={() => handleDelete(programDetail.cfw_type_id, programDetail.year_served)}
                                                                                className="text-red-500 hover:text-red-700">
                                                                                <Trash className="w-4 h-4" />
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Delete Record</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2}>No program details available</TableCell>
                                                </TableRow>
                                            )}


                                    </TableBody>

                                </Table>
                            </div>

                        </div>

                    )}

                </div>

            </div >


        </>
    )
}