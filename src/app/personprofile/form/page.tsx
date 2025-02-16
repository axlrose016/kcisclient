'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { PictureBox } from '@/components/forms/picture-box'
import Details from './personal_information'
import { FormTabs } from '@/components/forms/form-tabs'
import { FormDropDown } from '@/components/forms/form-dropdown'
import { LibraryOption } from '@/components/interfaces/library-interface'
import { getLibrary } from '@/lib/libraries'
import ContactDetails from './contact_details'
import SectorDetails from './sectors'
import CFWProgramDetails from './program_details'
import FamilyComposition from './family_composition'
import HighestEducationalAttainment from './highest_educational_attainment'

import PrefferedDeploymentArea from './preferred_deployment_area'
import RequirementsAttachment from './requirements_attachments'
import { Textarea } from '@/components/ui/textarea'
import Occupation from './occupation'

import PWDRepresentative from './pwd_representative'
import VolunteerDetails from './volunteer_details'
import KCTrainings from './kc_trainings'
import CapacityBuilding from './capacity_building'
import Ers_work_record from './ers_work_record'
import { getCivilStatusLibraryOptions, getExtensionNameLibraryOptions, getModalityLibraryOptions, getModalitySubCategoryLibraryOptions, getSexLibraryOptions } from '@/components/_dal/options'

import { ButtonSubmit } from "@/components/actions/button-submit";
import { submit } from "./action";
import { debug } from 'console'

