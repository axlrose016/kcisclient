"use client"; // Needed for Next.js App Router (Client Component)
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";  // Import your Dexie instance
import { useEffect, useState } from "react";
import { getOfflineCivilStatusLibraryOptions, getOfflineExtensionLibraryOptions, getOfflineLibCFWType, getOfflineLibCourses, getOfflineLibEducationalAttainment, getOfflineLibIdCard, getOfflineLibRelationshipToBeneficiary, getOfflineLibSectorsLibraryOptions, getOfflineLibSexOptions, getOfflineLibTypeOfDisability, getOfflineLibTypeOfWork, getOfflineLibYearServed } from "../_dal/offline-options";
import { LibraryOption } from "../interfaces/library-interface";
import { IPersonProfile } from "../interfaces/personprofile";
import { getCFWTypeLibraryOptions } from "../_dal/options";
import Attachments from "@/app/personprofile/form/attachments";
import { array } from "zod";

const GeneratePDF = () => {
  const [extensionNames, setExtensionNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [isGenerated, setGenerated] = useState(false);
  const [profile, setProfile] = useState<IPersonProfile | null>(null);
  const reg = useState(false);

    const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;
    const cache: Record<string, any> = {};
    const [options, setOptions] = useState<Options>({ regions: [], provinces: [], municipalities: [], barangays: [] });
    
    interface Location {
      label: any;
      id: any,
      name: string
    }

    interface Options {
      regions: Location[];
      provinces: Location[];
      municipalities: Location[];
      barangays: Location[];
    }
    
    function newAbortSignal(timeoutMs: number) {
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), timeoutMs || 0);
      return abortController.signal;
    }
    
    const fetchData = async (key: string, endpoint: string,updateOptions: (data: any) => void): Promise<any> => {
      if (cache[key]) {
        return cache[key]; // Return cached data
      }
    
      try {
        const response = await fetch(endpoint, {
          // signal,
          headers: {
              Authorization: `Bearer ${KeyToken}`,
              "Content-Type": "application/json",
          }
        });
        if (!response.ok) throw new Error("Failed to fetch data");
    
        const data = await response.json();
        console.log("PSGC" + endpoint, data);
        cache[key] = data; // Cache the result
        return data;
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        return null;
      }
    };

    // const fetchRegion = async () => {
    //   fetchData("regions", "/api-libs/psgc/regions", (data) => {
    //         // console.log('LocationAreaSelections > regions', data)
    //         if (data?.status) {
    //             // Ensure the response has data and map it to LibraryOption format
    //             const mappedRegions: LibraryOption[] = data.data.map((item: any) => ({
    //                 id: item.code,         // Assuming 'id' exists in fetched data
    //                 name: item.name,     // Assuming 'name' exists in fetched data
    //             }));
    //             setOptions((prev) => ({ ...prev, regions: mappedRegions }))
    //         }
    //     });
    // };

    // useEffect(() => {
    //   fetchRegion();
    // }, []);

    // useEffect(() => {

    // //   const fetchRegion = async (): Promise<LibraryOption[]> => {
    // //     return new Promise((resolve, reject) => {
    // //         fetchData("regions", "/api-libs/psgc/regions", (data) => {
    // //             if (data?.status) {
    // //                 const filteredRegions: LibraryOption[] = data.data
    // //                     .filter((item: any) => item.region_code === profile?.region_code)
    // //                     .map((item: any) => ({
    // //                         id: item.code,
    // //                         name: item.name
    // //                     }));
    
    // //                 setOptions((prev) => ({ ...prev, regions: filteredRegions }));
    // //                 console.log("Filtered Regions:", filteredRegions);
    // //                 resolve(filteredRegions);  // ✅ Return the filtered regions
    // //             } else {
    // //                 reject("No data found or invalid response.");
    // //             }
    // //         });
    // //     });
    // // };
    

    // //   const fetchProvinces = async () => {
    // //     debugger;
    // //     if (!profile?.province_code) return; // Ensure province_code exists
  
    // //     try {
    // //       await fetchData(`provinces-${profile.region_code}`, `/api-libs/psgc/provincesByRegion?region=${profile.region_code}`, (data: any) => {
    // //         // console.log('LocationAreaSelections > provinces', data)
    // //         if (data?.status) {
    // //             const mappedProvince: LibraryOption[] = data.data.provinces.map((item: any) => ({
    // //                 id: item.code,         // Assuming 'id' exists in fetched data
    // //                 name: item.name,     // Assuming 'name' exists in fetched data
    // //             }));
    // //             setOptions((prev) => ({ ...prev, provinces: mappedProvince }))
    // //         }
    // //     }
    // //     );
    // //     } catch (error) {
    // //       console.error("Error fetching provinces:", error);
    // //     }
    // //   };

    // //   const fetchCity = async () => {
    // //     debugger;
    // //     if (!profile?.city_code) return; // Ensure city_code exists
  
    // //     try {
    // //       await fetchData(`muni-${profile.province_code}`, `/api-libs/psgc/municipalityByProvince?province=${profile.province_code}`, (data: any) => {
           
    // //         console.log('LocationAreaSelections > provinces', data)
    // //         if (data?.status) {
    // //             const mappedCity: LibraryOption[] = data.data.muni.map((item: any) => ({
    // //                 id: item.code,         // Assuming 'id' exists in fetched data
    // //                 name: item.name,     // Assuming 'name' exists in fetched data
    // //             }));
    // //             setOptions((prev) => ({ ...prev, muni: mappedCity }))
    // //         }
    // //     }
        
    // //     );
    // //     } catch (error) {
    // //       console.error("Error fetching city:", error);
    // //     }
    // //   };

    // //   const fetchBrgy = async () => {
    // //     debugger;
    // //     if (!profile?.brgy_code) return; // Ensure brgy_code exists
    
    // //     try {
    // //         await fetchData(`barangays-${profile.city_code}`, `/api-libs/psgc/barangayByMunicipality?municipality=${profile.city_code}`, (data: any) => {
    // //             console.log('LocationAreaSelections > muni', data)
    // //             if (data?.status) {
    // //                 const mappedBrgy: LibraryOption[] = data.data.barangays.map((item: any) => ({
    // //                     id: item.code,         // Assuming 'id' exists in fetched data
    // //                     name: item.name,       // Assuming 'name' exists in fetched data
    // //                 }));
    // //                 setOptions((prev) => ({ ...prev, barangays: mappedBrgy }))
    
    // //                 // Extracting brgy_name from mappedBrgy
    // //                 const brgyNames = mappedBrgy.map(brgy => brgy.name);
    // //                 console.log('Barangay Names:', brgyNames);
    // //             }
    // //         });
            
    // //     } catch (error) {
    // //         console.error("Error fetching barangay:", error);
    // //     }
    // // };
  
    //   debugger;
    //   const loadRegions = async () => {
    //     const regions = await fetchRegion();
    //     console.log("Region!!!!!!!", regions);  // This will properly log the filtered regions
    // };
    
    // loadRegions();
    //   // fetchProvinces();
    //   // fetchCity();
    //   // fetchBrgy();
    // }, [profile]);

    const testFetchRegion = async (region_code: string): Promise<LibraryOption[]> => {
      try {
          const regions: LibraryOption[] = [];
  
          fetchData("regions", "/api-libs/psgc/regions", (data) => {
              if (data?.status) {
                  const filteredRegions = data.data
                      // .filter((item: any) => item.region_code === region_code)
                      .map((item: any) => ({
                          id: item.code,
                          name: item.name
                      }));
  
                  console.log("Filtered Regions:", filteredRegions);
  
                  // ✅ Update state with filtered regions
                  setOptions((prev) => ({ ...prev, regions: filteredRegions }));
  
                  // Assign filtered regions for returning
                  regions.push(...filteredRegions);
              } else {
                  console.error("No data found or invalid response.");
              }
          });
  
          // ✅ Add slight delay to wait for asynchronous callback
          await new Promise((resolve) => setTimeout(resolve, 100));
  
          return regions;
  
      } catch (error) {
          console.error("Error fetching regions:", error);
          return [];  // Return an empty array on error
      }
  };
  
  

  const generatePdf = async () => {
    setGenerated(true);
    setLoading(true);
    
    try {
            // Fetch data from Dexie.js
            const personProfile = await dexieDb.person_profile.toArray();
            const firstProfile = personProfile[0]; // Use the first record for this example
            const firstProfile2 = personProfile[1];
            const firstProfile3 = personProfile[2];
            const firstProfile4 = personProfile[3];
            const firstProfile5 = personProfile[4];
            const firstProfile6 = personProfile[5];
            const firstProfile7 = personProfile[6];
            const firstProfile8 = personProfile[7];
            const firstProfile9 = personProfile[8];
            const firstProfile10 = personProfile[9];


            // const person_profile_id = await dexieDb.lib_id_card.toArray();
            // const person_id = person_profile_id[0];

            //Partisipasyon sa CFWF
            const cfw_fam_program = await dexieDb.person_profile_cfw_fam_program_details.toArray();
            const cfw_fam = cfw_fam_program[0];
            
            //Family member relationship
            const family_relation = await dexieDb.person_profile_family_composition.toArray();
            const family_relationProfile1 = family_relation[0];
            const family_relationProfile2 = family_relation[1];
            const family_relationProfile3 = family_relation[2];
            const family_relationProfile4 = family_relation[3];
            const family_relationProfile5 = family_relation[4];
            const family_relationProfile6 = family_relation[5];
            const family_relationProfile7 = family_relation[6];
            const family_relationProfile8 = family_relation[7];
            const family_relationProfile9 = family_relation[8];
            const family_relationProfile710 = family_relation[9];



            
  
            console.log(firstProfile);
            if (!firstProfile) {
              alert("No profile data found!");
              setLoading(false);
              return;
            }

           // setProfile(personProfile[0]);
            //debugger;


          /*  //--------------------------------------------------------------------------------------
            const region_list = await fetchData("region", "/api-libs/psgc/regions", (data) => {
              if (data?.status) {
                  const filteredRegions = data.data
                      .map((item: any) => ({
                          id: item.code,
                          name: item.name
                      }));
  
                  console.log("Filtered Regions:", filteredRegions);
  
                  // ✅ Update state with filtered regions
                  setOptions((prev) => ({ ...prev, regions: filteredRegions }));
  
                  // Assign filtered regions for returning
                  return filteredRegions
              } else {
                  console.error("No data found or invalid response.");
              }
            });

            if (region_list?.data) {
              const filteredRegion = region_list.data.filter((w: any) => w.code === firstProfile?.region_code);
              console.log("REGION:", filteredRegion[0].name);
            } else {
                console.error("No data found or invalid response.");
            }
          
          //--------------------------------------------------------------------------------------

        //    //--------------------------------------------------------------------------------------
       var profileProvince;
         const province_list = await fetchData(`provinces-${firstProfile.region_code}`, `/api-libs/psgc/provincesByRegion?region=${firstProfile.region_code}`, (data) => {
            if (data?.status) {
              const filteredProvinces = data.data
                  .map((item: any) => ({
                      id: item.code,
                      name: item.name
                  }));

              console.log("Filtered Provinces:", filteredProvinces);

              // ✅ Update state with filtered province
              setOptions((prev) => ({ ...prev, provinces: filteredProvinces }));

              // Assign filtered province for returning
              return filteredProvinces
          } else {
              console.error("No data found or invalid response.");
          }
          });

          if (province_list?.data) {
            const filteredProvince = province_list.data.provinces.filter((w: any) => w.region === firstProfile?.region_code);
            console.log("Province:", filteredProvince[0].name);
            profileProvince = filteredProvince[0].name;
          } else {
              console.error("No data found or invalid response.");
          }
        // //--------------------------------------------------------------------------------------

        
          //--------------------------------------------------------------------------------------
           var profileCity;
            const city_list = await fetchData(`muni-${firstProfile.province_code}`, `/api-libs/psgc/municipalityByProvince?province=${firstProfile.province_code}`, (data) => {
            if (data?.status) {
                const filteredCities = data.data
                    .map((item: any) => ({
                        id: item.code,
                        name: item.name
                    }));

                console.log("Filtered city:", filteredCities);

                // ✅ Update state with filtered regions
                setOptions((prev) => ({ ...prev, municipalities: filteredCities }));

                // Assign filtered province for returning
                return filteredCities
              
            } else {
                console.error("No data found or invalid response.");
            }
            });

            debugger;
            if (city_list?.data) {
              const filteredCity = city_list.data.municipalities.filter((w: any) => w.province === firstProfile?.province_code);
              console.log("City:", filteredCity[0].name);
              profileCity = filteredCity[0].name;
            } else {
                console.error("No data found or invalid response.");
            }
            //--------------------------------------------------------------------------------------

              
           //--------------------------------------------------------------------------------------
           var profileBrgy;
           const brgy_list = await fetchData(`barangays-${firstProfile.city_code}`, `/api-libs/psgc/barangayByMunicipality?municipality=${firstProfile.city_code}`, (data) => {
           if (data?.status) {
               const filteredBrgys = data.data
                   .map((item: any) => ({
                       id: item.code,
                       name: item.name
                   }));

               console.log("Filtered city:", filteredBrgys);

               // ✅ Update state with filtered regions
               setOptions((prev) => ({ ...prev, barangays: filteredBrgys }));

               // Assign filtered province for returning
               return filteredBrgys
             
           } else {
               console.error("No data found or invalid response.");
           }
           });

           debugger;
           if (brgy_list?.data) {
             const filteredBrgy = brgy_list.data.barangays.filter((w: any) => w.municipality === firstProfile?.city_code);
             console.log("City:", filteredBrgy[0].name);
             profileBrgy = filteredBrgy[0].name;
           } else {
               console.error("No data found or invalid response.");
           }
               */
           //--------------------------------------------------------------------------------------

            // Create a new PDF document
            const pdfDoc = await PDFDocument.create();
            const pages = Array.from({ length: 10 }, () => pdfDoc.addPage([842, 595]));
            const { width, height } = pages[0].getSize();

            // Embed images
            const imagePaths = [
              "/images/Page1.png",
              "/images/Page2.png",
              "/images/Page3.png",
              "/images/Page4.png",
              "/images/Page5.png",
              "/images/Page6.png",
              "/images/Page7.png",
              "/images/Page8.png",
              "/images/Page9.png",
              "/images/Page10.png"
            ];

            const images = await Promise.all(
              imagePaths.map(async (path) => {
                const imageBytes = await fetch(path).then((res) => res.arrayBuffer());
                return pdfDoc.embedPng(imageBytes);
              })
            );

            // Draw images on each page
            pages.forEach((page, index) => {
              page.drawImage(images[index], {
                x: 0,
                y: height - 595,
                width,
                height,
              });
            });

            // Draw text from Dexie data on the PDF
            let full_name = `${firstProfile.first_name}` + ` ` + `${firstProfile.middle_name}` + ` ` + `${firstProfile.last_name}`;
            let count_full_name_1 = (full_name.length);
            const date = new Date();
            const formatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
            const dateString = date.toLocaleDateString('en-US', options);  // "March 26, 2025"
            let civil = firstProfile.civil_status_id;
            let date_spilt = dateString.split(/,/);

            // PAGE 4 AND 7 OF THE PDF FILE =======================================================================================================
            const  get_id_card = await getOfflineLibIdCard();
            const id_map = Object.fromEntries(get_id_card.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
            setExtensionNames(id_map);
            const id_ext = id_map[firstProfile.id_card ?? 0] || ""; 
              
            //fullname
            pages[0].drawText(full_name.toUpperCase() , {
              x: 632.5 - (count_full_name_1 * 3),
              y: 122,
              size: 9,
              color: rgb(0, 0, 0),
            });

            let cfwp_id = 'KC25-00000001';
            let cfwp_id_count = (cfwp_id.length * 7) / 2;

            //cfwp_id
            pages[0].drawText(cfwp_id, {
              x: 645 - cfwp_id_count,
              y: 80,
              size: 9,
              color: rgb(0, 0, 0),
            });

            //date 
            pages[2].drawText(formatted.toString(), {
              x: 260,
              y: 540,
              size: 7,
              color: rgb(0, 0, 0),
            });

            pages[2].drawText(date_spilt[0].toString(), {
              x: 115,
              y: 425,
              size: 7,
              color: rgb(0, 0, 0),
            });
            const two_digit_year = date_spilt[1].toString().replace('20', ''); 
            pages[2].drawText(two_digit_year, {
              x: 173,
              y: 425,
              size: 7,
              color: rgb(0, 0, 0),
            });

            pages[2].drawText(`N/A`, {
              x: 270,
              y: 509,
              size: 7,
              color: rgb(0, 0, 0),
            });

            const count_full_name_3 = full_name.length;
            pages[2].drawText(full_name.toString().toLocaleUpperCase() , {
              x: 115 - (count_full_name_3 * 1.9),
              y: 307,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[2].drawText(cfwp_id, {
              x: 278 - cfwp_id_count,
              y: 13,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //Page 4 ----------------------------------------------------------------------------------------------------------------------------
              
            pages[3].drawText(cfwp_id, {
              x: 138 - cfwp_id_count,
              y: 540,
              size: 7,
              color: rgb(0, 0, 0),
            });
            
            pages[3].drawText(formatted.toString(), {
              x: 224,
              y: 540,
              size: 7,
              color: rgb(0, 0, 0),
            });
            // CFWP FOR HIGHER EDUCATION INSTITUTION
            pages[3].drawText('X', {
              x: 32.5,
              y: 491,
              size: 7,
              color: rgb(0, 0, 0),
            });
            // CFWP FOR ECONOMICALLY VULNERABLE COMMUNITIES AND SECTOR
            pages[3].drawText('', {
              x: 155,
              y: 491,
              size: 7,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${firstProfile.last_name.toString().toUpperCase()}`, {
              x: 29,
              y: 436,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${firstProfile.first_name.toString().toUpperCase()}`, {
              x: 141,
              y: 436,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${firstProfile.middle_name.toString().toUpperCase()}`, {
              x: 257,
              y: 436,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // NAME EXTENSION
            const extension_name = await getOfflineExtensionLibraryOptions();
            const ext_map = Object.fromEntries(extension_name.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
            setExtensionNames(ext_map);
            const name_ext = ext_map[firstProfile.extension_name_id ?? 0] || ""; 
            

            pages[3].drawText(`${name_ext}`, {
              x: 363,
              y: 436,
              size: 6,
              color: rgb(0, 0, 0),
            });

            

            //ADDRESS
            pages[3].drawText(`N?A`, {
              x: 50,
              y: 370,
              size: 6,
              color: rgb(0, 0, 0),
            });
         //-----------------------------------------------------------Address--------------------------------------------------------------------   
            //SITIO ADRRESS
            pages[3].drawText(`${'X'}`, {
              x: 29,
              y: 322,
              size: 6,
              color: rgb(0, 0, 0),
            });

            const str = firstProfile.birthplace;
            const chunkSize = 21;
            const result = [];

          for (let i = 0; i < str.length; i += chunkSize) {
              result.push(str.slice(i, i + chunkSize));
          }
          for(let i = 0; i < result.length; i++){
            pages[3].drawText(result[i].toString().toUpperCase(), {
              x: 29,
              y: 242 - (9 * i),
              size: 6,
              color: rgb(0, 0, 0),
            });
          }
          
            let occupation = firstProfile.current_occupation.toString().toUpperCase();
            let occupation_split = occupation.split(" ");
            //TRABAHO
            pages[3].drawText(`${occupation_split[0]}`, {
              x: 116,
              y: 242,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${occupation_split[1]}`, {
              x: 116,
              y: 233,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${occupation_split[2]}`, {
              x: 116,
              y: 224,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${occupation_split[3]}`, {
              x: 116,
              y: 215,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //IDENTIFICATION CARD
            let ID_INFO = id_ext + ' / ' +  firstProfile.occupation_id_card_number;
            pages[3].drawText(`${ID_INFO.toString().toUpperCase()}`, {
              x: 175,
              y: 242,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
            let bdate = `${firstProfile.birthdate}`;
            let res = bdate.split(/-/);

            pages[3].drawText(res[1], { 
              x: 39,
              y: 290,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(res[2], { 
              x: 74,
              y: 290,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(res[0], { 
              x: 105,
              y: 290,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //AGE
            pages[3].drawText(`${firstProfile.age}`, { 
              x: 144,
              y: 282,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
            const get_sex = await getOfflineLibSexOptions();
            const sex_map = Object.fromEntries(get_sex.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
            setExtensionNames(sex_map);
            const sex_ext = sex_map[firstProfile.sex_id ?? 0] || ""; 
            const sex_count = sex_ext.length;

            pages[3].drawText(sex_ext.toString().toUpperCase(), { 
              x: 195 - (sex_count * 1.9),
              y: 282,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(`${firstProfile.cellphone_no}`, { 
              x: 231,
              y: 293,
              size: 6,
              color: rgb(0, 0, 0),
            });

            let email_a = `${firstProfile.email}`;
            let email_split = email_a.split("@");

            pages[3].drawText(email_split[0], { 
              x: 316,
              y: 292,
              size: 6,
              color: rgb(0, 0, 0),
          
            });
            pages[3].drawText('@' + email_split[1], { 
              x: 316,
              y: 285,
              size: 6,
              color: rgb(0, 0, 0),
            });
            console.log(email_split[0])
        
            // CIVIL STATUS 
            const get_civil_status = await getOfflineCivilStatusLibraryOptions();
            const civil_map = Object.fromEntries(get_civil_status.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
            setExtensionNames(civil_map);
            const civil_ext = civil_map[firstProfile.civil_status_id ?? 0] || "";
            pages[3].drawText(civil_ext.toString().toUpperCase(), { 
              x: 283,
              y: 242,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // 4PS BENEFICIARIES
            pages[3].drawText('', { 
              x: 35,
              y: 158,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //SEKTOR
              const get_sector_status = await getOfflineLibSectorsLibraryOptions();
              const sector_map = Object.fromEntries(get_sector_status.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
              setExtensionNames(sector_map);
              const sector_ext = sector_map[firstProfile.extension_name_id ?? 0] || ""; 

            pages[3].drawText(sector_ext.toString().toUpperCase(), { 
              x: 32,
              y: 119,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
            //TYPE OF DISABILITY
              const get_disability_type = await getOfflineLibTypeOfDisability();
              const disability_map = Object.fromEntries(get_disability_type.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
              setExtensionNames(sector_map);
              const disability_ext = disability_map[firstProfile.push_status_id ?? 0] || ""; 

            //URI NG KAPANSANAN
            pages[3].drawText(disability_ext.toString().toUpperCase(), { 
              x: 232,
              y: 120.5,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // LEFT
            pages[3].drawText(cfwp_id, {
              x: 278 - cfwp_id_count,
              y: 13,
              size: 6,
              color: rgb(0, 0, 0),
            });
        
            //RIGHT
            pages[3].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 13,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //Page 5

            //----------------------------------------------------------------------------------------------------------------Page 5-----------------------------------------------------------------------------------------------------------
            //BUONG PANGALAN 1

            let family_member_name1 = family_relationProfile1.first_name.toString().toUpperCase().concat("  ", family_relationProfile1.middle_name.toString().toUpperCase(), "  ", family_relationProfile1.last_name.toString().toUpperCase());
            //let family_member_name2 = family_relationProfile2.first_name.toString().toUpperCase().concat("  ", family_relationProfile2.middle_name.toString().toUpperCase(), "  ", family_relationProfile2.last_name.toString().toUpperCase());
            pages[4].drawText(family_member_name1, {
              x: 510,
              y: 26,
              size: 5,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

            //  //BUONG PANGALAN 2
            // pages[4].drawText(family_member_name2, {
            //   x: 542,
            //   y: 26,
            //   size: 6,
            //   color: rgb(0, 0, 0),
            //   rotate: degrees(90)
            // });

            //BUONG PANGALAN 3
            pages[4].drawText('', {
              x: 572,
              y: 26,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

              //BUONG PANGALAN 4
              pages[4].drawText('x', {
                x: 603,
                y: 26,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

               //BUONG PANGALAN 5
               pages[4].drawText('x', {
                x: 636,
                y: 26,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

                //BUONG PANGALAN 6
                pages[4].drawText('x', {
                  x: 668,
                  y: 26,
                  size: 6,
                  color: rgb(0, 0, 0),
                  rotate: degrees(90)
                });

            //BUONG PANGALAN 7
            pages[4].drawText('x', {
              x: 699,
              y: 26,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

              //BUONG PANGALAN 8
              pages[4].drawText('x', {
                x: 731,
                y: 26,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

              
              //BUONG PANGALAN 9
              pages[4].drawText('x', {
                x: 763,
                y: 26,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

                  //BUONG PANGALAN 10
                  pages[4].drawText('x', {
                    x: 795,
                    y: 26,
                    size: 6,
                    color: rgb(0, 0, 0),
                    rotate: degrees(90)
                  });

                  const get_family_relation = await getOfflineLibRelationshipToBeneficiary();
                  const family_relation_map = Object.fromEntries(get_family_relation.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
                  setExtensionNames(family_relation_map);
                  const family_relation_ext = family_relation_map[family_relationProfile1.relationship_to_the_beneficiary_id ?? 0] || ""; 

          //RELASYON 1
            pages[4].drawText(`${family_relation_ext}`, {
              x: 510,
              y: 148,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

            
          //RELASYON 2
          pages[4].drawText('x', {
            x: 542,
            y: 148,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

          //RELASYON 3
          pages[4].drawText('x', {
            x: 572,
            y: 148,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

          //RELASYON 4
          pages[4].drawText('x', {
            x: 603,
            y: 148,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

             //RELASYON 5
             pages[4].drawText('x', {
              x: 636,
              y: 148,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

               //RELASYON 6
          pages[4].drawText('x', {
            x: 668,
            y: 148,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

               //RELASYON 7
               pages[4].drawText('x', {
                x: 699,
                y: 148,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

                   //RELASYON 8
          pages[4].drawText('x', {
            x: 731,
            y: 148,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

            //RELASYON 9
              pages[4].drawText('x', {
                x: 763,
                y: 148,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

            //RELASYON 10
          pages[4].drawText('x', {
            x: 795,
            y: 148,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

  

          //KAPANGANAKAN 1
          pages[4].drawText(`${family_relationProfile1.birthdate.toString().toUpperCase()}`, {
            x: 510,
            y: 208,
            size: 5,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

                
           //KAPANGANAKAN 2
          pages[4].drawText('x', {
            x: 542,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

             //KAPANGANAKAN 3
          pages[4].drawText('x', {
            x: 572,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

             //KAPANGANAKAN 4
          pages[4].drawText('x', {
            x: 603,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

              //KAPANGANAKAN 5
             pages[4].drawText('x', {
              x: 636,
              y: 208,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

                //KAPANGANAKAN 6
          pages[4].drawText('x', {
            x: 668,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

            //KAPANGANAKAN 7
            pages[4].drawText('x', {
            x: 699,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

          //KAPANGANAKAN 8
          pages[4].drawText('x', {
            x: 731,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

           //KAPANGANAKAN 9
              pages[4].drawText('x', {
                x: 763,
                y: 208,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

             //KAPANGANAKAN 10
          pages[4].drawText('x', {
            x: 795,
            y: 208,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });


          //EDAD 1
          pages[4].drawText(`${family_relationProfile1.age}`, {
            x: 510,
            y: 270,
            size: 5,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

               //EDAD 2 
            pages[4].drawText('x', {
              x: 542,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
  
                  //EDAD 3
            pages[4].drawText('x', {
              x: 572,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
  
                //EDAD 4
            pages[4].drawText('x', {
              x: 603,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
  
                  //EDAD 5
               pages[4].drawText('x', {
                x: 636,
                y: 270,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
  
                   //EDAD 6
            pages[4].drawText('x', {
              x: 668,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
  
                //EDAD 7
              pages[4].drawText('x', {
              x: 699,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
  
              //EDAD 8
            pages[4].drawText('x', {
              x: 731,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
  
                //EDAD 9
                pages[4].drawText('x', {
                  x: 763,
                  y: 270,
                  size: 6,
                  color: rgb(0, 0, 0),
                  rotate: degrees(90)
                });
  
                  //EDAD 10
            pages[4].drawText('x', {
              x: 795,
              y: 270,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
            const  get_educational_attainment = await getOfflineLibEducationalAttainment();
            const educational_attainment_map = Object.fromEntries(get_educational_attainment.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
            setExtensionNames(educational_attainment_map);
            const educational_attainment = educational_attainment_map[family_relationProfile1.highest_educational_attainment_id ?? 0] || ""; 

            //ANTAS NG EDUKASYON 1
            pages[4].drawText(`${educational_attainment.toString().toUpperCase()}`, {
              x: 510,
              y: 304,
              size: 5,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
       
            //ANTAS NG EDUKASYON 2
            pages[4].drawText('x', {
            x: 542,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

          //ANTAS NG EDUKASYON 3
          pages[4].drawText('x', {
            x: 572,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

          //ANTAS NG EDUKASYON 4
          pages[4].drawText('x', {
            x: 603,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

              //ANTAS NG EDUKASYON 5
              pages[4].drawText('x', {
              x: 636,
              y: 304,
              size: 6,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
          //ANTAS NG EDUKASYON 6
          pages[4].drawText('x', {
            x: 668,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

           //ANTAS NG EDUKASYON 7
            pages[4].drawText('x', {
            x: 699,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

          //ANTAS NG EDUKASYON 8
          pages[4].drawText('x', {
            x: 731,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });

              //ANTAS NG EDUKASYON 9
              pages[4].drawText('x', {
                x: 763,
                y: 304,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

          //ANTAS NG EDUKASYON 10
          pages[4].drawText('x', {
            x: 795,
            y: 304,
            size: 6,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
             //TRABAHO 1
             pages[4].drawText(`${family_relationProfile1.work?.toString().toUpperCase()}`, {
              x: 510,
              y: 374,
              size: 5,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

              //TRABAHO 2
              pages[4].drawText('x', {
                x: 542,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
              //TRABAHO 3
              pages[4].drawText('x', {
                x: 572,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
              //TRABAHO 4
              pages[4].drawText('x', {
                x: 603,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                 //TRABAHO 5
                  pages[4].drawText('x', {
                  x: 636,
                  y: 374,
                  size: 6,
                  color: rgb(0, 0, 0),
                  rotate: degrees(90)
                });
              //TRABAHO 6
              pages[4].drawText('x', {
                x: 668,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
               //TRABAHO 7
                pages[4].drawText('x', {
                x: 699,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
              //TRABAHO 8
              pages[4].drawText('x', {
                x: 731,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                 //TRABAHO 9
                  pages[4].drawText('x', {
                    x: 763,
                    y: 374,
                    size: 6,
                    color: rgb(0, 0, 0),
                    rotate: degrees(90)
                  });
    
              //TRABAHO 10
              pages[4].drawText('x', {
                x: 795,
                y: 374,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

            //BUWANANG KITA 1
            pages[4].drawText(`${family_relationProfile1.monthly_income}`, {
              x: 510,
              y: 438,
              size: 5,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });

                 //BUWANANG KITA 2
              pages[4].drawText('x', {
                x: 542,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                 //BUWANANG KITA 3
              pages[4].drawText('x', {
                x: 572,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                //BUWANANG KITA 4
              pages[4].drawText('x', {
                x: 603,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                   //BUWANANG KITA 5
                  pages[4].drawText('x', {
                  x: 636,
                  y: 438,
                  size: 6,
                  color: rgb(0, 0, 0),
                  rotate: degrees(90)
                });
                 //BUWANANG KITA 6
              pages[4].drawText('x', {
                x: 668,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                 //BUWANANG KITA 7
                pages[4].drawText('x', {
                x: 699,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                //BUWANANG KITA 8
              pages[4].drawText('x', {
                x: 731,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });
    
                   //BUWANANG KITA 9
                  pages[4].drawText('x', {
                    x: 763,
                    y: 438,
                    size: 6,
                    color: rgb(0, 0, 0),
                    rotate: degrees(90)
                  });
    
                 //BUWANANG KITA 10
              pages[4].drawText('x', {
                x: 795,
                y: 438,
                size: 6,
                color: rgb(0, 0, 0),
                rotate: degrees(90)
              });

             //NUMBER NG TELEPONO 1
             pages[4].drawText(`${family_relationProfile1.contact_number}`, {
              x: 510,
              y: 504,
              size: 5,
              color: rgb(0, 0, 0),
              rotate: degrees(90)
            });
    //NUMBER NG TELEPONO 2
    pages[4].drawText('x', {
      x: 542,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //NUMBER NG TELEPONO 3
    pages[4].drawText('x', {
      x: 572,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

   //NUMBER NG TELEPONO 4
    pages[4].drawText('x', {
      x: 603,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

        //NUMBER NG TELEPONO 5
        pages[4].drawText('x', {
        x: 636,
        y: 504,
        size: 6,
        color: rgb(0, 0, 0),
        rotate: degrees(90)
      });
    //NUMBER NG TELEPONO 6
    pages[4].drawText('x', {
      x: 668,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

      //NUMBER NG TELEPONO 7
      pages[4].drawText('x', {
      x: 699,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

    //NUMBER NG TELEPONO 8
    pages[4].drawText('x', {
      x: 731,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });

        //NUMBER NG TELEPONO 9
        pages[4].drawText('x', {
          x: 763,
          y: 504,
          size: 6,
          color: rgb(0, 0, 0),
          rotate: degrees(90)
        });

    //NUMBER NG TELEPONO 10
    pages[4].drawText('x', {
      x: 795,
      y: 504,
      size: 6,
      color: rgb(0, 0, 0),
      rotate: degrees(90)
    });
        

    
          

            //left
            pages[4].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 11,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //right 
            pages[4].drawText(cfwp_id, {
              x: 695 - cfwp_id_count,
              y: 11,
              size: 6,
              color: rgb(0, 0, 0),
            });
          
            let has_health_concern = firstProfile.has_immediate_health_concern;
            if(has_health_concern == true){
                pages[5].drawText('X', {
                  x: 33.5,
                  y: 522,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
                pages[5].drawText(`${firstProfile.immediate_health_concern}`, {
                  x: 174,
                  y: 527.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
            }else{        
                pages[5].drawText('X', {
                  x: 33.5,
                  y: 500.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
            }
            //TYPE OF CFWP 

            const get_cfw_type = await getCFWTypeLibraryOptions();
            const get_cfw_map = Object.fromEntries(get_cfw_type.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
            setExtensionNames(get_cfw_map);
            const cfw_familty_type1 = get_cfw_map[cfw_fam.program_type_id ?? 0] || ""; 

            const str_cfw = cfw_familty_type1;
            const charSize = 33;
            const cfw_result = [];

          for (let i = 0; i < str_cfw.length; i += chunkSize) {
              cfw_result.push(str_cfw.slice(i, i + charSize));
          }
          
          for(let i = 0; i < cfw_result.length; i++){
            pages[5].drawText(`${cfw_result[i].toString().toUpperCase()}`, {
              x:29,
              y: 410 - (9 * i),
              size: 5,
              color: rgb(0, 0, 0),
            });
          }

            //URI NG CFWP 1

            // pages[5].drawText(``, {
            //   x:29,
            //   y: 400,
            //   size: 5,
            //   color: rgb(0, 0, 0),
            // });

            //URI NG CFWP 2
            pages[5].drawText('N/A', {
              x:29,
              y: 392,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //URI NG CFWP 3
            pages[5].drawText('N/A', {
              x:29,
              y: 374,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //MIYEMBRO NG PAMILYA 1
            pages[5].drawText(`${family_relationProfile1.first_name.concat("  ", family_relationProfile1.middle_name, "  ", family_relationProfile1.last_name).toUpperCase()}`, {
              x: 133,
              y: 410,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //MIYEMBRO NG PAMILYA 2
            pages[5].drawText('N/A', {
              x: 133,
              y: 392,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //MIYEMBRO NG PAMILYA 3
            pages[5].drawText('N/A', {
              x: 133,
              y: 374,
              size: 6,
              color: rgb(0, 0, 0),
            });


            const get_year_serverd1 = await getOfflineLibYearServed();
            const year_served_map1 = Object.fromEntries(get_year_serverd1.map((Pid: { id: number; name: string }) => [Pid.id, Pid.name]));
            setExtensionNames(year_served_map1);

            const year_server_profiele1 = year_served_map1[cfw_fam.year_served_id ?? 0] || ""; 
            //TAON 1
            pages[5].drawText(`${year_server_profiele1}`, {
              x: 331,
              y: 410,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //TAON 2
            pages[5].drawText('N/A', {
              x: 331,
              y: 392,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //TAON 3
            pages[5].drawText('N/A', {
              x: 331,
              y: 374,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //PAARALAN
            pages[5].drawText(`${firstProfile.school_address.toUpperCase()}`, {
              x: 29,
              y: 342,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //MAIN CAMPUS
            pages[5].drawText('X', {
              x: 311,
              y: 338,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //OTHER CAMPUS
            pages[5].drawText('X', {
              x: 311,
              y: 322,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
              //ADDRESS NG PAARALAN
              pages[5].drawText(`${firstProfile.school_address.toUpperCase()}`, {
              x: 29,
              y: 291,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //KURSO
            const get_course = await getOfflineLibCourses();
            const course_map = Object.fromEntries(get_course.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
            setExtensionNames(course_map);
            const course_ext = course_map[firstProfile.course_id ?? 0] || ""; 
            pages[5].drawText(`${course_ext.toUpperCase()}`, {
              x: 29,
              y: 245,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //YEAR GRADUATED
              pages[5].drawText(`${firstProfile.year_graduated}`, {
              x: 219,
              y: 245,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //YEAR LEVEL
              pages[5].drawText('N/A', {
              x: 306,
              y: 245,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //let skills[5];
              let skills = firstProfile.skills.toString().toUpperCase().split(",");
              //MGA KAKAYAHAN 1
              
              pages[5].drawText(`${skills[0].toString()}`, {
                x: 29,
                y: 181.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

                //MGA KAKAYAHAN 2
                if(skills[1]){
                  pages[5].drawText(``, {
                    x: 29,
                    y: 161,
                    size: 6,
                    color: rgb(0, 0, 0),
                  });
                }
                else{
                  pages[5].drawText(`${skills[1]}`, {
                    x: 29,
                    y: 161,
                    size: 6,
                    color: rgb(0, 0, 0),
                  });
                }
               

                //MGA KAKAYAHAN 3
                pages[5].drawText(`${skills[2]}`, {
                x: 29,
                y: 139.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

              //MGA KAKAYAHAN 4
              pages[5].drawText(`${skills[3]}`, {
                x: 148,
                y: 181.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

                  //MGA KAKAYAHAN 5
                  pages[5].drawText(`${skills[4]}`, {
                  x: 148,
                  y: 161,
                  size: 6,
                  color: rgb(0, 0, 0),
                });

                  //MGA KAKAYAHAN 6
                pages[5].drawText(`${skills[5]}`, {
                  x: 148,
                  y: 139.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
                
                //CERTIFICATE OF ELIGIBILITY
                pages[5].drawText('', {
                  x: 386.5,
                  y: 151.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });

                //CERTIFICATE OF INDIGENCY
                pages[5].drawText('', {
                  x: 386.5,
                  y: 123.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });

                  //PROOF OF GRADUATION 
                  pages[5].drawText('', {
                    x: 386.5,
                    y: 93.5,
                    size: 6,
                    color: rgb(0, 0, 0),
                  });

          //PROOF OF ENROLLMENT
          pages[5].drawText('', {
            x: 386.5,
            y: 65.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

          //VALID OF IDENTIFICATION CARD
          pages[5].drawText('', {
            x: 386.5,
            y: 37.5,
            size: 6,
            color: rgb(0, 0, 0),
          });
          
          //NAME OF OFFICER AND ADDRESS
          let deployment_name_address = firstProfile.deployment_area_name + ' / ' + firstProfile.deployment_area_address
          pages[5].drawText(deployment_name_address.toUpperCase(), {
            x: 29,
            y: 107.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

          const get_type_of_work = await getOfflineLibTypeOfWork();
          const type_of_work_map = Object.fromEntries(get_type_of_work.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
          setExtensionNames(type_of_work_map);
          const type_of_work_ext = type_of_work_map[firstProfile.preffered_type_of_work_id ?? 0] || ""; 
          //PREFERRED TYPE OF WORK 

          
          pages[5].drawText(`${type_of_work_ext.toUpperCase()}`, {
            x: 29,
            y: 63.5,
            size: 6,
            color: rgb(0, 0, 0),
          });
              
            pages[5].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[5].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });
          /*

            // PAGE 6
            //MONTH
            pages[6].drawText(res[1], { 
              x: 451,
              y: 418,
              size: 6,
              color: rgb(0, 0, 0),
            });
            //DAY
            pages[6].drawText(res[2], { 
              x: 482,
              y: 418,
              size: 6,
              color: rgb(0, 0, 0),
            });
            //YEAR
            pages[6].drawText(res[0], { 
              x: 517,
              y: 418,
              size: 6,
              color: rgb(0, 0, 0),
            });
            //AGE
            pages[6].drawText(`${firstProfile.age}`, { 
              x: 563,
              y: 402,
              size: 6,
              color: rgb(0, 0, 0),
            });
            let gender = firstProfile.sex_id;
            //LALAKE
            if(gender == 2){
              pages[6].drawText('x', { 
                x: 590.5,
                y: 413.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            else{
              pages[6].drawText('', { 
                x: 590.5,
                y: 413.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }

            //BABAE
            if(gender == 1){
              pages[6].drawText('x', { 
                x: 590.5,
                y: 394,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', { 
                x: 590.5,
                y: 394,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }

            //CONTACT NUMBER
            pages[6].drawText(`${firstProfile.cellphone_no}`, { 
              x: 651,
              y: 417,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //RELASYON SA BENEPISYARYO
            pages[6].drawText('N/A', { 
              x: 723,
              y: 417,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //KASALUKUYANG TIRAHAN
            pages[6].drawText(`${firstProfile.sitio_present_address}`, { 
              x: 451,
              y: 452,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //LAST NAME
            pages[6].drawText(`${firstProfile.last_name.toUpperCase()}`, { 
              x: 451,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //FIRST NAME
            pages[6].drawText(`${firstProfile.first_name.toUpperCase()}`, { 
              x: 562,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //MIDDLE NAME
            pages[6].drawText(`${firstProfile.middle_name.toUpperCase()}`, { 
              x: 678,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //NAME EXT
            pages[6].drawText(`${name_ext}`, { 
              x: 784,
              y: 526,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //ANTAS NG EDUKASYON
            pages[6].drawText(`n`, {
              x: 451,
              y: 352,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //TRABAHO
              pages[6].drawText('N/A', {
                x: 651,
                y: 352,
                size: 6,
                color: rgb(0, 0, 0),
              });

              //BUWANANG KITA
              pages[6].drawText('N/A', {
                x: 722,
                y: 352,
                size: 6,
                color: rgb(0, 0, 0),
              });

            //SINGLE
            if(civil == 4){
              pages[6].drawText('x', {
                x: 466,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

            }
            else{
              pages[6].drawText('', {
                x: 466,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            

            //ANNULLED
            if(civil == 1)
            {
              pages[6].drawText('x', {
                x: 553.5,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 553.5,
                y: 277.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            

            //MARREID
            if(civil == 3){
              pages[6].drawText('x', {
                x: 466,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 466,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            

            //SEPARATED
            if(civil == 2){
              pages[6].drawText('x', {
                x: 553.5,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 553.5,
                y: 265,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
            //WIDOW / WIDOWER
            if(civil == 5){ 
              pages[6].drawText('x', {
                x: 466,
                y: 251.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }else{
              pages[6].drawText('', {
                x: 466,
                y: 251.5,
                size: 6,
                color: rgb(0, 0, 0),
              });
            }
              

            //COMMON LAW
            pages[6].drawText('', {
              x: 553.5,
              y: 251.5,
              size: 6,
              color: rgb(0, 0, 0),
            });
            
            //IDENTIFICATION CARD
              pages[6].drawText(`${ID_INFO.toString().toUpperCase()}`, {
                x: 651,
                y: 282,
                size: 6,
                color: rgb(0, 0, 0),
              });

            // Use the mapped name directly when drawing the PDF
              pages[6].drawText(`${firstProfile.representative_id_card_number}`, {
                x: 638,
                y: 282,
                size: 6,
                color: rgb(0, 0, 0),
              });
        
        
            // KAKAYAHAN NG KINATAWAN 1
            pages[6].drawText('N/A', {
              x: 451.5,
              y: 208,
              size: 6,
              color: rgb(0, 0, 0),
            });

              // KAKAYAHAN NG KINATAWAN 2
              pages[6].drawText('N/A', {
                x: 451.5,
                y: 187.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

              // KAKAYAHAN NG KINATAWAN 3
              pages[6].drawText('N/A', {
                x: 451.5,
                y: 165.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

              // KAKAYAHAN NG KINATAWAN 4
              pages[6].drawText('N/A', {
                x: 570,
                y: 208,
                size: 6,
                color: rgb(0, 0, 0),
              });

                // KAKAYAHAN NG KINATAWAN 5
                pages[6].drawText('N/A', {
                  x: 570,
                  y: 187.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });

                // KAKAYAHAN NG KINATAWAN 6
                pages[6].drawText('N/A', {
                  x: 570,
                  y: 165,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
              
            // oo
            pages[6].drawText('X', {
              x: 455.5,
              y: 98,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // hindi
            pages[6].drawText('X', {
              x: 573,
              y: 98,
              size: 6,
              color: rgb(0, 0, 0),
            });

            // please specify
            pages[6].drawText('N/A', {
              x: 535,
              y: 86,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //L/C/MSWDO
            pages[6].drawText('X', {
              x: 807.5,
              y: 150,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //BLGU
            pages[6].drawText('X', {
              x: 807.5,
              y: 123,
              size: 6,
              color: rgb(0, 0, 0),
            });

            //valid id of beneficiaries
            pages[6].drawText('X', {
              x: 807.5,
              y: 93,
              size: 6,
              color: rgb(0, 0, 0),
            }); 

            //valid id of representative
            pages[6].drawText('X', {
              x: 807.5,
              y: 64.5,
              size: 6,
              color: rgb(0, 0, 0),
            });
          

            //other submitted documents
            pages[6].drawText('X', {
              x: 807.5,
              y: 36.5,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[6].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[6].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });*/

            //eligible
            pages[7].drawText('X', {
              x: 38.5,
              y: 532,
              size: 9,
              color: rgb(0, 0, 0),
            });

            //ineligible
            pages[7].drawText('', {
              x: 223,
              y: 532,
              size: 9,
              color: rgb(0, 0, 0),
            });

            pages[7].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[7].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 12,
              size: 6,
              color: rgb(0, 0, 0),
            });

            let full_name_count_9 = full_name.length;
            pages[8].drawText( full_name.toString().toUpperCase(), {
              
              x: 535 - (full_name_count_9 * 1.9) ,
              y: 271,
              size: 6,
              color: rgb(0, 0, 0),

            });

            pages[8].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 15,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[8].drawText(cfwp_id, {
              x: 275 - cfwp_id_count,
              y: 15,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[9].drawText(cfwp_id, {
              x: 280 - cfwp_id_count,
              y: 15,
              size: 6,
              color: rgb(0, 0, 0),
            });

            
          /// Fetch data from Dexie.js
            const lib_card = await dexieDb.lib_relationship_to_beneficiary.toArray();
            const lcard = lib_card[0]; // Use the first record for this example
            console.log(lcard);

            // Save the document
            const pdfBytes = await pdfDoc.save();

            // Convert to Blob and create a downloadable link
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            
            // Create a Blob and open it in a new tab
            const blobUrl = URL.createObjectURL(blob);

          // Auto-open the PDF
            window.open(blobUrl, '_blank');
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "profile.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
      setGenerated(false);
    }
  };

    return (
      <div>
        <button onClick={generatePdf} disabled={loading}>
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    )
};
export default GeneratePDF;