"use client"; // Needed for Next.js App Router (Client Component)

import { PDFDocument, rgb } from "pdf-lib";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";  // Import your Dexie instance
import { useState } from "react";


const GeneratePDF = () => {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);

    try {
      // Fetch data from Dexie.js
      const personProfile = await dexieDb.person_profile.toArray();
      const firstProfile = personProfile[0]; // Use the first record for this example
      console.log(firstProfile);
      if (!firstProfile) {
        alert("No profile data found!");
        setLoading(false);
        return;

      }

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
 
      let date_spilt = dateString.split(/,/);

  
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

      pages[2].drawText('N/A', {
        x: 270,
        y: 509,
        size: 7,
        color: rgb(0, 0, 0),
      });

      pages[2].drawText(full_name , {
        x: 142 - count_full_name_1,
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

      pages[3].drawText('X', {
        x: 34,
        y: 491,
        size: 7,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText('X', {
        x: 155,
        y: 491,
        size: 7,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.last_name}`, {
        x: 29,
        y: 436,
        size: 6,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.first_name}`, {
        x: 141,
        y: 436,
        size: 6,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.middle_name}`, {
        x: 257,
        y: 436,
        size: 6,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.extension_name}`, {
        x: 363,
        y: 436,
        size: 6,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.sitio_current_address}`, {
           //--------------->
        x: 29,
        y: 370,
        size: 6,
        color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.sitio_current_address}`, {
     x: 29,
     y: 322,
     size: 6,
     color: rgb(0, 0, 0),
      });

      pages[3].drawText(`${firstProfile.birthplace}`, {
        x: 29,
        y: 242,
        size: 6,
        color: rgb(0, 0, 0),
         });

         
         pages[3].drawText(`${firstProfile.current_occupation}`, {
          x: 116,
          y: 242,
          size: 6,
          color: rgb(0, 0, 0),
           });

           pages[3].drawText(`${firstProfile.id_card}`, {
            x: 175,
            y: 242,
            size: 6,
            color: rgb(0, 0, 0),
             });

             pages[3].drawText(cfwp_id, {
              x: 278 - cfwp_id_count,
              y: 13,
              size: 6,
              color: rgb(0, 0, 0),
            });

            pages[3].drawText(cfwp_id, {
              x: 699 - cfwp_id_count,
              y: 13,
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

      // age
      pages[3].drawText(`${firstProfile.age}`, { 
        x: 144,
        y: 282,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //male
      pages[3].drawText(`x`, { 
        x: 172,
        y: 291,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //female
      pages[3].drawText(`x`, { 
        x: 172,
        y: 275,
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
  
   // civil status = single
      pages[3].drawText('x', { 
        x: 283,
        y: 238,
        size: 6,
        color: rgb(0, 0, 0),
      });

    // civil status = anulled
    pages[3].drawText('x', { 
      x: 347,
      y: 238,
      size: 6,
      color: rgb(0, 0, 0),
    });

    // civil status = married
    pages[3].drawText('x', { 
      x: 283,
      y: 224,
      size: 6,
      color: rgb(0, 0, 0),
    });
    // civil status = separated
    pages[3].drawText('x', { 
      x: 347,
      y: 224,
      size: 6,
      color: rgb(0, 0, 0),
    });

     // civil status = widow/widower
     pages[3].drawText('x', { 
      x: 283,
      y: 211,
      size: 6,
      color: rgb(0, 0, 0),
    });

    // civil status = common law
    pages[3].drawText('x', { 
      x: 347,
      y: 211,
      size: 6,
      color: rgb(0, 0, 0),
    });
    // 4ps = yes
    pages[3].drawText('x', { 
      x: 35,
      y: 158,
      size: 6,
      color: rgb(0, 0, 0),
    });
      // 4ps = No
      pages[3].drawText('x', { 
        x: 35,
        y: 146,
        size: 6,
        color: rgb(0, 0, 0),
      });
      //women
      pages[3].drawText('x', { 
        x: 33,
        y: 121.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //children
      pages[3].drawText('x', { 
        x: 79,
        y: 121.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //youth
      pages[3].drawText('x', { 
        x: 126.5,
        y: 121.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      // out of school youth
      pages[3].drawText('x', { 
        x: 168.5,
        y: 121.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //farmer
      pages[3].drawText('x', { 
        x: 33,
        y: 100.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //fisherfolk
      pages[3].drawText('x', { 
        x: 79,
        y: 100.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

        //laborer
        pages[3].drawText('x', { 
          x: 126.5,
          y: 100.5,
          size: 6,
          color: rgb(0, 0, 0),
        });
        //urban poor
        pages[3].drawText('x', { 
          x: 168.5,
          y: 100.5,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //pregnant women
        pages[3].drawText('x', { 
          x: 33,
          y: 87,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //senior citizen
        pages[3].drawText('x', { 
          x: 106.5,
          y: 87,
          size: 6,
          color: rgb(0, 0, 0),
        });
  
        //solo parent
        pages[3].drawText('x', { 
          x: 168.5,
          y: 87,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //person with disability
        pages[3].drawText('x', { 
          x: 33,
          y: 73,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //indegenous people
        pages[3].drawText('x', { 
          x: 124,
          y: 73,
          size: 6,
          color: rgb(0, 0, 0),
        });

         //family heads  in needs of assistance
         pages[3].drawText('x', { 
          x: 33,
          y: 59,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //children and youth in needs of assistanced
        pages[3].drawText('x', { 
          x: 33,
          y: 46,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //others
        pages[3].drawText('x', { 
          x: 33,
          y: 32,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //others
        pages[3].drawText('x', { 
          x: 61,
          y: 32,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //Psychosocial disability
        pages[3].drawText('x', { 
          x: 236,
          y: 120.5,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //Mental disability
        pages[3].drawText('x', { 
          x: 319,
          y: 120.5,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //chronic illness
        pages[3].drawText('x', { 
          x: 236,
          y: 107.5,
          size: 6,
          color: rgb(0, 0, 0),
        });

         //mental illness
         pages[3].drawText('x', { 
          x: 319,
          y: 107.5,
          size: 6,
          color: rgb(0, 0, 0),
        });
  
       //visual disability
       pages[3].drawText('x', { 
        x: 236,
        y: 93,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //physical illness
      pages[3].drawText('x', { 
        x: 319,
        y: 93,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //deaf
      pages[3].drawText('x', { 
        x: 236,
        y: 80,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //speach and language impairment
      pages[3].drawText('x', { 
        x: 319,
        y: 80,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //intellectual disability
      pages[3].drawText('x', { 
        x: 236,
        y: 59,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //Multiple disability
      pages[3].drawText('x', { 
        x: 319,
        y: 59,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //rare disease
      pages[3].drawText('x', { 
        x: 236,
        y: 46,
        size: 6,
        color: rgb(0, 0, 0),
      });

       //rare disease
       pages[3].drawText('x', { 
        x: 236,
        y: 46,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //others
      pages[3].drawText('x', { 
        x: 236,
        y: 32.5,
        size: 6,
        color: rgb(0, 0, 0),
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

      //YES
      pages[5].drawText('X', {
        x: 33.5,
        y: 522,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //NO
      pages[5].drawText('X', {
        x: 33.5,
        y: 500.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //IF YES, PLEASE SPECIFY
      pages[5].drawText('X', {
        x: 174,
        y: 527.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //URI NG CFWP 1
      pages[5].drawText('N/A', {
        x:29,
        y: 410,
        size: 6,
        color: rgb(0, 0, 0),
      });

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
      pages[5].drawText('N/A', {
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

      //TAON 1
      pages[5].drawText('N/A', {
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

      //PARAAN
      pages[5].drawText('N/A', {
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
         pages[5].drawText('N/A', {
          x: 29,
          y: 291,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //KURSO
        pages[5].drawText('N/A', {
          x: 29,
          y: 245,
          size: 6,
          color: rgb(0, 0, 0),
        });

         //YEAR GRADUATED
         pages[5].drawText('N/A', {
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

          //MGA KAKAYAHAN 1
          pages[5].drawText('N/A', {
            x: 29,
            y: 181.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

           //MGA KAKAYAHAN 2
           pages[5].drawText('N/A', {
            x: 29,
            y: 161,
            size: 6,
            color: rgb(0, 0, 0),
          });

           //MGA KAKAYAHAN 3
           pages[5].drawText('N/A', {
            x: 29,
            y: 139.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

          //MGA KAKAYAHAN 4
          pages[5].drawText('N/A', {
            x: 148,
            y: 181.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

             //MGA KAKAYAHAN 5
             pages[5].drawText('N/A', {
              x: 148,
              y: 161,
              size: 6,
              color: rgb(0, 0, 0),
            });

             //MGA KAKAYAHAN 6
           pages[5].drawText('N/A', {
            x: 148,
            y: 139.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

           //CERTIFICATE OF ELIGIBILITY
           pages[5].drawText('X', {
            x: 386.5,
            y: 151.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

          //CERTIFICATE OF INDIGENCY
          pages[5].drawText('X', {
            x: 386.5,
            y: 123.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

            //PROOF OF GRADUATION 
            pages[5].drawText('X', {
              x: 386.5,
              y: 93.5,
              size: 6,
              color: rgb(0, 0, 0),
            });

              //PROOF OF ENROLLMENT
              pages[5].drawText('X', {
                x: 386.5,
                y: 65.5,
                size: 6,
                color: rgb(0, 0, 0),
              });

                //VALID OF IDENTIFICATION CARD
                pages[5].drawText('X', {
                  x: 386.5,
                  y: 37.5,
                  size: 6,
                  color: rgb(0, 0, 0),
                });
    
  



          //NAME OF OFFICER AND ADDRESS
          pages[5].drawText('N/A', {
            x: 29,
            y: 107.5,
            size: 6,
            color: rgb(0, 0, 0),
          });

          //PREFERRED TYPE OF WORK 
          pages[5].drawText('N/A', {
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

      //LALAKE
      pages[6].drawText('x', { 
        x: 590.5,
        y: 413.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //BABAE
      pages[6].drawText('x', { 
        x: 590.5,
        y: 394,
        size: 6,
        color: rgb(0, 0, 0),
      });

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
      pages[6].drawText(`${firstProfile.sitio_current_address}`, { 
        x: 451,
        y: 452,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //LAST NAME
      pages[6].drawText(`${firstProfile.last_name}`, { 
        x: 451,
        y: 526,
        size: 6,
        color: rgb(0, 0, 0),
      });

       //FIRST NAME
       pages[6].drawText(`${firstProfile.first_name}`, { 
        x: 562,
        y: 526,
        size: 6,
        color: rgb(0, 0, 0),
      });

       //MIDDLE NAME
       pages[6].drawText(`${firstProfile.middle_name}`, { 
        x: 678,
        y: 526,
        size: 6,
        color: rgb(0, 0, 0),
      });

       //MIDDLE NAME
       pages[6].drawText(`${firstProfile.extension_name}`, { 
        x: 784,
        y: 526,
        size: 6,
        color: rgb(0, 0, 0),
      });


      //ANTAS NG EDUKASYON
      pages[6].drawText('N/A', {
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
       pages[6].drawText('x', {
        x: 466,
        y: 277.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

       //ANNULLED
       pages[6].drawText('x', {
        x: 553.5,
        y: 277.5,
        size: 6,
        color: rgb(0, 0, 0),
      });


       //MARREID
       pages[6].drawText('x', {
        x: 466,
        y: 265,
        size: 6,
        color: rgb(0, 0, 0),
      });

      //SEPARATED
      pages[6].drawText('x', {
        x: 553.5,
        y: 265,
        size: 6,
        color: rgb(0, 0, 0),
      });

         //WIDOW / WIDOWER
         pages[6].drawText('x', {
          x: 466,
          y: 251.5,
          size: 6,
          color: rgb(0, 0, 0),
        });

        //SEPARATED
      pages[6].drawText('x', {
        x: 553.5,
        y: 251.5,
        size: 6,
        color: rgb(0, 0, 0),
      });

        //IDENTIFICATION CARD
        pages[6].drawText('N/A', {
          x: 651,
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
      });

      //e;igible
      pages[7].drawText('X', {
        x: 38.5,
        y: 532,
        size: 9,
        color: rgb(0, 0, 0),
      });

      //ineligible
      pages[7].drawText('X', {
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

      pages[8].drawText(`${firstProfile.first_name}` + ` ` + `${firstProfile.middle_name}` + ` ` + `${firstProfile.last_name}`, {
        x: 492,
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
      
      let count_full_name_10 = (full_name.length * 7) / 2;
      pages[9].drawText(full_name, {
        x: 637 - count_full_name_10,
        y: 122,
        size: 9,
        color: rgb(0, 0, 0),
      });

      pages[9].drawText(cfwp_id, {
        x: 643 - cfwp_id_count,
        y: 78,
        size: 9,
        color: rgb(0, 0, 0),
      });

      // Fetch data from Dexie.js
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
    }
  };

  return (
    <div>
      <button onClick={generatePdf} disabled={loading}>
        {loading ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
};


export default GeneratePDF;