export default function PersonProfileForm() {
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const { toast } = useToast()

  const [sexOptions, setSexOptions] = useState<LibraryOption[]>([]);
  const [selectedSex, setSelectedSex] = useState("");
  const [selectedSexId, setSelectedSexId] = useState<number | null>(null);

  const [civilStatusOptions, setCivilStatusOptions] = useState<LibraryOption[]>([]);
  const [selectedCivilStatus, setSelectedCivilStatus] = useState("");
  const [selectedCivilStatusId, setSelectedCivilStatusId] = useState<number | null>(null);

  const [modalityOptions, setModalityOptions] = useState<LibraryOption[]>([]);
  const [selectedModality, setSelectedModality] = useState("");
  const [selectedModalityId, setSelectedModalityId] = useState<number | null>(null);

  const [extensionNameOptions, setExtensionNameOptions] = useState<LibraryOption[]>([]);
  const [selectedExtensionNameId, setSelectedExtensionNameId] = useState<number | null>(null);
  const [selectedExtensionName, setSelectedExtensionName] = useState("");

  const [modalitySubCategoryOptions, setModalitySubCategoryOptions] = useState<LibraryOption[]>([]);
  const [selectedModalitySubCategoryId, setSelectedModalitySubCategoryId] = useState<number | null>(null);
  const [selectedModalitySubCategory, setSelectedModalitySubCategory] = useState("");

  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const [state, submitAction] = useActionState(submit, undefined)

  const [philsysIdNo, setPhilsysIdNo] = useState<string>("");

  const [localStorageData, setLocalStorageDate] = useState([]);
  const [form_Data, setForm_Data] = useState([]);

  // array that separate data by modality
  const [capturedData, setCapturedData] = useState({
    common_data: {
      modality_id: 0,
      first_name: '',
      middle_name: '',
      last_name: '',
      extension_name: 0,
      sex_id: 0,
      civil_status_id: 0,
      birthdate: "",
      age: 0,

      sitio: "",
      barangay_code: "",
      cellphone_no: "",
      cellphone_no_secondary: "",
      email: "",
      birthplace: "",
      philsys_id_no: "",


    },

    // this is for cfw alone
    cfw: [
      {
        // junction table
        programDetails: [
          { type_of_cfw: '', year_served: '' }
        ]
      },
      {
        sectors: [
          { sector_id: '' }
        ]
      },
      {
        disabilities: [
          { disability_id: '' }
        ]
      },
      {

        family_composition: [
          { name: "", relationship_to_the_beneficiary_id: 0, birthdate: "", age: 0, highest_educational_attainment_id: 0, work: "", monthly_income: "", contact_number: "" }
        ]
      },
      {
        modality_sub_category_id: 0,
        current_occupation: "",
        occupation_id_card_id: 0,
        occupation_id_card_number: "",
        women: "",
        ip: "",
        ip_group_id: 0,
        solo_parent: "",
        children_and_youth_in_need_of_special_protection: "",
        out_of_school_youth: "",
        family_heads_in_need_of_assistance: "",
        affected_by_disaster: "",
        persons_with_disability: "",
        senior_citizen: "",
        has_immediate_health_concern: 0,
        immediate_health_concern: "",

        school_name: "",
        campus: "",
        school_address: "",
        course_id: 0,
        year_graduated: "",
        year_level_id: 0,
        skills: "",
        deployment_area_id: 0,
        deployment_area_address: "",
        preffered_type_of_work_id: 0,

        representative_last_name: "",
        representative_first_name: "",
        representative_middle_name: "",
        representative_extension_name_id: "",
        representative_sitio: "",
        representative_brgy_code: "",
        representative_relationship_to_beneficiary: "",
        representative_birthdate: "",
        representative_age: "",
        representative_occupation: "",
        representative_monthly_salary: 0,
        representative_educational_attainment_id: 0,
        representative_sex_id: 0,
        representative_contact_number: "",
        representative_id_card_id: 0,
        representative_id_card_number: "",
        representative_civil_status_id: 0,
        representative_has_health_concern: "",
        representative_health_concern_details: "",
        representative_skills: "",


      },

    ]
  });

  const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    updateCapturedData("common_data", "birthdate", selectedDate);
    // updateCommonData("birthdate", selectedDate);
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
    updateCapturedData("common_data", "age", ageNumber);
    // updateCommonData("age", ageNumber);
    setAge(ageNumber.toString());
  };
  const updateCommonData = (field: string, value: any) => {
    setCapturedData((prevData) => {
      const updatedData = {
        ...prevData,
        common_data: {
          ...prevData.common_data,
          [field]: value
        }
      };

      // Store the updated data in localStorage
      localStorage.setItem("formData", JSON.stringify(updatedData));

      return updatedData;
    });
  };
  const updateCFWData = (field: string, value: any) => {
    setCapturedData((prevData) => {
      const updatedData = {
        ...prevData,
        cfw: prevData.cfw.map((item, index) => {
          // Update the modality_sub_category_id in the second object (index 1)
          if (index === 4 && field === 'modality_sub_category_id') {
            return { ...item, modality_sub_category_id: value };
          }
          return item;
        })
      };



      // Store the updated data in localStorage
      localStorage.setItem("formData", JSON.stringify(updatedData));

      return updatedData;
    });
  };


  const updateCapturedData = (section: string, field: string, value: any, index: number = -1) => {
    setCapturedData((prevData) => {
      let updatedData = { ...prevData };

      if (section === "common_data") {
        updatedData.common_data = {
          ...prevData.common_data,
          [field]: value,
        };
      }

      else if (section === "cfw" && index >= 0 && index < prevData.cfw.length) {
        updatedData.cfw[index] = { ...prevData.cfw[index], [field]: value };
      }
      // else {
      //   console.log("Not in the choices.")
      // }
      // else if (section === "cfw") {


      //   updatedData.cfw = prevData.cfw.map((item, index) => {
      //     if (index === 4) {
      //       console.log("The has health issues " + value);
      //       value = value === "yes" ? 1 : 0;
      //       return { ...item, [field]: value };  // Dynamically set the field to the value
      //     }
      //     return item;

      //   });
      // } else {
      //   console.log("Not in the choices.")
      // }

      // Store the updated data in localStorage
      localStorage.setItem("formData", JSON.stringify(updatedData));

      return updatedData;
    });
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const sex = await getSexLibraryOptions();
        setSexOptions(sex);

        const civil_status = await getCivilStatusLibraryOptions();
        setCivilStatusOptions(civil_status);

        const modality = await getModalityLibraryOptions();
        setModalityOptions(modality);

        const extension_name = await getExtensionNameLibraryOptions();
        setExtensionNameOptions(extension_name);

        const modality_sub_category = await getModalitySubCategoryLibraryOptions();
        setModalitySubCategoryOptions(modality_sub_category);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSexChange = (id: number) => {
    updateCapturedData("common_data", "sex_id", id);
    // updateCommonData("sex_id", id);
    console.log("Selected Sex ID:", id);
    setSelectedSexId(id);
  };
  const handleCivilStatusChange = (id: number) => {
    updateCapturedData("commnon_data", "civil_status_id", id);
    // updateCommonData("civil_status_id", id);
    console.log("Selected Civil Status ID:", id);
    setSelectedCivilStatusId(id);
  };
  const handlModalityChange = (id: number) => {
    setSelectedModalityId(id);
    updateCapturedData("common_data", "modality_id", id);
    // updateCommonData("modality_id", id);
    console.log("Selected Modality ID:", id);

  };
  const handlModalitySubCategoryChange = (id: number) => {
    setSelectedModalitySubCategoryId(id);
    updateCapturedData("cfw", "modality_sub_category_id", id);
    // updateCFWData("modality_sub_category_id", id);
    console.log("Selected Modality Sub Category ID:", id);

  };

  const handlExtensionNameChange = (id: number) => {
    updateCapturedData("common_data", "extension_name", id);
    // updateCommonData("extension_name", id);
    console.log("Selected Extension name ID:", id);
    setSelectedExtensionNameId(id);
  };



  // async function handleOnClick(formData: FormData) {
  //   const result = await submit(formData)
  //   if (result.success) {
  //     toast({
  //       title: "Success",
  //       description: result.message,
  //     })
  //     setErrors({})
  //   } else {
  //     setErrors(result.errors || {})
  //   }
  // }


  const tabs = [
    ...(selectedModalityId === 25 || selectedModalityId === 22
      ? [

      ]
      : []),
    {
      value: "details",
      label: "Personal Information",
      content: (
        <div className="bg-card rounded-lg">
          <Details
            errors={state?.errors}
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
          // updateCapturedData={capturedData} 
          />
        </div>
      )
    },

    {
      value: "contact",
      label: "Contact Information",
      content: (
        <div className="bg-card rounded-lg">
          <ContactDetails 
          // errors={errors} 
          errors={state?.errors}
          capturedData={capturedData}
          updateCapturedData={updateCapturedData}
          selectedModalityId={selectedModalityId}
          />
        </div>
      ),
    },


    {
      value: "occupation",
      label: "Employment",
      content: (
        <div className="bg-card rounded-lg">
          <Occupation
           errors={state?.errors}
           capturedData={capturedData}
           updateCapturedData={updateCapturedData}
           selectedModalityId={selectedModalityId}
           />
        </div>
      ),
    },
    // {
    //   value: "healthdeclaration",
    //   label: "Declaration of Health",
    //   content: (
    //     <div className="bg-card rounded-lg">
    //       <HealthDeclaration errors={errors} />
    //     </div>
    //   ),
    // },
    {
      value: "pwdrepresentative",
      label: "CFW PWD Representative",
      content: (
        <div className="bg-card rounded-lg">
          <PWDRepresentative
            errors={state?.errors}
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
           />
        </div>
      ),
    },
    // {
    //   value: "guardian",
    //   label: "Guardian Information",
    //   content: (
    //     <div className="bg-card rounded-lg">
    //       <GuardianInformation errors={errors} />
    //     </div>
    //   ),
    // },
    {
      value: "sector",
      label: "Sector",
      content: (
        <div className="bg-card rounded-lg">
          <SectorDetails errors={errors} />
        </div>
      ),
    },
    {
      value: "volunteerdetails",
      label: "Volunteer Details",
      content: (
        <div className="bg-card rounded-lg">
          <VolunteerDetails errors={errors} />
        </div>
      ),
    },
    {
      value: "kctrainings",
      label: "KC Trainings",
      content: (
        <div className="bg-card rounded-lg">
          <KCTrainings errors={errors} />
        </div>
      ),
    },
    {
      value: "capacity_building",
      label: "Capacity Building",
      content: (
        <div className="bg-card rounded-lg">
          <CapacityBuilding errors={errors} />
        </div>
      ),
    },
    {
      value: "ers_work_record",
      label: "ERS Work Record",
      content: (
        <div className="bg-card rounded-lg">
          <Ers_work_record errors={errors} />
        </div>
      ),
    },
    {
      value: "cash_for_work",
      label: "Cash-for-Work Program Details",
      content: (
        <div className="p-4 bg-card rounded-lg">
          <CFWProgramDetails errors={errors} />
        </div>
      ),
    },
    {
      value: "family_composition",
      label: "Family Composition",
      content: (
        <div className="p-4 bg-card rounded-lg">
          <FamilyComposition errors={errors} />
        </div>
      ),
    },
    {
      value: "education",
      label: "Highest Educational Attainment",
      content: (
        <div className="p-4 bg-card rounded-lg">
          <HighestEducationalAttainment errors={errors} />
        </div>
      ),
    },
    // {
    //   value: "skills",
    //   label: "Skills",
    //   content: (
    //     <div className="p-4 bg-card rounded-lg">
    //       <Skills errors={errors}/>
    //     </div>
    //   ),
    // },
    {
      value: "deployment",
      label: "Preferred Deployment Area",
      content: (
        <div className="p-4 bg-card rounded-lg">
          <PrefferedDeploymentArea errors={errors} />
        </div>
      ),
    },

    {
      value: "attachment",
      label: "Attachment",
      content: (
        <div className="p-4 bg-card rounded-lg">
          <RequirementsAttachment errors={errors} />
        </div>
      ),
    },
  ]
  // Assume this is your form component
  // function FormComponent() {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(e.currentTarget);
    formData.append('modality_id', selectedModalityId?.toString() || "0");  // Append modality_id
    formData.append('sex_id', selectedSexId?.toString() || "0");  // Append modality_id
    formData.append('extension_name', selectedExtensionNameId?.toString() || "0");  // Append modality_id
    formData.append('civil_status_id', selectedCivilStatusId?.toString() || "0");
    formData.append('age', age?.toString() || "0");

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      // localStorage.setItem(`${key}`, `${value}`);
    }


    const response = await submit({}, formData);
    // const response = await submit({}, formData);
    // console.log("Formdata: " + formData);
    // Log FormData values

    console.log(response);
    if (response.success) {
      console.log(response.message);
    } else {
      console.log('Validation errors:', response.errors);
    }
  };

  // const handleDropdownChange = (selectedOption: { id: number; label: string }) => {
  //   setSelectedModalityId(selectedOption.id); // Update state
  //   updateLocalStorage('modality_id', selectedOption.id); // Store in localStorage
  // };
  const updateLocalStorage = (field: string, value: any) => {
    const savedData = localStorage.getItem('formData');
    const formData = savedData ? JSON.parse(savedData) : {};

    formData[field] = value; // Update the specific field
    localStorage.setItem('formData', JSON.stringify(formData));  // Save back to localStorage

  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Person Profile Form</CardTitle>
        <CardDescription>It displays essential details about an individual, including their name, photo, role, contact info, and other related information.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        {/* <form action={submitAction}> */}
        <CardContent>
          <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
            <div className="flex items-center justify-center row-span-1 sm:row-span-2 sm:col-span-1">
              <PictureBox />
            </div>

            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-1 my-4"> */}
            <div className="flex grid sm:col-span-3 sm:grid-cols-3">
              <div className="p-2">
                <Label htmlFor="modality_id" className="block text-sm font-medium">Select Modality</Label>
                <FormDropDown

                  id="modality_id"
                  options={modalityOptions}
                  selectedOption={selectedModalityId}
                  onChange={handlModalityChange}

                />
                {errors?.modality_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.modality_id}</p>
                )}
              </div>
              <div className={`p-2  ${selectedModalityId === 25 ? "" : "hidden"}`}>
                <Label htmlFor="modality_sub_category_id" className="block text-sm font-medium">Select Modality</Label>
                <FormDropDown

                  id="modality_sub_category_id"
                  options={modalitySubCategoryOptions}
                  selectedOption={selectedModalitySubCategoryId}
                  onChange={handlModalitySubCategoryChange}

                />
                {errors?.modality_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.modality_id}</p>
                )}
              </div>

              <div className="p-2">
                <Label htmlFor="first_name" className="block text-sm font-medium">First Name</Label>
                <Input
                  value={capturedData.common_data.first_name}
                  onChange={(e) => updateCapturedData("common_data", 'first_name', e.target.value)}
                  // onChange={(e) => updateCommonData('first_name', e.target.value)}
                  // onBlur={handleBlur}
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter your First Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.first_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="middle_name" className="block text-sm font-medium">Middle Name</Label>
                <Input
                  // onBlur={handleBlur}
                  // onChange={(e) => updateCommonData('middle_name', e.target.value)}
                  onChange={(e) => updateCapturedData("common_data", 'middle_name', e.target.value)}
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  placeholder="Enter your Middle Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />

              </div>

              <div className="p-2">
                <Label htmlFor="last_name" className="block text-sm font-medium">Last Name</Label>
                <Input
                  // onBlur={handleBlur}
                  // onChange={(e) => updateCommonData('last_name', e.target.value)}
                  onChange={(e) => updateCapturedData("common_data", 'last_name', e.target.value)}
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter your Last Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.last_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>

              <div className="p-2">
                <Label htmlFor="extension_name" className="block text-sm font-medium mb-1">Extension Name</Label>
                <FormDropDown

                  id="extension_name"
                  options={extensionNameOptions}
                  selectedOption={selectedExtensionNameId}
                  onChange={handlExtensionNameChange}
                />
              </div>

              <div className="p-2">
                <Label htmlFor="sex_id" className="block text-sm font-medium">Sex</Label>
                <FormDropDown

                  id="sex_id"
                  options={sexOptions}
                  selectedOption={selectedSexId}
                  onChange={handleSexChange}
                />
                {errors?.sex_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.sex_id}</p>
                )}
              </div>
            </div>



            <div className="flex grid sm:col-span-3 sm:grid-cols-3">
              <div className="p-2">
                <Label htmlFor="civil_status_id" className="block text-sm font-medium">Civil Status</Label>
                <FormDropDown

                  id="civil_status_id"
                  options={civilStatusOptions}
                  selectedOption={selectedCivilStatusId}
                  onChange={handleCivilStatusChange}
                />
                {errors?.civil_status_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.civil_status_id}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="birthdate" className="block text-sm font-medium">Birth Date</Label>
                <Input
                  //  onChange={(e) => updateCommonData('first_name', e.target.value)}
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleDOBChange}
                />
                {errors?.birthdate && (
                  <p className="mt-2 text-sm text-red-500">{errors.birthdate}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="age" className="block text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="text"
                  placeholder="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                  value={age.toString()}
                  // onChange={(e) => updateCommonData('age', age.toString())}
                  readOnly
                />
              </div>
              <div className="p-2">
                <Label htmlFor="philsys_id_no" className="block text-sm font-medium">PhilSys ID Number</Label>
                <Input
                  // onChange={(e) => updateCommonData('philsys_id_no', e.target.value)}
                  type="text"
                  id="philsys_id_no"
                  name="philsys_id_no"
                  placeholder="0000-0000000-0"
                  maxLength={14} // 4 + 7 + 1 digits + 2 hyphens
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => updateCapturedData("common_data", "philsys_id_no", e.target.value)}
                  value={capturedData?.common_data?.philsys_id_no || ""}
                />
                {/* <PhilSysInput                        
                        /> */}
                {/* may id na sa component */}
                {errors?.philsys_id_no && (
                  <p className="mt-2 text-sm text-red-500">{errors.philsys_id_no}</p>
                )}
              </div>
              {/* <div className="p-2 col-span-3">
                <Label htmlFor="birthplace" className="block text-sm font-medium">Birthplace</Label>
                <Textarea
                  id="birthplace"
                  name="birthplace"
                  placeholder="Enter your Birthplace"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div> */}
            </div>
          </div>
          <FormTabs tabs={tabs} />
        </CardContent>
        <CardFooter>
          <ButtonSubmit label="Submit" />
        </CardFooter>
      </form>
    </Card>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Registering...' : 'Register'}
    </Button>
  )
}

