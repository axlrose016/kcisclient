"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface dataI {
    id: string;
    date: string;
    hours: number;
    status: string;
}

const data = [
    {
        id: 'SF-123678',
        date: 'Jan 1-15, 2024',
        hours: 80,
        status: 'Completed'
    },
    {
        id: 'SF-12234',
        date: 'Jan 16-31, 2024',
        hours: 88,
        status: 'Completed'
    },
    {
        id: 'SF-23478',
        date: 'Feb 1-15, 2024',
        hours: 72,
        status: 'Pending'
    }
];

const baseUrl = 'personprofile/payroll'

export default function PayrollUser() {

    const params = useParams<{ list: string; id: string }>()
    const router = useRouter();


    const StatusBadge = ({ status }: { status: string }) => (
        <span className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-400'
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
                    <div className="flex text-lg items-center font-semibold mt-2 md:mt-0 gap-2">
                        <p>March 1-15 2025</p>
                    </div>
                </CardTitle>



            </CardHeader>
            <CardContent>

                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col min-h-screen">


                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                                <AvatarFallback>AF</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <h2 className="text-lg font-semibold">Jane Cooper</h2>
                                <p className="text-sm text-gray-500">Quezon City University</p>
                            </div>
                            <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                                <Printer className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            </Button>
                            
                        </div>

                        <div className="my-10 grid grid-cols-2 gap-2 text-center">
                            <div>
                                <p className="text-xl font-bold">146</p>
                                <p className="text-gray-500 text-sm">Working hours</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">14</p>
                                <p className="text-gray-500 text-sm">Overtime hours</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">2</p>
                                <p className="text-gray-500 text-sm">Sick days</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">3</p>
                                <p className="text-gray-500 text-sm">Days off</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <p><strong>Type:</strong> Hourly</p>
                            <p><strong>Period of :</strong> March 1 - 15, 2025</p>
                            <p><strong>Total Salary:</strong> 4,580</p>
                            <div className='flex gap-2 items-center'><p><strong>Payment date:</strong> March 15 2025</p> <StatusBadge status='completed' /></div>
                            <p><strong>Bank:</strong> Cash</p>
                            <p><strong>Bank Number:</strong> N/A</p>
                        </div>


                    </div>
                </div>
            </CardContent>
        </Card>

    );
}