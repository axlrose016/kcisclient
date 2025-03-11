'use client'

import { useActionState, useEffect, useState } from 'react'
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
import { v4 as uuidv4 } from 'uuid';
import { fstat } from 'fs'
import { IAttachments } from '@/components/interfaces/general/attachments'
import { ConfirmSave, SessionPayload } from '@/types/globals'
import { getSession } from '@/lib/sessions-client'
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb'

export default function PersonProfileForm() {
  const module = "personprofile";
  let _session = {} as SessionPayload;
  const [combinedData, setCombinedData] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  // cfw

  const [commonData, setCommonData] = useState(() => {
    if (globalThis.window) {
      const storedCommonData = localStorage.getItem("common_data");
      if (storedCommonData !== null) {
        return storedCommonData ? JSON.parse(storedCommonData) : {};
      }
    }

    return {};
    // if (typeof window !== "undefined") {
    //   const storedCommonData = localStorage.getItem("commonData");
    //   return storedCommonData ? JSON.parse(storedCommonData) : {};
    // }
    // return {};
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

  //  sectors 




  // useEffect(() => {
  //   console.log("commonData in localStorage:", localStorage.getItem("commonData"));
  // }, []);
  // end of CFW



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
      region_code: "",
      pronvince_code: "",
      city_code: "",
      barangay_code: "",
      cellphone_no: "",
      cellphone_no_secondary: "",
      email: "",
      birthplace: "",
      philsys_id_no: "",
      profile_picture: ""


    },

    // this is for cfw alone
    cfw: [
      {
        sectors: []
      },
      {
        // junction table
        program_details: [
        ]
      },

      {
        disabilities: [

        ]
      },
      {

        family_composition: [

          // { name: "", relationship_to_the_beneficiary_id: 0, birthdate: "", age: 0, highest_educational_attainment_id: 0, work: "", monthly_income: "", contact_number: "" }
        ]
      },
      {
        modality_sub_category_id: 0,
        current_occupation: "",
        id_card: 0,
        occupation_id_card_number: "",
        women: "",
        is_family_beneficiary_of_cfw: 0,
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
        is_need_pwd_id: "",
        pwd_id_no: "",

        representative_last_name: "",
        representative_first_name: "",
        representative_middle_name: "",
        representative_extension_name_id: "",
        representative_sitio: "",
        representative_region_code: "",
        representative_province_code: "",
        representative_city_code: "",
        representative_brgy_code: "",
        representative_relationship_to_beneficiary: 0,
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


      {

        // attachments: [

        // { name: "", relationship_to_the_beneficiary_id: 0, birthdate: "", age: 0, highest_educational_attainment_id: 0, work: "", monthly_income: "", contact_number: "" }
        // ]
      },


    ]
  });

  const handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    updateCapturedData("common_data", "birthdate", selectedDate);
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
    updateCapturedData("common_data", "age", ageNumber);
    updatingCommonData("age", ageNumber);
    // updateCommonData("age", ageNumber);
    setAge(ageNumber.toString());
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

      // else if (section === "cfw" && index >= 0 && index < prevData.cfw.length) {
      else if (section === "cfw") {
        if (index === 4) {
          // all cfw data
          updatedData.cfw[index] = { ...prevData.cfw[index], [field]: value };
        } else if (index === 0) {
          // sectors
          updatedData.cfw[index] = { ...prevData.cfw[index], [field]: value };
        } else if (index === 2) {
          // disabilities
          updatedData.cfw[index] = { ...prevData.cfw[index], [field]: value };
        }
        //  && index >= 0 && index < prevData.cfw.length) {
      }


      // Store the updated data in localStorage
      localStorage.setItem("formData", JSON.stringify(updatedData));

      return updatedData;
    });
  }

  const [displayPic, setDisplayPic] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
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
    updateCapturedData("common_data", "sex_id", id);
    // updateCommonData("sex_id", id);
    console.log("Selected Sex ID:", id);
    setSelectedSexId(id);
    updatingCommonData("sex_id", id);
  };
  const handleCivilStatusChange = (id: number) => {
    updateCapturedData("common_data", "civil_status_id", id);
    // updateCommonData("civil_status_id", id);
    console.log("Selected Civil Status ID:", id);
    setSelectedCivilStatusId(id);
    updatingCommonData("civil_status_id", id);
  };
  const handlModalityChange = (id: number) => {
    setSelectedModalityId(id);
    updateCapturedData("common_data", "modality_id", id);
    // updateCommonData("modality_id", id);
    console.log("Selected Modality ID:", id);
    updatingCommonData("modality_id", id);
    

  };
  const handlModalitySubCategoryChange = (id: number) => {
    setSelectedModalitySubCategoryId(id);
    // updateCapturedData("cfw", "modality_sub_category_id", id, 4);
    // updateCFWData("modality_sub_category_id", id);
    console.log("Selected Modality Sub Category ID:", id);
    updatingCfwGeneralInfo("modality_sub_category_id", id);

  };

  const handlExtensionNameChange = (id: number) => {
    updateCapturedData("common_data", "extension_name", id);
    // updateCommonData("extension_name", id);
    console.log("Selected Extension name ID:", id);
    setSelectedExtensionNameId(id);
    updatingCommonData("extension_name_id", id);
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

    // contact details
    {
      value: "contact",
      label: "Contact Information",
      content: (
        <div className="bg-card rounded-lg">
          <ContactDetails
            // errors={errors} 
            errors={errors}
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
          />
        </div>
      ),
    },
    // health concern
    {
      value: "details",
      label: "Health Concern",
      // label: "Basic Information",
      content: (
        <div className="bg-card rounded-lg">
          <Details
            errors={errors}
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
          // updateCapturedData={capturedData} 
          />
        </div>
      )
    },

    // employment
    {
      value: "occupation",
      label: "Employment",
      content: (
        <div className="bg-card rounded-lg">
          <Occupation
            errors={errors}
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
          />
        </div>
      ),
    },
    // (cfwGeneralInfo?.modality_sub_category_id === 2 && selectedModalityId === 25
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
      // ...(selectedModalityId !== 25
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
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
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
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
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
              capturedData={capturedData}
              updateCapturedData={updateCapturedData}
              selectedModalityId={selectedModalityId}
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
            capturedData={capturedData}
            updateCapturedData={updateCapturedData}
            selectedModalityId={selectedModalityId}
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
  function errorToast(msg: string) {
    toast({
      variant: "destructive",
      title: "Missing Required Fields",
      description: msg,
    });
  }

  const appendData = (key: any, data: any) => {
    setCombinedData((prevData) => {
      const updatedData = { ...prevData, [key]: data };
      // console.log("updated data", updatedData);
      //localStorage.setItem("combinedData", JSON.stringify(updatedData));
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
    debugger;
    console.log(combinedData);
    if(confirmed){
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
            sitio:fd.contact_details?.sition || null,
            brgy_code: fd.contact_details?.brgy_code || null,
            cellphone_no: fd.contact_details?.cellphone_no || null,
            cellphone_no_secondary: fd.contact_details?.cellphone_no_secondary || null,
            email: fd.contact_details?.email || null,
            sitio_current_address: fd.contact_details?.sitio_present_address || null,
            brgy_code_current: fd.contact_details?.barangay_code_present_address || null,
            is_permanent_same_as_current_address: fd.contact_details?.is_same_as_permanent_address === true ? true : false  || null,
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
            academe:0,
            business:0,
            differently_abled:0,
            farmer:0,
            fisherfolks:0,
            government:0,
            ip:0,
            ngo:0,
            po:0,
            religious:0,
            senior_citizen:0,
            women:0,
            solo_parent:0,
            out_of_school_youth:0,
            children_and_youth_in_need_of_special_protection:0,
            family_heads_in_need_of_assistance:0, 
            affected_by_disaster:0,
            persons_with_disability:0,
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
            remarks:"Person Profile Created",
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
          try{
            await dexieDb.person_profile.add(formPersonProfile);
            await dexieDb.person_profile_sector.add(formPersonProfileSector);
            await dexieDb.person_profile_disability.add(formPersonProfileDisability);
            await dexieDb.person_profile_family_composition.add(formPersonProfileFamilyComposition);
            await dexieDb.attachments.add(formAttachments);
            console.log("person_profile",JSON.stringify(formPersonProfile));
            console.log("sector", JSON.stringify(formPersonProfileSector));
            console.log("disability", JSON.stringify(formPersonProfileDisability));
            console.log("family", JSON.stringify(formPersonProfileFamilyComposition));
            console.log("Person Profile added to IndexedDB");
          }catch(error){
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

  const showToastConfirmation = (confirmSave : ConfirmSave) => {
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
    if (!isAccepted) {
      errorToast("Please check the terms and agreement before submitting.");
      return;
    }

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
        if (!parsedCommonData.modality_id) { errorToast("Modality is required!"); return; }
        if (!parsedCommonData.first_name) { errorToast("First name is required!"); return; }
        if (!parsedCommonData.middle_name) { errorToast("Middle name is required!"); return; }
        if (!parsedCommonData.last_name) { errorToast("Last name is required!"); return; }
        if (!parsedCommonData.birthdate) { errorToast("Birthdate is required!"); return; }
        if (!parsedCommonData.age || parsedCommonData.age <= 18) { errorToast("Valid age is required!"); return; }
        // if (!parsedCommonData.philsys_id_no) { errorToast("PhilSys ID number is required!"); return; }
        if (!parsedCommonData.birthplace) { errorToast("Birthplace is required!"); return; }
        if (!parsedCommonData.extension_name_id) { errorToast("Extension name is required!"); return; }
        if (!parsedCommonData.sex_id) { errorToast("Sex is required!"); return; }
        if (!parsedCommonData.civil_status_id) { errorToast("Civil status is required!"); return; }

        const storedContactDetails = localStorage.getItem("contactDetails");
        if (!storedContactDetails) { errorToast("Contact Details required!"); return; }
        const parsedContactDetails = JSON.parse(storedContactDetails);
        if (!parsedContactDetails.sitio) { errorToast("Sitio is required!"); return; }
        if (!parsedContactDetails.cellphone_no) { errorToast("Primary cellphone number is required!"); return; }
        if (!parsedContactDetails.cellphone_no_secondary) { errorToast("Secondary cellphone number is required!"); return; }
        if (!parsedContactDetails.email) { errorToast("Email is required!"); return; }
        if (!parsedContactDetails.region_code) { errorToast("Region is required!"); return; }
        if (!parsedContactDetails.province_code) { errorToast("Province is required!"); return; }
        if (!parsedContactDetails.city_code) { errorToast("City/Municipality is required!"); return; }
        if (!parsedContactDetails.barangay_code) { errorToast("Barangay is required!"); return; }
        // if (!parsedContactDetails.is_same_as_permanent_address) { errorToast("is_same_as_permanent_address is empty!"); return; }
        if (!parsedContactDetails.sitio_present_address) { errorToast("Present Sitio is required!"); return; }
        if (!parsedContactDetails.region_code_present_address) { errorToast("Present Region is required!"); return; }
        if (!parsedContactDetails.province_code_present_address) { errorToast("Present Province is required!"); return; }
        if (!parsedContactDetails.city_code_present_address) { errorToast("Present City/Municipality is required!"); return; }
        if (!parsedContactDetails.barangay_code_present_address) { errorToast("Present Barangay is required!"); return; }


        const storedHealthConcern = localStorage.getItem("healthConcerns");
        if (!storedHealthConcern) { errorToast("Health Concern required!"); return; }
        const parsedHealthConcerns = JSON.parse(storedHealthConcern);
        if (parsedHealthConcerns.has_immediate_health_concern === 1 && !parsedHealthConcerns.immediate_health_concern) { errorToast("Health Concern details is required!"); return; }


        const storedEmployment = localStorage.getItem("employment");
        if (!storedEmployment) { errorToast("Skills required!"); return; }
        const parsedEmployments = JSON.parse(storedEmployment);
        if (!parsedEmployments.skills) { errorToast("Skill is required!"); return; }


        const storedSectors = localStorage.getItem("sectors");
        if (!storedSectors) { errorToast("Skills required!"); return; }
        const parsedSectors = JSON.parse(storedSectors);
        if (parsedSectors[2].answer === "Yes") {
          // check if there is disabilities
          const storedDisabilities = localStorage.getItem("disabilities");
          if (!storedDisabilities) { errorToast("Pease select a disability!"); return; }
          const parsedDisabilities = JSON.parse(storedDisabilities);
          // Convert ["1", "5"] → { disability_id_1: 1, disability_id_5: 5 }
          const formattedDisabilities = Object.fromEntries(
            parsedDisabilities.map((id: any) => [`disability_id_${id}`, Number(id)])
          );

          appendData("disabilities", formattedDisabilities);
        }
        if (parsedSectors[3].answer === "Yes") {
          // check if there is disabilities
          const storedIPGroupId = localStorage.getItem("ipgroup_id");
          if (!storedIPGroupId) { errorToast("Pease select an IP Group!"); return; }
          const parsedIpGroupId = JSON.parse(storedIPGroupId);
          if (parsedIpGroupId === 0) { errorToast("Pease select an IP Group"); return; }
          appendData("ip_group_id", parsedIpGroupId);
        }


        const storedFamilyComposition = localStorage.getItem("family_composition");
        if (!storedFamilyComposition) { errorToast("Family composition is required!"); return; }
        const parsedFamilyComposition = JSON.parse(storedFamilyComposition);
        if (parsedFamilyComposition.family_composition.length <= 0) { errorToast("Family composition is required!"); return; }
        // console.log(parsedFamilyComposition.family_composition.length);


        const storedcfwGeneralInfo = localStorage.getItem("cfwGeneralInfo");
        if (!storedcfwGeneralInfo) { errorToast("Modality Sub category is required!"); return; }
        const parsedcfwGeneralInfo = JSON.parse(storedcfwGeneralInfo);


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

        // debugger;
        // optional to
        const storedHasProgramDetails = localStorage.getItem("hasProgramDetails");
        if (!storedHasProgramDetails) { errorToast("CFW Program details required!"); return; }
        // const parsedHasProgramDetails = JSON.parse(storedHasProgramDetails);
        if (storedHasProgramDetails === "yes") {
          const storedProgramDetails = localStorage.getItem("programDetails");
          if (!storedProgramDetails) { errorToast("CFW Program details required!"); return; }
          const parsedProgramDetails = JSON.parse(storedProgramDetails);
          appendData("program_details", parsedProgramDetails);

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
        errorToast("Please select a modality!");
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
  return (

    <Card>
      <CardHeader>
        <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
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
          {/* Card Container */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4  w-full ">

            {/* Image on top (Mobile) / Left (Desktop) */}
            <div className="flex-shrink-0 md:h-full lg:h-full">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-full">
                {/* Avatar - Center Horizontally & Vertically */}
                <div className="p-3 col-span-full flex justify-center items-center min-h-[250px]">
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
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-3 w-full">

              <div className="p-2">
                <Label htmlFor="modality_id" className="block text-sm font-medium mb-1  ">Select Modality<span className='text-red-500'> *</span> </Label>
                <FormDropDown

                  id="modality_id"
                  options={modalityOptions}
                  selectedOption={commonData.modality_id || ""}
                  onChange={handlModalityChange}
                // onChange={(e) => updatingCommonData("modality_id", e.target.id)}

                />
                {errors?.modality_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.modality_id}</p>
                )}
              </div>
              <div className={`p-2  ${commonData.modality_id !== undefined && commonData.modality_id === 25 ? "" : "hidden"}`}>
                <Label htmlFor="modality_sub_category_id" className="block text-sm font-medium mb-1">CFW Category<span className='text-red-500'> *</span></Label>
                <FormDropDown

                  id="modality_sub_category_id"
                  options={modalitySubCategoryOptions}
                  // selectedOption={selectedModalitySubCategoryId}
                  selectedOption={cfwGeneralInfo.modality_sub_category_id || ""}

                  onChange={handlModalitySubCategoryChange}

                />
                {errors?.modality_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.modality_id}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name<span className='text-red-500'> *</span></Label>
                <Input
                  value={commonData.first_name || ""}
                  // value={capturedData.common_data.first_name}
                  // onChange={(e) => updateCapturedData("common_data", 'first_name', e.target.value)}
                  onChange={(e) => updatingCommonData('first_name', e.target.value)}
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
                <Label htmlFor="middle_name" className="block text-sm font-medium mb-1">Middle Name 
                  {/* &nbsp;<input type='checkbox' />No Middle Name */}
                  </Label>
               
                <Input
                  // onBlur={handleBlur}
                  // onChange={(e) => updateCommonData('middle_name', e.target.value)}
                  value={commonData.middle_name || ""}
                  onChange={(e) => updatingCommonData('middle_name', e.target.value)}
                  // onChange={(e) => updateCapturedData("common_data", 'middle_name', e.target.value)}
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  placeholder="Enter your Middle Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="p-2"><Label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name<span className='text-red-500'> *</span></Label>
                <Input

                  value={commonData.last_name || ""}
                  onChange={(e) => updatingCommonData('last_name', e.target.value)}
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
                <Label htmlFor="extension_name" className="block text-sm font-medium mb-1 mb-1">Extension Name</Label>
                <FormDropDown

                  id="extension_name"
                  options={extensionNameOptions}
                  selectedOption={commonData.extension_name_id || ""}
                  onChange={handlExtensionNameChange}
                />
              </div>
              <div className="p-2">
                <Label htmlFor="sex_id" className="block text-sm font-medium mb-1">Sex<span className='text-red-500'> *</span></Label>
                <FormDropDown

                  id="sex_id"
                  options={sexOptions}
                  selectedOption={commonData.sex_id || ""}
                  // selectedOption={selectedSexId}
                  onChange={handleSexChange}
                />
                {errors?.sex_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.sex_id}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="civil_status_id" className="block text-sm font-medium mb-1">Civil Status<span className='text-red-500'> *</span></Label>
                <FormDropDown

                  id="civil_status_id"
                  options={civilStatusOptions}
                  // selectedOption={commonData.civil_status_id || ""}
                  selectedOption={commonData.civil_status_id || 2 || ""}
                  // selectedOption={selectedCivilStatusId}
                  onChange={handleCivilStatusChange}
                />
                {errors?.civil_status_id && (
                  <p className="mt-2 text-sm text-red-500">{errors.civil_status_id}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="birthdate" className="block text-sm font-medium mb-1">Birth Date<span className='text-red-500'> *</span></Label>
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
                  <p className="mt-2 text-sm text-red-500">{errors.birthdate}</p>
                )}

              </div>
              <div className="p-2">
                <Label htmlFor="age" className="block text-sm font-medium mb-1">Age<span className='text-red-500'> *</span></Label>
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
              <div className="p-2"><Label htmlFor="philsys_id_no" className="block text-sm font-medium mb-1">PhilSys ID Number</Label>
                <Input
                  // onChange={(e) => updateCommonData('philsys_id_no', e.target.value)}
                  type="text"
                  id="philsys_id_no"
                  name="philsys_id_no"
                  placeholder="0000-0000000-000"
                  maxLength={16} // 4 + 7 + 1 digits + 2 hyphens
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  // value={capturedData?.common_data?.philsys_id_no || ""}
                  value={commonData.philsys_id_no || ""}
                  onChange={(e) => updatingCommonData("philsys_id_no", e.target.value)}
                />
                {/* <PhilSysInput                        
                        /> */}
                {/* may id na sa component */}
                {errors?.philsys_id_no && (
                  <p className="mt-2 text-sm text-red-500">{errors.philsys_id_no}</p>
                )}
              </div>
              <div className="p-2">
                <Label htmlFor="birthplace" className="block text-sm font-medium mb-1">Birthplace <span className='text-red-500'> *</span></Label>
                <Textarea
                  value={commonData.birthplace || ""}
                  // value={capturedData.common_data.birthplace}
                  onChange={(e) => updatingCommonData('birthplace', e.target.value)}
                  // onChange={(e) => updateCapturedData("common_data", 'birthplace', e.target.value)}
                  // onChange={(e) => updateCommonData('first_name', e.target.value)}
                  // onBlur={handleBlur}
                  id="birthplace"
                  name="birthplace"
                  placeholder="Enter your Birthplace (Region, Province, Municipality and Barangay"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors?.birthplace && (
                  <p className="mt-2 text-sm text-red-500">{errors.birthplace}</p>
                )}
              </div>
            </div>

          </div>
        </div>





        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">


          {/* inputs */}





        </div>


        <div className="p-3 col-span-full">

          <FormTabs tabs={tabs} className={commonData.modality_id !== undefined ? "" : "hidden"} />
        </div>

      </CardContent>
      <CardFooter className="mt-10 pt-5 sticky bottom-0 bg-white shadow-md z-50">



        <div className="flex flex-col space-y-4">


          {/* Checkbox Section */}
          <div className='px-3'>
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
          </div>

          {/* Save Button Section */}
          <div className='px-3'>
            {/* <Button onClick={handleSubmit} disabled={!isAccepted || loading || btnToggle} > */}
            <Button onClick={handleSubmit} disabled={btnToggle} >
              {loading ? <Loader2 className={`animate-spin size-5 ${Number(selectedModalityId) === 25 ? "bg-cfw_bg_color text-black" : ""}`} /> : ""}
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
