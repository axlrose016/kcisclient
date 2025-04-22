"use client"; // Needed for Next.js App Router (Client Component)

import { PDFDocument, rgb } from "pdf-lib";

const GeneratePDF = () => {
  const generatePdf = async () => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // Set page size
    const { width, height } = page.getSize();

    // Load an image
    const imageUrl = "/images/cover_page.png"; // Replace with your image path
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(imageBytes);

    page.drawImage(pngImage, {
      x: 0,
      y: height - 595,
      width: width ,
      height: height 

    })

    // Draw text on the PDF
    page.drawText("AXL ROSE G. VILLANUEVA", {
      x: 550,
      y: 130,
      size: 12,
      color: rgb(0, 0, 0),
    });
// 1121 331
    // Save the document
    const pdfBytes = await pdfDoc.save();

    // Convert to Blob and create a downloadable link
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={generatePdf}>Download PDF</button>;
};

export default GeneratePDF;
