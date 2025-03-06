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
import { Edit, Trash } from "lucide-react"

import { useState, useRef, useEffect, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, UploadIcon } from "lucide-react"
import { getFileToUploadLibraryOptions } from "@/components/_dal/options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOfflineLibFilesToUpload } from "@/components/_dal/offline-options";
export default function Attachments({ errors }: { errors: any }) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [filesToUploadOptions, setfilesToUploadOptions] = useState<LibraryOption[]>([]);
    const [selectedFileId, setSelectedFileId] = useState();
    const [selectedFile, setSelectedFile] = useState();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const files_upload = await getOfflineLibFilesToUpload(); //await getFileToUploadLibraryOptions();
                setfilesToUploadOptions(files_upload);

                const attachments = localStorage.getItem("attachments");
                // Check if attachments exist and contain data
                let parsedData = [];
                if (attachments) {
                    try {
                        parsedData = JSON.parse(attachments) || [];
                    } catch (error) {
                        console.error("Error parsing attachments:", error);
                        parsedData = [];
                    }
                }

                if (parsedData.length === 0) {
                    parsedData = files_upload.map(file => ({
                        id: file.id,          // ID from files_upload
                        file_to_upload: file.name, // File reference from library
                        file_name: "",        // Placeholder for file name
                        file_size: "",         // Placeholder for file size
                        file_path: ""
                    }));

                    // Save to localStorage
                    localStorage.setItem("attachments", JSON.stringify(parsedData));
                }

                // Update state
                setUploadedFiles(parsedData);



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
        // const selectedOption = event.target.options[selectedIndex]; // Get selected option
        // const id = Number(selectedOption.getAttribute("data-id")); // Retrieve id from data attribute
        // const value = selectedOption.textContent || ""; // Get text content

        // setFileToUpload(value);
        // setFileToUploadId(id);
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
        } else {
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

    return (
        <>


            <div className="p-2 sm:col-span-4">

                <div className="flex justify-end">




                    <Dialog modal={false}>
                        <DialogTrigger asChild>
                            <p className="border px-2 py-3 mr-2 cursor-pointer">
                                Attach a file
                            </p>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-left">Attach a file</DialogTitle>
                                <DialogDescription className="text-left">
                                    Please select the file you want to upload. Browse and choose the desired file, then click "Upload" to proceed.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2 md:grid-cols-1">
                                {/* <div className="mt-2">
                                    {fileInfo.file_path && (
                                        <><Avatar className="h-[100px] w-[100px]">
                                            <AvatarImage src={fileInfo.file_path} alt="KCIS" />
                                            <AvatarFallback>KC</AvatarFallback>
                                        </Avatar>
                                        </>
                                    )}
                                </div> */}
                                <div className="p-2 col-span-1">
                                    <Label htmlFor="select_file" className="block text-sm font-medium mb-2">What file to upload?</Label>

                                    <FormDropDown
                                        options={filesToUploadOptions}
                                        selectedOption={selectedFileId} // Pass the selected ID
                                        label="Select a file to upload."
                                        onChange={(e) => handleSelectFileChange(e)}
                                        // onChange={handleCFWTypeChange}
                                        id="select_file"
                                    />

                                    {errors?.select_file && (
                                        <p className="mt-2 text-sm text-red-500">{errors.select_file}</p>
                                    )}
                                </div>

                                <div className="mt-2 mx-2  h-32 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition">
                                    <label htmlFor="file-upload" className="text-gray-500 text-sm flex flex-col items-center cursor-pointer">
                                        📤 <span className="mt-1">Click to upload</span>
                                    </label>
                                    {/* 
                                    ID Number
                                    <Input
                                                    type="text"
                                                    id="family_member_contact_number"
                                                    name="family_member_contact_number"
                                                    className="mt-1 block w-full mb-2"
                                                    onChange={(e) => setfamilyMemberContactNumber(e.target.value)}

                                                /> */}
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileElementChange}
                                    />
                                    {fileInfo.name && (
                                        <div className="mt-2 text-sm text-gray-700 text-center">
                                            <p><strong>File:</strong> {fileInfo.name}</p>
                                            <p><strong>Size:</strong> {fileInfo.size}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveFileUpload}>Upload</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="p-2 col-span-4">
                    <Table className="border">
                        <TableHeader>
                            <TableRow key={0}>
                                <TableHead>Uploaded File</TableHead>
                                <TableHead>File Name</TableHead>
                                <TableHead>File Size</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uploadedFiles.length > 0 && uploadedFiles.some((f) => f.file_name !== "") ? (

                                uploadedFiles
                                    .filter((f) => f.file_name !== "")
                                    .map((f, index) => (
                                        <>
                                            <TableRow key={index}>
                                                <TableCell>{f.file_to_upload}</TableCell>
                                                <TableCell>{f.file_name}</TableCell>
                                                <TableCell>{f.file_size ? `${f.file_size} KB` : "N/A"}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => handleDeleteFileRecord(f.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <Trash className="w-4 h-4" />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Delete Record</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
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


        </>
    )
}