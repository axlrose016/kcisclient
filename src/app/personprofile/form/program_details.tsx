import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Children, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Terminal, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCFWTypeLibraryOptions, getYearServedLibraryOptions } from "@/components/_dal/options";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Combobox } from "@/components/ui/combobox";
import {
    Alert, AlertDescription, AlertTitle
} from "@/components/ui/alert"
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
import { getOfflineExtensionLibraryOptions, getOfflineLibCFWType, getOfflineLibProgramTypes, getOfflineLibYearServed } from "@/components/_dal/offline-options";


export default function CFWProgramDetails({ errors }: { errors: any; }) {
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWFamBene, setSelectedIsCFWFamBene] = useState("");

    const [cFWTypeOptions, setCFWTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWType, setSelectedCFWType] = useState("");
    const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);

    const [yearServed, setYearServed] = useState("");
    const [yearServeOptions, setYearServeOptions] = useState<LibraryOption[]>([]);
    const [selectedYearServedId, setSelectedYearServedId] = useState<number | null>(null);

    const [programTypes, setProgramTypes] = useState("");
    const [programTypesOptions, setProgramTypesOptions] = useState<LibraryOption[]>([]);
    const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<number | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);

    // const [capturedData1, setCapturedData] = useState([]);
    // const [capturedData1, setCapturedData] = useState<CapturedData[]>([]);
    const [parsedData1, setParsedData] = useState([]);
    const [SelectedCFWTypeName, setSelectedCFWTypeName] = useState<string | null>(null);

    const [famMemberFirstName, setfamMemberFirstName] = useState("");
    const [famMemberLastName, setfamMemberLastName] = useState("");
    const [famMemberMiddleName, setfamMemberMiddleName] = useState("");
    const [famMemberSelectedExtNameId, setfamMemberExtNameId] = useState<number | null>(null);

    const [formData, setFormData] = useState(() => {
        // Initialize formData from localStorage or set default structure
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : { cfw: [{ sectors: [] }] };
    });
    // const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);
    const [selectedCFWTypeText, setSelectedCFWTypeText] = useState<string | null>(null);

    const [hasProgramDetails, setHasProgramDetails] = useState("");
    const [programDetailsExtensionNameOptions, setprogramDetailsExtensionNameOptions] = useState<LibraryOption[]>([]);

    const handlExtensionNameChange = (id: number) => {

        // updateCommonData("extension_name", id);
        console.log("Selected Extension name ID:", id);
        setfamMemberExtNameId(id)
        // setSelectedExtensionNameId(id);
        // updatingCommonData("extension_name_id", id);
    };
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
                // const cfw_type = await getOfflineLibCFWType(); //await getCFWTypeLibraryOptions();
                // const cfwTypes = localStorage.getItem("cfw_type");
                // if (!cfwTypes) {
                //     localStorage.setItem("cfw_type", JSON.stringify(cfw_type));
                // }
                // setCFWTypeOptions(cfw_type);

                const storedHasProgramDetails = localStorage.getItem("cfwHasProgramDetails");
                if (storedHasProgramDetails !== null) {
                    setHasProgramDetails(storedHasProgramDetails);
                    console.log("has Program Details? " + storedHasProgramDetails);
                }

                loadProgramDetails();

                const extension_name = await getOfflineExtensionLibraryOptions(); //await getExtensionNameLibraryOptions();
                // Convert label values to uppercase before setting state
                const formattedExtensions = extension_name.map(option => ({

                    ...option,
                    name: option.name.toUpperCase(), // Convert label to uppercase

                }));
                console.log("Formatted Extension", formattedExtensions);
                setprogramDetailsExtensionNameOptions(formattedExtensions);


                const yearsServed = await getOfflineLibYearServed();
                setYearServeOptions(yearsServed)

                const programTypes = await getOfflineLibProgramTypes();
                setProgramTypesOptions(programTypes)
                return;

                const formDataLS = localStorage.getItem("formData");

                // First, check if formDataLS exists
                if (formDataLS) {
                    const parsedData = JSON.parse(formDataLS || "");
                    console.log("Parsed Data: ", parsedData);
                    // setCapturedData(parsedData);
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

        setSelectedProgramTypeId(id);
        // setSelectedCFWTypeId(id);
    };
    const handleYearServedChange = (id: number) => {
        console.log("Selected Year Served ID:", id);

        setSelectedYearServedId(id);
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
            // updateCapturedData("cfw", "is_family_beneficiary_of_cfw", 1, 4);
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
        // debugger;
        // alert(famMemberFirstName + ' ' + famMemberMiddleName + ' ' + famMemberLastName + ' ' + famMemberExtNameId + ' ' + selectedProgramTypeId + ' ' + selectedYearServedId);
        // return;
        // console.log("Selected Type is: " + selectedCFWTypeId);

        if (!famMemberFirstName || famMemberFirstName.trim() === "") {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Please input First Name!",
            })
            return;
        }

        else if (!famMemberLastName || famMemberLastName.trim() === "") {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Please input Last Name!",
            })
            return;
        }

        else if (selectedProgramTypeId === null) {

            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a Program Type!",
            })
            return;
        }
        else if (selectedYearServedId == null) {


            toast({
                variant: "destructive",
                title: "Error",
                description: "Year served required!",
            })
            return;
        } else {

            const selectedProgramTypeName = programTypesOptions.find(option => option.id === selectedProgramTypeId)?.name;
            const selectedYearServedName = yearServeOptions.find(option => option.id === selectedYearServedId)?.name;
            const selectedExtensionName = programDetailsExtensionNameOptions.find(option => option.id === famMemberSelectedExtNameId)?.name;
            // console.log("CFW Program TYPE " + selectedProgramTypeName + " Selected Year Served: " + selectedYearServedName);

            // const selectedText = e.target.options[e.target.selectedIndex].text; // Get the text
            const newRecord = {
                // Define your new data here
                program_type_first_name: famMemberFirstName.toUpperCase(),
                program_type_middle_name: famMemberMiddleName.toUpperCase(),
                program_type_last_name: famMemberLastName.toUpperCase(),
                program_type_ext_name_id: famMemberSelectedExtNameId,
                program_type_ext_name: selectedExtensionName,
                program_type_id: selectedProgramTypeId,
                program_type_name: selectedProgramTypeName,
                program_type_year_served_id: selectedYearServedId,
                program_type_year_served_name: selectedYearServedName

            };
            // debugger;
            const programDetails = localStorage.getItem("programDetails");
            const prevData = programDetails ? JSON.parse(programDetails || "") : [];
            // debugger;
            // Check if prevData is empty
            const isEmpty = Object.keys(prevData).length === 0;
            if (isEmpty) {
                // Insert new record

                addProgramDetail(newRecord);
                setDialogOpen(false);
                toast({
                    variant: "green",
                    title: "Success",
                    description: "New entry has been saved!",
                })
            } else {
                // const selectedText = cFWTypeOptions.find(option => option.id === selectedCFWTypeId)?.name;
                // console.log("Selected Program CFW Type: " + selectedText);

                // if (selectedProgramTypeId !== null && Number(selectedProgramTypeId) > 0) {
                //     console.log("Selected Program ID is a valid positive number");
                // } else {
                //     toast({
                //         variant: "destructive",
                //         title: "Error",
                //         description: "Please select a Program Type!",
                //     })
                //     return;
                // }




                // const programArray = Array.isArray(prevData) ? prevData : Object.values(prevData);
                const lsProgramDetails = localStorage.getItem("programDetails");
                if (lsProgramDetails) {
                    debugger;
                    // const programArray = Array.isArray(prevData) ? prevData : [prevData];
                    // console.log("Program array is " + typeof programArray);
                    const parsedProgramDetails = JSON.parse(lsProgramDetails);
                    const matchingPrograms = parsedProgramDetails.filter((program: any) => {
                        return (
                            Number(program.program_type_id) === Number(selectedProgramTypeId) &&
                            Number(program.program_type_year_served_id) === Number(selectedYearServedId) &&
                            program.program_type_first_name.trim().toLowerCase() === famMemberFirstName.trim().toLowerCase() &&
                            program.program_type_middle_name.trim().toLowerCase() === famMemberMiddleName.trim().toLowerCase() &&
                            program.program_type_last_name.trim().toLowerCase() === famMemberLastName.trim().toLowerCase() &&
                            Number(program.program_type_ext_name_id) === Number(famMemberSelectedExtNameId)
                        );
                    });

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
                            // Define your new data here
                            program_type_first_name: famMemberFirstName.toUpperCase(),
                            program_type_middle_name: famMemberMiddleName.toUpperCase(),
                            program_type_last_name: famMemberLastName.toUpperCase(),
                            program_type_ext_name_id: famMemberSelectedExtNameId,
                            program_type_id: selectedProgramTypeId,
                            program_type_name: selectedProgramTypeName,
                            program_type_year_served_id: selectedYearServedId,
                            program_type_year_served_name: selectedYearServedName

                        };

                        // Append the new data to the array
                        // programArray.push(newRecord);
                        addProgramDetail(newRecord);

                        setDialogOpen(false);
                        toast({
                            variant: "green",
                            title: "Success",
                            description: "New entry has been saved!",
                        })
                    }
                }



            }
        }




        // console.log("Year Served is: " + yearServed);






    };


    // type ProgramDetails = {
    //     cfw_type: string;
    //     year_served: number;
    // };
    // type CFWItem = {
    //     program_details?: ProgramDetails[];
    // };
    // type CapturedData = {
    //     cfw: CFWItem[];
    // };

    useEffect(() => {
        const storedValue = localStorage.getItem("hasProgramDetails");
        if (storedValue) {
            setHasProgramDetails(storedValue);
        }
    }, [hasProgramDetails]);

    const handleDelete = (cfwTypeId: string, firstName?: string, middleName?: string, lastName?: string, extNameId?: number, yearServedId?: number) => {
        toast({
            variant: "destructive",
            title: "Are you sure?",
            description: "You are about to remove the record, continue?",
            action: (
                <button
                    onClick={() => confirmDelete(cfwTypeId, firstName, middleName, lastName, extNameId, yearServedId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Confirm
                </button>
            ),
        });
    };

    const confirmDelete = (cfwTypeId: string, firstName?: string, middleName?: string, lastName?: string, extNameId?: number, yearServedId?: number) => {
        const updatedList = programDetails.filter(
            (program) => !(program.program_type_first_name === firstName &&
                program.program_type_middle_name === middleName &&
                program.program_type_last_name === lastName &&
                Number(program.program_type_ext_name_id) === Number(extNameId) &&
                Number(program.program_type_id) === Number(cfwTypeId) &&
                Number(program.program_type_year_served_id) === Number(yearServedId)
            )
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
                <div className="">
                    <div className="w-full">
                        <Label htmlFor="cfw_program_details" className="block text-sm font-medium p-2">
                            Have you/or member/s of your family ever been a beneficiary of the Cash-for-Work Programs of the DSWD?
                        </Label>
                        <div className="mt-2 ml-2 flex items-center space-x-6">
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
                        <div className="mt-4">

                            <div className="flex justify-start mt-5 overflow-y-auto">

                                <Dialog modal={false} open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <p
                                            onClick={() => setDialogOpen(true)}
                                            className="border px-4 py-2 rounded-md bg-blue-600 text-white text-center cursor-pointer hover:bg-blue-700 transition"
                                        >
                                            Add New Entry
                                        </p>
                                    </DialogTrigger>

                                    <DialogContent className="w-full max-w-[90vw] md:max-w-[600px] lg:max-w-[660px] max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-left mb-3">Beneficiary History</DialogTitle>
                                            <DialogDescription className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md text-sm">
                                                Please indicate if your family has ever been a beneficiary of the Cash-for-Work Program of DSWD
                                                (e.g., Tara Basa Program, CFW for Disaster, etc.). Write the full name and the year served.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="mb-2 w-full space-y-4">
                                            <div className="px-2">
                                                <Label htmlFor="program_details_first_name" className="block text-sm font-medium mb-2">
                                                    Family Member's First Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="program_details_first_name"
                                                    placeholder="First Name"
                                                    className="w-full"
                                                    value={famMemberFirstName.toUpperCase()}
                                                    onChange={(e) => setfamMemberFirstName(e.target.value)}
                                                />
                                            </div>

                                            <div className="px-2">
                                                <Label htmlFor="program_details_middle_name" className="block text-sm font-medium mb-2">
                                                    Family Member's Middle Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="program_details_middle_name"
                                                    placeholder="Middle Name"
                                                    className="w-full"
                                                    value={famMemberMiddleName.toUpperCase()}
                                                    onChange={(e) => setfamMemberMiddleName(e.target.value)}
                                                />
                                            </div>

                                            <div className="px-2">
                                                <Label htmlFor="program_details_last_name" className="block text-sm font-medium mb-2">
                                                    Family Member's Last Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="program_details_last_name"
                                                    placeholder="Last Name"
                                                    className="w-full"
                                                    value={famMemberLastName.toUpperCase()}
                                                    onChange={(e) => setfamMemberLastName(e.target.value)}
                                                />
                                            </div>

                                            <div className="px-2">
                                                <Label htmlFor="program_details_extension_name" className="block text-sm font-medium mb-2">
                                                    Family Member's Extension Name
                                                </Label>
                                                <FormDropDown
                                                    id="program_details_extension_name"
                                                    options={programDetailsExtensionNameOptions}
                                                    selectedOption={famMemberSelectedExtNameId}
                                                    onChange={(value) => handlExtensionNameChange(value)}
                                                    label="Select an Extension Name (if applicable)"
                                                />
                                            </div>

                                            <div className="px-2 w-[300px] md:w-full lg:w-full">
                                                <Label htmlFor="program_type" className="block text-sm font-medium mb-2">
                                                    Program Type
                                                </Label>
                                                <FormDropDown
                                                    options={programTypesOptions}
                                                    selectedOption={selectedProgramTypeId}
                                                    label="Select CFW Program Type"
                                                    onChange={(value) => handleCFWTypeChange(value)}
                                                    id="program_type"
                                                />
                                            </div>

                                            <div className="px-2">
                                                <Label htmlFor="year_served" className="block text-sm font-medium mb-2">
                                                    Year Served
                                                </Label>
                                                <FormDropDown
                                                    options={yearServeOptions}
                                                    selectedOption={selectedYearServedId}
                                                    label="Select Year Served"
                                                    onChange={(value) => handleYearServedChange(value)}
                                                    id="year_served"
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button onClick={handleSaveFamBeneData}>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <div className="mt-4">
                                <Table className="border">
                                    {/* <TableCaption>A list of families that have previously been beneficiaries of the DSWD's CFW Program.</TableCaption> */}
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[5%] text-center">#</TableHead>
                                            <TableHead className="w-[45%] ">Family Member Name</TableHead>
                                            <TableHead className="w-[40%] ">Program Type</TableHead>
                                            <TableHead className="w-[10%] text-center">Year Served</TableHead>
                                            <TableHead className="w-[10%] text-center">Action</TableHead>

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* {capturedData !== undefined ? "" : capturedData?.cfw[1].program_details[0].cfw_type_id} */}


                                        {
                                            programDetails && programDetails.length > 0 ? (
                                                programDetails.map((programDetail: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="text-center">{index + 1}.</TableCell>
                                                        <TableCell>{programDetail.program_type_first_name} {programDetail.program_type_middle_name}  {programDetail.program_type_last_name} {programDetail.selectedExtensionName} </TableCell>
                                                        <TableCell>{programDetail.program_type_name}</TableCell>
                                                        <TableCell className="text-center" >{programDetail.program_type_year_served_name}</TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex space-x-2 text-center">

                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button onClick={() => handleDelete(programDetail.program_type_id,
                                                                                programDetail.program_type_first_name,
                                                                                programDetail.program_type_middle_name,
                                                                                programDetail.program_type_last_name,
                                                                                programDetail.program_type_ext_name_id,
                                                                                programDetail.program_type_year_served_id)}
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