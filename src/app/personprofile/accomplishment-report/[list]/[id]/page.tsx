"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import DropAttachments from './DropAttachments';

interface Report {
    id: string;
    dateRange: {
        start: string;
        end: string;
    };
    status: 'draft' | 'submitted';
    reviewedBy: string;
    submittedDate: string;
}

const initialReports: Report[] = [
    {
        id: '1',
        dateRange: {
            start: '2024-03-01',
            end: '2024-03-15'
        },
        status: 'submitted',
        reviewedBy: 'John Smith',
        submittedDate: '2024-03-16'
    },
    {
        id: '2',
        dateRange: {
            start: '2024-03-16',
            end: '2024-03-31'
        },
        status: 'draft',
        reviewedBy: '-',
        submittedDate: '-'
    },
    {
        id: '3',
        dateRange: {
            start: '2024-02-15',
            end: '2024-02-29'
        },
        status: 'submitted',
        reviewedBy: 'Sarah Johnson',
        submittedDate: '2024-03-01'
    },
    {
        id: '4',
        dateRange: {
            start: '2024-02-01',
            end: '2024-02-14'
        },
        status: 'submitted',
        reviewedBy: 'Michael Brown',
        submittedDate: '2024-02-15'
    },
    {
        id: '5',
        dateRange: {
            start: '2024-04-01',
            end: '2024-04-15'
        },
        status: 'draft',
        reviewedBy: '-',
        submittedDate: '-'
    }
];


export default function AccomplishmentReportUser() {

    const router = useRouter();
    const params = useParams();

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2025, 2, 1),
        to: addDays(new Date(2025, 2, 1), 14),
    })

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
                        Accomplishment Report
                    </div>
                </CardTitle>



            </CardHeader>
            <CardContent>

                <div className="min-h-screen">

                    <div className='sm:flex items-center gap-2'>
                        <span>For the period of</span>
                        <div className='flex-1 flex items-center'>
                            <div className={cn("grid gap-2", '')}>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-[300px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "LLL dd, y")} -{" "}
                                                        {format(date.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(date.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            max={31}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="items-center flex flex-1 justify-end gap-2">
                                <Button onClick={() => null} size="sm" className="flex items-center gap-2">
                                    <Printer className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => null} size="sm" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 mt-6'>
                        <Textarea placeholder='Tasks/Deliverables based on the approved Authority to Adopt Work Arrangement/Work Schedule of MOA Workers/Additional Tasks or Assignments'></Textarea>
                        <Textarea placeholder='Actual Accomplishments'></Textarea>

                        <div className='flex gap-2 items-center my-1'>
                            <span>Inclusive dates:</span>  <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "LLL dd, y")} -{" "}
                                                    {format(date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Select Date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        max={31}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <DropAttachments onDropFiles={(files) => console.log('files', files)} />


                        <div className="flex items-center gap-2">
                            <Button onClick={() => null} size="sm" className="flex items-center gap-2">
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>


            </CardContent>
        </Card>

    );
}