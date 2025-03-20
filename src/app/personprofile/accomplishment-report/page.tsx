"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

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

const baseUrl = 'personprofile/accomplishment-report'

export default function AccomplishmentReport() {

    const router = useRouter();
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [date, setDate] = React.useState<Date>(new Date())

    const formatDateRange = (start: string, end: string) => {
        const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const handlePrint = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        window.print();
    };

    const handleDownload = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        console.log('Download report:', id);
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        router.push(`${baseUrl}/${id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this report?')) {
            setReports(reports.filter(report => report.id !== id));
        }
    };

    const handleRowClick = (id: string) => {
        router.push(`/${baseUrl}/${id}`);
    };

    const handleNewReport = () => {
        router.push(`/${baseUrl}/new`);
    };

    const StatusBadge = ({ status }: { status: Report['status'] }) => (
        <span className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }
      `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );


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
                    <div className="max-w-6xl mx-auto">
                        <div className="min-h-screen">

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
                                    <Button onClick={handleNewReport} size="sm" className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                            </div>

                            <div className="mt-4 flex flex-col">
                                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-sm">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-black !text-white">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 border-r border-[#555555] text-left text-sm font-semibold">
                                                            Date Coverage
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left border-r border-[#555555] text-sm font-semibold">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left border-r border-[#555555] text-sm font-semibold">
                                                            Reviewed By
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left border-r border-[#555555] text-sm font-semibold">
                                                            Submitted Date
                                                        </th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                            <span className="sr-only">Actions</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {reports.map((report) => (
                                                        <tr
                                                            key={report.id}
                                                            onClick={() => handleRowClick(report.id)}
                                                            className="cursor-pointer hover:bg-gray-50"
                                                        >
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                                                <div className="flex items-center">
                                                                    <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                                                                    {formatDateRange(report.dateRange.start, report.dateRange.end)}
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <StatusBadge status={report.status} />
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {report.reviewedBy}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {report.submittedDate === '-' ? '-' : new Date(report.submittedDate).toLocaleDateString()}
                                                            </td>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        onClick={(e) => handleEdit(e, report.id)}
                                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handlePrint(e, report.id)}
                                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                                                                    >
                                                                        <Printer className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleDownload(e, report.id)}
                                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleDelete(e, report.id)}
                                                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}