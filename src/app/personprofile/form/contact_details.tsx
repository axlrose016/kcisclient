import { fetchPIMS } from "@/components/_dal/libraries"; //region to
import { fetchPIMSProvince } from "@/components/_dal/libraries";
import { fetchPIMSCity } from "@/components/_dal/libraries";
import { fetchPIMSBrgy } from "@/components/_dal/libraries";
import { getProvinceLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { number } from "zod";

export default function ContactDetails({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionId, setSelectedRegionId] = useState<string>();

    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

    const [BarangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [selectedBarangayId, setSelectedBarangayId] = useState<string | null>(null);

    const [cityOptions, setCityOptions] = useState<LibraryOption[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    const [municipalityOptions, setMunicipalityOptions] = useState<LibraryOption[]>([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState("");


    const initialContactDetails = {
        sitio: "",
        cellphone_no: "",
        cellphone_no_secondary: "",
        email: "",
        region_code: "",
        province_code: "",
        city_code: "",
        barangay_code: "",
        sitio_present_address: "",
        region_code_present_address: "",
        province_code_present_address: "",
        city_code_present_address: "",
        brgy_code_present_address: "",
        is_same_as_permanent_address: false
    };

    const [contactDetails, setContactDetails] = useState(initialContactDetails);


    const updatingContactDetails = (field: any, value: any) => {
        // debugger;
        console.log("The valus is ", value);
        console.log(isSameAddress);
        if (isSameAddress) {
            if (field === "sitio") {

                contactDetails.sitio_present_address = value;
            } else if (field === "region_code") {
                contactDetails.region_code_present_address = value;

            } else if (field === "province_code") {
                contactDetails.province_code_present_address = value;
            } else if (field === "city_code") {
                contactDetails.city_code_present_address = value;
            } else if (field === "barangay_code") {
                contactDetails.brgy_code_present_address = value;
            }
        }
        setContactDetails((prev: any) => {

            // console.log(initialContactDetails);
            const updatedData = { ...prev, [field]: value };

            // Update localStorage
            localStorage.setItem("contactDetails", JSON.stringify(updatedData));

            return updatedData;
        });

    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                // const province = await getProvinceLibraryOptions();
                // setProvinceOptions(province);
                // alert("Hello Lord!");
                // const region = await fetchPIMS();
                const region = await fetchPIMS();

                // Ensure the response has data and map it to LibraryOption format
                const mappedRegions: LibraryOption[] = region.map((item: any) => ({
                    id: item.Id,         // Assuming 'id' exists in fetched data
                    name: item.Name,     // Assuming 'name' exists in fetched data
                }));

                setRegionOptions(mappedRegions); // Update state with mapped data

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

                if (typeof window !== "undefined") {
                    const storedContactDetails = localStorage.getItem("contactDetails");
                    if (storedContactDetails) {
                        setContactDetails(JSON.parse(storedContactDetails));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const handleRegionChange = (id: string) => {
        console.log("Selected Region ID:", id);
        // updateCapturedData("common_data", "region_code", id);
        // updateCapturedData("common_data", "region_code_present_address", id);
        setSelectedRegionId(id);
        updatingContactDetails("region_code", id);
    };

    const [selectedRegionIDPresentAddress, setSelectedRegionIDPresentAddress] = useState<string>();
    const [encodedSitioPermanent, setEncodedSitioPermanent] = useState("");
    const [encodedSitioPresent, setEncodedSitioPresent] = useState("");
    const handleRegionPresentAddressChange = (region_code_present_address: string) => {
        console.log("Selected Region ID:", region_code_present_address);
        setSelectedRegionIDPresentAddress(region_code_present_address);
        updatingContactDetails("region_code_present_address", region_code_present_address);
    };

    const handleSitioPermanentChange = () => {
        if (isSameAddress) {
            // setEncodedSitioPresent
        }
    }
    const handleProvinceChange = (id: string) => {
        console.log("Selected Province ID:", id);
        updateCapturedData("common_data", "province_code", id);
        setSelectedProvinceId(id);
        updatingContactDetails("province_code", id);
    };

    const [selectedCityIDPresentAddress, setSelectedCityIDPresentAddress] = useState<string>();
    const handleCityPresentAddressChange = (city_code_present_address: string) => {
        console.log("Selected  City ID:", city_code_present_address);
        setSelectedCityIDPresentAddress(city_code_present_address);
        updatingContactDetails("city_code_present_address", city_code_present_address);
    };
    const handleCityChange = (id: string) => {
        console.log("Selected City ID:", id);
        updateCapturedData("common_data", "city_code", id);
        setSelectedCityId(id);
        updatingContactDetails("city_code", id);
    };
    const [selectedProvinceIDPresentAddress, setSelectedProvinceIDPresentAddress] = useState<string>();
    const handleProvincePresentAddressChange = (province_code_present_address: string) => {
        console.log("Selected  Province ID:", province_code_present_address);
        setSelectedProvinceIDPresentAddress(province_code_present_address);
        updatingContactDetails("province_code_present_address", province_code_present_address);
    };
    // const handleProvinceChange = (id: number) => {
    //     console.log("Selected Province Code:", id);
    //     updateCapturedData("common_data", "barangay_code", id);
    //     setSelectedBarangayId(id);
    // };

    const handleBarangayChange = (id: string) => {
        console.log("Selected Barangay ID:", id);
        updateCapturedData("common_data", "barangay_code", id);
        setSelectedBarangayId(id);
        updatingContactDetails("barangay_code", id);
    };

    const [selectedBarangayIDPresentAddress, setSelectedBarangayIDPresentAddress] = useState<string>();
    const handleBarangayPresentAddressChange = (barangay_code_present_address: string) => {
        console.log("Selected  Barangay ID:", barangay_code_present_address);
        setSelectedBarangayIDPresentAddress(barangay_code_present_address);
        updatingContactDetails("barangay_code_present_address", barangay_code_present_address);
    };
    const [isSameAddress, setIsSameAddress] = useState(false);
    const handleCheckSameAddress = () => {
        console.log(!isSameAddress);
        setIsSameAddress(!isSameAddress);
        if (!isSameAddress) {
            contactDetails.sitio_present_address = contactDetails.sitio;
            contactDetails.region_code_present_address = contactDetails.region_code;
            contactDetails.province_code_present_address = contactDetails.province_code;
            contactDetails.city_code_present_address = contactDetails.city_code;
        }
        updatingContactDetails("is_same_as_permanent_address", !isSameAddress);
    }
    return (
        <>
            <div className="space-y-3">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 bg-gray-200 p-3 mb-0">
                    Permanent Address
                </div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2 mt-0">

                    <div className="p-2 col-span-2">
                        <Label htmlFor="sitio" className="block text-sm font-medium">House No/Street/Purok<span className='text-red-500'> *</span></Label>
                        <Input
                            // value={capturedData.common_data.sitio}
                            value={contactDetails.sitio || ""}
                            onChange={(e) => updatingContactDetails("sitio", e.target.value)}
                            // onChange={(e) => updateCapturedData("common_data", 'sitio', e.target.value)}
                            id="sitio"
                            name="sitio"
                            type="text"
                            placeholder="Enter your House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.sitio && (
                            <p className="mt-2 text-sm text-red-500">{errors.sitio}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="region_contact_details" className="block text-sm font-medium mb-[5px]">Region<span className='text-red-500'> *</span></Label>

                        <FormDropDown
                            selectedOption={contactDetails.region_code}
                            onChange={handleRegionChange}
                            id="region_contact_details"
                            options={regionOptions}

                        />
                        {errors?.region_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.region_contact_details}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="province_contact_details" className="block text-sm font-medium mb-[5px]">Province<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="province_contact_details"
                            options={provinceOptions}
                            // selectedOption={selectedProvinceId}
                            // selectedOption={capturedData.common_data.province_code}
                            selectedOption={contactDetails.province_code}
                            onChange={handleProvinceChange}
                        />
                        {errors?.province_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.province_contact_details}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="municipality_contact_number" className="block text-sm font-medium mb-[5px]">Municipality<span className='text-red-500'> *</span></Label>

                        <FormDropDown
                            id="municipality_contact_number"
                            options={cityOptions}

                            selectedOption={contactDetails.city_code}
                            onChange={handleCityChange}
                        />
                        {errors?.municipality_contact_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality_contact_number}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="barangay_contact_details" className="block text-sm font-medium mb-[5px]">Barangay<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="barangay_contact_details"
                            options={BarangayOptions}
                            selectedOption={contactDetails.barangay_code}

                            onChange={handleBarangayChange}
                        />
                        {errors?.barangay_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.barangay_contact_details}</p>
                        )}
                    </div >
                </div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 bg-gray-200 p-3">
                    Present Address
                </div>
                <div className="flex items-center gap-2 p-3">
                    <Input
                        type="checkbox"
                        id="copy_permanent_address"
                        checked={contactDetails.is_same_as_permanent_address}
                        onChange={handleCheckSameAddress}
                        className="w-4 h-4 cursor-pointer" />
                    <label
                        htmlFor="copy_permanent_address"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  cursor-pointer"
                    >
                        Same as Permanent Address
                    </label>
                </div>


                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
                    <div className="p-2 col-span-2">
                        <Label htmlFor="sitio_present_address" className="block text-sm font-medium">House No/Street/Purok<span className='text-red-500'> *</span></Label>
                        <Input
                            // value={capturedData.common_data.sitio}
                            value={contactDetails.sitio_present_address || ""}
                            onChange={(e) => updatingContactDetails("sitio_present_address", e.target.value)}
                            // onChange={(e) => updateCapturedData("common_data", 'sitio', e.target.value)}
                            id="sitio_present_address"
                            name="sitio_present_address"
                            type="text"
                            placeholder="Enter your Present House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            readOnly={isSameAddress}
                        />
                        {errors?.sitio_present_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.sitio_present_address}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="region_contact_details_present_address" className="block text-sm font-medium mb-[5px]">Region<span className='text-red-500'> *</span></Label>

                        <FormDropDown
                            selectedOption={contactDetails.region_code_present_address}
                            onChange={handleRegionPresentAddressChange}
                            id="region_contact_details_present_address"
                            options={regionOptions}
                            readOnly={contactDetails.is_same_as_permanent_address}

                        />
                        {errors?.region_contact_details_present_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.region_contact_details_present_address}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="province_contact_details_present_address" className="block text-sm font-medium mb-[5px]">Province<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="province_contact_details_present_address"
                            options={provinceOptions}
                            selectedOption={contactDetails.province_code_present_address}
                            onChange={handleProvincePresentAddressChange}
                            readOnly={contactDetails.is_same_as_permanent_address}
                        />
                        {errors?.province_contact_details_present_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.province_contact_details_present_address}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="municipality_contact_details_present_address" className="block text-sm font-medium mb-[5px]">Municipality<span className='text-red-500'> *</span></Label>

                        <FormDropDown
                            id="municipality_contact_details_present_address"
                            options={cityOptions}
                            selectedOption={contactDetails.city_code_present_address}
                            onChange={handleCityPresentAddressChange}
                            readOnly={contactDetails.is_same_as_permanent_address}
                        />
                        {errors?.municipality_contact_details_present_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality_contact_details_present_address}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="barangay_contact_details_present_address" className="block text-sm font-medium mb-[5px]">Barangay<span className='text-red-500'> *</span></Label>
                        <FormDropDown
                            id="barangay_contact_details_present_address"
                            options={BarangayOptions}
                            selectedOption={contactDetails.brgy_code_present_address}
                            onChange={handleBarangayPresentAddressChange}
                            readOnly={contactDetails.is_same_as_permanent_address}
                        />
                        {errors?.barangay_contact_details_present_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.barangay_contact_details_present_address}</p>
                        )}
                    </div >
                </div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 bg-gray-200 p-3">
                    Contact Numbers and Email
                </div>
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no" className="block text-sm font-medium">Contact Number (Primary)<span className='text-red-500'> *</span></Label>
                        <Input
                            value={contactDetails.cellphone_no}
                            // value={capturedData.common_data.cellphone_no}
                            id="cellphone_no"
                            name="cellphone_no"
                            type="text"
                            placeholder="Enter your primary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updatingContactDetails("cellphone_no", e.target.value)}
                        // onChange={(e) => updateCapturedData("common_data", "cellphone_no", e.target.value)}
                        />
                        {errors?.cellphone_no && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no_secondary" className="block text-sm font-medium">Contact Number (Secondary)<span className='text-red-500'> *</span></Label>
                        <Input
                            value={contactDetails.cellphone_no_secondary}
                            // value={capturedData.common_data.cellphone_no_secondary}
                            id="cellphone_no_secondary"
                            name="cellphone_no_secondary"
                            type="text"
                            placeholder="Enter your secondary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updatingContactDetails("cellphone_no_secondary", e.target.value)}
                        // onChange={(e) => updateCapturedData("common_data", "cellphone_no_secondary", e.target.value)}
                        />
                        {errors?.cellphone_no_secondary && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no_secondary}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="email" className="block text-sm font-medium">Active Email Address<span className='text-red-500'> *</span></Label>
                        <Input
                            value={contactDetails.email}
                            // value={capturedData.common_data.email}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your active email address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updatingContactDetails('email', e.target.value)}
                        // onChange={(e) => updateCapturedData("common_data", 'email', e.target.value)}
                        />
                        {errors?.email && (
                            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}