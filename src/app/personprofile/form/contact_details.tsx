import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ContactDetails({ errors }: ErrorProps) {
  
    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [municipalityOptions, setMunicipalityOptions] = useState<LibraryOption[]>([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [barangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    return (
        <>
            <div className="space-y-12">
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
                    <div className="p-2 col-span-2">
                        <Label htmlFor="house_no_street_purok" className="block text-sm font-medium">House No/Street/Purok</Label>
                        <Input
                            id="house_no_street_purok"
                            name="house_no_street_purok"
                            type="text"
                            placeholder="Enter your House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.house_no_street_purok && (
                            <p className="mt-2 text-sm text-red-500">{errors.house_no_street_purok[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="region" className="block text-sm font-medium mb-[5px]">Region</Label>
                        <FormDropDown
                            options={regionOptions}
                            selectedOption={selectedRegion}

                        />
                        {errors?.region && (
                            <p className="mt-2 text-sm text-red-500">{errors.region[0]}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="province" className="block text-sm font-medium mb-[5px]">Province</Label>
                        <FormDropDown
                            options={provinceOptions}
                            selectedOption={selectedProvince}
                        />
                        {errors?.province && (
                            <p className="mt-2 text-sm text-red-500">{errors.province[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="municipality" className="block text-sm font-medium mb-[5px]">Municipality</Label>
                        <FormDropDown
                            options={municipalityOptions}
                            selectedOption={selectedMunicipality}
                        />
                        {errors?.municipality && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality[0]}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="barangay" className="block text-sm font-medium mb-[5px]">Barangay</Label>
                        <FormDropDown
                            options={barangayOptions}
                            selectedOption={selectedBarangay}
                        />
                        {errors?.barangay && (
                            <p className="mt-2 text-sm text-red-500">{errors.barangay[0]}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="contact_number_primary" className="block text-sm font-medium">Contact Number (Primary)</Label>
                        <Input
                            id="contact_number_primary"
                            name="contact_number_primary"
                            type="text"
                            placeholder="Enter your primary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.contact_number_primary && (
                            <p className="mt-2 text-sm text-red-500">{errors.contact_number_primary[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="contact_number_secondary" className="block text-sm font-medium">Contact Number (Secondary)</Label>
                        <Input
                            id="contact_number_secondary"
                            name="contact_number_secondary"
                            type="text"
                            placeholder="Enter your secondary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.contact_number_secondary && (
                            <p className="mt-2 text-sm text-red-500">{errors.contact_number_secondary[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="active_email_address" className="block text-sm font-medium">Active Email Address</Label>
                        <Input
                            id="active_email_address"
                            name="active_email_address"
                            type="email"
                            placeholder="Enter your active email address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.active_email_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.active_email_address[0]}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}