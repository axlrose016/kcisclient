import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function PWDRepresentative({ errors }: ErrorProps) {
    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");
    const handleCfwCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCfwCategory(event.target.value);
        if (event.target.value === "no") {
            (document.getElementById("health_concerns_details") as HTMLTextAreaElement).value = "";
        }
    };
    return (
        <>
            <div className="">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                    <div className="p-2 col-span-1">
                        <Label htmlFor="last_name" className="block text-sm font-medium">Last Name</Label>
                        <Input id="last_name" name="last_name" className="mt-1 block w-full" />
                        {errors?.last_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="first_name" className="block text-sm font-medium">First Name</Label>
                        <Input id="first_name" name="first_name" className="mt-1 block w-full" />
                        {errors?.first_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.first_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="middle_name" className="block text-sm font-medium">Middle Name</Label>
                        <Input id="middle_name" name="middle_name" className="mt-1 block w-full" />
                        {errors?.middle_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.middle_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="extension_name" className="block text-sm font-medium">Extension Name</Label>
                        <Input id="extension_name" name="extension_name" className="mt-1 block w-full" />
                        {errors?.extension_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.extension_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="house_no_street_purok" className="block text-sm font-medium">House No/Street/Purok</Label>
                        <Input id="house_no_street_purok" name="house_no_street_purok" className="mt-1 block w-full" />
                        {errors?.house_no_street_purok && (
                            <p className="mt-2 text-sm text-red-500">{errors.house_no_street_purok[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="region" className="block text-sm font-medium">Region</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.region && (
                            <p className="mt-2 text-sm text-red-500">{errors.region[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="province" className="block text-sm font-medium">Province</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.province && (
                            <p className="mt-2 text-sm text-red-500">{errors.province[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="municipality" className="block text-sm font-medium">Municipality</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.municipality && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="barangay" className="block text-sm font-medium">Barangay</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.barangay && (
                            <p className="mt-2 text-sm text-red-500">{errors.barangay[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="relationship_to_beneficiary" className="block text-sm font-medium">Relationship to Beneficiary</Label>
                        <Input id="relationship_to_beneficiary" name="relationship_to_beneficiary" className="mt-1 block w-full" />
                        {errors?.relationship_to_beneficiary && (
                            <p className="mt-2 text-sm text-red-500">{errors.relationship_to_beneficiary[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="birthday" className="block text-sm font-medium">Birthday</Label>
                        <Input id="birthday" name="birthday" type="date" className="mt-1 block w-full" />
                        {errors?.birthday && (
                            <p className="mt-2 text-sm text-red-500">{errors.birthday[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="age" className="block text-sm font-medium">Age</Label>
                        <Input id="age" name="age" className="mt-1 block w-full" />
                        {errors?.age && (
                            <p className="mt-2 text-sm text-red-500">{errors.age[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="work" className="block text-sm font-medium">Work (if available)</Label>
                        <Input id="work" name="work" className="mt-1 block w-full" />
                        {errors?.work && (
                            <p className="mt-2 text-sm text-red-500">{errors.work[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="monthly_salary" className="block text-sm font-medium">Monthly Salary</Label>
                        <Input id="monthly_salary" name="monthly_salary" className="mt-1 block w-full" />
                        {errors?.monthly_salary && (
                            <p className="mt-2 text-sm text-red-500">{errors.monthly_salary[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="highest_educational_attainment" className="block text-sm font-medium">Highest Educational Attainment</Label>
                        <Input id="highest_educational_attainment" name="highest_educational_attainment" className="mt-1 block w-full" />
                        {errors?.highest_educational_attainment && (
                            <p className="mt-2 text-sm text-red-500">{errors.highest_educational_attainment[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="sex" className="block text-sm font-medium">Sex</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.sex && (
                            <p className="mt-2 text-sm text-red-500">{errors.sex[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="contact_number" className="block text-sm font-medium">Contact Number</Label>
                        <Input id="contact_number" name="contact_number" className="mt-1 block w-full" />
                        {errors?.contact_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.contact_number[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="id_card" className="block text-sm font-medium">ID Card</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.id_card && (
                            <p className="mt-2 text-sm text-red-500">{errors.id_card[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="id_card_number" className="block text-sm font-medium">ID Card Number</Label>
                        <Input id="id_card_number" name="id_card_number" className="mt-1 block w-full" />
                        {errors?.id_card_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.id_card_number[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="civil_status" className="block text-sm font-medium">Civil Status</Label>
                        <FormDropDown
                            options={[]}
                            selectedOption={""}
                        />
                        {errors?.civil_status && (
                            <p className="mt-2 text-sm text-red-500">{errors.civil_status[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="health_declaration" className="block text-sm font-medium">Health Declaration of the Representative</Label>
                        <Textarea id="health_declaration" name="health_declaration" rows={4} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        {errors?.health_declaration && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_declaration[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="health_concerns" className="block text-sm font-medium">Do you have any immediate health concerns that you think may affect your work?</Label>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <input
                                    id="health_concerns_yes"
                                    name="health_concerns"
                                    type="radio"
                                    value="yes"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    onChange={handleCfwCategoryChange}
                                />
                                <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    id="health_concerns_no"
                                    name="health_concerns"
                                    type="radio"
                                    value="no"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    onChange={handleCfwCategoryChange}
                                />
                                <Label htmlFor="health_concerns_no" className="ml-3 block text-sm font-medium text-gray-700">
                                    No
                                </Label>
                            </div>
                        </div>
                        {errors?.health_concerns && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_concerns[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="health_concerns_details" className="block text-sm font-medium">If yes, please provide details:</Label>
                        <div className="mt-2">
                            <Textarea
                                id="health_concerns_details"
                                name="health_concerns_details"
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                disabled={selectedCfwCategory !== "yes"}
                            />
                        </div>
                        {errors?.health_concerns_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_concerns_details[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="skills_assessment" className="block text-sm font-medium">Skills Assessment of the Representative</Label>
                        <Textarea id="skills_assessment" name="skills_assessment" rows={4} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        {errors?.skills_assessment && (
                            <p className="mt-2 text-sm text-red-500">{errors.skills_assessment[0]}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}