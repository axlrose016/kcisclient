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
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, UploadIcon } from "lucide-react"

export default function RequirementsAttachment({ errors }: ErrorProps) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            const fileType = selectedFile.type
            if (fileType === "application/pdf" || fileType === "image/png" || fileType === "image/jpeg") {
                setFile(selectedFile)
                setError(null)
            } else {
                setFile(null)
                setError("Please select a PDF, PNG, or JPG file.")
            }
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }



    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 gap-4">

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Primary ID
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-secondary" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Secondary Government ID
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-health" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Health Declaration
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-school-id" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload School ID
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-cert-registration" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Certificate of Registration from School
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-tor-diploma" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload TOR/Diploma/Certification from the School Registrar
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-indigency" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Certificate of Indigency
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-1x1" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload 1x1 Picture
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-endorsement" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Endorsement Letter from SUC/LGU/MSWDO for PWD
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="file-upload-pwd-id" className="block text-sm font-medium text-gray-700 mb-2">
                            Upload PWD ID
                        </Label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={handleClick}
                        >
                            <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 10MB)</p>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        {file && (
                            <div className="mt-4 flex items-center p-2 bg-gray-100 rounded-md">
                                {file.type === "application/pdf" ? (
                                    <FileIcon className="h-6 w-6 text-blue-500 mr-2" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-green-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm mx-auto mt-4">
                        <Label htmlFor="pwd-id-number" className="block text-sm font-medium text-gray-700 mb-2">
                            PWD ID Number
                        </Label>
                        <Input
                            type="text"
                            id="pwd-id-number"
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>
            </div >


        </>
    )
}