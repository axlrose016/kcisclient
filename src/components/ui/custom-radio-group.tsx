"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { v4 as uuidv4 } from 'uuid';
import { Badge } from "./badge";
import { Check, CircleCheck } from "lucide-react";

interface RadioOption {
    id: string | number
    name: string
}

interface CustomRadioGroupProps {
    options: RadioOption[]
    onChange?: (optionResponses: any[]) => void
    // onChange?: (optionResponses: Record<string | number, boolean>) => void
    values?: any[],
    created_by?: string;
    person_profile_id?: string;
    created_date?: string,
    user_id?: any,
    last_modified_by?: string,
    last_modified_date?: string,
    push_date?: string,
    push_status_id?: number,
    deleted_by?: string,
    deleted_date?: string,
    remarks?: string;
}

export function CustomRadioGroup({
    options, onChange, values, created_by, person_profile_id, created_date,
    user_id, last_modified_by, last_modified_date, push_date, push_status_id, deleted_by, deleted_date, remarks }: CustomRadioGroupProps) {
    const [responses, setResponses] = useState<Record<string | number, boolean>>({})

    useEffect(() => {
        debugger;
        const lsSec = localStorage.getItem("person_sectors")
        if (lsSec) {
            setResponses(JSON.parse(lsSec))
        }
    }, [values])

    const handleOptionChange = (Id: string | number, value: string) => {

        const newResponses = {
            ...responses,
            [Id]: value === "yes",
        }
        if (Id == 3) {
            if (value == "yes") {

                localStorage.setItem("isPWDSector", 'true');
            } else {
                localStorage.setItem("isPWDSector", 'false');

            }
        }

        setResponses(newResponses)

        onChange?.(Object.entries(newResponses).map((i) => (
            {

                "is_deleted": !i[1],
                "sector_id": i[0],
                "id": uuidv4(),
                "created_by": created_by,
                "person_profile_id": person_profile_id,
                "created_date": created_date,
                "user_id": user_id,
                "last_modified_by": null,
                "last_modified_date": null,
                "push_date": null,
                "push_status_id": 2,
                "deleted_by": null,
                "deleted_date": null,
                "remarks": "Person Profile Sector Created"


            }
        )))
    }

    return (
        < >
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  "> */}
            {options.map((option) => (

                // <div key={option.id} className="p-4">
                <div key={option.id} className="border rounded-lg p-5">
                    <div className="font-medium mb-3 flex items-center">
                        {/* <CircleCheck className="text-green-500 mr-2" /> */}
                        {option.name}
                    </div>

                    <RadioGroup

                        defaultValue={values?.find(i => i.sector_id.toString() == option.id.toString()) == null ? ""
                            : values?.find(i => i.sector_id.toString() == option.id.toString()).is_deleted ? "no" : "yes"}
                        onValueChange={(value) => handleOptionChange(option.id, value)}
                    >
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id={`${option.id}-yes`} />
                                <Label htmlFor={`${option.id}-yes`}>Yes
                                    {/* {JSON.stringify(values?.find(i => i.sector_id == option.id))} */}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id={`${option.id}-no`} />
                                <Label htmlFor={`${option.id}-no`}>No</Label>
                            </div>
                        </div>
                        {/* <div>
                            <Badge variant={"green"}>Selected</Badge>
                        </div> */}
                    </RadioGroup>
                </div>


            ))}
            {/* </div> */}
        </>
    )
}
