"use client";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import { uuid } from "drizzle-orm/pg-core";
import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";

export default function ClockInOut() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
    const [db, setDb] = useState<IDBDatabase | null>(null);
    const [worker, setWorker] = useState("");
    const [pw, setPw] = useState("");
    const [clockTime, setClockTime] = useState<Date | null>(null);
    const [displayPic, setDisplayPic] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false); // Controls dialog visibility
    const [username, setUsername] = useState(""); // Username state
    const [password, setPassword] = useState(""); // Password state

    const [isTimeBtnDisabled, setIsTimeBtnDisabled] = useState(false); // Button time in/ out
    const [isConfirmBtnDisabled, setIsConfirmBtnDisabled] = useState(true); // Button confirm
    const usernameRef = useRef<HTMLInputElement>(null); // Reference for username input

    // Success Toast
    function successToast(msg: string) {
        toast({
            variant: "green",
            title: "Success!",
            description: msg,
            duration: 3000
        });

        setTimeout(() => {
            setUsername("");   // Clear username
            setPassword("");   // Clear password
            setIsTimeBtnDisabled(false); // Enable Time button
            setIsConfirmBtnDisabled(true); // Disable Confirm button
            setIsOpen(false); // Close dialog
        }, 3000);
    }
    // const handleTimeInOut = () => {
    //     setIsConfirmBtnDisabled(!isConfirmBtnDisabled);
    //     successToast("Time in/ out has been recorded!");
    // }
    // Error Toast
    function errorToast(msg: string) {
        toast({
            variant: "destructive",
            title: "Missing Required Fields",
            description: msg,
        });
    }

    // Time In/Out Handler
    const handleTimeClick = () => {
        if (username === "" || password === "") {
            errorToast("Username and/or Password required!");
            return;
        }

        setIsOpen(true); // Open dialog
        setIsTimeBtnDisabled(true); // Disable Time button
        setIsConfirmBtnDisabled(false); // Enable Confirm button
    };

    // Confirm Handler
    const handleTimeInOut = () => {
        setIsConfirmBtnDisabled(true); // Disable Confirm button after clicking
        successToast("Time in/out has been recorded!");
    };

    const accounts = [
        {
            id: "1",
            name: "John Doe",
            username: "johndoe",
            password: "pass123",
            cfw_type_id: 1, // Standard
            schedule: [
                { time_in: "08:00 AM", time_out: "12:00 PM" },
                { time_in: "01:00 PM", time_out: "05:00 PM" }
            ]
        },
        {
            id: "2",
            name: "Jane Smith",
            username: "janesmith",
            password: "secure456",
            cfw_type_id: 1, // Standard
            schedule: [
                { time_in: "09:00 AM", time_out: "12:00 PM" },
                { time_in: "01:00 PM", time_out: "06:00 PM" }
            ]
        },
        {
            id: "3",
            name: "Mike Johnson",
            username: "mikej",
            password: "mike789",
            cfw_type_id: 1, // Standard
            schedule: [
                { time_in: "07:30 AM", time_out: "12:00 PM" },
                { time_in: "01:00 PM", time_out: "04:30 PM" }
            ]
        },
        {
            id: "4",
            name: "Emily Davis",
            username: "emilyd",
            password: "flexi123",
            cfw_type_id: 2, // Flexi
            flexi_schedule: [
                { time_in: "09:15 AM", time_out: "11:45 AM" },
                { time_in: "12:30 PM", time_out: "03:00 PM" },
                { time_in: "04:00 PM", time_out: "06:30 PM" }
            ]
        },
        {
            id: "5",
            name: "Chris Wilson",
            username: "chrisw",
            password: "time456",
            cfw_type_id: 2, // Flexi
            flexi_schedule: [
                { time_in: "08:45 AM", time_out: "10:30 AM" },
                { time_in: "11:15 AM", time_out: "02:45 PM" },
                { time_in: "03:30 PM", time_out: "05:15 PM" }
            ]
        },
        {
            id: "6",
            name: "Sarah Brown",
            username: "sarahb",
            password: "brown789",
            cfw_type_id: 2, // Flexi
            flexi_schedule: [
                { time_in: "10:00 AM", time_out: "12:00 PM" },
                { time_in: "01:15 PM", time_out: "03:45 PM" },
                { time_in: "04:30 PM", time_out: "07:00 PM" }
            ]
        }
    ];


    console.log(accounts);



    useEffect(() => {
        const request = indexedDB.open("clock", 2);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("attendance")) {
                db.createObjectStore("attendance", { keyPath: "id" });
                console.log("Object store 'attendance' created!");
            }
        };

        request.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            setDb(db); // Store the opened database in state
            console.log("IndexedDB: 'clock' database opened successfully");
        };

        request.onerror = (event) => {
            console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
        };

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval)
    }, []);

    // Format time function
    const formatTime = (time: Date | null) => {
        return time ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) : "--:--:--";
    };

    const formatDateTime = (time: Date | null) => {
        return time
            ? time.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            })
            : "--/--/---- --:--:--";
    };



    const clockInClick = () => {

        // Find the user in the accounts array
        const user = accounts.find(acc => acc.username === worker && acc.password === pw);

        if (!user) {
            console.error("Invalid username or password.");
            return;
        }
        else {
            console.log("Access Granted!");
            return;
        }
        if (!db) {
            console.error("Database not initialized.");
            return;
        }
        // debugger;

        // const transaction = db.transaction("attendance", "readwrite");
        // const store = transaction.objectStore("attendance");

        // const now = new Date();
        // const ids = crypto.randomUUID(); // Generate a unique string ID

        // let name = "Unknown";
        // if (typeof worker === "string") {
        //     name = worker;
        // } else if (worker && typeof worker === "object" && "name" in worker) {
        //     name = worker; // Extract only the needed property
        // }

        // const attendanceRecord = {
        //     id: ids,
        //     name: name,
        //     clock: now,
        //     tag: "",
        //     status: ""
        // }
        // // const attendanceRecord = { id: ids, name: name, clock: now };
        // store.add(attendanceRecord);

        // console.log("Clock-in recorded:", attendanceRecord);

        // transaction.oncomplete = () => {
        //     console.log("Transaction completed.");
        // };

        // transaction.onerror = (event) => {
        //     console.error("Transaction error:", event);
        // };
    };

    const clockOutClick = () => {
        const now = new Date();
        setClockOutTime(now)
        // alert(clockInTime);
    }

    useEffect(() => {

        if (clockInTime) {
            alert(`Clock-in time: ${clockInTime.toLocaleTimeString()}`);
        }
    }, [clockInTime]);

    useEffect(() => {
        if (clockOutTime) {
            alert(`Clock-out Time: ${clockOutTime.toLocaleTimeString()}`);
        }
    }, [clockOutTime])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <div className="p-6 rounded-xl shadow-lg text-center w-full max-w-6xl text-black ">
                <div className="w-full flex justify-center">
                    <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto mb-3" />
                </div>
                <h1 className="text-2xl font-bold my-4">KAPIT BISIG LABAN SA KAHIRAPAN - COMPREHENSIVE AND INTEGRATED DELIVERY OF SOCIAL SERVICES (KALAHI-CIDSS)</h1>
                <h1 className="text-2xl font-bold my-4">TIME IN/ OUT</h1>
                <p className="text-lg"><span className="font-mono text-cfw_bg_color text-6xl">{formatDateTime(currentTime)}</span></p>

                <div className="p-2 col-span-4 mt-5 w-1/2 mx-auto">
                    <div className="flex flex-col items-center w-full">


                        {/* Username Field */}
                        <Label htmlFor="username" className="block text-sm font-medium text-left mt-5">
                            Enter Username<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            ref={usernameRef} // Attach the ref
                            type="text"
                            id="username"
                            name="username"
                            className="mt-1 block w-full mb-2 text-center bg-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {/* Password Field */}
                        <Label htmlFor="password" className="block text-sm font-medium text-left mt-5">
                            Enter Password<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full mb-2 text-center text-4xl"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Clock In/Out Buttons */}
                <div className="mt-6 flex justify-center items-center pb-5 w-full">


                    <Dialog modal={false} open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) {
                            setTimeout(() => {
                                usernameRef.current?.focus(); // Focus on username input when dialog closes
                            }, 100);
                            setIsTimeBtnDisabled(false); // Re-enable Time button when dialog closes
                            setIsConfirmBtnDisabled(true); // Reset Confirm button to disabled
                        }
                    }}>
                        {/* TIME Button */}
                        <DialogTrigger asChild>
                            <p
                                onClick={handleTimeClick}
                                className={`bg-cfw_bg_color hover:bg-green-700 cursor-pointer px-1 py-3 rounded-lg text-white font-semibold w-1/2 text-2xl text-center 
                    ${isTimeBtnDisabled ? "pointer-events-none opacity-50" : ""}`}
                            >
                                TIME
                            </p>
                        </DialogTrigger>

                        {/* Dialog Content */}
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                {/* Title */}
                                <DialogTitle className="text-center text-2xl font-bold text-red-600 mb-4">
                                    Confirm Time In/Out
                                </DialogTitle>

                                {/* Noticeable Description */}
                                <DialogDescription className="text-center mt-3 bg-yellow-200 border-l-8 border-yellow-500 text-yellow-900 p-5 rounded-md shadow-md">
                                    <strong>⚠️ Attention:</strong> Please verify if this is your image. If correct, click the
                                    <strong> Confirm </strong> button to proceed.
                                </DialogDescription>
                            </DialogHeader>

                            {/* Centered Avatar, Name, and CFW ID */}
                            <div className="flex flex-col items-center justify-center gap-1 mt-4">
                                <Avatar className="h-[200px] w-[200px]">
                                    <AvatarImage src="/images/sample_picture.jpg" alt="Display Picture" />
                                </Avatar>
                                <p className="text-lg font-semibold text-center">ANGEL LOCSIN</p>
                                <p className="text-sm text-gray-600 text-center">CFW ID: 123456789</p>
                            </div>

                            {/* Confirm Button */}
                            <DialogFooter className="flex justify-center mt-4">
                                <Button
                                    onClick={handleTimeInOut}
                                    disabled={isConfirmBtnDisabled}
                                    className={`w-full text-white font-bold text-xl py-3 rounded-lg shadow-lg transition-all duration-200
                        ${isConfirmBtnDisabled ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-orange-600 hover:bg-green-700"}`}
                                >
                                    CONFIRM
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>

 
            </div>
        </div>
    );
}
