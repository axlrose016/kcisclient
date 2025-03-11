"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uuid } from "drizzle-orm/pg-core";
import { useState, useEffect } from "react";
import { v4 } from "uuid";

export default function ClockInOut() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
    const [db, setDb] = useState<IDBDatabase | null>(null);
    const [worker, setWorker] = useState("");
    const [pw, setPw] = useState("");
    const [clockTime, setClockTime] = useState<Date | null>(null);


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
        else{
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
            <div className="p-6 rounded-xl shadow-lg text-center w-full max-w-6xl text-black">
                <div className="w-full flex justify-center">
                    <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto mb-3" />
                </div>
                <h1 className="text-2xl font-bold my-4">KAPIT BISIG LABAN SA KAHIRAPAN - COMPREHENSIVE AND INTEGRATED DELIVERY OF SOCIAL SERVICES (KALAHI-CIDSS)</h1>
                <h1 className="text-2xl font-bold my-4">CLOCK IN & OUT</h1>
                <p className="text-lg"><span className="font-mono text-6xl">{formatDateTime(currentTime)}</span></p>

                <div className="p-2 col-span-4 mt-5">
                    <Label htmlFor="username" className="block text-sm font-medium text-left">Enter Username<span className='text-red-500'> *</span></Label>
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 block w-full mb-2"
                        value={worker}
                        onChange={(e) => setWorker(e.target.value)}
                    // onChange={(e) => setFamilyMemberName(e.target.value)}
                    // value={familyMemberName}
                    />
                    <Label htmlFor="password" className="block text-sm font-medium text-left mt-5">Enter Password<span className='text-red-500'> *</span></Label>
                    <Input
                        type="text"
                        id="password"
                        name="password"
                        className="mt-1 block w-full mb-2"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                    // onChange={(e) => setFamilyMemberName(e.target.value)}
                    // value={familyMemberName}
                    />
                </div>
                {/* Clock In/Out Buttons */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={clockInClick}
                        // onClick={() => setClockInTime(new Date())}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold w-1/2"
                    >
                        Time
                    </button>
                    {/* <button
                        onClick={clockOutClick}
                        // onClick={() => setClockOutTime(new Date())}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold w-1/2"
                    >
                        Clock Out
                    </button> */}
                </div>

                {/* Display Clock In/Out Times */}
                {/* <div className="mt-6 text-lg">
          <p>🟢 Clock In: <span className="font-mono">{formatTime(clockInTime)}</span></p>
          <p>🔴 Clock Out: <span className="font-mono">{formatTime(clockOutTime)}</span></p>
        </div> */}
            </div>
        </div>
    );
}
