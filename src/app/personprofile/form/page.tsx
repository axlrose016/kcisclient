'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { onSubmit } from './action'
import { PictureBox } from '@/components/forms/picture-box'
import Details from './personal_information'
import { FormTabs } from '@/components/forms/form-tabs'
import { FormDropDown } from '@/components/forms/form-dropdown'
import { LibraryOption } from '@/components/interfaces/library-interface'
import { getLibrary } from '@/lib/libraries'
import ContactDetails from './contact_details'
import GuardianInformation from './guardian_information'
import SectorDetails from './sectors'
import CFWProgramDetails from './program_details'
import FamilyComposition from './family_composition'
import HighestEducationalAttainment from './highest_educational_attainment'
import { Skills } from './skills'
import PrefferedDeploymentArea from './preferred_deployment_area'
import RequirementsAttachment from './requirements_attachments'
import { Textarea } from '@/components/ui/textarea'
import Occupation from './occupation'
import HealthDeclaration from './health_declaration'
import PWDRepresentative from './pwd_representative'
import VolunteerDetails from './volunteer_details'
import KCTrainings from './kc_trainings'
import CapacityBuilding from './capacity_building'
import Ers_work_record from './ers_work_record'

export default function PersonProfileForm() {
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const { toast } = useToast()

  const [sexOptions, setSexOptions] = useState<LibraryOption[]>([]);
  const [selectedSex, setSelectedSex] = useState("");

  const [civilStatusOptions, setCivilStatusOptions] = useState<LibraryOption[]>([]);
  const [selectedCivilStatus, setSelectedCivilStatus] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const sex = await fetchLibSex();
  //       setSexOptions(sex);
  //       const civil_status = await fetchLibCivilStatus();
  //       setCivilStatusOptions(civil_status);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  async function handleOnClick(formData: FormData) {
    const result = await onSubmit(formData)
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      setErrors({})
    } else {
      setErrors(result.errors || {})
    }
  }

  const tabs = [
    {
      value: "details",
      label: "Personal Information",
      content: (
        <div className="bg-card rounded-lg">
          <Details errors={errors} />
        </div>
      ),
    },
    {
      value: "contact",
      label: "Contact Information",
      content: (
        <div className="bg-card rounded-lg">
          <ContactDetails errors={errors} />
        </div>
      ),
    },
    {
      value: "occupation",
      label: "Employment",
      content: (
        <div className="bg-card rounded-lg">
          <Occupation errors={errors} />
        </div>
      ),
    },
    {
      value: "healthdeclaration",
      label: "Declaration of Health",
      content: (
        <div className="bg-card rounded-lg">
          <HealthDeclaration errors={errors} />
        </div>
      ),
    },
    {
      value: "pwdrepresentative",
      label: "CFW for PWD ONLY",
      content: (
        <div className="bg-card rounded-lg">
          <PWDRepresentative errors={errors} />
        </div>
      ),
    },
    {
      value: "guardian",
      label: "Guardian Information",
      content: (
        <div className="bg-card rounded-lg">
          <GuardianInformation errors={errors} />
        </div>
      ),
    },
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
    {
      value: "skills",
      label: "Skills",
      content: (
        <div className="p-4 bg-card rounded-lg">
          <Skills />
        </div>
      ),
    },
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Person Profile Form</CardTitle>
        <CardDescription>It displays essential details about an individual, including their name, photo, role, contact info, and other related information.</CardDescription>
      </CardHeader>
      <form action={handleOnClick}>
        <CardContent>
          <div className="grid md:grid-rows-1 sm:grid-cols-4 sm:grid-rows-1 mb-2">
            <div className="flex items-center justify-center row-span-1 sm:row-span-2 sm:col-span-1">
              <PictureBox />
            </div>

            <div className="flex grid sm:col-span-3 sm:grid-cols-4">
              <div className="flex grid sm:col-span-4 sm:grid-cols-4 ">
                <div className="p-2">
                  <Label htmlFor="modality" className="block text-sm font-medium">Select Modality</Label>
                  <FormDropDown
                    options={[]}
                    selectedOption={""}
                  />
                  {errors?.modality && (
                    <p className="mt-2 text-sm text-red-500">{errors.modality[0]}</p>
                  )}
                </div>
              </div>
              <div className="p-2">
                <Label htmlFor="first_name" className="block text-sm font-medium">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter your First Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.first_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.first_name[0]}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="middle_name" className="block text-sm font-medium">Middle Name</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  placeholder="Enter your Middle Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.middle_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.middle_name[0]}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="last_name" className="block text-sm font-medium">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter your Last Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.last_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.last_name[0]}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="extension_name" className="block text-sm font-medium mb-1">Extension Name</Label>
                <FormDropDown
                  options={[]}
                  selectedOption={""}
                />
                {errors?.extension_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.extension_name[0]}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="sex" className="block text-sm font-medium">Sex</Label>
                <FormDropDown
                  options={sexOptions}
                  selectedOption={selectedSex}
                />
                {errors?.sex && (
                  <p className="mt-2 text-sm text-red-500">{errors.sex[0]}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="civil_status" className="block text-sm font-medium">Civil Status</Label>
                <FormDropDown
                  options={civilStatusOptions}
                  selectedOption={selectedCivilStatus}
                />
                {errors?.civil_status && (
                  <p className="mt-2 text-sm text-red-500">{errors.civil_status[0]}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="birthday" className="block text-sm font-medium">Birth Date</Label>
                <Input
                  type='date' className='mt-1' />
                {errors?.last_name && (
                  <p className="mt-2 text-sm text-red-500">{errors.birthday[0]}</p>
                )}
              </div>

              <div className="p-2">
                <Label htmlFor="age" className="block text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your Age"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                  value={0}
                  disabled

                />
                {errors?.age && (
                  <p className="mt-2 text-sm text-red-500">{errors.age[0]}</p>
                )}
              </div>
              <div className="p-2 col-span-4">
                <Label htmlFor="birthplace" className="block text-sm font-medium">Birthplace</Label>
                <Textarea
                  id="birthplace"
                  name="birthplace"
                  placeholder="Enter your Birthplace"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.birthplace && (
                  <p className="mt-2 text-sm text-red-500">{errors.birthplace[0]}</p>
                )}
              </div>
            </div>



          </div>
          <FormTabs tabs={tabs} />
        </CardContent>
        <CardFooter>
          <SubmitButton />
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

