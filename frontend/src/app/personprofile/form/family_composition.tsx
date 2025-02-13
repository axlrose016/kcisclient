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

export default function FamilyComposition({ errors }: ErrorProps) {
    const [cfwTypeOptions, setcfwTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWBene, setSelectedIsCFWBene] = useState("");

    const [relationshipToFamilyMemberOptions, setRelationshipToFamilyMemberOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToFamilyMember, setSelectedRelationshipToFamilyMember] = useState("");
    const [selectedRelationshipToFamilyMemberId, setSelectedRelationshipToFamilyMemberId] = useState<number | null>(null);

    const [yearLevelOptions, setYearLevelOptions] = useState<LibraryOption[]>([]);
    const [selectedYearLevel, setSelectedYearLevel] = useState("");
    const [selectedYearLevelId, setSelectedYearLevelId] = useState<number | null>(null);

    const [CFWTypeOptions, setCFWTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWType, setSelectedCFWType] = useState("");
    const [selectedCFWTypeId, setSelectedCFWTypeId] = useState<number | null>(null);

    const [EducationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);
    const [form_Data, setForm_Data] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const relationship_to_family_member = await getRelationshipToFamilyMemberTypeLibraryOptions();
                setRelationshipToFamilyMemberOptions(relationship_to_family_member);

                const year_level = await getYearLevelLibraryOptions();
                setYearLevelOptions(year_level);

                const cfw_type = await getCFWTypeLibraryOptions();
                setCFWTypeOptions(cfw_type);

                const educational_attainment = await getEducationalAttainmentLibraryOptions();
                setEducationalAttainmentOptions(educational_attainment);



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

    const handlCFWTypeChange = (id: number) => {
        console.log("Selected CFW Type ID (ADD):", id);
        setSelectedCFWTypeId(id);
    };

    const handlEducationalAttainmentChange = (id: number) => {
        console.log("Selected Educational attainment ID (ADD):", id);
        setSelectedEducationalAttainmentId(id);
    };

    const handlbtnOnChange = (id: number) => {
        console.log("submitted", id);
        // setSelectedEducationalAttainmentId(id);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm_Data((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            localStorage.setItem('formData', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
        });
    };
    return (
        <>
            <div className="w-full overflow-x-auto " >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 col-span-4 ">
                        <div className="flex justify-end">
                            {/* <Dialog>

                                <DialogTrigger>
                                    Add Family Member
                                </DialogTrigger>


                                 <ButtonDialog dialogForm={FamilyCompositionForm} label="Add Family Member"/> 
                            </Dialog> */}
                            <Dialog modal={false}>
                                <DialogTrigger>
                                    Edit Profile
                                </DialogTrigger>
                                <DialogPortal>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when you're done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form action="">
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Name
                                                    </Label>
                                                    <Input id="name" className="col-span-3" />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="username" className="text-right">
                                                        Username
                                                    </Label>
                                                    <Input id="username" className="col-span-3" />
                                                </div>
                                                <div className="grid grid-cols-1 items-center gap-4">
                                                    <Label htmlFor="username" className="text-right">
                                                        Username
                                                    </Label>
                                                    <FormDropDown
                                                        // onBlur={handleBlur}
                                                        id="relationshiptothemember"
                                                        options={relationshipToFamilyMemberOptions}
                                                        selectedOption={selectedRelationshipToFamilyMemberId}
                                                        onChange={handlRelationshipToFamilyMemberChange}
                                                    // menuPortalTarget={document.body}
                                                    // styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button  >Save changes</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </DialogPortal>
                            </Dialog>
                        </div>
                        <div className="p-2 col-span-4">

                            <Table className="min-w-[1000px] border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Birthday</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Educational level</TableHead>
                                        <TableHead>Occupation</TableHead>
                                        <TableHead>Monthly Income</TableHead>
                                        <TableHead>Type of Vulnerability</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>Father</TableCell>
                                        <TableCell>1980-01-01</TableCell>
                                        <TableCell>43</TableCell>
                                        <TableCell>College</TableCell>
                                        <TableCell>Engineer</TableCell>
                                        <TableCell>$5000</TableCell>
                                        <TableCell>None</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Edit className="w-4 h-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit Record</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Trash className="w-4 h-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Record</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </div>


                    </div>



                </div>
            </div >
        </>
    )
}