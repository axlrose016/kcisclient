'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
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
import VolunteerDetails from './volunteer_details'
import KCTrainings from './kc_trainings'
import CapacityBuilding from './capacity_building'
import Ers_work_record from './ers_work_record'
import { getCivilStatusLibraryOptions, getExtensionNameLibraryOptions, getModalityLibraryOptions, getModalitySubCategoryLibraryOptions, getSectorsLibraryOptions, getSexLibraryOptions } from '@/components/_dal/options'

import { submit } from "./action";
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibModalityOptions, getOfflineLibModalitySubCategoryOptions, getOfflineLibSectorsLibraryOptions, getOfflineLibSexOptions } from '@/components/_dal/offline-options'
import Attachments from './attachments'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import SectorDetails from './sectors'
import { IPersonProfile, IPersonProfileDisability, IPersonProfileFamilyComposition, IPersonProfileSector } from '@/components/interfaces/personprofile'
import { v4 as uuidv4, validate } from 'uuid';
import { fstat } from 'fs'
import { IAttachments } from '@/components/interfaces/general/attachments'
import { ConfirmSave, SessionPayload } from '@/types/globals'
import { getSession } from '@/lib/sessions-client'
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb'
import { CheckCircle } from "lucide-react";
import { ToastAction } from '@/components/ui/toast'

