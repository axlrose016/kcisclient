import { fetchPIMS } from "@/components/_dal/libraries"; //region to
import { fetchPIMSProvince } from "@/components/_dal/libraries";
import { fetchPIMSCity } from "@/components/_dal/libraries";
import { fetchPIMSBrgy } from "@/components/_dal/libraries";

import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getCivilStatusLibraryOptions, getEducationalAttainmentLibraryOptions, getExtensionNameLibraryOptions, getIDCardLibraryOptions, getRelationshipToBeneficiaryLibraryOptions, getSexLibraryOptions } from "@/components/_dal/options";


export default function PWDRepresentative({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");
    const [selectedHealthConcern, setSelectedHealthConcern] = useState("");

    const [extensionNameOptions, setExtensionNameOptions] = useState<LibraryOption[]>([]);
    const [selectedExtensionNameId, setSelectedExtensionNameId] = useState<number | null>(null);
    const [selectedExtensionName, setSelectedExtensionName] = useState("");

    const [civilStatusOptions, setCivilStatusOptions] = useState<LibraryOption[]>([]);
    const [selectedCivilStatus, setSelectedCivilStatus] = useState("");
    const [selectedCivilStatusId, setSelectedCivilStatusId] = useState<number | null>(null);

    const [educationalAttainmentOptions, setEducationalAttainmentOptions] = useState<LibraryOption[]>([]);
    const [selectedEducationalAttainment, setSelectedEducationalAttainment] = useState("");
    const [selectedEducationalAttainmentId, setSelectedEducationalAttainmentId] = useState<number | null>(null);

    const [iDCardOptions, setIDCardOptions] = useState<LibraryOption[]>([]);
    const [selectedIDCard, setSelectedIDCard] = useState("");
    const [selectedIDCardId, setSelectedIDCardId] = useState<number | null>(null);

    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);

    const [BarangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [selectedBarangayId, setSelectedBarangayId] = useState<number | null>(null);

    const [cityOptions, setCityOptions] = useState<LibraryOption[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    const [sexOptions, setSexOptions] = useState<LibraryOption[]>([]);
    const [selectedSex, setSelectedSex] = useState("");
    const [selectedSexId, setSelectedSexId] = useState<number | null>(null);

    const [relationshipToBeneficiaryOptions, setRelationshipToBeneficiaryOptions] = useState<LibraryOption[]>([]);
    const [selectedRelationshipToBeneficiary, setSelectedRelationshipToBeneficiary] = useState("");
    const [selectedRelationshipToBeneficiaryId, setSelectedRelationshipToBeneficiaryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sex = await getSexLibraryOptions();
                setSexOptions(sex);

                const representative_civil_status_id = await getCivilStatusLibraryOptions();
                setCivilStatusOptions(representative_civil_status_id);

                // const modality = await getModalityLibraryOptions();
                // setModalityOptions(modality);

                const representative_extension_name_id = await getExtensionNameLibraryOptions();
                setExtensionNameOptions(representative_extension_name_id);

                const educational_attainment = await getEducationalAttainmentLibraryOptions();
                setEducationalAttainmentOptions(educational_attainment);

                const id_card = await getIDCardLibraryOptions();
                setIDCardOptions(id_card);

                const relationship_to_beneficiary_id = await getRelationshipToBeneficiaryLibraryOptions();
                setRelationshipToBeneficiaryOptions(relationship_to_beneficiary_id);

                const region = await fetchPIMS();
                // Ensure the response has data and map it to LibraryOption format
                const mappedRegions: LibraryOption[] = region.map((item: any) => ({
                    id: item.Id,         // Assuming 'id' exists in fetched data
                    name: item.Name,     // Assuming 'name' exists in fetched data
                }));

                setRegionOptions(mappedRegions); // Update state with mapped data

                // 
                const province = await fetchPIMSProvince();

                const mappedProvince: LibraryOption[] = province.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                }));

                setProvinceOptions(mappedProvince);

                const city = await fetchPIMSCity();

                const mappedCity: LibraryOption[] = city.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                }));

                setCityOptions(mappedCity);

                const barangay = await fetchPIMSBrgy();

                const mappedBarangay: LibraryOption[] = barangay.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                }));

                setBarangayOptions(mappedBarangay);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    // 



    const handlRelationshipToBeneficiaryChange = (id: number) => {
        console.log("Selected Relationship to beneficiary ID:", id);
        updateCapturedData("cfw", "representative_relationship_to_beneficiary", id, 4);
        setSelectedRelationshipToBeneficiaryId(id);
    };
    const handlExtensionNameChange = (id: number) => {
        console.log("Selected Extension name ID:", id);
        updateCapturedData("cfw", "representative_extension_name_id", id, 4);
        setSelectedExtensionNameId(id);
    };
    const handleCivilStatusChange = (id: number) => {
        console.log("Selected Civil Status ID:", id);
        updateCapturedData("cfw", "representative_civil_status_id", id, 4);
        setSelectedCivilStatusId(id);
    };
    const handleRegionChange = (id: number) => {
        console.log("Selected Region ID:", id);
        setSelectedRegionId(id);
    };
    const handleProvinceChange = (id: number) => {
        console.log("Selected Province ID:", id);
        setSelectedProvinceId(id);
    };
    const handleCityChange = (id: number) => {
        console.log("Selected City ID:", id);
        setSelectedCityId(id);
    };
    const handleBarangayChange = (id: number) => {
        console.log("Selected Barangay ID:", id);
        updateCapturedData("cfw", "representative_brgy_code", id, 4);
        setSelectedBarangayId(id);
    };
    const handleSexChange = (id: number) => {
        console.log("Selected Sex ID:", id);
        updateCapturedData("cfw", "representative_sex_id", id, 4);
        setSelectedSexId(id);
    };
    const handleEducationalAttainmentChange = (id: number) => {
        console.log("Selected Educational Attainment ID:", id);
        updateCapturedData("cfw", "representative_educational_attainment_id", id, 4);
        setSelectedEducationalAttainmentId(id);
    };
    const [dob, setDob] = useState<string>("");
    const [age, setAge] = useState<number | "">("");
    const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        updateCapturedData("cfw", "representative_birthdate", selectedDate, 4);
        setDob(selectedDate);
        computeAge(selectedDate);
    };
    const computeAge = (dob: string) => {
        if (!dob) {
            setAge(0);
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

        updateCapturedData("cfw", "representative_age", calculatedAge, 4);
        setAge(calculatedAge);
    };
    const handleCfwCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCfwCategory(event.target.value);
        if (event.target.value === "no") {
            (document.getElementById("health_concerns_details") as HTMLTextAreaElement).value = "";
        }
    };
    const handleHealthConcernChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedHealthConcern(value);

        if (value === "no") {
            // updateCapturedData("cfw", "representative_has_health_concern", 0);
            // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
            updateCapturedData("cfw", "representative_has_health_concern", 0, 4);
        } else {
            // updateCapturedData("cfw", "has_immediate_health_concern", 1);
            // Updating cfw at index 4
            updateCapturedData("cfw", "representative_has_health_concern", 1, 4);
        }
        // setSelectedHealthConcern(event.target.value);
        // if (event.target.value === "no") {
        //     (document.getElementById("representative_health_concern_details") as HTMLTextAreaElement).value = "";
        // }
    };
    const handleIDCardChange = (id: number) => {
        console.log("Selected ID Card ID:", id);
        updateCapturedData("cfw", "representative_id_card_id", id, 4);
        setSelectedIDCardId(id);
    };

    return (
        <>
            <div className="">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_last_name" className="block text-sm font-medium">Last Name</Label>
                        <Input
                            id="representative_last_name"
                            name="representative_last_name"
                            className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_last_name', e.target.value, 4)}
                        />
                        {errors?.representative_last_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_last_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_first_name" className="block text-sm font-medium">First Name</Label>
                        <Input
                            id="representative_first_name"
                            name="representative_first_name"
                            className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_first_name', e.target.value, 4)}
                        />
                        {errors?.representative_first_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_first_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_middle_name" className="block text-sm font-medium">Middle Name</Label>
                        <Input
                            id="representative_middle_name"
                            name="representative_middle_name"
                            className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_middle_name', e.target.value, 4)}
                        />
                        {errors?.representative_middle_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_middle_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_extension_name_id" className="block text-sm font-medium">Extension Name</Label>
                        <FormDropDown
                            options={extensionNameOptions}
                            selectedOption={selectedExtensionNameId}
                            onChange={handlExtensionNameChange}
                        />
                        {errors?.representative_extension_name_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_extension_name_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_sitio" className="block text-sm font-medium">House No/Street/Purok</Label>
                        <Input id="representative_sitio" name="representative_sitio" className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_sitio', e.target.value, 4)} />
                        {errors?.representative_sitio && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_sitio[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="region_representative" className="block text-sm font-medium">Region</Label>
                        <FormDropDown
                            id="region_representative"
                            options={regionOptions}
                            selectedOption={selectedRegionId}
                            onChange={handleRegionChange}
                        />
                        {errors?.region_representative && (
                            <p className="mt-2 text-sm text-red-500">{errors.region_representative[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="province_representative" className="block text-sm font-medium">Province</Label>
                        <FormDropDown
                            id="province_representative"
                            options={provinceOptions}
                            selectedOption={selectedProvinceId}
                            onChange={handleProvinceChange}
                        />
                        {errors?.province && (
                            <p className="mt-2 text-sm text-red-500">{errors.province[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="municipality_representative" className="block text-sm font-medium">Municipality</Label>
                        <FormDropDown
                            id="municipality_representative"
                            options={cityOptions}
                            selectedOption={selectedCityId}
                            onChange={handleCityChange}
                        />
                        {errors?.municipality_representative && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality_representative[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_brgy_code" className="block text-sm font-medium">Barangay</Label>
                        <FormDropDown
                            id="representative_brgy_code"
                            options={BarangayOptions}
                            selectedOption={selectedBarangayId}
                            onChange={handleBarangayChange}
                        />
                        {errors?.representative_brgy_code && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_brgy_code[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_relationship_to_beneficiary_id" className="block text-sm font-medium">Relationship to Beneficiary</Label>
                        <FormDropDown
                            id="representative_relationship_to_beneficiary_id"
                            options={relationshipToBeneficiaryOptions}
                            selectedOption={selectedRelationshipToBeneficiaryId}
                            onChange={handlRelationshipToBeneficiaryChange}
                        />

                        {errors?.representative_relationship_to_beneficiary_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_relationship_to_beneficiary_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_birthdate" className="block text-sm font-medium">Birthday</Label>
                        <Input
                            id="representative_birthdate"
                            name="representative_birthdate"
                            type='date' className='mt-1'
                            onChange={handleDOBChange} />
                        {errors?.representative_birthdate && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_birthdate[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_age" className="block text-sm font-medium">Age</Label>
                        <Input
                            id="representative_age"
                            name="representative_age"
                            type="number"
                            placeholder="Enter your Age"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                            value={age}
                            disabled

                        />
                        {errors?.representative_age && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_age[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_occupation" className="block text-sm font-medium">Work (if available)</Label>
                        <Input id="representative_occupation" name="representative_occupation" className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_occupation', e.target.value, 4)}
                        />
                        {errors?.representative_occupation && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_occupation[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_monthly_salary" className="block text-sm font-medium">Monthly Salary</Label>
                        <Input type="number" id="representative_monthly_salary" name="monthly_salary" className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_monthly_salary', e.target.value, 4)}
                        />
                        {errors?.representative_monthly_salary && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_monthly_salary[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_educational_attainment_id" className="block text-sm font-medium">Highest Educational Attainment</Label>

                        <FormDropDown
                            id="representative_educational_attainment_id"
                            options={educationalAttainmentOptions}
                            selectedOption={selectedEducationalAttainmentId}
                            onChange={handleEducationalAttainmentChange}
                        />

                        {errors?.representative_educational_attainment_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_educational_attainment_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_sex_id" className="block text-sm font-medium">Sex</Label>
                        <FormDropDown
                            id="representative_sex_id"
                            options={sexOptions}
                            selectedOption={selectedSexId}
                            onChange={handleSexChange}
                        />
                        {errors?.representative_sex_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_sex_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_contact_number" className="block text-sm font-medium">Contact Number</Label>
                        <Input id="representative_contact_number" name="representative_contact_number" className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_contact_number', e.target.value, 4)} />
                        {errors?.representative_contact_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_contact_number[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_id_card_id" className="block text-sm font-medium">ID Card</Label>
                        <FormDropDown
                            id="representative_id_card_id"
                            options={iDCardOptions}
                            selectedOption={selectedIDCardId}
                            onChange={handleIDCardChange}
                        />
                        {errors?.representative_id_card_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_id_card_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_id_card_number" className="block text-sm font-medium">ID Card Number</Label>
                        <Input id="representative_id_card_number" name="representative_id_card_number" className="mt-1 block w-full"
                            onChange={(e) => updateCapturedData("cfw", 'representative_id_card_number', e.target.value, 4)}
                        />
                        {errors?.representative_id_card_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_id_card_number[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_civil_status_id" className="block text-sm font-medium">Civil Status</Label>
                        <FormDropDown
                            options={civilStatusOptions}
                            selectedOption={selectedCivilStatusId}
                            onChange={handleCivilStatusChange}
                        />
                        {errors?.representative_civil_status_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_civil_status_id[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="health_declaration" className="block text-sm font-medium">Health Declaration of the Representative</Label>
                        <Textarea id="health_declaration" name="health_declaration" rows={4} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            onChange={(e) => updateCapturedData("cfw", 'health_declaration', e.target.value, 4)}
                        />
                        {errors?.health_declaration && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_declaration[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_has_health_concern" className="block text-sm font-medium">Do you have any immediate health concerns that you think may affect your work?</Label>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <input
                                    id="health_concerns_yes"
                                    name="representative_has_health_concern"
                                    type="radio"
                                    value="yes"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    onChange={handleHealthConcernChange}
                                />
                                <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    id="health_concerns_no"
                                    name="representative_has_health_concern"
                                    type="radio"
                                    value="no"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    onChange={handleHealthConcernChange}
                                />
                                <Label htmlFor="health_concerns_no" className="ml-3 block text-sm font-medium text-gray-700">
                                    No
                                </Label>
                            </div>
                        </div>
                        {errors?.representative_has_health_concern && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_has_health_concern[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_health_concern_details" className="block text-sm font-medium">If yes, please provide details:</Label>
                        <div className="mt-2">
                            <Textarea
                                id="representative_health_concern_details"
                                name="representative_health_concern_details"
                                rows={4}
                                className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                disabled={selectedCfwCategory !== "1"}
                                onChange={(e) => updateCapturedData("cfw", 'representative_health_concern_details', e.target.value, 4)}
                            />
                        </div>
                        {errors?.representative_health_concern_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_health_concern_details[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="representative_skills" className="block text-sm font-medium">Skills Assessment of the Representative</Label>
                        <Textarea id="representative_skills" name="representative_skills" rows={4} className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            onChange={(e) => updateCapturedData("cfw", 'representative_skills', e.target.value, 4)} />
                        {errors?.representative_skills && (
                            <p className="mt-2 text-sm text-red-500">{errors.representative_skills[0]}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}