'use client'
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import Details from './health_concern'
import { FormTabs } from '@/components/forms/form-tabs'
import { FormDropDown } from '@/components/forms/form-dropdown'
import { LibraryOption } from '@/components/interfaces/library-interface'
import ContactDetails from './contact_details'
import CFWProgramDetails from './program_details'
import FamilyComposition from './family_composition'
import HighestEducationalAttainment from './highest_educational_attainment'

import PrefferedDeploymentArea from './preferred_deployment_area'
import Occupation from './occupation'

import PWDRepresentative from './pwd_representative'
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibFilesToUpload, getOfflineLibModalityOptions, getOfflineLibModalitySubCategoryOptions, getOfflineLibSectorsLibraryOptions, getOfflineLibSexOptions } from '@/components/_dal/offline-options'
import Attachments from './attachments'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import SectorDetails from './sectors'
import { ICFWAssessment, IPersonProfile, IPersonProfileCfwFamProgramDetails, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector } from '@/components/interfaces/personprofile'
import { v4 as uuidv4, validate } from 'uuid';
import { fstat } from 'fs'
import { IAttachments } from '@/components/interfaces/general/attachments'
import { ConfirmSave, SessionPayload } from '@/types/globals'
import { getSession } from '@/lib/sessions-client'
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb'
import PersonProfileService from '../PersonProfileService'
import { ToastAction } from '@/components/ui/toast'
import GeneratePDF from './pdf'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'path'
import { is } from 'drizzle-orm'
import Assessment from '../masterlist/[record]/assessment'
import WorkshiftAssignment from '../masterlist/[record]/workshift_assignment'
import WorkPlan from '../masterlist/[record]/work_plan'
// import pdfFonts from "pdfmake/build/vfs_fonts";
export default function PersonProfileForm({ user_id_viewing }: any) {
  const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);

  // alert(userIdViewing)
  // const userIdForViewing = user_id_viewing;
  const module = "personprofile";
  const [combinedData, setCombinedData] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [session, setSession] = useState<SessionPayload | null>(null);
  // cfw
  const [formData, setFormData] = useState<Partial<IPersonProfile>>({});
  const [formSectorData, setFormSectorData] = useState<Partial<IPersonProfileSector>[]>([]);
  const [formDisabilitiesData, setFormDisabilitesData] = useState<Partial<IPersonProfileDisability>[]>([]);
  const [formFamilyCompositionData, setFormFamilyCompositionData] = useState<Partial<IPersonProfileFamilyComposition>[]>([]);
  const [formAttachmentsData, setFormAttachmentsData] = useState<Partial<IAttachments>[]>([]);
  const [formCFWFamDetailsData, setFormCFWFamDetailsData] = useState<Partial<IPersonProfileCfwFamProgramDetails>[]>([]);
  const [dataPrivacyOpen, setDataPrivacyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");
  const [filesToUploadOptions, setfilesToUploadOptions] = useState<IAttachments[]>([]);
  const [displayPic, setDisplayPic] = useState<string | null>(null);
  let isMounted = false;

  // readonly when admin viewing 
  useEffect(() => {
    if (userIdViewing) {
      const form = document.getElementById("general_info_form");
      if (form) {
        form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
          el.setAttribute("disabled", "true");
        });
      }
    }
  }, [userIdViewing]);

  const updateFormData = (newData: Partial<IPersonProfile>) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...newData };

      // Save the updated value to localStorage
      localStorage.setItem("person_profile", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const updateFormSectorData = (newData: Partial<IPersonProfileSector>[]) => {
    setFormSectorData(() => {
      // Ensure newData is an array
      const validNewData = Array.isArray(newData) ? newData : [];

      // Create a Map to track sectors by sector_id
      const sectorMap = new Map(
        validNewData.map((sector) => [sector.sector_id, sector])
      );
      // Return updated sector data (only from newData)
      localStorage.setItem("person_sectors", JSON.stringify(Array.from(sectorMap.values())));
      return Array.from(sectorMap.values());
    });
  };


  const updateDisabilitiesData = (newData: Partial<IPersonProfileDisability>[]) => {
    setFormDisabilitesData(() => {
      const validNewData = Array.isArray(newData) ? newData : [];

      const disabilityMap = new Map(
        validNewData.map((disability) => [disability.type_of_disability_id, disability])
      );

      // Return updated sector data (only from newData)
      localStorage.setItem("person_disabilities", JSON.stringify(Array.from(disabilityMap.values())));
      return Array.from(disabilityMap.values());
    });
  };


  const updateCFWFormData = (newData: Partial<IPersonProfileCfwFamProgramDetails>[]) => {
    setFormCFWFamDetailsData(() => {
      // Ensure newData is a valid array
      const validNewData = Array.isArray(newData) ? newData : [];

      // Use a unique key (fallback to JSON.stringify if 'id' is missing)
      const cfwFamDetails = new Map(
        validNewData.map((cfwFam) => [
          cfwFam.id ?? JSON.stringify(cfwFam),
          cfwFam
        ])
      );

      // Return deduplicated data
      return Array.from(cfwFamDetails.values());
    });
  };
  const toggleDataPrivacy = () => {
    setDataPrivacyOpen(true);
  }
  const updateFormFamilyCompositionData = (newData: Partial<IPersonProfileFamilyComposition>[]) => {
    setFormFamilyCompositionData(() => {
      const validNewData = Array.isArray(newData) ? newData : [];

      const familyCompositionMap = new Map(
        validNewData.map((familyComposition) => [familyComposition.id ?? JSON.stringify(familyComposition), familyComposition])
      );
      localStorage.setItem("family_composition", JSON.stringify(Array.from(familyCompositionMap.values())));
      return Array.from(familyCompositionMap.values());
    });
  }

  const updateFormAttachments = (newData: Partial<IAttachments>[]) => {
    setFormAttachmentsData(() => {
      const validNewData = Array.isArray(newData) ? newData : [];

      const attachmentMap = new Map(
        validNewData.map((attachment) => [attachment.id, attachment])
      );

      return Array.from(attachmentMap.values());
    })
  }

  const philSysIDRef = useRef<HTMLInputElement>(null);
  const [hasPhilsysId, setHasPhilsysId] = useState(true);


  useEffect(() => {
    if (hasPhilsysId && philSysIDRef.current) {
      philSysIDRef.current.focus(); // Auto-focus when enabled
    }
  }, [hasPhilsysId]);


  const [cfwGeneralInfo, setCfwGeneralInfo] = useState(() => {
    if (globalThis.window) {
      const storedCfwGeneralInfo = localStorage.getItem("cfwGeneralInfo");
      return storedCfwGeneralInfo ? JSON.parse(storedCfwGeneralInfo) : {};
    }
    return {};
  })

  useEffect(() => {
    localStorage.setItem("cfwGeneralInfo", JSON.stringify(cfwGeneralInfo));
  }, [cfwGeneralInfo]);

  const updatingCfwGeneralInfo = (field: any, value: any) => {
    setCfwGeneralInfo((prev: any) => ({
      ...prev, [field]: value
    }));
  }

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const { toast } = useToast()

  const [sexOptions, setSexOptions] = useState<LibraryOption[]>([]);
  const [selectedSex, setSelectedSex] = useState("");
  const [selectedSexId, setSelectedSexId] = useState<number | null>(null);

  const [civilStatusOptions, setCivilStatusOptions] = useState<LibraryOption[]>([]);
  const [selectedCivilStatus, setSelectedCivilStatus] = useState("Single");
  const [selectedCivilStatusId, setSelectedCivilStatusId] = useState<number | null>(4);

  const [modalityOptions, setModalityOptions] = useState<LibraryOption[]>([]);
  const [selectedModality, setSelectedModality] = useState(0);
  // const [selectedModalityID, setSelectedModalityId] = useState<number | null>(null);

  const [extensionNameOptions, setExtensionNameOptions] = useState<LibraryOption[]>([]);
  const [selectedExtensionNameId, setSelectedExtensionNameId] = useState<number | null>(null);
  const [selectedExtensionName, setSelectedExtensionName] = useState("");

  const [modalitySubCategoryOptions, setModalitySubCategoryOptions] = useState<LibraryOption[]>([]);
  const [selectedModalitySubCategoryId, setSelectedModalitySubCategoryId] = useState<number | null>(null);
  const [selectedModalitySubCategory, setSelectedModalitySubCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const [philsysIdNo, setPhilsysIdNo] = useState<string>("");

  const [localStorageData, setLocalStorageDate] = useState([]);
  const [form_Data, setForm_Data] = useState([]);

  const [sectorsOptions, setSectorsOptions] = useState<LibraryOption[]>([]);


  const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    //updateCapturedData("common_data", "birthdate", selectedDate);
    updateFormData({ "birthdate": selectedDate });
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
    //updateCapturedData("common_data", "age", ageNumber);
    updateFormData({ "age": ageNumber });
    // updateCommonData("age", ageNumber);
    setAge(ageNumber.toString());
  };

  const [isMiddleNameEnabled, setIsMiddleNameEnabled] = useState(true);
  const middleNameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log("displayPic changed:", displayPic);
  }, [displayPic])
  const chkIsMiddleNameEnabled = (e: any) => {
    // alert(e);
    setIsMiddleNameEnabled(!isMiddleNameEnabled);
    updateFormData({ 'middle_name': "" })
    updateFormData({ 'has_middle_name': !isMiddleNameEnabled })
  }
  const chkHasPhilSysId = (e: any) => {
    // alert(e);
    setHasPhilsysId(!hasPhilsysId);
    updateFormData({ 'philsys_id_no': "" })
    updateFormData({ 'has_philsys_id': !hasPhilsysId });
  }


  useEffect(() => {
    if (isMiddleNameEnabled && middleNameRef.current) {
      middleNameRef.current.focus(); // Auto-focus when enabled
    }
  }, [isMiddleNameEnabled]);

  const handleSexChange = (id: number) => {

    // updateCommonData("sex_id", id);
    console.log("Selected Sex ID:", id);
    setSelectedSexId(id);
    updateFormData({ "sex_id": id });
  };
  const handleCivilStatusChange = (id: number) => {

    // updateCommonData("civil_status_id", id);
    console.log("Selected Civil Status ID:", id);
    setSelectedCivilStatusId(id);
    updateFormData({ "civil_status_id": id });
  };
  const handlModalityChange = (id: number) => {
    setSelectedModality(id);

    // updateCommonData("modality_id", id);
    console.log("Selected Modality ID:", id);
    updateFormData({ "modality_id": id, "modality_sub_category_id": 1 });

  };

  const handlModalitySubCategoryChange = (id: number) => {
    setSelectedModalitySubCategoryId(id);
    console.log("Selected Modality Sub Category ID:", id);
    updateFormData({ "modality_sub_category_id": id });
  };

  const handlExtensionNameChange = (id: number) => {

    // updateCommonData("extension_name", id);
    console.log("Selected Extension name ID:", id);
    setSelectedExtensionNameId(id);
    updateFormData({ "extension_name_id": id });
  };

  const handleErrorClick = (tabValue: any, fieldId: any) => {
    // debugger;
    // alert(activeTab + ' ' + tabValue)
    console.log('handleErrorClick >', { tabValue, fieldId })
    if (tabValue !== "basic_information") {
      setActiveTab(activeTab);


      const tabButton = document.querySelector(`[data-value="${tabValue}"]`) as HTMLButtonElement | null; // Adjust selector based on your implementation

      if (tabButton) {

        tabButton.scrollIntoView({ behavior: "smooth", block: "center" });
        setActiveTab(tabValue);

        tabButton.click();
      }
      else {
        alert(`Tab button with data-value="${tabValue}" not found.`);
      }

    } else {
      // alert(tabValue + ' ' + activeTab)
      setActiveTab(activeTab);
    }

    setTimeout(() => {
      const element = document.getElementById(fieldId) as HTMLElement;

      if (element) {


        // Scroll the element to the center of the screen
        const elementRect = element.getBoundingClientRect();
        const scrollOffset =
          window.scrollY + elementRect.top - window.innerHeight / 2 + elementRect.height / 2;

        window.scrollTo({ top: scrollOffset, behavior: "smooth" });

        setTimeout(() => {
          // First, try focusing if it's an input or select field
          if (["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)) {
            element.focus({ preventScroll: true });
          } else {
            // button
            element.click();
          }
        }, 300); // Delay to ensure smooth scrolling finishes
      } else {

        // for select element
        if (!fieldId) return;

        let label = document.querySelector('label[for="' + fieldId + '"]'); // Get the label

        if (label) {
          let dropdownContainer = label.nextElementSibling as HTMLElement | null; // Assume FormDropDown is the next element

          if (dropdownContainer) {
            let button = dropdownContainer.querySelector('button[role="combobox"]') as HTMLButtonElement | null; // Find the button inside

            if (button) {
              // alert("Button clicked");
              // Scroll to the button smoothly
              button.scrollIntoView({ behavior: "smooth", block: "center" });
              button.click(); // Simulate button click
            } else {
              // alert("button not clicked")
              console.warn("Dropdown button not found inside FormDropDown.");
            }
          } else {
            alert("button not found")
            console.warn("FormDropDown component not found.");
          }
        } else {
          alert("button not found nor label")
          console.warn("Label with for='sex_id' not found.");
        }


      }
    }, 100);
  };

  const tabs = [
    ...(formData && (formData?.modality_id === 25 || formData?.modality_id === 22)
      ? [

      ]
      : []),

    // contact details
    {

      value: "contact",
      label: "Contact Information",
      content: activeTab === "contact" && (
        <div className="bg-card rounded-lg">
          <ContactDetails

            errors={errors}
            capturedData={formData}
            updateCapturedData={formData}
            updateFormData={updateFormData}
            modality_id_global={Number(formData?.modality_id)}
            userIdViewing={userIdViewing}
          />
        </div>
      ),
    },
    // health concern
    {
      value: "details",
      label: "Health Concern",
      // label: "Basic Information",
      content: activeTab === "details" && (
        <div className="bg-card rounded-lg">
          <Details
            errors={errors}
            capturedData={formData}
            updateCapturedData={formData}
            selectedModalityId={formData?.modality_id}
            updateFormData={updateFormData}
            user_id_viewing={userIdViewing}
          />
        </div>
      )
    },

    // employment
    {
      value: "occupation",
      label: "Employment",
      content: activeTab === "occupation" && (
        <div className="bg-card rounded-lg">
          <Occupation
            errors={errors}
            capturedData={formData}
            updateCapturedData={formData}
            selectedModalityId={formData?.modality_id}
            updateFormData={updateFormData}
            user_id_viewing={userIdViewing}
          />
        </div>
      ),
    },


    {
      value: "sector",
      label: "Sector",
      content: (
        <div className="bg-card rounded-lg">
          <SectorDetails
            capturedData={formData}
            sectorData={formSectorData}
            disabilitiesData={formDisabilitiesData}
            selectedModality={formData?.modality_id}
            errors={errors}
            updateFormData={updateFormData}
            updateSectorData={updateFormSectorData}
            updateDisabilityData={updateDisabilitiesData}
            session={session}
            user_id_viewing={userIdViewing}
          />
        </div>
      ),
    },
    {
      value: "family_composition",
      label: "Family Composition",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <FamilyComposition
            errors={errors}
            capturedeData={formData}
            familyCompositionData={formFamilyCompositionData}
            updatedFamComposition={updateFormFamilyCompositionData}
            session={session}
            user_id_viewing={userIdViewing}
          />
        </div>
      ),
    },
    {
      value: "cash_for_work",
      label: "Cash-for-Work Program Details",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <CFWProgramDetails
            capturedData={formData}
            familyComposition={formFamilyCompositionData}
            errors={errors}
            cfwFamComposition={formCFWFamDetailsData}
            updateFormData={updateFormData}
            updateCFWFormData={updateCFWFormData}
            session={session}
            user_id_viewing={userIdViewing}
          />
        </div>
      ),
    },

    {
      value: "education",
      label: "Highest Educational Attainment",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <HighestEducationalAttainment
            errors={errors}
            capturedData={formData}
            updateFormData={updateFormData}
            user_id_viewing={userIdViewing}
          // updateCapturedData={updateCapturedData}
          // selectedModalityID={selectedModalityID}
          />
        </div>
      ),
    },
    ...(cfwGeneralInfo.modality_sub_category_id === 2 ?
      [{
        value: "pwdrepresentative",
        label: "CFW PWD Representative",
        content: (
          <div className="bg-card rounded-lg">
            <PWDRepresentative
              errors={errors}
              capturedData={formData}
            // updateCapturedData={updateCapturedData}
            // selectedModalityID={selectedModalityID}
            />
          </div>
        ),
      }
      ] : []
    )
    ,
    {
      value: "deployment",
      label: "Deployment Area",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <PrefferedDeploymentArea
            errors={errors}
            capturedData={formData}
            updateFormData={updateFormData}
            user_id_viewing={userIdViewing}
          // updateCapturedData={updateCapturedData}
          // selectedModalityID={selectedModalityID}
          />
        </div>
      ),
    },

    {
      value: "attachment",
      label: "Attachment",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <Attachments
            errors={errors}
            capturedData={formAttachmentsData}
            updateFormData={updateFormAttachments}
            session={session}
            user_id_viewing={userIdViewing}
          />
        </div>
      ),
    },

    ...(user_id_viewing ? [
      {
        value: "assessment",
        label: "Assessment and Eligibility",
        content: (
          <div className="p-3 bg-card rounded-lg">
            <Assessment

            />
          </div>
        ),
      },
    ] : []),

    // ...(user_id_viewing ? [
    //   {
    //     value: "workshift_assignment",
    //     label: "Workshift Assignment",
    //     content: (
    //       <div className="p-3 bg-card rounded-lg">
    //         <WorkshiftAssignment

    //         />
    //       </div>
    //     ),
    //   },
    // ] : []),
    // ...(user_id_viewing ? [
    //   {
    //     value: "workplan_assignment",
    //     label: "Workplan",
    //     content: (
    //       <div className="p-3 bg-card rounded-lg">
    //         <WorkPlan

    //         />
    //       </div>
    //     ),
    //   },
    // ] : [])


  ]

  function errorToast(msg: string, tabValue?: string, fieldId?: string) {

    const toastInstance = toast({
      variant: "destructive",
      description: (
        <div
          className="relative cursor-pointer p-4 w-full h-full flex flex-col justify-center"
          style={{ margin: 0, padding: '8px' }} // Extra inline style to override any margin
          onClick={() => {
            toastInstance.dismiss(); // Dismiss toast when clicked
            handleErrorClick(tabValue, fieldId);
          }}
        >
          <p className="text-xl">{msg}</p>
          <p className="text-xs opacity-80 mt-2">
            Oops! Something’s missing. Click here to dismiss this alert.
          </p>
          {/* <p className="text-xs opacity-80 mt-2">
            You can dismiss this message by sliding it away, clicking the "×" button, or selecting "Fix issue" to go to the field.
          </p> */}
        </div>
      ),
    });
  }



  const appendData = (key: any, data: any) => {
    setCombinedData((prevData) => {
      const updatedData = { ...prevData, [key]: data };
      return updatedData;
    });
  };

  const sendEmail = async (first_name: any, email: any, email_subject: any, email_body: any) => {

    const res = await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({ first_name, email, email_subject, email_body }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

  };

  useEffect(() => {
    const saveData = async () => {
      if (confirmed) {
        if (formData && (session != null || session != undefined)) {
          generated_cfw_id_no();
          const pls = JSON.parse(JSON.stringify(combinedData));
          const fd = pls;
          const modality_id = formData?.modality_id;//fd.common_data.modality_id;
          let formPersonProfile: IPersonProfile;
          let formPersonProfileSector: IPersonProfileSector[];
          let formPersonProfileDisability: IPersonProfileDisability[];
          let formPersonProfileFamilyComposition: IPersonProfileFamilyComposition[];
          let formPersonCFWFamDetails: IPersonProfileCfwFamProgramDetails[];
          let formAttachments: IAttachments[];
          let cfw_active_email = formData.email;
          let cfw_first_name_email = formData.first_name;
          if (modality_id === 25) {
            let _id = formData?.id ?? uuidv4();
            cfw_first_name_email = formData.first_name
            // alert(cfw_active_email)

            formPersonProfile = {
              id: _id,
              modality_id: modality_id,
              extension_name_id: formData?.extension_name_id ?? 0,
              birthplace: formData?.birthplace ?? "",
              sex_id: formData?.sex_id ?? 0,
              first_name: formData?.first_name ?? "",
              last_name: formData?.last_name ?? "",
              middle_name: formData?.middle_name ?? "",
              has_middle_name: formData?.has_middle_name ?? false,
              civil_status_id: formData?.civil_status_id ?? 0,
              birthdate: formData?.birthdate ?? "",
              age: formData?.age ?? 0,
              has_philsys_id: formData?.has_philsys_id ?? false,
              philsys_id_no: formData?.philsys_id_no ?? "",
              sitio: formData?.sitio ?? null,
              cellphone_no: formData?.cellphone_no ?? null,
              cellphone_no_secondary: formData?.cellphone_no_secondary ?? null,
              email: formData?.email ?? "",
              sitio_present_address: formData?.sitio_present_address ?? null,
              region_code_present_address: formData?.region_code_present_address ?? null,
              province_code_present_address: formData?.province_code_present_address ?? null,
              city_code_present_address: formData?.city_code_present_address ?? null,
              brgy_code_present_address: formData?.brgy_code_present_address ?? null,
              brgy_code_current: formData?.brgy_code_current ?? null,
              region_code: formData?.region_code ?? "",
              province_code: formData?.province_code ?? "",
              city_code: formData?.city_code ?? "",
              brgy_code: formData?.brgy_code ?? "",
              profile_picture: formData?.profile_picture ?? "",
              is_permanent_same_as_current_address: formData?.is_permanent_same_as_current_address ?? null,
              has_immediate_health_concern: formData?.has_immediate_health_concern ?? null,
              immediate_health_concern: formData?.immediate_health_concern ?? "",
              school_id: formData?.school_id ?? 0,
              is_graduate: formData?.is_graduate ?? false,
              campus: formData?.campus ?? "",
              school_address: formData?.school_address ?? "",
              course_id: formData?.course_id ?? 0,
              year_graduated: formData?.year_graduated ?? "",
              year_level_id: formData?.year_level_id ?? 0,
              hasOccupation: formData?.hasOccupation ?? false,
              current_occupation: formData?.current_occupation ?? "",
              id_card: formData?.id_card ?? 0,
              occupation_id_card_number: formData?.occupation_id_card_number ?? "",
              skills: formData?.skills ?? "",
              deployment_area_name: formData?.deployment_area_name ?? "",
              deployment_area_id: formData?.deployment_area_id ?? 0,
              deployment_area_address: formData?.deployment_area_address ?? "",
              preffered_type_of_work_id: formData?.preffered_type_of_work_id ?? 0,

              modality_sub_category_id: formData?.modality_sub_category_id ?? null,


              is_pwd_representative: formData?.is_pwd_representative ?? null,


              ip_group_id: formData?.ip_group_id ?? 0,

              cwf_category_id: null,
              cfwp_id_no: generated_cfw_id_no(),
              no_of_children: null,
              is_pantawid: false,
              is_pantawid_leader: false,
              is_slp: false,
              address: null,
              is_lgu_official: false,
              is_mdc: false,
              is_bdc: false,
              is_bspmc: false,
              is_bdrrmc_bdc_twg: false,
              is_bdrrmc_expanded_bdrrmc: false,
              is_mdrrmc: false,
              is_hh_head: false,
              academe: 0,
              business: 0,
              differently_abled: 0,
              farmer: 0,
              fisherfolks: 0,
              government: 0,
              is_ip: formData?.is_ip ?? false,
              is_pwd: formData?.is_pwd ?? false,
              ngo: 0,
              po: 0,
              religious: 0,
              senior_citizen: 0,
              women: 0,
              solo_parent: 0,
              out_of_school_youth: 0,
              children_and_youth_in_need_of_special_protection: 0,
              family_heads_in_need_of_assistance: 0,
              affected_by_disaster: 0,
              persons_with_disability: false,
              others: null,
              relationship_to_family_member_id: null,
              family_member_name_id: null,
              hasProgramDetails: false,

              //CFW Representative
              representative_last_name: formData?.representative_last_name ?? null,
              representative_first_name: formData?.representative_first_name ?? null,
              representative_middle_name: formData?.representative_middle_name ?? null,
              representative_extension_name_id: formData?.representative_extension_name_id ?? null,
              representative_sitio: formData?.representative_sitio ?? null,
              representative_brgy_code: formData?.representative_brgy_code ?? null,
              representative_relationship_to_beneficiary_id: formData?.representative_relationship_to_beneficiary_id ?? null,
              representative_birthdate: formData?.representative_birthdate ?? null,
              representative_age: formData?.representative_age ?? null,
              representative_occupation: formData?.representative_occupation ?? null,
              representative_monthly_salary: formData?.representative_monthly_salary ?? null,
              representative_educational_attainment_id: formData?.representative_educational_attainment_id ?? null,
              representative_sex_id: formData?.representative_sex_id ?? null,
              representative_contact_number: formData?.representative_contact_number ?? null,
              representative_id_card_id: formData?.representative_id_card_id ?? null,
              representative_id_card_number: formData?.representative_id_card_number ?? null,
              representative_address: formData?.representative_address ?? null,
              representative_civil_status_id: formData?.representative_civil_status_id ?? null,
              representative_has_health_concern: formData?.representative_has_health_concern ?? null,
              representative_health_concern_details: formData?.representative_health_concern_details || null,
              representative_skills: formData?.representative_skills || null,


              user_id: session.id,
              created_by: session.userData.email ?? "",
              created_date: new Date().toISOString(),
              last_modified_by: null,
              last_modified_date: null,
              push_date: null,
              push_status_id: 2,
              deleted_by: null,
              deleted_date: null,
              is_deleted: false,
              remarks: "Person Profile Created",
            }

            formPersonProfileSector = formSectorData.map((sector) => {
              const sector_id = sector.id ?? uuidv4(); // Declare the variable properly

              return {
                id: sector_id,
                person_profile_id: _id,
                sector_id: sector.sector_id ?? 0,
                user_id: session.id,
                created_by: session.userData.email ?? "",
                created_date: new Date().toISOString(),
                last_modified_by: null,
                last_modified_date: null,
                push_date: null,
                push_status_id: 2,
                deleted_by: null,
                deleted_date: null,
                is_deleted: false,
                remarks: "Person Profile Sector Created",
              }
            });

            formPersonProfileDisability = formDisabilitiesData.map((disability) => {
              const disability_id = disability.id ?? uuidv4(); // Declare the variable properly

              return {
                id: disability_id,
                person_profile_id: _id,
                type_of_disability_id: disability.type_of_disability_id ?? 0,
                user_id: session.id,
                created_by: session.userData.email ?? "",
                created_date: new Date().toISOString(),
                last_modified_by: null,
                last_modified_date: null,
                push_date: null,
                push_status_id: 2,
                deleted_by: null,
                deleted_date: null,
                is_deleted: false,
                remarks: "Person Profile Disability Created",
              }
            });

            formPersonProfileFamilyComposition = formFamilyCompositionData.map((fcd) => {
              const fcd_id = fcd.id ?? uuidv4(); // Declare the variable properly

              return {
                id: fcd_id,
                person_profile_id: _id,
                first_name: fcd.first_name ?? "",
                middle_name: fcd.middle_name ?? "",
                last_name: fcd.last_name ?? "",
                extension_name_id: fcd.extension_name_id ?? 0,
                birthdate: fcd.birthdate ?? "",
                age: fcd.age ?? 0,
                contact_number: fcd.contact_number ?? null,
                highest_educational_attainment_id: fcd.highest_educational_attainment_id ?? 0,
                monthly_income: fcd.monthly_income ?? null,
                relationship_to_the_beneficiary_id: fcd.relationship_to_the_beneficiary_id ?? 0,
                work: fcd.work ?? "",
                user_id: session.id,
                created_by: session.userData.email ?? "",
                created_date: new Date().toISOString(),
                last_modified_by: null,
                last_modified_date: null,
                push_date: null,
                push_status_id: 2,
                deleted_by: null,
                deleted_date: null,
                is_deleted: false,
                remarks: "Person Profile Disability Created",
              };
            });


            formPersonCFWFamDetails = formCFWFamDetailsData.map((cfwFam) => {
              const cfwFam_id = cfwFam.id ?? uuidv4(); // Declare the variable properly

              return {
                id: cfwFam_id,
                person_profile_id: _id,
                family_composition_id: cfwFam.family_composition_id ?? "",
                program_type_id: cfwFam.program_type_id ?? 0,
                year_served_id: cfwFam.year_served_id ?? 0,
                user_id: session.id,
                created_by: session.userData.email ?? "",
                created_date: new Date().toISOString(),
                last_modified_by: null,
                last_modified_date: null,
                push_date: null,
                push_status_id: 2,
                deleted_by: null,
                deleted_date: null,
                is_deleted: false,
                remarks: "Person Profile CFW Family Program Details Created",
              }
            });

            formAttachments = formAttachmentsData.map((attachment) => {
              const attachment_id = attachment.id ?? uuidv4(); // Declare the variable properly

              return {
                id: attachment_id,
                record_id: _id,
                file_path: attachment.file_path ?? null, //blob
                file_name: attachment.file_name ?? "",
                file_id: attachment.file_id ?? 0,
                file_type: attachment.file_type ?? "",
                module_path: attachment.module_path ?? "",
                user_id: session.id,
                created_by: session.userData.email ?? "",
                created_date: new Date().toISOString(),
                last_modified_by: null,
                last_modified_date: null,
                push_date: null,
                push_status_id: 2,
                deleted_by: null,
                deleted_date: null,
                is_deleted: false,
                remarks: "Person Profile Attachment Created",
              }
            });
          }
          sendEmail(cfw_first_name_email, cfw_active_email, "CFW Beneficiary Profiling", "Your registration has been submitted successfully.");

          dexieDb.open();
          dexieDb.transaction('rw', [dexieDb.person_profile,
          dexieDb.person_profile_sector, dexieDb.person_profile_disability, dexieDb.person_profile_family_composition,
          dexieDb.attachments, dexieDb.person_profile_cfw_fam_program_details], async () => {
            try {
              await dexieDb.person_profile.put(formPersonProfile);
              await dexieDb.person_profile_sector.bulkPut(formPersonProfileSector);
              await dexieDb.person_profile_disability.bulkPut(formPersonProfileDisability);
              await dexieDb.person_profile_family_composition.bulkPut(formPersonProfileFamilyComposition);
              await dexieDb.person_profile_cfw_fam_program_details.bulkPut(formPersonCFWFamDetails);
              await dexieDb.attachments.bulkPut(formAttachments);
              console.log("Person Profile added to IndexedDB");
              localStorage.removeItem("person_profile");
              localStorage.removeItem("person_sectors");
              localStorage.removeItem("family_composition");
              localStorage.removeItem("person_cfw_program_details");
              localStorage.removeItem("person_disabilities");
              debugger;
              await PersonProfileService.syncBulkData(formPersonProfile);
            } catch (error) {
              console.error("Error adding Person Profile to IndexedDB", error);
            }
          }).catch(error => {
            console.log('Transaction failed: ', error);
          });

          setChkToggle(false);
          toast({
            variant: "green",
            title: "Success",
            description: "Record has been saved!",
          });
        };
      }
    }
    saveData();
  }, [confirmed])


  const [isAccepted, setIsAccepted] = useState(false);
  const [chkToggle, setChkToggle] = useState(true);
  const [btnToggle, setbtnToggle] = useState(false);



  const confirmSave = async () => {
    // debugger;
    setConfirmed(true);
  }

  const showToastConfirmation = (confirmSave: ConfirmSave) => {
    const toastInstance = toast({
      variant: "destructive",
      title: "You are about to save the form, continue?",
      description: "This will save the data. This action cannot be undone.",
      action: (
        <Button
          onClick={() => {
            setDataPrivacyOpen(true); // Open the data privacy modal
            toastInstance.dismiss(); // Dismiss the toast
          }}
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Confirm
        </Button>
      ),
    });
  };

  const handleSubmit = async () => {


    // e.preventDefault(); // Prevent the default form submission
    // 1 check what modality
    // 2 conso the data depending on the modality
    // 3 validation
    // 4 saving
    // 5 feedback

    // 1 - check what modality
    const storedCommonData = localStorage.getItem("common_data");
    if (formData) {

      //const parsedCommonData = JSON.parse(formData);

      //console.log(parsedCommonData);

      if (formData?.modality_id === 25) { //cfw
        //2 conso the data depending on the modality
        // in cfw                             Validation-combined
        // attachments                        ✅✅
        // cfwGeneralInfo                     ✅✅
        // cfwPWDRepresentative  - optional   ✅✅        
        // commondata                         ✅✅
        // contactDetails                     ✅✅
        // disabilities                       ✅✅
        // educational_attainment             ✅✅
        // employment                         ✅✅
        // family_composition                 ✅✅
        // hasProgramDetails                  ✅
        // healthConcern                      ✅✅
        // ipgroup_id                         ✅✅
        // preferred_deployment               ✅✅
        // programDetails/ cfw_type - optional          ✅✅
        // sectors                            ✅✅



        // setLoading(true);
        console.log("CFW");
        // 2 validation
        if (!formData?.modality_id) { errorToast("Modality is required!", "basic_information", "modality_id"); return; }
        if (!formData?.first_name) { errorToast("First name is required!", "basic_information", "first_name"); return; }
        if (formData.has_middle_name && !formData?.middle_name) { errorToast("Middle name is required!", "basic_information", "middle_name"); return; }
        if (!formData?.last_name) { errorToast("Last name is required!", "basic_information", "last_name"); return; }
        if (!formData?.birthdate) { errorToast("Birthdate is required!", "basic_information", "birthdate"); return; }
        if (!formData?.age || formData?.age < 18) { errorToast("Valid age is required!", "basic_information", "birthdate"); return; }
        // if (!parsedCommonData.philsys_id_no) { errorToast("PhilSys ID number is required!"); return; }
        if (!formData?.birthplace) { errorToast("Birthplace is required!", "basic_information", "birthplace"); return; }
        // if (!formData?.extension_name_id) { errorToast("Extension name is required!"); return; }
        if (!formData?.sex_id) { errorToast("Sex is required!", "basic_information", "sex_id"); return; }
        if (!formData?.civil_status_id) { errorToast("Civil status is required!", "basic_information", "civil_status_id"); return; }
        const storedcfwGeneralInfo = localStorage.getItem("cfwGeneralInfo");
        if (!formData?.modality_sub_category_id) { errorToast("Modality Sub category is required!", "basic_information", "modality_sub_category_id"); return; }
        if (!formData?.modality_id) { errorToast("Modality is required!", "basic_information", "modality_id"); return; }
        if (!formData?.first_name) { errorToast("First name is required!", "basic_information", "first_name"); return; }
        if (!formData?.middle_name && isMiddleNameEnabled) { errorToast("Middle name is required!", "basic_information", "middle_name"); return; }
        if (!formData?.last_name) { errorToast("Last name is required!", "basic_information", "last_name"); return; }
        // if (!parsedCommonData.extension_name_id) { errorToast("Extension  name is required!", "basic_information", "extension_name"); return; }
        if (!formData?.sex_id) { errorToast("Sex field is required!", "basic_information", "sex_id"); return; }
        if (!formData?.civil_status_id) { errorToast("Civil status is required!", "basic_information", "civil_status_id"); return; }
        if (!formData?.birthdate) { errorToast("Birthdate is required!", "basic_information", "birthdate"); return; }
        if (!formData?.age || formData?.age < 18 || formData?.age > 71) {
          errorToast("Invalid age! Please enter a valid age between 18 and 70 years old.", "basic_information", "birthdate"); return;
        }
        if (!formData?.philsys_id_no && hasPhilsysId) { errorToast("16-digit PhilSys ID number is required!", "basic_information", "philsys_id_no"); return; }
        // alert(parsedCommonData.philsys_id_no.length)
        if (hasPhilsysId && (!formData?.philsys_id_no || formData?.philsys_id_no.length < 19)) {
          errorToast("16-digit PhilSys ID number is required!", "basic_information", "philsys_id_no");
          return;
        }
        if (!formData?.birthplace) { errorToast("Birthplace is required!", "basic_information", "birthplace"); return; }


        if (!formData?.region_code) { errorToast("Region is required!", "contact", "region_contact_details_permanent_address"); return; }
        if (!formData?.province_code) { errorToast("Province is required!", "contact", "province_contact_details_permanent_address"); return; }
        if (!formData?.city_code) { errorToast("City/Municipality is required!", "contact", "municipality_contact_details_permanent_address"); return; }
        if (!formData?.brgy_code) { errorToast("Barangay is required!", "contact", "barangay_contact_details_permanent_address"); return; }
        if (!formData?.sitio) { errorToast("Sitio is required!", "contact", "sitio"); return; }
        if (!formData?.region_code_present_address) { errorToast("Present Region is required!", "contact", "region_contact_details_present_address"); return; }
        if (!formData?.province_code_present_address) { errorToast("Present Province is required!", "contact", "province_contact_details_present_address"); return; }
        if (!formData?.city_code_present_address) { errorToast("Present City/Municipality is required!", "contact", "municipality_contact_details_present_address"); return; }
        if (!formData?.brgy_code_present_address) { errorToast("Present Barangay is required!", "contact", "barangay_contact_details_present_address"); return; }
        if (!formData?.sitio_present_address) { errorToast("Present Sitio is required!", "contact", "sitio_present_address"); return; }
        // alert(parsedContactDetails.cellphone_no.length)
        if ((formData?.cellphone_no?.length ?? 0) < 13 || formData?.cellphone_no == null) { errorToast("Primary cellphone number is required!", "contact", "cellphone_no"); return; }
        if (!formData?.email) { errorToast("Email is required!", "contact", "email"); return; }
        // Regular Expression to check valid email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData?.email)) {
          errorToast("Invalid email format! Please enter a valid email.", "contact", "email");
          return;
        }
        // if (!parsedContactDetails.is_same_as_permanent_address) { errorToast("is_same_as_permanent_address is empty!"); return; }
        if (!formData?.sitio_present_address) { errorToast("Present Sitio is required!", "contact", "sitio_present_address"); return; }
        if (!formData?.region_code_present_address) { errorToast("Present Region is required!", "contact", "region_contact_details_present_address"); return; }
        if (!formData?.province_code_present_address) { errorToast("Present Province is required!", "contact", "province_contact_details_present_address"); return; }
        if (!formData?.city_code_present_address) { errorToast("Present City/Municipality is required!", "contact", "municipality_contact_details_present_address"); return; }
        if (!formData?.brgy_code_present_address) { errorToast("Present Barangay is required!", "contact", "barangay_contact_details_present_address"); return; }


        const storedHealthConcern = localStorage.getItem("healthConcerns");
        console.log('has_immediate_health_concern', formData.has_immediate_health_concern)
        if (formData?.has_immediate_health_concern == null || undefined) { errorToast("Health Concern required!", "details", "has_immediate_health_concern"); return; }
        //const parsedHealthConcerns = JSON.parse(storedHealthConcern);
        if (formData?.has_immediate_health_concern === true && (!formData?.immediate_health_concern || formData?.immediate_health_concern == "")) { errorToast("Health Concern details is required!", "details", "immediate_health_concern"); return; }


        //const storedEmployment = localStorage.getItem("employment");
        // if (!formData?.skills) { errorToast("Skills required!", "occupation", "skills"); return; }
        //const parsedEmployments =formData?.skills;
        // if (!storedHealthConcern) { errorToast("Health Concern required!", "details", ""); return; }
        // const parsedHealthConcerns = JSON.parse(storedHealthConcern);
        // try {
        //   const parsedHealthConcern = JSON.parse(storedHealthConcern);

        //   if (typeof parsedHealthConcern === "object" && parsedHealthConcern !== null && Object.keys(parsedHealthConcern).length === 0) {
        //     errorToast("Health Concern cannot be empty!", "details", "");
        //     return;
        //   }
        // } catch (error) {
        //   errorToast("Invalid Health Concern data!");
        //   return;
        // }

        // if (parsedHealthConcerns.has_immediate_health_concern === 1 && !parsedHealthConcerns.immediate_health_concern) { errorToast("Health Concern details is required!", "details", "immediate_health_concern"); return; }


        const storedEmployment = localStorage.getItem("employment");

        if (!storedEmployment) { errorToast("Skills required!", "occupation", "skills"); return; }
        const parsedEmployments = JSON.parse(storedEmployment);

        // alert(parsedEmployments.has_occupation + " " + parsedEmployments.current_occupation)
        // debugger;
        // if (parsedEmployments.has_occupation && !parsedEmployments.current_occupation?.trim()) {
        //   errorToast("Occupation is required!", "occupation", "current_occupation");
        //   return;
        // }
        // debugger;
        if (formData?.hasOccupation && !formData?.current_occupation) { errorToast("Occupation is required!", "occupation", "current_occupation"); return; }
        if (formData?.hasOccupation && formData?.current_occupation === "") { errorToast("Occupation is required!", "occupation", "current_occupation"); return; }
        if (formData?.hasOccupation && formData?.id_card === 0 || formData?.id_card === undefined) { errorToast("Valid ID is requiredx!", "occupation", "occupation_id_card"); return; }
        // alert(formData?.hasOccupation + ' ' + formData?.occupation_id_card_number);
        if ((formData?.hasOccupation == true && formData?.occupation_id_card_number === "") || (formData?.hasOccupation == true && formData?.occupation_id_card_number === undefined)) { errorToast("Valid ID number is required!", "occupation", "occupation_id_card_number"); return; }



        if (!formData?.skills) { errorToast("Skill is required!", "occupation", "skills"); return; }


        const storedSectors = localStorage.getItem("person_sectors");
        if (formSectorData.length == 0 || formSectorData == undefined) { errorToast("Sectors required!", "sector", ""); return; }

        // const parsedSectors = JSON.parse(storedSectors) as IPersonProfileSector[];

        // Check if there is at least one non-empty "YES" in the sectors
        // const hasYesAnswer = parsedSectors.some((sector: { answer: string }) => sector.answer.trim() !== "");

        if (!formSectorData) {
          errorToast("At least one sector must be selected!", "sector", "");
          return;
        }

        if (formData?.is_pwd) {
          // check if there is disabilities


          if (!formDisabilitiesData) { errorToast("Pease select a disability!", "sector", "type_of_disabilities"); return; }

          const formattedDisabilities = Object.fromEntries(
            formDisabilitiesData.map((id: any) => [`disability_id_${id}`, Number(id)])
          );

          appendData("disabilities", formattedDisabilities);
        }

        if (formData?.is_ip) {
          // check if there is disabilities
          const storedIPGroupId = localStorage.getItem("ipgroup_id");
          if (!storedIPGroupId) { errorToast("Pease select an IP Group!", "sector", "ip_group"); return; }
          const parsedIpGroupId = JSON.parse(storedIPGroupId);
          if (parsedIpGroupId === 0) { errorToast("Pease select an IP Group", "sector", "ip_group"); return; }
          appendData("ip_group_id", parsedIpGroupId);
        }


        // debugger;
        // family composition
        if (!formFamilyCompositionData || formFamilyCompositionData.length === 0) { errorToast("Family composition is required!", "family_composition", ""); return; }



        const storedHasProgramDetails = localStorage.getItem("hasProgramDetails");
        // debugger;
        if (formData?.hasProgramDetails == undefined) { errorToast("CFW Program details required!", "cash_for_work", ""); return; }
        // const parsedHasProgramDetails = JSON.parse(storedHasProgramDetails);
        if (formData?.hasProgramDetails) {
          if (formCFWFamDetailsData.length == 0) { errorToast("CFW Program details required!", "cash_for_work", ""); return; }
          //const parsedProgramDetails = JSON.parse(storedProgramDetails);
          //appendData("program_details", parsedProgramDetails);

        }


        // console.log(parsedFamilyComposition.family_composition.length);


        const storedEducationalAttainment = localStorage.getItem("educational_attainment");
        if (!storedEducationalAttainment) { errorToast("Educational Attainment data is required!", "education", "school_name"); return; }
        const parsedEducationData = JSON.parse(storedEducationalAttainment);


        if (!formData?.school_id) { errorToast("Name of school is required!", "education", "school_name"); return; }
        if (!formData?.campus) { errorToast("Campus is required!", "education", "campus"); return; }
        if (!formData?.school_address) { errorToast("School address is required!", "education", "school_address"); return; }
        if (formData?.course_id === 0 || formData?.course_id == undefined) { errorToast("Course is required!", "education", "course_id"); return; }
        if (formData.is_graduate && !formData?.year_graduated) { errorToast("Year graduated is required!", "education", "year_graduated"); return; }

        if (!formData.is_graduate && !formData?.year_level_id) { errorToast("Year level is required!", "education", "year_level_id"); return; }

        // if student to cfw
        // console.log("CFW Sub Cat ID " + parsedcfwGeneralInfo.modality_sub_category_id);
        // if (parsedcfwGeneralInfo.modality_sub_category_id === 1 && parsedEducationData.year_level_id === 0) { errorToast("Year level is required!"); return; }
        // if (parsedEducationData.modality_sub_category_id === 1 && parsedEducationData.year_level_id === 0) { errorToast("Year level is required!", "education", "year_level_id"); return; }

        if (!formData?.deployment_area_name || formData?.deployment_area_name == undefined) { errorToast("Preferred Deployment Area is required!", "deployment", "deployment_area_id"); return; }
        if (!formData?.deployment_area_address || formData?.deployment_area_address == undefined) { errorToast("Preferred Deployment Area is required!", "deployment", "deployment_area_address"); return; }
        if (formData.preffered_type_of_work_id === 0 || formData.preffered_type_of_work_id == null) { errorToast("Preferred Type of Work is required!", "deployment", "preffered_type_of_work_id"); return; }

        // debugger;
        // const storedAttachments = localStorage.getItem("attachments");
        if (formAttachmentsData.length == 0) { errorToast("Attachment is required!", "attachment", ""); return; }
        const requiredFileIds = [13, 1, 2, 11]; // Define required file IDs        


        // const requiredFile = formAttachmentsData.find(file => file.file_id === requiredFileId);
        // alert(requiredFile);


        if (formAttachmentsData.some(attachment => attachment.file_id === 13 && attachment.file_type === "")) {
          errorToast("Profile Picture is required!", "attachment", "profile_picture");
          return;
        }



        for (const requiredFileId of requiredFileIds) {
          const isFilePresent = formAttachmentsData.some(
            (attachment) => attachment.file_id === requiredFileId && attachment.file_type !== ""
          );
          if (!isFilePresent) {
            errorToast(`Please upload Primary ID (front) and Primary (Back) and Certificate of Indigency!`, "attachment", "");
            return;
          }
        }





        console.log(formAttachmentsData);
        // if (formAttachmentsData.length == 0) { errorToast("Attachment is required!", "attachment", ""); return; }

        // const parsedAttachments = JSON.parse(storedAttachments);
        // for fixing pa to using dexie db
        // if (!parsedAttachments[0].file_name) { errorToast("Primary ID is required!"); return; }
        // if (!parsedAttachments[8].file_name) { errorToast("Profile Picture is required!"); return; }

        // if (!isAccepted) { errorToast("Please check the terms and agreement before submitting.", "basic_information", ""); return; }

        appendData("common_data", formData);
        // appendData("contact_details", parsedContactDetails);
        appendData("health_concerns", formData);
        appendData("employment", parsedEmployments);
        // appendData("sectors", parsedSectors);
        // appendData("family_composition", parsedFamilyComposition);
        appendData("educational_attainment", parsedEducationData);
        // appendData("attachments", parsedAttachments);
        // appendData("cfw_general_info", parsedcfwGeneralInfo); //10

        // appendData("contact_details", parsedHealthConcerns);
        // console.log("File name" , parsedAttachments[8].file_name);

        // setLoading(false);
        // special validation like the age of the cfw should be greater that parents'

        const storedcfwPWDRepresentative = localStorage.getItem("cfwPWDRepresentative");
        if (storedcfwPWDRepresentative) {
          const parsedCfwPWDRepresentative = JSON.parse(storedcfwPWDRepresentative);
          if (parsedCfwPWDRepresentative.representative_age <= 18) {
            errorToast("CFW PWD Representative must be 18 years old and above.");
            return;
          }
          appendData("cfw_representative", parsedCfwPWDRepresentative);
        }




        // console.log("combined data is", combinedData);
        // cfwPWDRepresentative
      }

      else {
        console.log("No modality selected!");
        if (!formData?.modality_id) { errorToast("Modality is required!", "basic_information", "modality_id"); return; }
        // errorToast("Please select a modality!");
        return;
      }
      //localStorage.setItem("combinedData", JSON.stringify(combinedData));

      // toast({
      //   variant: "destructive",
      //   title: "You are about to save the form, continue?",
      //   description: "This will save the data. This action cannot be undone.",
      //   action: (
      //     <button
      //       onClick={() => confirmSave()}  //saving to server
      //       className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"

      //     >
      //       Confirm
      //     </button>
      //   ),
      // });

      showToastConfirmation(confirmSave);
    }
    else {
      setLoading(false);
      console.log("No formData");
      toast({
        variant: "destructive",
        title: "No inputs",
        description: "No input data",
      })
    }   // const response = await submit({}, formData);


  };

  const handleUpdateCFWPersonProfile = () => {




    // return;
    // validation
    const lsAssessment = localStorage.getItem("assessment");

    if (lsAssessment) {
      const parsedlsAssessment = JSON.parse(lsAssessment);
      if (parsedlsAssessment.status_id == 0) {
        errorToast("Eligible status is required!", "assessment", "statuses"); return;
      }

      if (parsedlsAssessment.assessment === "") {
        errorToast("Assessment is required!", "assessment", "assessment"); return;
      }

      const lsAssignedDeploymentArea = localStorage.getItem("assigned_deployment_area");
      if (lsAssignedDeploymentArea) {
        const parsedLsAssignedDeploymentArea = JSON.parse(lsAssignedDeploymentArea);
        if (parsedLsAssignedDeploymentArea.assigned_deployment_area_id == 0 && parsedlsAssessment.status_id == 1) {
          errorToast("Deployment area is required!", "deployment", "assigned_deployment_area_id"); return;
        }

        let formAssessment: ICFWAssessment;
        formAssessment = {
          id: uuidv4(),
          person_profile_id: userIdViewing,
          deployment_area_id: parsedLsAssignedDeploymentArea.assigned_deployment_area_id,
          assessment: parsedlsAssessment.assessment,
          status_id: parsedlsAssessment.status_id,
          immediate_supervisor_id: "",
          alternate_supervisor_id: "",
          cfw_category_id: formData.is_graduate ?? false,
          created_by: session?.userData.email ?? "",
          created_date: new Date().toISOString(),
          last_modified_by: null,
          last_modified_date: null,
          push_date: "",
          push_status_id: 2,
          deleted_by: null,
          deleted_date: null,
          is_deleted: false,
          remarks: "Assessment Created",
        }
        // assessment
        dexieDb.open();
        dexieDb.transaction('rw', [dexieDb.cfwassessment], async () => {
          try {
            if (userIdViewing) {
              await dexieDb.cfwassessment.update(userIdViewing, formAssessment);
              console.log("Assessment Updated");
            } else {  
              await dexieDb.cfwassessment.put(formAssessment);
              console.log("Assessment Created");
            }
            // await dexieDb.cfwassessment.put(formAssessment);
            // console.log("Assessment Created");
            toast({
              variant: "green",
              title: "Success",
              description: "Record has been updated!",
            });
            // synch
          } catch (error) {
            console.error("Error adding assessment to IndexedDB", error);
          }
        })

      } else {
        errorToast("Deployment area is required!", "deployment", "assigned_deployment_area_id"); return;
      }
      // if (parsedlsAssessment.)
      // setSelectedStatus(parsedlsAssessment.status_id);
      // setAssessment(parsedlsAssessment.assessment);
    } else {
      errorToast("Eligible status is required!", "assessment", "statuses"); return;
    }



    // validation
    // deployment


    // consolidate

    // save to dexie

    // synch/ other 


    // person_profile_id userIdViewing ✅
    // deployment_area_id
    // assessment
    // status_id
    // supervisor_id
    // cfw_category_id
    // alert(userIdViewing);
  }
  const generated_cfw_id_no = () => {
    // region nick, year now, hei, sequence
    let cfw_id_number = "";

    //get the region nickname
    const regions = [
      { code: "010000000", nick: "I" },
      { code: "020000000", nick: "II" },
      { code: "030000000", nick: "III" },
      { code: "040000000", nick: "IV-A" },
      { code: "170000000", nick: "IV-B" },
      { code: "050000000", nick: "V" },
      { code: "060000000", nick: "VI" },
      { code: "070000000", nick: "VII" },
      { code: "080000000", nick: "VIII" },
      { code: "090000000", nick: "IX" },
      { code: "100000000", nick: "X" },
      { code: "110000000", nick: "XI" },
      { code: "120000000", nick: "XII" },
      { code: "130000000", nick: "CAR" },
      { code: "140000000", nick: "NCR" },
      { code: "150000000", nick: "BARMM" },
      { code: "160000000", nick: "XIII" },
      { code: "180000000", nick: "NIR" } // ✅ Newly added
    ];

    const region = regions.find((region) => region.code === formData.region_code);
    let region_nick = "";
    if (region) {
      region_nick = region.nick;
    } else {
      console.warn("Region code not found in regions array.");
    }

    // // Save to localStorage
    // localStorage.setItem("psgcRegions", JSON.stringify(regions));
    const currentYear = new Date().getFullYear();

    // school short name
    const lsHEA = localStorage.getItem("educational_attainment");
    let school_short_name = '';
    if (lsHEA) {
      const parsedHEA = JSON.parse(lsHEA);
      school_short_name = parsedHEA.short_name;
    }
    // alert(region_nick);
    cfw_id_number = region_nick + "-CGS-" + school_short_name + "-" + currentYear;
    // alert(cfw_id_number);
    return cfw_id_number;

  }
  // const handleDropdownChange = (selectedOption: { id: number; label: string }) => {
  //   setSelectedModalityId(selectedOption.id); // Update state
  //   updateLocalStorage('modality_id', selectedOption.id); // Store in localStorage
  // };
  // const updateLocalStorage = (field: string, value: any) => {
  //   const savedData = localStorage.getItem('formData');
  //   const formData = savedData ? JSON.parse(savedData) : {};

  //   formData[field] = value; // Update the specific field
  //   localStorage.setItem('formData', JSON.stringify(formData));  // Save back to localStorage

  // };
  const handleCheckboxChange = () => {
    setIsAccepted((prev) => !prev);
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // useEffect(() => {
  //   // debugger;
  //   const storedDisplayPic = localStorage.getItem("attachments");
  //   if (storedDisplayPic) {
  //     const parsedDP = JSON.parse(storedDisplayPic); // Convert JSON string to object/array
  //     // console.log("Attachments:", parsedDP);

  //     if (Array.isArray(parsedDP) && parsedDP.length > 8) {


  //       const filePath = parsedDP[8].file_path;
  //       if (filePath.startsWith("data:image/")) {
  //         setDisplayPic(parsedDP[8].file_path); // Access the 9th element (index 8)
  //       } else {
  //         setDisplayPic(""); // Access the 9th element (index 8)
  //       }

  //       // console.log("Picture path: " + parsedDP[8].file_path);
  //     } else {
  //       console.error("Invalid or missing file_path at index 8");
  //     }
  //   } else {
  //     console.log("No attachments");
  //   }
  //   // setBtnSaveEnabled(false);
  //   // setIsAccepted(false);
  // })

  useEffect(() => {
    const fetchData = async () => {
      try {

        const files_upload = await getOfflineLibFilesToUpload();
        console.log("Files to uploade: ", files_upload);

        const _session = await getSession() as SessionPayload;
        setSession(_session);

        const sex = await getOfflineLibSexOptions();//await getSexLibraryOptions();
        setSexOptions(sex);

        const civil_status = await getOfflineCivilStatusLibraryOptions(); //await getCivilStatusLibraryOptions();
        setCivilStatusOptions(civil_status);

        const modality = await getOfflineLibModalityOptions(); //await getModalityLibraryOptions();
        setModalityOptions(modality);

        const extension_name = await getOfflineExtensionLibraryOptions(); //await getExtensionNameLibraryOptions();
        setExtensionNameOptions(extension_name);

        const modality_sub_category = await getOfflineLibModalitySubCategoryOptions(); //await getModalitySubCategoryLibraryOptions();
        setModalitySubCategoryOptions(modality_sub_category);

        const sectors = await getOfflineLibSectorsLibraryOptions(); //await getSectorsLibraryOptions();
        setSectorsOptions(sectors);
        console.log("Session: ", _session);

        updateFormData({ "modality_id": 25, "modality_sub_category_id": 1 })

        if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open
        const existingRecords = await dexieDb.attachments.toArray();
        const existingRecord = await dexieDb.attachments
          .where("file_id")
          .equals(13) //profile picture
          .first();
        if (existingRecord?.file_path instanceof Blob) {
          const blobUrl = URL.createObjectURL(existingRecord.file_path);
          console.log("✅ Blob URL:", blobUrl);
          setDisplayPic(blobUrl);
        }
        await Promise.all(
          files_upload.map(async (file) => {
            const fid = file.id;
            if (isNaN(fid)) {
              console.warn("⚠️ Invalid file_id:", file.id);
              return;
            }
            const attachmentcount = await dexieDb.attachments.toArray();
            if (attachmentcount.length === 0) {
              if (!isMounted) {
                isMounted = true;
                console.log("🚀 Fetching Data...");
                await Promise.all(
                  files_upload.map(async (file) => {
                    await dexieDb.attachments.put({
                      id: crypto.randomUUID(),
                      record_id: crypto.randomUUID(),
                      module_path: "personprofile",
                      file_id: file.id, //
                      file_name: file.name, //image1.jpg
                      file_type: "",
                      file_path: null,
                      created_date: new Date().toISOString(),
                      last_modified_date: null,
                      created_by: session?.id ?? "",
                      last_modified_by: null,
                      push_status_id: 0,
                      push_date: null,
                      user_id: session?.id ?? "",
                      deleted_date: null,
                      deleted_by: null,
                      is_deleted: false,
                      remarks: null,
                    });
                  }
                  ))
              }
            }
          })
        );


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();


  }, []);

  useEffect(() => {
    // debugger;
    const fetchData = async () => {
      try {
        // debugger;
        await dexieDb.open();
        await dexieDb.transaction('r', [dexieDb.person_profile,
        dexieDb.person_profile_sector, dexieDb.person_profile_disability, dexieDb.person_profile_family_composition,
        dexieDb.attachments, dexieDb.person_profile_cfw_fam_program_details], async () => {
          const searchByUserId = userIdViewing ? userIdViewing : session?.id;
          if (searchByUserId != null || searchByUserId != undefined) {
            debugger;
            // Fetch Profile (Dexie first, then LocalStorage)
            // alert("search id is : " + searchByUserId);
            let profile: IPersonProfile | null = (await dexieDb.person_profile.where("id").equals(searchByUserId).first()) || null;
            // let profile: IPersonProfile | null = (await dexieDb.person_profile.where("user_id").equals(searchByUserId).first()) || null;
            // let profile: IPersonProfile | null = (await dexieDb.person_profile.where("user_id").equals(session.id).first()) || null;
            // alert(typeof profile)

            if (!profile) {
              profile = JSON.parse(localStorage.getItem("person_profile") || "null");
              // alert(profile)
            }

            if ((profile && profile.user_id === session?.id) || (profile && profile.id === userIdViewing)) {
              setFormData(profile);
            } else {
              localStorage.removeItem("person_profile");
              updateFormData({ civil_status_id: 4, id: uuidv4(), created_by: session?.userData.email, user_id: session?.id }); // Default value
            }

            // debugger;
            // Fetch Sectors (LocalStorage first, then Dexie)
            let sectors: IPersonProfileSector[] | [] = (await dexieDb.person_profile_sector.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];

            if (!Array.isArray(sectors) || sectors.length === 0) {
              sectors = JSON.parse(localStorage.getItem("person_sectors") || "[]") || [];
            }

            const userSectors = sectors.filter((sector) => sector.person_profile_id === profile?.id);
            if (userSectors.length > 0) {
              updateFormSectorData(userSectors); // Update only the sectors created by the current user
            }

            // Fetch Disabilities (LocalStorage first, then Dexie)
            let pwd: IPersonProfileDisability[] | [] = (await dexieDb.person_profile_disability.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
            if (!Array.isArray(pwd) || pwd.length === 0) {
              pwd = JSON.parse(localStorage.getItem("person_disabilities") || "[]") || [];
            }

            const userPwd = pwd.filter((disability) => disability.person_profile_id === profile?.id);
            if (userPwd.length > 0) {
              updateDisabilitiesData(pwd);
            }

            // Fetch Family Composition (LocalStorage first, then Dexie)
            let family: IPersonProfileFamilyComposition[] | [] = (await dexieDb.person_profile_family_composition.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
            if (!Array.isArray(family) || family.length === 0) {
              family = JSON.parse(localStorage.getItem("family_composition") || "[]") || [];
            }

            const userFamily = family.filter((member) => member.person_profile_id === profile?.id);
            if (userFamily.length > 0) {
              updateFormFamilyCompositionData(family);
            }

            // Fetch CFW Family Program Details (Dexie first, then LocalStorage)
            let cfwFamDetails: Partial<IPersonProfileFamilyComposition>[] = await dexieDb.person_profile_cfw_fam_program_details
              .where("person_profile_id")
              .equals(profile?.id ?? "")
              .toArray();

            if (!Array.isArray(cfwFamDetails) || cfwFamDetails.length === 0) {
              cfwFamDetails = JSON.parse(localStorage.getItem("person_cfw_program_details") || "null") || [];
            }

            const userCfwFamDetails = cfwFamDetails.filter((detail) => detail.person_profile_id === profile?.id);
            if (userCfwFamDetails.length > 0) {
              updateCFWFormData(cfwFamDetails);
            }

            // debugger;
            const person_attachments = await dexieDb.attachments.where('file_type').notEqual('').and(x => x.record_id == profile?.id).toArray();
            if (person_attachments !== null && person_attachments !== undefined && person_attachments.length > 0) {
              setFormAttachmentsData(person_attachments);
            }
          }
        }
        );
      } catch (error) {
        console.error("Error fetching Person Profile from IndexedDB", error);
      }
    };
    fetchData();
  }, [session]);

  const fetchData = async () => {
    try {
      // debugger;
      await dexieDb.open();
      await dexieDb.transaction('r', [dexieDb.person_profile,
      dexieDb.person_profile_sector, dexieDb.person_profile_disability, dexieDb.person_profile_family_composition,
      dexieDb.attachments, dexieDb.person_profile_cfw_fam_program_details], async () => {
        if (session != null || session != undefined) {

          // Fetch Profile (LocalStorage first, then Dexie)
          let profile: IPersonProfile | null = JSON.parse(localStorage.getItem("person_profile") || "null");

          if (!profile) {
            profile = (await dexieDb.person_profile.where("user_id").equals(session.id).first()) || null;
          }

          if (profile) {
            setFormData(profile);
          } else {
            updateFormData({ civil_status_id: 4, id: uuidv4() }); // Default value
          }

          // Fetch Sectors (LocalStorage first, then Dexie)
          let sectors: IPersonProfileSector[] = JSON.parse(localStorage.getItem("person_sectors") || "null") || [];

          if (!Array.isArray(sectors) || sectors.length === 0) {
            sectors = (await dexieDb.person_profile_sector.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
          }

          updateFormSectorData(sectors);

          // Fetch Disabilities (LocalStorage first, then Dexie)
          let pwd: Partial<IPersonProfileDisability>[] = JSON.parse(localStorage.getItem("person_disabilities") || "null") || [];

          if (!Array.isArray(pwd) || pwd.length === 0) {
            pwd = (await dexieDb.person_profile_disability.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
          }

          updateDisabilitiesData(pwd);

          // Fetch Family Composition (LocalStorage first, then Dexie)
          let family: Partial<IPersonProfileFamilyComposition>[] = JSON.parse(localStorage.getItem("family_composition") || "null") || [];

          if (!Array.isArray(family) || family.length === 0) {
            family = (await dexieDb.person_profile_family_composition.where("person_profile_id").equals(profile?.id ?? "").toArray()) || [];
          }

          updateFormFamilyCompositionData(family);

          // Fetch CFW Family Program Details (Dexie first, then LocalStorage)
          let cfwFamDetails: Partial<IPersonProfileFamilyComposition>[] = await dexieDb.person_profile_cfw_fam_program_details
            .where("person_profile_id")
            .equals(profile?.id ?? "")
            .toArray();

          if (!Array.isArray(cfwFamDetails) || cfwFamDetails.length === 0) {
            cfwFamDetails = JSON.parse(localStorage.getItem("person_cfw_program_details") || "null") || [];
          }

          updateCFWFormData(cfwFamDetails);

          // debugger;
          const person_attachments = await dexieDb.attachments.where('file_type').notEqual('').toArray();
          if (person_attachments !== null && person_attachments !== undefined && person_attachments.length > 0) {
            setFormAttachmentsData(person_attachments);
          }
        }
      }
      );
    } catch (error) {
      console.error("Error fetching Person Profile from IndexedDB", error);
    }
  };

  useEffect(() => {
    console.log("Form Data! ", formData);
  }, [formData])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (!file) return;
    try {
      const blob = new Blob([file], { type: file.type });
      if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open
      const exists = await dexieDb.attachments.where("file_id").equals(13).first();
      if (exists) {
        // Update if exists
        await dexieDb.attachments.update(exists.id, {
          file_name: file.name,
          file_type: file.type,
          file_path: blob,
          last_modified_date: new Date().toISOString(),
          last_modified_by: "00000000-0000-0000-0000-000000000000"
        });
        console.log("✅ Record updated.");
      } else {
        // Insert if it doesn't exist
        await dexieDb.attachments.put({
          id: crypto.randomUUID(), // Generate unique ID
          record_id: crypto.randomUUID(),
          module_path: "personprofile",
          file_id: 13,
          file_name: file.name,
          file_type: file.type,
          file_path: blob,
          created_date: new Date().toISOString(),
          last_modified_date: null,
          created_by: session?.id ?? "",
          user_id: session?.id ?? "",
          last_modified_by: null,
          push_status_id: 0,
          push_date: null,
          deleted_date: null,
          deleted_by: null,
          is_deleted: false,
          remarks: null
        });
        console.log("✅ New record added.");
      }
      // Update the state with the blob URL for the avatar
      setDisplayPic(URL.createObjectURL(blob));
      fetchData();

    } catch (error) {

    }
  }

  return (

    <div className='w-full'>

      <Dialog modal={false} open={dataPrivacyOpen} onOpenChange={setDataPrivacyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='p-5'>Data Privacy Statement and Beneficiary Agreement</DialogTitle>
            <DialogDescription className="max-h-[70vh] overflow-y-auto text-left text-black">
              <label className="font-bold">Terms and Conditions of Engagement</label><br /><br />
              <span>This Agreement shall cover the engagement of the Beneficiary with the CFW during the period provided in the table below. The beneficiary shall at all times:</span>
              <br /><br />
              <span>
                ▶ Observe the proper code of conduct and comply with the office's rules and regulations during deployment.<br /><br />
                ▶ Attend and participate in KALAHI-CIDSS CFW Program activities, including orientations, discussions, meetings, and training.<br /><br />
                ▶ Perform assigned tasks efficiently within the timeline set by the work plan.<br /><br />
                ▶ Render a maximum of 8 hours per day based on agreed working hours; compensation is based on actual hours rendered.<br /><br />
                ▶ Students shall not report to work during class periods regardless of early dismissal or remote classes.<br /><br />
                ▶ Inform the immediate supervisor/DSWD/HEI/LGU for leave of absence or other status changes affecting program engagement.<br /><br />
                ▶ Work performed on days of declared suspension shall count as a full day's work.<br /><br />
                ▶ Optionally work on weekends/holidays with supervisor approval and no entitlement to overtime pay.<br /><br />
                ▶ Inform DSWD/HEI/LGU in case of pre-termination due to absence, withdrawal, violation of agreement, or fraud.<br /><br />
                ▶ Replacement beneficiaries will render the remaining program days of the replaced beneficiary.<br /><br />
                ▶ Travel outside the official station requires approval with no additional benefits.<br /><br />
                ▶ DSWD is not liable for any health or medical concerns; the beneficiary is responsible for health insurance.<br /><br />
                ▶ Health-related concerns must be disclosed in the CFW Profile Form.<br /><br />
              </span>

              <span className='font-bold'>Release of Financial Assistance</span><br /><br />

              <span>
                ▶ Financial assistance is based on the regional daily wage for non-agricultural workers as per DOLE-NWPC.<br /><br />
                ▶ Financial assistance is computed based on DTR and supported by the Accomplishment Report.<br /><br />
                ▶ Sign documentary requirements consistently with the valid ID submitted during engagement.<br /><br />
                ▶ Submit DTR and AR on time for processing financial assistance.<br /><br />
                ▶ Comply with corrections flagged by the DSWD KALAHI-CIDSS team for documentary requirements.<br /><br />
                ▶ Submit a photocopy of a valid government-issued ID for verification purposes.<br /><br />
                ▶ In case of delayed financial assistance release, the beneficiary may suspend or continue deployment.<br /><br />
                ▶ Certificate of Completion/Participation is based on attendance and job performance assessment.<br /><br />
                ▶ Submit the KALAHI-CIDSS CFWP Evaluation Form for program enhancement.<br /><br />
              </span>

              <span className='font-bold'>Other Conditions</span><br /><br />

              <span>
                ▶ No employee-employer relationship is established; only agreed financial assistance applies.<br /><br />
                ▶ Documents are primarily signed by the immediate supervisor; an alternate supervisor may sign if unavailable.<br /><br />
                ▶ Address grievances through proper DSWD KALAHI-CIDSS channels.<br /><br />
                ▶ Maintain confidentiality of records, documents, and sensitive information.<br /><br />
                ▶ Use appropriate channels, not social media, for raising issues and concerns.<br /><br />
                ▶ Maintain confidentiality of non-public information during and after the program.<br /><br />
              </span>


            </DialogDescription>

          </DialogHeader>
          <DialogFooter className='p-4'>
            <Button onClick={() => { confirmSave(); setDataPrivacyOpen(false); }}>CONFIRM SUBMISSION</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
            </div>

            {/* Title Section */}
            <div className="text-lg font-semibold mt-2 md:mt-0">
              Beneficiary Profile Form <span className={` ${userIdViewing ? "" : "hidden"} text-blue-800`}> [ Reviewing ]</span>
            </div>
          </CardTitle>


          <CardDescription>
            <div className={`p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm ${userIdViewing ? "hidden" : ""} `}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Important Instructions</h2>
              <p className="text-gray-700 mb-4">
                Please read and understand the following before proceeding:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>
                  By submitting this form, you agree to the collection, use, and processing of your personal data in accordance with our{" "}
                  <span className="text-indigo-600 underline cursor-pointer">
                    Data Privacy Statement
                  </span>.
                </li>
                <li>
                  Submitting this form does <span className="font-bold">not guarantee</span> acceptance into any program or service. All submissions are subject to review and approval.
                </li>
                <li>
                  Ensure that all fields are accurately completed. Incomplete or incorrect information may result in disqualification.
                </li>
                <li>
                  Utilize special characters, such as ñ and Ñ, where appropriate.
                </li>
              </ul>

            </div>

            {/* It displays essential details about an individual, including their name, photo, role, contact info, and other related information.</CardDescription> */}
          </CardDescription>
        </CardHeader>
        {/* <pre><h1>Person Profile</h1>{JSON.stringify(formData, null, 2)}</pre> */}
        {/* <pre><h1>Sectors</h1>{JSON.stringify(formSectorData, null, 2)}</pre> */}
        {/* <pre><h1>Disabilities</h1>{JSON.stringify(formDisabilitiesData, null, 2)}</pre> */}
        {/* <pre><h1>Family Composition</h1>{JSON.stringify(formFamilyCompositionData, null, 2)}</pre> */}
        {/* <pre><h1>CFW Program Details</h1>{JSON.stringify(formCFWFamDetailsData, null, 2)}</pre> */}
        {/* <pre><h1>Attachments</h1>{JSON.stringify(formAttachmentsData, null, 2)}</pre> */}
        <CardContent>

          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-start w-full">
              <div
                className={`grid sm:grid-cols-4 sm:grid-rows-1 w-full ${Number(formData.modality_id) === 25 ? "bg-cfw_bg_color text-black" : ""
                  } p-3 bg-black text-white mt-3`}
              >
                <span className="flex items-center gap-1">
                  General Information
                  {/* <CheckCircle className="h-6 w-6 text-white-500 " /> */}
                </span>
              </div>
            </div>
            {/* Card Container */}
            {/* <div className="flex flex-col gap-4 sm:flex-row items-center sm:items-start w-full justify-between"> */}
            <div id="general_info_form" className="grid grid-cols-1 py-4 sm:grid-cols-4 gtabs4:grid-cols-1 md:grid-cols-1 2xl:grid-cols-4 w-full">

              {/* Image on top (Mobile) / Left (Desktop) */}
              {/* <div className="flex-shrink-0 md:h-full lg:h-full"> */}
              <div className="col-span-1 p-4 flex items-center justify-center">

                <Avatar className="h-[300px] w-[300px] cursor-pointer" onClick={handleAvatarClick} id="profile_picture">
                  {displayPic ? (
                    <AvatarImage src={displayPic} alt="Display Picture" />
                  ) : (
                    <AvatarFallback className="bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 font-bold rounded-full w-full h-full">
                      KC
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 hidden"
                />
              </div>

              <div className="col-span-3 flex flex-col gap-4 mt-2">
                {/* Inputs below image (Mobile) / Right (Desktop) */}
                <div className="grid  sm:grid-cols-1 gtabs4:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 w-full">
                  <div className="sm:py-1 md:p-1">
                    {/* <GeneratePDF  /> */}

                    <Label htmlFor="modality_id" className="block text-md font-medium mb-1">Select Modality<span className='text-red-500'> *</span> </Label>
                    <FormDropDown

                      id="modality_id"
                      options={modalityOptions}
                      selectedOption={formData.modality_id || 25}
                      onChange={handlModalityChange}

                    // onChange={(e) => updatingCommonData("modality_id", e.target.id)}

                    />
                    {errors?.modality_id && (
                      <p className="mt-2 text-md  text-red-500">{errors.modality_id}</p>
                    )}
                  </div>
                  <div className={`sm:py-1 md:p-1  ${formData.modality_id !== undefined && formData.modality_id === 25 ? "" : "hidden"}`}>
                    <Label htmlFor="modality_sub_category_id" className="block text-md  font-medium mb-1">CFW Category<span className='text-red-500'> *</span></Label>
                    <FormDropDown

                      id="modality_sub_category_id"
                      options={modalitySubCategoryOptions}
                      selectedOption={formData.modality_sub_category_id || 1}
                      onChange={handlModalitySubCategoryChange}
                      readOnly

                    />
                    {errors?.modality_id && (
                      <p className="mt-2 text-md  text-red-500">{errors.modality_id}</p>
                    )}
                  </div>
                </div>

                {/* <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 w-full"> */}
                <div className=" grid sm:grid-cols-1 lg:grid-cols-3 gap-4 ipadmini:grid-cols-3 gtabs4:grid-cols-3  2xl:grid-cols-4 w-full ">
                  {/* <div className="sm:py-1 md:p-1 hidden">
                    <GeneratePDF />
                  </div> */}



                  <div className="sm:py-1 md:p-1">
                    <Label htmlFor="first_name" className="block text-md  font-medium mb-1">First Name<span className='text-red-500'> *</span></Label>
                    <Input
                      value={formData.first_name || ""}
                      onChange={(e) => updateFormData({ first_name: e.target.value })}
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Enter your First Name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors?.first_name && (
                      <p className="mt-2 text-md  text-red-500">{errors.first_name}</p>
                    )}
                  </div>
                  <div className="sm:py-1 md:p-1">



                    <div className="flex items-center space-x-1">
                      <Input type='checkbox'
                        className="w-4 h-4 cursor-pointer"
                        id='middle_name_toggle'
                        checked={isMiddleNameEnabled}
                        // checked={formData?.has_middle_name ?? false}
                        onChange={(e) => chkIsMiddleNameEnabled(e.target.checked)}
                      />
                      <Label htmlFor="middle_name" className="block text-md  font-medium">
                        With Middle Name
                      </Label>
                    </div>
                    <Input
                      ref={middleNameRef}
                      // onBlur={handleBlur}
                      // onChange={(e) => updateCommonData('middle_name', e.target.value)}
                      value={isMiddleNameEnabled ? formData.middle_name || "" : ""}
                      onChange={(e) => updateFormData({ middle_name: e.target.value })}
                      // onChange={(e) => updateCapturedData("common_data", 'middle_name', e.target.value)}
                      id="middle_name"
                      name="middle_name"
                      type="text"
                      placeholder={isMiddleNameEnabled ? "Enter your Middle Name" : "No Middle Name"}     //  "No Middle Name"
                      // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      className={`${!isMiddleNameEnabled ? "bg-gray-200 cursor-not-allowed" : ""} mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1"><Label htmlFor="last_name" className="block text-md  font-medium mb-1">Last Name<span className='text-red-500'> *</span></Label>
                    <Input

                      value={formData.last_name || ""}
                      onChange={(e) => updateFormData({ last_name: e.target.value })}
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Enter your Last Name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors?.last_name && (
                      <p className="mt-2 text-md  text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <Label htmlFor="extension_name" className="block text-md  font-medium mb-1 mb-1">Extension Name</Label>
                    <FormDropDown

                      id="extension_name"
                      options={extensionNameOptions}
                      selectedOption={formData.extension_name_id || ""}
                      onChange={handlExtensionNameChange}
                    />
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <Label htmlFor="sex_id" className="block text-md  font-medium mb-1">Sex<span className='text-red-500'> *</span></Label>
                    <FormDropDown

                      id="sex_id"
                      options={sexOptions}
                      selectedOption={formData.sex_id || ""}
                      // selectedOption={selectedSexId}
                      onChange={handleSexChange}
                    />
                    {errors?.sex_id && (
                      <p className="mt-2 text-md  text-red-500">{errors.sex_id}</p>
                    )}
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <Label htmlFor="civil_status_id" className="block text-md  font-medium mb-1">Civil Status<span className='text-red-500'> *</span></Label>
                    <FormDropDown

                      id="civil_status_id"
                      options={civilStatusOptions}
                      // selectedOption={commonData.civil_status_id || ""}
                      selectedOption={formData.civil_status_id || 4 || ""}
                      // selectedOption={selectedCivilStatusId}
                      onChange={handleCivilStatusChange}
                    />
                    {errors?.civil_status_id && (
                      <p className="mt-2 text-md  text-red-500">{errors.civil_status_id}</p>
                    )}
                  </div>
                  <div className="sm:py-1 md:p-1">
                    <Label htmlFor="birthdate" className="block text-md  font-medium mb-1">Birth Date<span className='text-red-500'> *</span></Label>
                    <Input
                      //  onChange={(e) => updateCommonData('first_name', e.target.value)}
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.birthdate || ""}
                      onChange={handleDOBChange}
                    />
                    {errors?.birthdate && (
                      <p className="mt-2 text-md  text-red-500">{errors.birthdate}</p>
                    )}

                  </div>
                  <div className="sm:py-1 md:p-1">

                    <Label htmlFor="age" className="block text-md  font-medium mb-1">Age<span className='text-red-500'> *</span></Label>
                    <Input
                      id="age"
                      name="age"
                      type="text"
                      placeholder="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center"
                      value={formData.age || 0}
                      // value={age.toString()}
                      // onChange={(e) => updateCommonData('age', age.toString())}
                      readOnly
                    />

                  </div>
                  <div className="sm:py-1 md:p-1">

                    <div className="flex items-center space-x-1">
                      <Input type='checkbox'
                        className="w-4 h-4 cursor-pointer"
                        id='philsys_id_number_toggle'
                        checked={hasPhilsysId}
                        onChange={(e) => chkHasPhilSysId(e.target.checked)}
                      />
                      <Label htmlFor="middle_name" className="block text-md  font-medium">
                        With PhilSys ID Number
                      </Label>
                    </div>

                    <Input
                      ref={philSysIDRef}
                      type="text"
                      id="philsys_id_no"
                      name="philsys_id_no"
                      placeholder="0000-0000000-000"
                      maxLength={19} // 4 + 7 + 1 digits + 2 hyphens
                      // className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      className={`${!hasPhilsysId ? "bg-gray-200 cursor-not-allowed" : ""} mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      disabled={!hasPhilsysId}
                      value={formData.philsys_id_no || ""}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
                        if (value.length > 9) value = value.slice(0, 9) + "-" + value.slice(9);
                        if (value.length > 14) value = value.slice(0, 14) + "-" + value.slice(14);
                        if (value.length > 19) value = value.slice(0, 19) + "-" + value.slice(19);
                        updateFormData({ philsys_id_no: value.slice(0, 19) }); // Limit to 16 characters
                      }}
                    />
                    {/* <PhilSysInput                        
                        /> */}
                    {/* may id na sa component */}
                    {errors?.philsys_id_no && (
                      <p className="mt-2 text-md  text-red-500">{errors.philsys_id_no}</p>
                    )}
                  </div>
                  {/* <div className="col-span-3 sm:py-1 md:p-1"> */}
                  <div className="sm:py-1 md:p-1  gtabs4:col-span-3 2xl:col-span-3">
                    <Label htmlFor="birthplace" className="block text-md  font-medium mb-1">Birthplace <span className='text-red-500'> *</span></Label>
                    <Textarea
                      value={formData.birthplace || ""}
                      onChange={(e) => updateFormData({ birthplace: e.target.value })}
                      id="birthplace"
                      name="birthplace"
                      placeholder="Enter your Birthplace (Region, Province, Municipality, Barangay and Street #/ Sitio"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors?.birthplace && (
                      <p className="mt-2 text-md  text-red-500">{errors.birthplace}</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">


            {/* inputs */}


          </div>

          <div className="p-3 col-span-full">

            <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className={formData.modality_id !== undefined ? "" : "hidden"} />
          </div>
        </CardContent>
        <CardFooter className="mt-10 pt-5 sticky bottom-0 bg-white shadow-md z-50">
          <div className="flex flex-col space-y-4">


            {/* Checkbox Section */}
            {/* <div className='px-3'>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAccepted}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>
                  I accept the <strong>Terms and Conditions</strong> and the{" "}
                  <strong>Data Privacy Statement</strong>.
                </span>
              </label>
            </div> */}

            {/* Save Button Section */}
            <div className='px-3'>
              {/* <Button onClick={handleSubmit} disabled={!isAccepted || loading || btnToggle} > */}
              {/* <Button onClick={toggleDataPrivacy} disabled={btnToggle} > */}
              <Button onClick={handleSubmit} disabled={btnToggle} className={`${userIdViewing ? "hidden" : ""}`}>
                {loading ? <Loader2 className={`animate-spin size-5 ${Number(formData?.modality_id) === 25 ? "bg-cfw_bg_color text-black" : ""}`} /> : ""}
                {loading ? "Saving..." : "Save"}
              </Button>


              <Button className={`${userIdViewing ? "" : "hidden"}`} variant={"default"} onClick={handleUpdateCFWPersonProfile}>
                Submit
              </Button>

            </div>
          </div>

          {/* <ButtonSubmit disabled={loading} label="Submit" onClick={handleSubmit} /> */}
          {/* <ButtonSubmit disabled={true} label="Submit" /> */}
        </CardFooter>
        {/* </form> */}
      </Card >
    </div>
  )
}



