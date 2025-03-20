"use client";

import React, { useState } from 'react';
import { Clock, Plus, Trash2, Save, X, Printer, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from "@/components/ui/calendar"

interface TimeEntry {
    id: string;
    date: string;
    amArrival: string;
    amDeparture: string;
    pmArrival: string;
    pmDeparture: string;
    activity: string;
}

const emptyEntry: Omit<TimeEntry, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    amArrival: '',
    amDeparture: '',
    pmArrival: '',
    pmDeparture: '',
    activity: ''
};

export default function DailyTimeRecord() {
    const [entries, setEntries] = useState<TimeEntry[]>([

        {
            "id": "72bd5bb0-2d4f-4f87-8182-5032c13eab31",
            "date": "2020-03-11",
            "amArrival": "09:57",
            "amDeparture": "04:05",
            "pmArrival": "11:57",
            "pmDeparture": "18:43",
            "activity": "Consectetur sunt ut"
        },
        {
            "id": "c8c87d22-b5d8-4fe3-bb77-3cae60cd9162",
            "date": "2016-01-17",
            "amArrival": "08:15",
            "amDeparture": "21:22",
            "pmArrival": "05:37",
            "pmDeparture": "04:04",
            "activity": "Reprehenderit repre"
        },
        {
            "id": "0f8c8e67-04d4-46eb-84a9-ad208ecc2fa6",
            "date": "2017-10-06",
            "amArrival": "08:13",
            "amDeparture": "13:47",
            "pmArrival": "04:45",
            "pmDeparture": "13:34",
            "activity": "Tempora ratione aliq"
        }

    ]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
    const [date, setDate] = React.useState<Date>(new Date())

    const handleAddEntry = () => {
        const newEntry: TimeEntry = {
            id: crypto.randomUUID(),
            ...emptyEntry
        };
        console.log('newEntry', newEntry)
        setEntries([...entries, newEntry]);
        setEditingId(newEntry.id);
        setEditingEntry(newEntry);
    };

    const handleDeleteEntry = (id: string) => {
        setEntries(entries.filter(entry => entry.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setEditingEntry(null);
        }
    };

    const handleEdit = (entry: TimeEntry) => {
        setEditingId(entry.id);
        setEditingEntry({ ...entry });
    };

    const handleSave = () => {
        if (!editingEntry) return;

        if (!editingEntry.amArrival || !editingEntry.amDeparture ||
            !editingEntry.pmArrival || !editingEntry.pmDeparture ||
            !editingEntry.activity) {
            alert('Please fill in all fields');
            return;
        }

        setEntries(entries.map(entry =>
            entry.id === editingEntry.id ? editingEntry : entry
        ));
        setEditingId(null);
        setEditingEntry(null);
    };

    const handleCancel = () => {
        const isNewEntry = entries.find(e => e.id === editingId)?.amArrival === '';
        if (isNewEntry) {
            setEntries(entries.filter(e => e.id !== editingId));
        }
        setEditingId(null);
        setEditingEntry(null);
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
                        Daily Time Record
                    </div>
                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="min-h-screen">
                    <div className="max-w-6xl mx-auto">
                        <div className="rounded-lg">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    {/* <h2 className="text-xl font-semibold text-card-foreground">Time Entries</h2> */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button onClick={() => null} size="sm" className="flex items-center gap-2">
                                                <CalendarIcon />
                                                {date ? format(date, "MMMM yyyy") : <span>Select Date/Year</span>}
                                            </Button>

                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(selected_date) => {
                                                    console.log('s.date', selected_date)
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex items-center gap-2">
                                        <Button onClick={handleAddEntry} size="sm" className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button onClick={() => console.log('enteries', entries)} size="sm" className="flex items-center gap-2">
                                            <Printer className="h-4 w-4" />
                                        </Button>
                                    </div> 
                                </div>

                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-sm">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-black !text-white">
                                            <tr className="border-b">
                                                <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r border-[#555555]">Month</th> 
                                                <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r border-[#555555]">Day</th> 
                                                <th colSpan={2} className="px-4 py-2 text-center text-sm font-semibold border-r border-[#555555]">A.M.</th>
                                                <th colSpan={2} className="px-4 py-2 text-center text-sm font-semibold border-r border-[#555555]">P.M.</th>
                                                <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold border-r border-[#555555]">Remarks</th>
                                                <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold"></th>
                                            </tr>
                                            <tr className="border-b"> 
                                                <th className="px-4 py-2 text-left text-sm font-semibold border-r border-[#555555]">In</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold border-r border-[#555555]">Out</th> 
                                                <th className="px-4 py-2 text-left text-sm font-semibold border-r border-[#555555]">In</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold border-r border-[#555555]">Out</th> 
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {entries.map((entry) => (
                                                <tr key={entry.id} className="cursor-pointer hover:bg-gray-50">
                                                    {editingId === entry.id ? (
                                                        <>
                                                            <td className="p-1 border-r">
                                                                <div className="relative">
                                                                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                                    <Input
                                                                        type="date"
                                                                        value={editingEntry?.date}
                                                                        onChange={(e) => setEditingEntry(prev => prev ? { ...prev, date: e.target.value } : null)}
                                                                        className="pl-10"
                                                                    />
                                                                </div>
                                                            </td> 
                                                            <td className="p-1 border-r">
                                                                Monday
                                                            </td>
                                                            <td className="p-1 border-r">
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                                    <Input
                                                                        type="time"
                                                                        value={editingEntry?.amArrival}
                                                                        onChange={(e) => setEditingEntry(prev => prev ? { ...prev, amArrival: e.target.value } : null)}
                                                                        className="pl-10"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-1 border-r">
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                                    <Input
                                                                        type="time"
                                                                        value={editingEntry?.amDeparture}
                                                                        onChange={(e) => setEditingEntry(prev => prev ? { ...prev, amDeparture: e.target.value } : null)}
                                                                        className="pl-10"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-1 border-r">
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                                    <Input
                                                                        type="time"
                                                                        value={editingEntry?.pmArrival}
                                                                        onChange={(e) => setEditingEntry(prev => prev ? { ...prev, pmArrival: e.target.value } : null)}
                                                                        className="pl-10"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-1 border-r">
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                                    <Input
                                                                        type="time"
                                                                        value={editingEntry?.pmDeparture}
                                                                        onChange={(e) => setEditingEntry(prev => prev ? { ...prev, pmDeparture: e.target.value } : null)}
                                                                        className="pl-10"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-1 border-r">
                                                                <Input
                                                                    value={editingEntry?.activity}
                                                                    onChange={(e) => setEditingEntry(prev => prev ? { ...prev, activity: e.target.value } : null)}
                                                                    placeholder="Enter activity"
                                                                />
                                                            </td>
                                                            <td className="p-1">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={handleSave}
                                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                    >
                                                                        <Save className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={handleCancel}
                                                                        className="text-muted-foreground hover:text-muted-foreground/90 hover:bg-muted/50"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="p-1 text-sm border-r">{entry.date}</td>
                                                            <td className="p-1 text-sm border-r">Monday</td>
                                                            <td className="p-1 text-sm border-r">{entry.amArrival}</td>
                                                            <td className="p-1 text-sm border-r">{entry.amDeparture}</td>
                                                            <td className="p-1 text-sm border-r">{entry.pmArrival}</td>
                                                            <td className="p-1 text-sm border-r">{entry.pmDeparture}</td>
                                                            <td className="p-1 text-sm border-r">{entry.activity}</td>
                                                            <td className="p-1">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleEdit(entry)}
                                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                    >
                                                                        <Clock className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleDeleteEntry(entry.id)}
                                                                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}