export default function PersonProfileForm() {
  const module = "personprofile";
  let _session = {} as SessionPayload;
  const [combinedData, setCombinedData] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [isMiddleNameEnabled, setIsMiddleNameEnabled] = useState(true);
  const middleNameRef = useRef<HTMLInputElement>(null);
  const [hasPhilsysId, setHasPhilsysId] = useState(true);
  const philSysIDRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("contact");

  useEffect(() => {
    if (hasPhilsysId && philSysIDRef.current) {
      philSysIDRef.current.focus(); // Auto-focus when enabled
    }
  }, [hasPhilsysId]);



  const chkHasPhilSysId = (e: any) => {
    // alert(e);
    setHasPhilsysId(!hasPhilsysId);
    updatingCommonData('philsys_id_no', "")
    updatingCommonData('has_philsys_id', !hasPhilsysId);
  }
  useEffect(() => {
    if (hasPhilsysId && philSysIDRef.current) {
      philSysIDRef.current.focus(); // Auto-focus when enabled
    }
  }, [hasPhilsysId]);

  useEffect(() => {
    if (isMiddleNameEnabled && middleNameRef.current) {
      middleNameRef.current.focus(); // Auto-focus when enabled
    }
  }, [isMiddleNameEnabled]);



  const chkIsMiddleNameEnabled = (e: any) => {
    // alert(e);
    setIsMiddleNameEnabled(!isMiddleNameEnabled);
    updatingCommonData('middle_name', "")
    updatingCommonData('has_middle_name', !isMiddleNameEnabled);
  }

  const [commonData, setCommonData] = useState(() => {
    // debugger;
    if (globalThis.window) {
      const storedCommonData = localStorage.getItem("common_data");
      if (storedCommonData !== null) {
        return storedCommonData ? JSON.parse(storedCommonData) : {};
      } else {
        const defaultData = { civil_status_id: 4, has_middle_name: true, has_philsys_id: true, extension_name_id: 5 };
        localStorage.setItem("common_data", JSON.stringify(defaultData));

        return defaultData;
      }
    }

    return {};

  });

  useEffect(() => {
    localStorage.setItem("common_data", JSON.stringify(commonData));
  }, [commonData]);

  const updatingCommonData = (field: any, value: any) => {
    setCommonData((prev: any) => ({
      ...prev, [field]: value
    }));
  }

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
  const [selectedModality, setSelectedModality] = useState("");
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

  //const [state, submitAction] = useActionState(submit, undefined)

  const [philsysIdNo, setPhilsysIdNo] = useState<string>("");

  const [localStorageData, setLocalStorageDate] = useState([]);
  const [form_Data, setForm_Data] = useState([]);

  const [sectorsOptions, setSectorsOptions] = useState<LibraryOption[]>([]);
  // const [selectedSex, setSelectedSex] = useState("");
  // const [selectedSexId, setSelectedSexId] = useState<number | null>(null);
  const [dummyId, setDummyId] = useState("");
  const [selectedModalityID, setSelectedModalityID] = useState<number | null>(null);


  const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;

    updatingCommonData("birthdate", selectedDate);
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

    updatingCommonData("age", ageNumber);
    // updateCommonData("age", ageNumber);
    setAge(ageNumber.toString());
  };


  const [displayPic, setDisplayPic] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // debugger;
      try {
        const sex = await getOfflineLibSexOptions();//await getSexLibraryOptions();
        const formattedSex = sex.map(option => ({

          ...option,
          name: option.name.toUpperCase(), // Convert label to uppercase

        }));

        setSexOptions(formattedSex);

        const civil_status = await getOfflineCivilStatusLibraryOptions(); //await getCivilStatusLibraryOptions();
        const formattedCivilStatus = civil_status.map(option => ({

          ...option,
          name: option.name.toUpperCase(), // Convert label to uppercase

        }));
        setCivilStatusOptions(formattedCivilStatus);

        const modality = await getOfflineLibModalityOptions(); //await getModalityLibraryOptions();
        setModalityOptions(modality);

        const extension_name = await getOfflineExtensionLibraryOptions(); //await getExtensionNameLibraryOptions();
        // Convert label values to uppercase before setting state
        const formattedExtensions = extension_name.map(option => ({

          ...option,
          name: option.name.toUpperCase(), // Convert label to uppercase

        }));
        console.log("Formatted Extension", formattedExtensions);
        setExtensionNameOptions(formattedExtensions);

        const modality_sub_category = await getOfflineLibModalitySubCategoryOptions(); //await getModalitySubCategoryLibraryOptions();
        setModalitySubCategoryOptions(modality_sub_category);

        const sectors = await getOfflineLibSectorsLibraryOptions(); //await getSectorsLibraryOptions();
        setSectorsOptions(sectors);

        const common_data = localStorage.getItem("common_data");
        if (common_data) {
          const parsedCommonData = JSON.parse(common_data);
          setSelectedModalityID(parsedCommonData.modality_id);
        }

        _session = await getSession() as SessionPayload;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();


  }, []);
  const [btnSaveEnabled, setBtnSaveEnabled] = useState(false);
  useEffect(() => {
    // debugger;
    const storedDisplayPic = localStorage.getItem("attachments");
    if (storedDisplayPic) {
      const parsedDP = JSON.parse(storedDisplayPic); // Convert JSON string to object/array
      // console.log("Attachments:", parsedDP);

      if (Array.isArray(parsedDP) && parsedDP.length > 8) {


        const filePath = parsedDP[8].file_path;
        if (filePath.startsWith("data:image/")) {
          setDisplayPic(parsedDP[8].file_path); // Access the 9th element (index 8)
        } else {
          setDisplayPic(""); // Access the 9th element (index 8)
        }

        // console.log("Picture path: " + parsedDP[8].file_path);
      } else {
        console.error("Invalid or missing file_path at index 8");
      }
    } else {
      console.log("No attachments");
    }
    // setBtnSaveEnabled(false);
    // setIsAccepted(false);
  })

  const handleSexChange = (id: number) => {

    // updateCommonData("sex_id", id);
    console.log("Selected Sex ID:", id);
    setSelectedSexId(id);
    updatingCommonData("sex_id", id);
  };
  const handleCivilStatusChange = (id: number) => {

    // updateCommonData("civil_status_id", id);
    console.log("Selected Civil Status ID:", id);
    setSelectedCivilStatusId(id);
    updatingCommonData("civil_status_id", id);
  };
  const handlModalityChange = (id: number) => {
    setSelectedModalityID(id);

    // updateCommonData("modality_id", id);
    console.log("Selected Modality ID:", id);
    updatingCommonData("modality_id", id);


  };

  useEffect(() => {
    setSelectedModalityID(selectedModalityID);
    console.log("SELECTED MODALITY ID: ", selectedModalityID);
  }, [selectedModalityID])
  const handlModalitySubCategoryChange = (id: number) => {
    setSelectedModalitySubCategoryId(id);
    // updateCapturedData("cfw", "modality_sub_category_id", id, 4);
    // updateCFWData("modality_sub_category_id", id);
    console.log("Selected Modality Sub Category ID:", id);
    updatingCfwGeneralInfo("modality_sub_category_id", id);

  };

  const handlExtensionNameChange = (id: number) => {

    // updateCommonData("extension_name", id);
    console.log("Selected Extension name ID:", id);
    setSelectedExtensionNameId(id);
    updatingCommonData("extension_name_id", id);
  };

  const handleErrorClick = (tabValue: any, fieldId: any) => {
    // alert(activeTab + ' ' + tabValue)
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
              alert("button not clicked")
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

    ...(selectedModalityID === 25 || selectedModalityID === 22
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
            modality_id_global={Number(selectedModalityID)}

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
          />
        </div>
      ),
    },
    // (cfwGeneralInfo?.modality_sub_category_id === 2 && selectedModalityID === 25
    //   ? [

    // ]
    // : [])
    // ,




    {
      value: "sector",
      label: "Sector",
      content: (
        <div className="bg-card rounded-lg">
          <SectorDetails
            errors={errors}
          />
        </div>
      ),
    },

    ...(commonData.modality_id !== 25
      // ...(selectedModalityID !== 25
      ? [
        {
          value: "volunteerdetails",
          label: "Volunteer Details",
          content: (
            <div className="bg-card rounded-lg">
              <VolunteerDetails errors={errors} />
            </div>
          ),
        }, {
          value: "kctrainings",
          label: "KC Trainings",
          content: (
            <div className="bg-card rounded-lg">
              <KCTrainings errors={errors} />
            </div>
          ),
        }, {
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
      ]
      : []),


    {
      value: "cash_for_work",
      label: "Cash-for-Work Program Details",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <CFWProgramDetails
            errors={errors}
          // capturedData={capturedData}
          // updateCapturedData={updateCapturedData}
          // selectedModalityID={selectedModalityID}
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
          // capturedData={capturedData}
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
            // capturedData={capturedData}
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
      label: "Preferred Deployment Area",
      content: (
        <div className="p-3 bg-card rounded-lg">
          <PrefferedDeploymentArea
            errors={errors}
          // capturedData={capturedData}
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

          />
        </div>
      ),
    },
  ]
  // Assume this is your form component
  // function FormComponent() {
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
  // useEffect(() => {
  //   if (Object.keys(combinedData).length > 0) {
  //     submit({}, combinedData).then((response) => console.log("Server Response:", response));
  //     // console.log("Final data before submit:", combinedData);
  //     // localStorage.setItem("combinedData", JSON.stringify(combinedData));
  //     // submit({}, combinedData).then((response) => console.log(response));
  //   }
  // }, [combinedData]);

  useEffect(() => {
    // debugger;
    console.log(combinedData);
    if (confirmed) {
      if (combinedData) {
        const pls = JSON.parse(JSON.stringify(combinedData));
        console.log("from LS ", pls);
        const fd = pls;

        const modality_id = fd.common_data.modality_id;

        let formPersonProfile: IPersonProfile;
        let formPersonProfileSector: IPersonProfileSector;
        let formPersonProfileDisability: IPersonProfileDisability;
        let formPersonProfileFamilyComposition: IPersonProfileFamilyComposition;
        let formAttachments: IAttachments;

        if (modality_id === 25) {
          let _id = uuidv4();
          formPersonProfile = {
            id: _id,
            modality_id: fd.common_data?.modality_id || null,
            extension_name: fd.common_data?.extension_name || null,
            birthplace: fd.common_data?.birthplace || null,
            sex_id: fd.common_data?.sex_id || null,
            first_name: fd.common_data?.first_name || null,
            last_name: fd.common_data?.last_name || null,
            middle_name: fd.common_data?.middle_name || null,
            civil_status_id: fd.common_data?.civil_status_id || null,
            birthdate: fd.common_data?.birthdate || null,
            age: fd.common_data?.age || null,
            philsys_id_no: fd.common_data?.philsys_id_no || null,
            sitio: fd.contact_details?.sition || null,
            brgy_code: fd.contact_details?.brgy_code || null,
            cellphone_no: fd.contact_details?.cellphone_no || null,
            cellphone_no_secondary: fd.contact_details?.cellphone_no_secondary || null,
            email: fd.contact_details?.email || null,
            sitio_current_address: fd.contact_details?.sitio_present_address || null,
            brgy_code_current: fd.contact_details?.barangay_code_present_address || null,
            is_permanent_same_as_current_address: fd.contact_details?.is_same_as_permanent_address === true ? true : false || null,
            has_immediate_health_concern: fd.health_concerns?.has_immediate_health_concern === true ? true : false || null,
            immediate_health_concern: fd.health_concerns?.immediate_health_concern || null,
            school_name: fd.educational_attainment?.school_name || null,
            campus: fd.educational_attainment?.campus || null,
            school_address: fd.educational_attainment?.school_address || null,
            course_id: fd.educational_attainment?.course_id ?? 0, // Integer defaulting to 0
            year_graduated: fd.educational_attainment?.year_graduated || null,
            year_level_id: fd.educational_attainment?.year_level_id ?? 0,

            current_occupation: fd.employment?.current_occupation || null,
            id_card: fd.employment?.id_card ?? 0, // Integer defaulting to 0
            occupation_id_card_number: fd.employment?.occupation_id_card_number || null,
            skills: fd.employment?.skills || null,

            deployment_area_id: fd.preferred_deployment?.deployment_area_id ?? 0, // Integer defaulting to 0
            deployment_area_address: fd.preferred_deployment?.deployment_area_address || null,
            preffered_type_of_work_id: fd.preferred_deployment?.preffered_type_of_work_id ?? 0, // Integer defaulting to 0

            modality_sub_category_id: fd.cfw_general_info?.modality_sub_category_id || null,


            is_pwd_representative: fd.cfw_representative?.is_cfw_representative === true ? true : false || null,


            ip_group_id: fd.ip_group_id || null,

            cwf_category_id: null,
            cfwp_id_no: null,
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
            ip: 0,
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
            persons_with_disability: 0,
            others: null,
            family_member_name: null,
            relationship_to_family_member: null,

            //CFW Representative
            representative_last_name: fd.cfw_representative?.representative_last_name || null,
            representative_first_name: fd.cfw_representative?.representative_first_name || null,
            representative_middle_name: fd.cfw_representative?.representative_middle_name || null,
            representative_extension_name_id: fd.cfw_representative?.representative_extension_name_id || null,
            representative_sitio: fd.cfw_representative?.representative_sitio || null,
            representative_brgy_code: fd.cfw_representative?.representative_brgy_code || null,
            representative_relationship_to_beneficiary: fd.cfw_representative?.representative_relationship_to_beneficiary || null,
            representative_birthdate: fd.cfw_representative?.representative_birthdate || null,
            representative_age: fd.cfw_representative?.representative_age || null,
            representative_occupation: fd.cfw_representative?.representative_occupation || null,
            representative_monthly_salary: fd.cfw_representative?.representative_monthly_salary || null,
            representative_educational_attainment_id: fd.cfw_representative?.representative_educational_attainment_id || null,
            representative_sex_id: fd.cfw_representative?.representative_sex_id || null,
            representative_contact_number: fd.cfw_representative?.representative_contact_number || null,
            representative_id_card_id: fd.cfw_representative?.representative_id_card_id || null,
            representative_id_card_number: fd.cfw_representative?.representative_id_card_number || null,
            representative_address: fd.cfw_representative?.representative_address || null,
            representative_civil_status_id: fd.cfw_representative?.representative_civil_status_id || null,
            representative_has_health_concern: fd.cfw_representative?.representative_has_health_concern || null,
            representative_health_concern_details: fd.cfw_representative?.representative_health_concern_details || null,
            representative_skills: fd.cfw_representative?.representative_skills || null,

            created_by: _session.id,
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
          formPersonProfileSector = {
            id: uuidv4(),
            person_profile_id: _id,
            sector_id: fd.sectors?.sector_id || null,
            created_by: _session.id,
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
          formPersonProfileDisability = {
            id: uuidv4(),
            person_profile_id: _id,
            type_of_disability_id: fd.disabilities?.disability_id || null,
            created_by: _session.id,
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
          formPersonProfileFamilyComposition = {
            id: uuidv4(),
            person_profile_id: _id,
            name: fd.family_composition?.name || null,
            birthdate: fd.family_composition?.birthdate || null,
            age: fd.family_composition?.age || null,
            contact_number: fd.family_composition?.contact_number || null,
            highest_educational_attainment_id: fd.family_composition?.highest_educational_attainment_id || null,
            monthly_income: fd.family_composition?.monthly_income || null,
            relationship_to_the_beneficiary_id: fd.family_composition?.relationship_to_the_beneficiary_id || null,
            work: fd.family_composition?.work || null,
            created_by: _session.id,
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
          formAttachments = {
            id: uuidv4(),
            record_id: _id,
            file_path: fd.attachments?.file_path || null,
            file_name: fd.attachments?.file_name || null,
            file_id: fd.attachments?.file_id || null,
            module_path: module,
            created_by: _session.id,
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
        }

        dexieDb.open();

        dexieDb.transaction('rw', [dexieDb.person_profile,
        dexieDb.person_profile_sector, dexieDb.person_profile_disability, dexieDb.person_profile_family_composition,
        dexieDb.attachments], async () => {
          try {
            await dexieDb.person_profile.add(formPersonProfile);
            await dexieDb.person_profile_sector.add(formPersonProfileSector);
            await dexieDb.person_profile_disability.add(formPersonProfileDisability);
            await dexieDb.person_profile_family_composition.add(formPersonProfileFamilyComposition);
            await dexieDb.attachments.add(formAttachments);
            console.log("person_profile", JSON.stringify(formPersonProfile));
            console.log("sector", JSON.stringify(formPersonProfileSector));
            console.log("disability", JSON.stringify(formPersonProfileDisability));
            console.log("family", JSON.stringify(formPersonProfileFamilyComposition));
            console.log("Person Profile added to IndexedDB");
          } catch (error) {
            console.error("Error adding Person Profile to IndexedDB", error);
          }
        }).catch(error => {
          console.log('Transaction failed: ', error);
        });
        //const response = await submit({}, JSON.stringify(pls));
        //console.log("SERVER RESPONSE", JSON.stringify(response));
        //console.log("SERVER RESPONSE", response);

        setChkToggle(false);
        // setbtnToggle(true);
        toast({
          variant: "green",
          title: "Success",
          description: "Record has been saved!",
        });
      };
    }
  }, [confirmed])

  const [isAccepted, setIsAccepted] = useState(false);
  const [chkToggle, setChkToggle] = useState(true);
  const [btnToggle, setbtnToggle] = useState(false);



  const confirmSave = async () => {
    debugger;
    setConfirmed(true);
  }

  const showToastConfirmation = (confirmSave: ConfirmSave) => {
    toast({
      variant: "destructive",
      title: "You are about to save the form, continue?",
      description: "This will save the data. This action cannot be undone.",
      action: (
        <button
          onClick={() => confirmSave()}  // saving to server
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Confirm
        </button>
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
    if (storedCommonData) {

      const parsedCommonData = JSON.parse(storedCommonData);

      console.log(parsedCommonData);

      if (parsedCommonData.modality_id === 25) { //cfw
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
        const storedcfwGeneralInfo = localStorage.getItem("cfwGeneralInfo");
        if (!storedcfwGeneralInfo) { errorToast("Modality Sub category is required!", "basic_information", "modality_sub_category_id"); return; }
        const parsedcfwGeneralInfo = JSON.parse(storedcfwGeneralInfo);
        if (!parsedcfwGeneralInfo.modality_sub_category_id) { errorToast("Modality Sub category is required!", "basic_information", "modality_sub_category_id"); return; }

        if (!parsedCommonData.modality_id) { errorToast("Modality is required!", "basic_information", "modality_id"); return; }
        if (!parsedCommonData.modality_id) { errorToast("Modality is required!", "basic_information", "modality_id"); return; }
        if (!parsedCommonData.first_name) { errorToast("First name is required!", "basic_information", "first_name"); return; }
        if (!parsedCommonData.middle_name && isMiddleNameEnabled) { errorToast("Middle name is required!", "basic_information", "middle_name"); return; }
        if (!parsedCommonData.last_name) { errorToast("Last name is required!", "basic_information", "last_name"); return; }
        // if (!parsedCommonData.extension_name_id) { errorToast("Extension  name is required!", "basic_information", "extension_name"); return; }
        if (!parsedCommonData.sex_id) { errorToast("Sex field is required!", "basic_information", "sex_id"); return; }
        if (!parsedCommonData.civil_status_id) { errorToast("Civil status is required!", "basic_information", "civil_status_id"); return; }
        if (!parsedCommonData.birthdate) { errorToast("Birthdate is required!", "basic_information", "birthdate"); return; }
        if (!parsedCommonData.age || parsedCommonData.age <= 18 || parsedCommonData.age >= 71) {
          errorToast("Invalid age! Please enter a valid age between 18 and 70 years old.", "basic_information", "birthdate"); return;
        }
        if (!parsedCommonData.philsys_id_no && hasPhilsysId) { errorToast("16-digit PhilSys ID number is required!", "basic_information", "philsys_id_no"); return; }
        // alert(parsedCommonData.philsys_id_no.length)
        if (hasPhilsysId && (!parsedCommonData.philsys_id_no || parsedCommonData.philsys_id_no.length < 19)) {
          errorToast("16-digit PhilSys ID number is required!", "basic_information", "philsys_id_no");
          return;
        }
        if (!parsedCommonData.birthplace) { errorToast("Birthplace is required!", "basic_information", "birthplace"); return; }

        const storedContactDetails = localStorage.getItem("contactDetails");
        if (!storedContactDetails) { errorToast("Contact Details required!", "contact", "region_contact_details"); return; }
        const parsedContactDetails = JSON.parse(storedContactDetails);

        if (!parsedContactDetails.region_code) { errorToast("Region is required!", "contact", "region_contact_details"); return; }
        if (!parsedContactDetails.province_code) { errorToast("Province is required!", "contact", "province_contact_details"); return; }
        if (!parsedContactDetails.city_code) { errorToast("City/Municipality is required!", "contact", "municipality_contact_number"); return; }
        if (!parsedContactDetails.barangay_code) { errorToast("Barangay is required!", "contact", "barangay_contact_details"); return; }
        if (!parsedContactDetails.sitio) { errorToast("Sitio is required!", "contact", "sitio"); return; }
        if (!parsedContactDetails.region_code_present_address) { errorToast("Present Region is required!", "contact", "region_contact_details_present_address"); return; }
        if (!parsedContactDetails.province_code_present_address) { errorToast("Present Province is required!", "contact", "province_contact_details_present_address"); return; }
        if (!parsedContactDetails.city_code_present_address) { errorToast("Present City/Municipality is required!", "contact", "municipality_contact_details_present_address"); return; }
        if (!parsedContactDetails.brgy_code_present_address) { errorToast("Present Barangay is required!", "contact", "barangay_contact_details_present_address"); return; }
        if (!parsedContactDetails.sitio_present_address) { errorToast("Present Sitio is required!", "contact", "sitio_present_address"); return; }
        // alert(parsedContactDetails.cellphone_no.length)
        if (parsedContactDetails.cellphone_no.length < 13) { errorToast("Primary cellphone number is required!", "contact", "cellphone_no"); return; }
        if (!parsedContactDetails.email) { errorToast("Email is required!", "contact", "email"); return; }
        // Regular Expression to check valid email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(parsedContactDetails.email)) {
          errorToast("Invalid email format! Please enter a valid email.", "contact", "email");
          return;
        }
        // if (!parsedContactDetails.is_same_as_permanent_address) { errorToast("is_same_as_permanent_address is empty!"); return; }


        const storedHealthConcern = localStorage.getItem("healthConcerns");
        if (!storedHealthConcern) { errorToast("Health Concern required!", "details", ""); return; }
        const parsedHealthConcerns = JSON.parse(storedHealthConcern);
        try {
          const parsedHealthConcern = JSON.parse(storedHealthConcern);

          if (typeof parsedHealthConcern === "object" && parsedHealthConcern !== null && Object.keys(parsedHealthConcern).length === 0) {
            errorToast("Health Concern cannot be empty!", "details", "");
            return;
          }
        } catch (error) {
          errorToast("Invalid Health Concern data!");
          return;
        }

        if (parsedHealthConcerns.has_immediate_health_concern === 1 && !parsedHealthConcerns.immediate_health_concern) { errorToast("Health Concern details is required!", "details", "immediate_health_concern"); return; }


        const storedEmployment = localStorage.getItem("employment");

        if (!storedEmployment) { errorToast("Skills required!", "occupation", ""); return; }
        const parsedEmployments = JSON.parse(storedEmployment);

        // alert(parsedEmployments.has_occupation + " " + parsedEmployments.current_occupation)
        if (parsedEmployments.has_occupation && !parsedEmployments.current_occupation?.trim()) {
          errorToast("Occupation is required!", "occupation", "current_occupation");
          return;
        }



        if (!parsedEmployments.skills) { errorToast("Skill is required!", "occupation", "skills"); return; }


        const storedSectors = localStorage.getItem("sectors");
        if (!storedSectors) { errorToast("Sectors required!", "sector", ""); return; }
        const parsedSectors = JSON.parse(storedSectors);

        // Check if there is at least one non-empty "YES" in the sectors
        const hasYesAnswer = parsedSectors.some((sector: { answer: string }) => sector.answer.trim() !== "");

        if (!hasYesAnswer) {
          errorToast("At least one sector must be selected!", "sector", "");
          return;
        }



        if (parsedSectors[2].answer === "Yes") {
          // check if there is disabilities

          const storedDisabilities = localStorage.getItem("disabilities");

          if (!storedDisabilities) { errorToast("Pease select a disability!", "sector", "type_of_disabilities"); return; }
          const parsedDisabilities = JSON.parse(storedDisabilities);

          if (!Array.isArray(parsedDisabilities) || parsedDisabilities.length === 0) {
            errorToast("Please select a disability!", "sector", "type_of_disabilities");
            return;
          }

          const formattedDisabilities = Object.fromEntries(
            parsedDisabilities.map((id: any) => [`disability_id_${id}`, Number(id)])
          );

          appendData("disabilities", formattedDisabilities);
        }

        if (parsedSectors[3].answer === "Yes") {
          // check if there is disabilities
          const storedIPGroupId = localStorage.getItem("ipgroup_id");
          if (!storedIPGroupId) { errorToast("Pease select an IP Group!", "sector", "ip_group"); return; }
          const parsedIpGroupId = JSON.parse(storedIPGroupId);
          if (parsedIpGroupId === 0) { errorToast("Pease select an IP Group", "sector", "ip_group"); return; }
          appendData("ip_group_id", parsedIpGroupId);
        }


        // debugger;
        const storedHasProgramDetails = localStorage.getItem("hasProgramDetails");
        if (!storedHasProgramDetails) { errorToast("CFW Program details required!", "cash_for_work", ""); return; }
        // const parsedHasProgramDetails = JSON.parse(storedHasProgramDetails);
        if (storedHasProgramDetails === "yes") {
          const storedProgramDetails = localStorage.getItem("programDetails");
          if (!storedProgramDetails) { errorToast("CFW Program details required!","cash_for_work", ""); return; }
          const parsedProgramDetails = JSON.parse(storedProgramDetails);
          appendData("program_details", parsedProgramDetails);

        }

        const storedFamilyComposition = localStorage.getItem("family_composition");
        if (!storedFamilyComposition) { errorToast("Family composition is required!","family_composition",""); return; }
        const parsedFamilyComposition = JSON.parse(storedFamilyComposition);
        if (parsedFamilyComposition.family_composition.length <= 0) { errorToast("Family composition is required!","family_composition",""); return; }
        // console.log(parsedFamilyComposition.family_composition.length);





        const storedEducationalAttainment = localStorage.getItem("educational_attainment");
        if (!storedEducationalAttainment) { errorToast("Educational Attainment data is required!"); return; }
        const parsedEducationData = JSON.parse(storedEducationalAttainment);
        if (!parsedEducationData.school_name) { errorToast("Name of school is required!"); return; }
        if (!parsedEducationData.campus) { errorToast("Campus is required!"); return; }
        if (!parsedEducationData.school_address) { errorToast("School address is required!"); return; }
        if (parsedEducationData.course_id === 0) { errorToast("Course is required!"); return; }
        if (!parsedEducationData.year_graduated) { errorToast("Year graduated is required!"); return; }

        // if student to cfw
        console.log("CFW Sub Cat ID " + parsedcfwGeneralInfo.modality_sub_category_id);
        if (parsedcfwGeneralInfo.modality_sub_category_id === 1 && parsedEducationData.year_level_id === 0) { errorToast("Year level is required!"); return; }


        const storedPreferred_deployment = localStorage.getItem("preferred_deployment");
        if (!storedPreferred_deployment) { errorToast("Preferred Deployment Area is required!"); return; }
        const parsedPreferred_deployment = JSON.parse(storedPreferred_deployment);
        if (parsedPreferred_deployment.deployment_area_id === 0) { errorToast("Preferred Deployment Area is required!"); return; }
        if (parsedPreferred_deployment.preffered_type_of_work_id === 0) { errorToast("Preferred Type of Work is required!"); return; }


        const storedAttachments = localStorage.getItem("attachments");
        if (!storedAttachments) { errorToast("Attachment is required!"); return; }
        const parsedAttachments = JSON.parse(storedAttachments);
        if (!parsedAttachments[0].file_name) { errorToast("Primary ID is required!"); return; }
        if (!parsedAttachments[8].file_name) { errorToast("Profile Picture is required!"); return; }

        if (!isAccepted) { errorToast("Please check the terms and agreement before submitting."); return; }

        appendData("common_data", parsedCommonData);
        appendData("contact_details", parsedContactDetails);
        appendData("health_concerns", parsedHealthConcerns);
        appendData("employment", parsedEmployments);
        appendData("sectors", parsedSectors);
        appendData("family_composition", parsedFamilyComposition);
        appendData("educational_attainment", parsedEducationData);
        appendData("preferred_deployment", parsedPreferred_deployment);
        appendData("attachments", parsedAttachments);
        appendData("cfw_general_info", parsedcfwGeneralInfo); //10

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

      else if (commonData.modality_id === 22) {
        // other modality: this is PMNP
        console.log("PMNP things");
      }

      else {
        console.log("No modality selected!");
        if (!parsedCommonData.modality_id) { errorToast("Modality is required!", "basic_information", "modality_id"); return; }
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
  const handleCheckboxChange = () => {
    setIsAccepted((prev) => !prev);
  };


  // function sampleClick() {
  //   let labelfor = "sex_id";
  //   let label = document.querySelector('label[for="' + labelfor + '"]'); // Get the label

  //   if (label) {
  //     let dropdownContainer = label.nextElementSibling as HTMLElement | null; // Assume FormDropDown is the next element

  //     if (dropdownContainer) {
  //       let button = dropdownContainer.querySelector('button[role="combobox"]') as HTMLButtonElement | null; // Find the button inside

  //       if (button) {
  //         // alert("Button clicked");
  //         // Scroll to the button smoothly
  //         button.scrollIntoView({ behavior: "smooth", block: "center" });
  //         button.click(); // Simulate button click
  //       } else {
  //         alert("button not clicked")
  //         console.warn("Dropdown button not found inside FormDropDown.");
  //       }
  //     } else {
  //       alert("button not found")
  //       console.warn("FormDropDown component not found.");
  //     }
  //   } else {
  //     alert("button not found nor label")
  //     console.warn("Label with for='sex_id' not found.");
  //   }

  // }

  return (

    <Card>
      <CardHeader>
        <CardTitle className="mb-2  flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
          </div>

          {/* Title Section */}
          <div className="text-lg font-semibold mt-2 md:mt-0">

            Beneficiary Profile Form
          </div>
        </CardTitle>


        <CardDescription>
          <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
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
      {/* <form onSubmit={handleSubmit}> */}
      {/* <form action={submitAction}> */}
      <CardContent>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="flex flex-col sm:flex-row items-center sm:items-start w-full">
            <div
              className={`grid sm:grid-cols-4 sm:grid-rows-1 w-full ${Number(selectedModalityID) === 25 ? "bg-cfw_bg_color text-black" : ""
                } p-3 bg-black text-white mt-3`}
            >
              <span className="flex items-center gap-1">
                General Information
                {/* <CheckCircle className="h-6 w-6 text-white-500 " /> */}
              </span>
            </div>
          </div>
          {/* Card Container */}
          <div className="flex flex-col gap-4 sm:flex-row items-center sm:items-start w-full justify-between">

            {/* Image on top (Mobile) / Left (Desktop) */}
            <div className="flex-shrink-0 md:h-full lg:h-full">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  h-full">
                {/* Avatar - Center Horizontally & Vertically */}
                <div className=" col-span-full flex justify-center items-center min-h-[250px]">
                  <Avatar className="h-[200px] w-[200px]">
                    {displayPic ? (
                      <AvatarImage src={displayPic} alt="Display Picture" />
                    ) : (
                      <AvatarFallback>KC</AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>

            </div>

            {/* Inputs below image (Mobile) / Right (Desktop) */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 w-full">

              <div className="sm:py-1 md:p-1">
                <Label htmlFor="modality_id" className="block text-md font-medium mb-1">Select Modality<span className='text-red-500'> *</span> </Label>
                <FormDropDown

                  id="modality_id"
                  options={modalityOptions}
                  selectedOption={commonData.modality_id || ""}
                  onChange={handlModalityChange}

                // onChange={(e) => updatingCommonData("modality_id", e.target.id)}

                />
                {errors?.modality_id && (
                  <p className="mt-2 text-md  text-red-500">{errors.modality_id}</p>
                )}
              </div>
              <div className={`sm:py-1 md:p-1  ${commonData.modality_id !== undefined && commonData.modality_id === 25 ? "" : "hidden"}`}>
                <Label htmlFor="modality_sub_category_id" className="block text-md  font-medium mb-1">CFW Category<span className='text-red-500'> *</span></Label>
                <FormDropDown

                  id="modality_sub_category_id"
                  options={modalitySubCategoryOptions}
                  // selectedOption={selectedModalitySubCategoryId}
                  selectedOption={cfwGeneralInfo.modality_sub_category_id || ""}

                  onChange={handlModalitySubCategoryChange}

                />
                {errors?.modality_id && (
                  <p className="mt-2 text-md  text-red-500">{errors.modality_id}</p>
                )}
              </div>
              <div className="sm:py-1 md:p-1">
                <Label htmlFor="first_name" className="block text-md  font-medium mb-1">First Name<span className='text-red-500'> *</span></Label>
                <Input
                  value={commonData.first_name || ""}

                  onChange={(e) => updatingCommonData('first_name', e.target.value.toUpperCase())}

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
                    onChange={(e) => chkIsMiddleNameEnabled(e.target.checked)}
                  />
                  <Label htmlFor="middle_name" className="block text-md  font-medium">
                    WITH Middle Name
                  </Label>
                </div>
                <Input
                  ref={middleNameRef}
                  // onBlur={handleBlur}
                  // onChange={(e) => updateCommonData('middle_name', e.target.value)}
                  value={isMiddleNameEnabled ? commonData.middle_name || "" : ""}
                  onChange={(e) => updatingCommonData('middle_name', e.target.value.toUpperCase())}
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

                  value={commonData.last_name || ""}
                  onChange={(e) => updatingCommonData('last_name', e.target.value.toUpperCase())}
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
                  selectedOption={commonData.extension_name_id || ""}
                  onChange={handlExtensionNameChange}
                />
              </div>
              <div className="sm:py-1 md:p-1">
                <Label htmlFor="sex_id" className="block text-md  font-medium mb-1">Sex<span className='text-red-500'> *</span></Label>
                <FormDropDown

                  id="sex_id"
                  options={sexOptions}
                  selectedOption={commonData.sex_id || ""}
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
                  selectedOption={commonData.civil_status_id || 4 || ""}
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
                  value={commonData.birthdate || ""}
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
                  value={commonData.age || 0}
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
                    WITH PhilSys ID Number
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

                  value={commonData.philsys_id_no || ""}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
                    if (value.length > 9) value = value.slice(0, 9) + "-" + value.slice(9);
                    if (value.length > 14) value = value.slice(0, 14) + "-" + value.slice(14);
                    if (value.length > 19) value = value.slice(0, 19) + "-" + value.slice(19);
                    updatingCommonData("philsys_id_no", value.slice(0, 19)); // Limit to 16 characters
                  }}
                />
                {/* <PhilSysInput                        
                        /> */}
                {/* may id na sa component */}
                {errors?.philsys_id_no && (
                  <p className="mt-2 text-md  text-red-500">{errors.philsys_id_no}</p>
                )}
              </div>
              <div className="sm:py-1 md:p-1">
                <Label htmlFor="birthplace" className="block text-md  font-medium mb-1">Birthplace <span className='text-red-500'> *</span></Label>
                <Textarea
                  value={commonData.birthplace || ""}
                  onChange={(e) => updatingCommonData('birthplace', e.target.value.toUpperCase())}
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





        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">


          {/* inputs */}





        </div>


        <div className="p-3">

          <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className={commonData.modality_id !== undefined ? "" : "hidden"} />
        </div>

      </CardContent>
      <CardFooter className="mt-10 pt-5 sticky bottom-0 bg-white shadow-md z-50">



        <div className="flex flex-col space-y-4">


          {/* Checkbox Section */}
          <div className='px-3'>
            <label className="flex items-center space-x-2">
              <input
                id='i_accept'
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
          </div>

          {/* Save Button Section */}
          <div className='px-3'>
            {/* <Button onClick={sampleClick} >Click Me</Button> */}
            {/* <Button onClick={handleSubmit} disabled={!isAccepted || loading || btnToggle} > */}
            <Button onClick={handleSubmit} disabled={btnToggle} >
              {loading ? <Loader2 className={`animate-spin size-5 ${Number(selectedModalityID) === 25 ? "bg-cfw_bg_color text-black" : ""}`} /> : ""}
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* <ButtonSubmit disabled={loading} label="Submit" onClick={handleSubmit} /> */}
        {/* <ButtonSubmit disabled={true} label="Submit" /> */}
      </CardFooter>
      {/* </form> */}
    </Card >

  )
}



