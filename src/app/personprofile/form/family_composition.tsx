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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogPortal } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCFWTypeLibraryOptions, getEducationalAttainmentLibraryOptions, getRelationshipToFamilyMemberTypeLibraryOptions, getYearLevelLibraryOptions } from "@/components/_dal/options";
import { ButtonDialog } from "@/components/actions/button-dialog";
import FamilyCompositionForm from "@/components/dialogs/personprofile/frmfamilycomposition";
import HighestEducationalAttainment from "./highest_educational_attainment";
import { toast } from "@/hooks/use-toast";
import { getOfflineLibEducationalAttainment, getOfflineLibRelationshipToBeneficiary, getOfflineLibYearLevel } from "@/components/_dal/offline-options";

export default function FamilyComposition({ errors }: { errors: any }) {


    const [relationshipToFamilyMemberOptions, setRelationshipToFamilyMemberOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToFamilyMember, setSelectedRelationshipToFamilyMember] = useState("");
    const [selectedRelationshipToFamilyMemberId, setSelectedRelationshipToFamilyMemberId] = useState<number | null>(null);

    const [yearLevelOptions, setYearLevelOptions] = useState<LibraryOption[]>([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedYearLevelId, setSelectedYearLevelId] = useState<number | null>(null);


    const [EducationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);

    const [dob, setDob] = useState<string>("");
    const [age, setAge] = useState<string>("");

    const [familyMemberName, setFamilyMemberName] = useState("");



    const [familyMemberWork, setfamilyMemberWork] = useState("");
    const [familyMemberMonthlyIncome, setfamilyMemberMonthlyIncome] = useState("");
    const [familyMemberContactNumber, setfamilyMemberContactNumber] = useState("");

    // const [capturedData1, setCapturedData] = useState([]);
    const [capturedData1, setCapturedData] = useState<CapturedData>({ cfw: [{ family_composition: [] }] });


    const [form_Data, setForm_Data] = useState([]);




    const [familyComposition, setFamilyComposition] = useState<FamilyCompositionData>({
        family_composition: []
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const relationship_to_family_member = await getOfflineLibRelationshipToBeneficiary(); //await getRelationshipToFamilyMemberTypeLibraryOptions();
                setRelationshipToFamilyMemberOptions(relationship_to_family_member);

                const year_level = await getOfflineLibYearLevel();//await getYearLevelLibraryOptions();
                setYearLevelOptions(year_level);


                const educational_attainment = await getOfflineLibEducationalAttainment();//await getEducationalAttainmentLibraryOptions();
                setEducationalAttainmentOptions(educational_attainment);


                let fam_com = localStorage.getItem("family_composition");

                if (!fam_com) {
                    // Initialize with an empty array if no data exists
                    const initialData = { family_composition: [] };
                    localStorage.setItem("family_composition", JSON.stringify(initialData));
                    fam_com = JSON.stringify(initialData);
                }

                // Parse and set the state
                const parsedData = JSON.parse(fam_com);
                setFamilyComposition(parsedData);
                console.log("Family Composition data:", parsedData);

                const cd = localStorage.getItem("commonData");
                if (cd) {
                    const parsedDataCd = JSON.parse(cd);
                    setCommonData(cd);
                }

                // const fd = localStorage.getItem("famCom");
                // if (fd) {
                //     setCapturedData(JSON.parse(fd));
                // } else {
                //     console.log("No data from famCom");
                // }



            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handlRelationshipToFamilyMemberChange = (id: number) => {
        console.log("Selected Relationship to Family Member ID:", id);
        setSelectedRelationshipToFamilyMemberId(id);
    };
    const handlYearLevelChange = (id: number) => {
        console.log("Selected Year Level ID:", id);
        setSelectedYearLevelId(id);
    };

    // const handlCFWTypeChange = (id: number) => {
    //     console.log("Selected CFW Type ID (ADD):", id);
    //     setSelectedCFWTypeId(id);
    // };

    const handlEducationalAttainmentChange = (id: number) => {
        console.log("Selected Family Member Educational attainment ID (ADD):", id);
        setSelectedEducationalAttainmentId(id);
    };
    const handleRelationshipToFamilyMember = (id: number) => {
        console.log("Selected Relationship to family member id:", id);
        setSelectedRelationshipToFamilyMemberId(id);
    };

    const handlbtnOnChange = (id: number) => {
        console.log("submitted", id);
        // setSelectedEducationalAttainmentId(id);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm_Data((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            localStorage.setItem('famCom', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
        });
    };

    const handleSaveFamMemberData = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent default button behavior

        console.log("Family Member Name:", familyMemberName);
        // debugger;

        const famCom = localStorage.getItem("family_composition");
        let prevData: any = { family_composition: [] }; // Ensure it's an object with an array

        if (famCom) {
            prevData = JSON.parse(famCom);
            console.log("Parsed prevData:", prevData);
        } else {
            console.log("No family composition found.");
        }

        console.log("Before:", prevData);

        // Ensure `family_composition` exists
        let familyComposition = prevData.family_composition || [];

        // Find the selected relationship
        const selectedTextRelationshipToFamilyMember = relationshipToFamilyMemberOptions.find(
            (option) => option.id === selectedRelationshipToFamilyMemberId
        )?.name || "";

        console.log("Selected Relationship to Bene:", selectedTextRelationshipToFamilyMember);

        // Find the selected highest educational attainment
        const selectedTextHighestEducationalAttainment = EducationalAttainmentOptions.find(
            (option) => option.id === selectedEducationalAttainmentId
        )?.name || "";

        console.log("Selected Highest Educational Attainment:", selectedTextHighestEducationalAttainment);

        // Check for duplicate family member by name (case insensitive)
        const famMemberExists = familyComposition.some(
            (member: any) => member.name.toLowerCase() === familyMemberName.toLowerCase()
        );

        if (famMemberExists) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "This Family Member already exists.",
            });
            alert("This Family Member already exists.");
            return; // Exit function early
        }

        // Validations
        if (!familyMemberName.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Family member's name is required!",
            });
            return;
        }

        if (selectedRelationshipToFamilyMemberId === 0 || selectedRelationshipToFamilyMemberId === null) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Relationship to Family member is required!",
            });
            return;
        }

        if (!dob.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Family member's birthday is required!",
            });
            return;
        }

        if (selectedEducationalAttainmentId === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Highest educational attainment is required!",
            });
            return;
        }

        if (!familyMemberContactNumber.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Family Member's Contact number is required!",
            });
            return;
        }

        // Create the new family member object
        const newFamilyMember = {
            name: familyMemberName,
            relationship_to_the_beneficiary: selectedTextRelationshipToFamilyMember,
            relationship_to_the_beneficiary_id: selectedRelationshipToFamilyMemberId,
            birthdate: dob,
            age: age,
            highest_educational_attainment: selectedTextHighestEducationalAttainment,
            highest_educational_attainment_id: selectedEducationalAttainmentId,
            work: familyMemberWork,
            monthly_income: familyMemberMonthlyIncome,
            contact_number: familyMemberContactNumber,
        };

        // Append the new family member to the existing family composition
        const updatedFamilyComposition = [...familyComposition, newFamilyMember];

        // Update the localStorage and state
        const updatedData = {
            ...prevData,
            family_composition: updatedFamilyComposition,
        };

        localStorage.setItem("family_composition", JSON.stringify(updatedData));

        // Update the state with the new data
        setFamilyComposition(updatedData);

        console.log("Updated Family Composition:", updatedData.family_composition);

        toast({
            variant: "green",
            title: "Success",
            description: "Family Member data has been added!",
        });
    };



    const handleFamilyMemberDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;

        setDob(selectedDate);
        computeAge(selectedDate);

    };

    const computeAge = (dob: string) => {
        if (!dob) {
            setAge("0");
            return;
        }

        const birthDate = new Date(dob);
        const today = new Date();

        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
        }
        // Ensure age is a number (in case of negative or invalid age)
        const ageNumber = Math.max(0, Number(calculatedAge)); // Ensure it's never negative

        setAge(ageNumber.toString());
    };

    interface FamilyMember {
        age: number;
        birthdate: string;
        contact_number: string;
        highest_educational_attainment: string;
        highest_educational_attainment_id: number;
        monthly_income: number;
        name: string;
        relationship_to_the_beneficiary: string;
        relationship_to_the_beneficiary_id: number;
        work: string;
    };

    interface FamilyCompositionData {
        family_composition: FamilyMember[];
    }
    type CFWItem = {
        family_composition?: FamilyMember[];
    };
    type CapturedData = {
        cfw: CFWItem[];
    };
    const [commonData, setCommonData] = useState(() => {
        if (typeof window !== "undefined") {
            const cd = localStorage.getItem("commonData");
            return cd ? JSON.parse(cd) : {};
        }
        return {};

    })
    useEffect(() => {
        const cd = localStorage.getItem("commonData");
        if (!cd) {

            localStorage.setItem("commonData", JSON.stringify(commonData));
        }
    }, [commonData]);

    // Delete function

    const confirmDelete = (index: number) => {
        if (!familyComposition.family_composition) return; // Ensure it exists
        const updatedFamily = familyComposition.family_composition.filter((_, i) => i !== index);
        setFamilyComposition({ family_composition: updatedFamily });
        // Update localStorage
        localStorage.setItem("family_composition", JSON.stringify({ family_composition: updatedFamily }));

        toast({
            variant: "green",
            title: "Success",
            description: "Record has been deleted!",
        });
    };
    const handleDeleteFamMem = (index: number) => {
        // alert("why");
        toast({
            variant: "destructive",
            title: "Are you sure?",
            description: "This action cannot be undone.",
            action: (
                <button
                    onClick={() => confirmDelete(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Confirm
                </button>
            ),
        });
    };
    return (
        <>
            <div className="w-full overflow-x-auto " >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 col-span-4 ">
                        <div className="flex justify-start">

                            <Dialog modal={false}>
                                <DialogTrigger asChild>
                                    <p className="ml-2 border px-3 py-3 cursor-pointer">Add Record</p>
                                </DialogTrigger>
                                <DialogPortal>
                                    <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-left">Add Family Members</DialogTitle>
                                            <DialogDescription className="text-left">
                                                Please complete the fields below and click "Save."
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                                            {/* // { 
                                        // name: "", 
                                        // relationship_to_the_beneficiary_id: 0, 
                                        // birthdate: "", 
                                        // age: 0, 
                                        // highest_educational_attainment_id: 0, 
                                        // work: "", 
                                        // monthly_income: "", 
                                        // contact_number: "" } */}
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_name" className="block text-sm font-medium">Name of Family Member<span className='text-red-500'> *</span></Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_name"
                                                    name="family_member_name"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setFamilyMemberName(e.target.value)}
                                                    value={familyMemberName}
                                                />
                                                {errors?.family_member_name && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_name}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="relationship_to_family_member" className="block text-sm font-medium">Relationship to Family Member<span className='text-red-500'> *</span></Label>
                                                <FormDropDown

                                                    id="relationship_to_family_member"
                                                    options={relationshipToFamilyMemberOptions}
                                                    selectedOption={selectedRelationshipToFamilyMemberId}
                                                    onChange={handlRelationshipToFamilyMemberChange}

                                                />
                                                {errors?.relationship_to_family_member && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.relationship_to_family_member}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_birthdate" className="block text-sm font-medium">Birth Date<span className='text-red-500'> *</span></Label>
                                                <Input
                                                    //  onChange={(e) => updateCommonData('first_name', e.target.value)}
                                                    id="family_member_birthdate"
                                                    name="family_member_birthdate"
                                                    type="date"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    onChange={handleFamilyMemberDOBChange}
                                                />
                                                {errors?.family_member_birthdate && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_birthdate}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_age" className="block text-sm font-medium">Age</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_age"
                                                    name="family_member_age"
                                                    className="mt-1 block w-full mb-2"
                                                    value={age}
                                                    readOnly

                                                />
                                                {errors?.family_member_age && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_age}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_highest_educational_attainment_id" className="block text-sm font-medium">Highest Educational Attainment</Label>
                                                <FormDropDown

                                                    id="family_highest_educational_attainment_id"
                                                    options={EducationalAttainmentOptions}
                                                    selectedOption={selectedEducationalAttainmentId}
                                                    onChange={handlEducationalAttainmentChange}

                                                />
                                                {errors?.family_highest_educational_attainment_id && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_highest_educational_attainment_id}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_work" className="block text-sm font-medium">Work</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_work"
                                                    name="family_member_work"
                                                    className="mt-1 block w-full mb-2"
                                                    // readOnly
                                                    onChange={(e) => setfamilyMemberWork(e.target.value)}

                                                />
                                                {errors?.family_member_work && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_work}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_monthly_income" className="block text-sm font-medium">Monthly Income</Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_monthly_income"
                                                    name="family_member_monthly_income"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setfamilyMemberMonthlyIncome(e.target.value)}

                                                />
                                                {errors?.family_member_monthly_income && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_monthly_income}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-4">
                                                <Label htmlFor="family_member_contact_number" className="block text-sm font-medium">Contact Number<span className='text-red-500'> *</span></Label>
                                                <Input
                                                    type="text"
                                                    id="family_member_contact_number"
                                                    name="family_member_contact_number"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setfamilyMemberContactNumber(e.target.value)}

                                                />
                                                {errors?.family_member_contact_number && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.family_member_contact_number}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSaveFamMemberData}>Save</Button>
                                        </DialogFooter>

                                    </DialogContent>
                                </DialogPortal>
                            </Dialog>
                        </div>
                        <div className="p-2 col-span-4">

                            <Table className="min-w-[1000px] border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {/* {'Type of familyComposition: ' + typeof familyComposition } */}
                                            {/* {'Type of familyComposition: ' + typeof familyComposition +
                                                "Family Composition:" + familyComposition +
                                                "Length of Fam Com:" + Array.isArray(familyComposition) ? familyComposition.length : "Not an array"
                                            } */}
                                            Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Birthday</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Educational level</TableHead>
                                        <TableHead>Occupation</TableHead>
                                        <TableHead>Monthly Income</TableHead>
                                        <TableHead>Contact Number</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {familyComposition?.family_composition && familyComposition.family_composition.length > 0 ? (
                                        familyComposition.family_composition.map((familyMember: FamilyMember, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{familyMember.name}</TableCell>
                                                <TableCell>{familyMember.relationship_to_the_beneficiary}</TableCell>
                                                <TableCell>{familyMember.birthdate}</TableCell>
                                                <TableCell>{familyMember.age}</TableCell>
                                                <TableCell>{familyMember.highest_educational_attainment}</TableCell>
                                                <TableCell>{familyMember.work}</TableCell>
                                                <TableCell>{familyMember.monthly_income}</TableCell>
                                                <TableCell>{familyMember.contact_number}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center  space-x-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>

                                                                    <Trash className="w-5 h-5 inline text-red-500 hover:text-red-700" onClick={() => handleDeleteFamMem(index)} />

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
                                            <TableCell colSpan={9}>No Family Members available</TableCell>
                                        </TableRow>
                                    )}

                                </TableBody>

                            </Table>

                        </div>

                    </div>



                </div>

            </div >
            {
                commonData.modality_id !== undefined && commonData.modality_id === 25 ? (
                    <div className="p-2">
                        <Label htmlFor="no_of_children" className="block text-sm font-medium">Number of Children</Label>
                        <Input
                            id="no_of_children"
                            name="no_of_children"
                            type="number"
                            placeholder="Enter the number of children"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.no_of_children && (
                            <p className="mt-2 text-sm text-red-500">{errors.no_of_children}</p>
                        )}
                    </div>
                ) : null
            }

        </>
    )
}