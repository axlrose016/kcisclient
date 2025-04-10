"use client";
import { FormTabs } from "@/components/forms/form-tabs"
import Person_profile from "./person_profile"
import React from "react"
import Assessment from "./assessment";
import WorkshiftAssignment from "./workshift_assignment";
import WorkPlan from "./work_plan";
import PersonProfileForm from "../../form/page";

export default function person_profile() {
    const [activeTab, setActiveTab] = React.useState("person_profile")
    const tabs = [
        {
            value: "person_profile",
            label: "Person Profile",
            icon: "user",
            content: (
                <div className="p-3 bg-card rounded-lg">
                    <Person_profile

                    />
                </div>
            ),
        },
        {
            value: "assessment",
            label: "Assessment and Eligibility",
            icon: "check_circle",
            content: (
                <div className="p-3 bg-card rounded-lg">
                    <Assessment

                    />
                </div>
            ),
        },
        {
            value: "workshift_assignment",
            label: "Workshift Assignment",
            content: (
                <div className="p-3 bg-card rounded-lg">
                    <WorkshiftAssignment

                    />
                </div>
            ),
        },
        {
            value: "work_plan",
            label: "Work Plan",
            content: (
                <div className="p-3 bg-card rounded-lg">
                    <WorkPlan

                    />
                </div>
            ),
        },
    ]
    return (

        <div className="p-3 col-span-full">

            <PersonProfileForm readonly={true}  />

            {/* <div className="flex items-center space-x-4 p-4 bg-card rounded-lg">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0">
           
                    <img
                        src="/path/to/image.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">John Doe</h2>
                    <p className="text-sm text-gray-600">Email: john.doe@example.com</p>
                    <p className="text-sm text-gray-600">Phone: +123456789</p>
                    <p className="text-sm text-gray-600">Address: 123 Main St, City, Country</p>
                </div>
            </div> */}

            <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            {/* <FormTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className={formData.modality_id !== undefined ? "" : "hidden"} /> */}
        </div>


    )

}