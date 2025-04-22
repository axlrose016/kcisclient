import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Check, Edit, Info, Trash, Upload } from "lucide-react"

import { useState, useRef, useEffect, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, UploadIcon } from "lucide-react"
import { getFileToUploadLibraryOptions } from "@/components/_dal/options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOfflineLibFilesToUpload } from "@/components/_dal/offline-options";
import localforage from "localforage";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";

import { IAttachments } from "@/components/interfaces/general/attachments";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
export default function Attachments({ errors, capturedData, updateFormData, session, user_id_viewing }: { errors: any; capturedData: Partial<IAttachments>[]; updateFormData: (newData: Partial<IAttachments>[]) => void; session: any, user_id_viewing: string }) {
    const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [filesToUploadOptions, setfilesToUploadOptions] = useState<LibraryOption[]>([]);
    const [selectedFileId, setSelectedFileId] = useState();
    const [selectedFile, setSelectedFile] = useState();

    const [attachmentsDexie, setAttachmentsDexie] = useState({});
    const [attachments, setAttachments] = useState<IAttachments[]>([]);
    const [attachmentNames, setAttachmentNames] = useState<Record<number, string>>({});


    let iflag = false;
    useEffect(() => {


        fetchAttachments();
    }, []);
    const fetchAttachments = async () => {
        // debugger;
        if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

        try {
            const allAttachments = await dexieDb.attachments.toArray();

            // Exclude file_ids 3, 6, and 8
            const filteredRecords = allAttachments.filter(
                (record) => ![3, 4, 5, 6, 9, 12].includes(Number(record.file_id))
            );
            setAttachments(allAttachments); // No error now
            // setAttachments(allAttachments); // No error now

            const files_to_upload = await getOfflineLibFilesToUpload();
            const attachment_map = Object.fromEntries(files_to_upload.map((ext: { id: number; name: string }) => [ext.id, ext.name]));
            setAttachmentNames(attachment_map);
            updateFormData(allAttachments);
            setAttachments(allAttachments);
            // debugger;
            if (!iflag) {
                console.log("✅ Attachments fetched:", filteredRecords);
                iflag = true;
                return; // Break the iteration
            }

        } catch (error) {
            console.error("❌ Error fetching attachments:", error);
        }
    };


    useEffect(() => {
        console.log("Attachments updated:", attachments);
    }, [attachments])



    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>, id: number) => {

        const file = e.target.files?.[0]; // Get the first selected file
        // alert(id)
        if (!file) return; // Exit if no file is selected           
        if (!id || typeof id !== "number") {
            console.warn("⚠️ Invalid file_id:", id);
            return;
        }
        try {
            if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

            // Create a Blob for the file
            const fileBlob = new Blob([file], { type: file.type });

            // Check if a record with the same file_id exists
            const existingRecord = await dexieDb.attachments
                .where("file_id") // Search by indexed field
                .equals(id)
                .first();
            // alert("Existing type is " + existingRecord);
            if (existingRecord) {
                // ✅ Modify existing record
                await dexieDb.attachments.update(existingRecord.id, {
                    file_name: file.name,
                    file_type: file.type,
                    file_path: fileBlob,
                    last_modified_date: new Date().toISOString()
                });
                console.log(`✅ Updated record for file_id: ${id}`);
            } else {
                // ✅ Add a new record if none exists


                await dexieDb.attachments.add({
                    id: crypto.randomUUID(), // Generate unique ID
                    record_id: crypto.randomUUID(),
                    module_path: "personprofile",
                    file_id: Number(id),
                    file_name: file.name,
                    file_type: file.type,
                    file_path: fileBlob,
                    created_date: new Date().toISOString(),
                    last_modified_date: null,
                    user_id: session.id ?? "",
                    created_by: session.userData.email ?? "", //for changing
                    last_modified_by: null,
                    push_status_id: 0,
                    push_date: null,
                    deleted_date: null,
                    deleted_by: null,
                    is_deleted: false,
                    remarks: null
                });
                console.log(`✅ Added new record for file_id: ${id}`);
            }

            e.target.value = "";
            fetchAttachments(); // Refresh the attachments list
        } catch (error) {
            console.error("⚠️ Error handling file upload:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const files_upload = await getOfflineLibFilesToUpload(); //await getFileToUploadLibraryOptions();
                // setfilesToUploadOptions(files_upload);

                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    type UploadedFile = {
        id: number; // or number
        file_to_upload: string;
        file_name: string;
        file_size: number;
        file: File;
        file_path: string;
    };

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);



    const [fileToUpload, setFileToUpload] = useState("");
    const [fileToUploadId, setFileToUploadId] = useState(0);
    const handleSelectFileChange = (id: number) => {
        const selectedIndex = id; // Get selected index

        setFileToUploadId(id);
        console.log("Selected id: " + selectedIndex);
        // console.log(`Selected File: ${value}, ID: ${id}`);
    };

    const [fileInfo, setFileInfo] = useState({ name: "", size: "", file_path: "" });

    const handleFileElementChange = (e: any) => {
        const file = e.target.files[0]; // Get the selected file
        // const fileUrl = URL.createObjectURL(file); // Generate a tempo

        if (file) {

            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert to Base64
            reader.onload = () => {
                const base64String = reader.result as string; // Get Base64 result

                setFileInfo({
                    name: file.name,
                    size: (file.size / 1024).toFixed(2),
                    file_path: base64String
                });
                // setDisplayPic(base64String);

                // Store the Base64 image in localStorage
                // localStorage.setItem(
                //     "attachments",
                //     JSON.stringify([{ file_path: base64String }])
                // );
            };
            reader.onerror = (error) => {
                console.error("Error converting file to Base64:", error);
            };

        }

        console.log("File name is " + file.name + " File size: " + file.size + " file path: " + fileInfo.file_path);
    };

    const handleSaveFileUpload = () => {
        debugger;
        const MAX_FILE_SIZE = 5; // * 1024 * 1024; // 50MB in bytes
        const fileSizeInMB = (Number(fileInfo.size) / 1024).toFixed(2);
        // console.log("File path " + fileInfo.file_path);
        if (fileToUploadId === 0 || fileToUploadId < 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select what file to upload."
            });
        }
        else if (fileInfo.name === "") {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a file to upload."
            });
        }
        else if (Number(fileSizeInMB) > MAX_FILE_SIZE) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "File size exceeds 5MB. Please select a smaller file.",
            });
        }
        else {
            console.log("File to upload ID " + fileToUploadId);
            console.log("File name  " + fileInfo.name);
            console.log("File size " + fileInfo.size);
            console.log("File path " + fileInfo.file_path);
            // Check if fileToUploadId exists in the array
            const updatedFiles = uploadedFiles.map((file: any) =>
                Number(file.id) === Number(fileToUploadId)
                    ? { ...file, file_name: fileInfo.name, file_size: fileInfo.size, file_path: fileInfo.file_path }
                    : file
            );
            console.log("Uploaded data: ", updatedFiles);
            // Update localStorage and state
            localStorage.setItem("attachments", JSON.stringify(updatedFiles));
            setUploadedFiles(updatedFiles);
            setFileToUploadId(0);
            setFileInfo({ name: "", size: "", file_path: "" });

            toast({
                variant: "green",
                title: "Success",
                description: "File to upload."
            });
        }

    }

    const handleDeleteFileRecord = (index: number) => {
        toast({
            variant: "destructive",
            title: "Are you sure?",
            description: "This action cannot be undone.",
            action: (
                <button
                    onClick={() => confirmDelete(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Confirm
                </button>
            ),
        });
    };



    const confirmDelete = (id: number) => {
        // Retrieve existing uploaded files from localStorage
        const storedFiles = localStorage.getItem("attachments");
        let uploadedFiles = storedFiles ? JSON.parse(storedFiles) : [];
        console.log("Uploaded files from Local Storage: ", uploadedFiles[id - 1]);
        // Find the file by ID (index) and reset file_name and file_size
        if (uploadedFiles[id - 1]) {
            uploadedFiles[id - 1].file_name = "";
            uploadedFiles[id - 1].file_size = "";
            uploadedFiles[id - 1].file_path = "";
        }

        // Update localStorage and state
        localStorage.setItem("attachments", JSON.stringify(uploadedFiles));
        setUploadedFiles([...uploadedFiles]); // Trigger re-render

        toast({
            variant: "green",
            title: "Success",
            description: "Record has been deleted!",
        });
    };

    // readonly when admin viewing 
    useEffect(() => {
        if (userIdViewing) {
            const form = document.getElementById("health_concern_info_form");
            if (form) {
                form.querySelectorAll("input, select, textarea, button, label").forEach((el) => {
                    el.setAttribute("disabled", "true");
                });
            }
        }
    }, [userIdViewing]);
    return (
        <div id="attachments_info_form">


            <div className="p-2 sm:col-span-4">


                <div className="p-2 col-span-4">
                    <div className="flex items-center space-x-2 p-5 bg-white shadow-md rounded-md mb-5">
                        {/* <Info className="w-5 h-5 text-blue-500" /> */}
                        <p className="text-xl text-black-500 flex items-center">
                            Click the upload icon to upload or change a file.
                        </p>
                    </div>
                </div>


                <div className="p-2 col-span-4">
                    <Table className={`min-w-[1000px] border ${userIdViewing ? "opacity-50 pointer-events-none" : ""}`}>
                        {/* <Table className="border"> */}

                        <TableHeader>
                            <TableRow key={0}>

                                <TableHead className="w-[10px]"><Check className="w-5 h-5 text-green-500" /></TableHead>
                                <TableHead>File to Upload</TableHead>
                                {/* <TableHead>File Name</TableHead>
                                <TableHead>File Size</TableHead> */}
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attachments.length > 0 ? (
                                attachments
                                    .filter((record) => ![5, 6, 12, 13].includes(record.file_id)) // Excludes 3, 4, and 7
                                    // .sort((a, b) => a.file_to_upload_name.localeCompare(b.file_to_upload_name))
                                    .map((f, index) => (

                                        <TableRow key={f.id}>
                                            <TableCell className="w-[10px]">
                                                {f.file_type !== "" ? <Check className="w-5 h-5 text-green-500" /> : ""}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {attachmentNames[f.file_id]}

                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-center items-center space-x-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <label htmlFor={`file-upload-${f.id}`} className="cursor-pointer text-blue-500 hover:text-blue-700">
                                                                    <Upload className="w-4 h-4" />
                                                                </label>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Upload a File</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <input
                                                        id={`file-upload-${f.id}`}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => handleUploadFile(e, Number(f.file_id))}
                                                        accept=".jpg,.png,.pdf" // Adjust as needed
                                                    />
                                                </div>
                                            </TableCell>


                                        </TableRow>

                                    ))
                            ) : (
                                <TableRow key={0}>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No Attachments.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>



                    </Table>
                </div>

            </div>


        </div>
    )
}