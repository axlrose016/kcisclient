"use client"
// import beneficiaries from './beneficiaries.json'
import { useEffect, useState } from "react"
import { Save, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
// import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Toast } from "@/components/ui/toast"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion";
import Wizard from "../wizard"
// Define the task type
interface WorkPlanTasks {
    id: string
    work_plan_id: string
    category_id: string //task type: 1 general, 2 specific
    activities_tasks: string
    expected_output: string
    timeline_from: string
    timeline_to: string
    assigned_person_id: string
}

interface WorkPlanProps {
    id: string;
    work_plan_title: string;
    immediate_supervisor_id: string;
    deployment_area_name: string;
    office_name: string;
    no_of_days_program_engagement: number;
    approved_work_schedule_from: string;
    approved_work_schedule_to: string;
    objectives: string;


}

type Beneficiary = {
    id: string
    full_name: string
    course_name: string
    school_name: string
    status_name: string
    // is_selected: string
}
import LoginService from "@/components/services/LoginService";
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client'
import { useParams } from "next/navigation"
const _session = await getSession() as SessionPayload;
export default function CreateWorkPlanPage() {
    const params = useParams();
    const idParam = params && 'id' in params ? params.id : undefined;
    const stringWorkPlanId = Array.isArray(idParam) ? idParam[0] : idParam || '';
    const [personProfileId, setPersonProfileId] = useState<string>("")
    const [deploymentAreaId, setDeploymentAreaId] = useState(0)
    const [deploymentAreaCategoryId, setDeploymentAreaCategoryId] = useState<string>("")
    // Load beneficiaries from JSON
    // const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>(beneficiaries) //default using json file
    const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>([])
    // const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>([])
    const [deploymentAreaName, setDeploymentAreaName] = useState("")
    const [workPlanData, setWorkPlanData] = useState<WorkPlanProps>({
        id: "",
        work_plan_title: "",
        immediate_supervisor_id: _session.id,
        deployment_area_name: deploymentAreaName,
        office_name: "",
        no_of_days_program_engagement: 0,
        approved_work_schedule_from: "",
        approved_work_schedule_to: "",
        objectives: "",

    })

    useEffect(() => {

        // Fetch task management data from local storage or server if needed
        const lsWorkPlanData = localStorage.getItem("work_plan")
        let wpIdfromLs = ""
        if (lsWorkPlanData) {
            const parsedTM = JSON.parse(lsWorkPlanData) as WorkPlanProps
            wpIdfromLs = parsedTM.id
            console.log("✨Work Plan: ", parsedTM)
            setWorkPlanData(parsedTM)
        } else {
            localStorage.setItem("work_plan", JSON.stringify(workPlanData))
        }


        async function getWorkPlanTask() {
            try {
                debugger;
                const email = "dsentico@dswd.gov.ph";
                const password = "Dswd@123";

                const onlinePayload = await LoginService.onlineLogin(email, password);
                const token = onlinePayload.token;

                const wpTasksResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan_task/view/${wpIdfromLs}/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!wpTasksResponse.ok) {
                    const errorData = await wpTasksResponse.json();
                    console.error("❌ Failed to load work plan tasks:", errorData);
                    return;
                }

                const wpTaskResult = await wpTasksResponse.json();
                localStorage.setItem("work_plan_tasks", JSON.stringify(wpTaskResult))
                console.log("📅Work Plan Tasks:", wpTaskResult);


            } catch (error: any) {
                if (error.name === "AbortError") {
                    console.warn("🚫 Request canceled:", error.message);
                } else {
                    console.error("🔥 Unexpected error:", error);
                }
            }
        }
        getWorkPlanTask()
        // search for work_plan_extended
        // debugger
        // const lswpe = localStorage.getItem("work_plan_extended")
        // const workPlanId = localStorage.getItem("current_work_plan_id"); // or use your variable

        // if (lswpe && workPlanId) {
        //     try {
        //         const parsedWPE = JSON.parse(lswpe); // should be an array of work plans
        //         const matched = parsedWPE.find((wp: any) => wp.work_plan_id === workPlanId);

        //         if (matched && Array.isArray(matched.work_plan_task)) {
        //             localStorage.setItem("work_plan_tasks", JSON.stringify(matched.work_plan_task));
        //             console.log("✅ work_plan_task saved to localStorage.");
        //         } else {
        //             console.warn("⚠️ No matching work plan or work_plan_task not found.");
        //         }
        //     } catch (err) {
        //         console.error("❌ Error parsing work_plan_extended from localStorage:", err);
        //     }
        // } else {
        //     console.warn("⚠️ Missing work_plan_extended or current_work_plan_id in localStorage.");
        // }


        // const lsWPTasks = localStorage.getItem("work_plan_tasks")
        // if (lsWPTasks) {
        //     const parsedTasks = JSON.parse(lsWPTasks) as WorkPlanTasks[]
        //     setTasks(parsedTasks)
        // } else {
        //     localStorage.setItem("work_plan_tasks", JSON.stringify([]))
        //     setTasks([])
        // }


        async function loadPersonProfile() {
            try {
                debugger;
                const email = "dsentico@dswd.gov.ph";
                const password = "Dswd@123";

                const onlinePayload = await LoginService.onlineLogin(email, password);
                const token = onlinePayload.token;

                const personProfileRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}person_profile/view/${_session.id}/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!personProfileRes.ok) {
                    const errorData = await personProfileRes.json();
                    console.error("❌ Failed to load person profile:", errorData);
                    return;
                }

                const personData = await personProfileRes.json();
                console.log("🧔 Person Profile:", personData);

                const ppid = personData.id;
                const dan = personData.cfw_assessment[0].deployment_area_name
                setWorkPlanData((prev) => ({
                    ...prev,
                    deployment_area_name: dan
                }))

                localStorage.setItem("deployment_area_supervisor", personData.cfw_assessment[0].deployment_area_name)
                localStorage.setItem("deployment_area_short_name_supervisor", personData.cfw_assessment[0].deployment_area_short_name)
                // alert("Deployment Area ID: " + personData.cfw_assessment[0].deployment_area_id)
                // alert("Deployment Area category ID: " + personData.cfw_assessment[0].deployment_area_category_id)
                setPersonProfileId(ppid);
                setDeploymentAreaName(personData.cfw_assessment[0].deployment_area_name)
                // setDeploymentAreaShortName(personData.cfw_assessment[0].deployment_area_short_name);

                const deploymentAreaId = personData.cfw_assessment[0].deployment_area_id;
                const deploymentAreaCategoryId = personData.cfw_assessment[0].deployment_area_category_id;
                debugger
                const eligibleBenesResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}cfw_assessment/view/cfw_assessment_by_deployment_category/`,
                    {
                        // const response = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            Authorization: `bearer ${onlinePayload.token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "deployment_area_category_id": deploymentAreaCategoryId,
                            "deployment_area_id": deploymentAreaId
                        })
                    });

                if (!eligibleBenesResponse.ok) {
                    const data = await eligibleBenesResponse.json();
                    console.log("Error fetching data:", data);
                } else {
                    const data = await eligibleBenesResponse.json();
                    console.log("👨‍👩‍👧‍👦Eligible Beneficiaries  from api ", data);


                    setBeneficiariesData(data); //these are the eligible beneficiaries
                }

            } catch (error: any) {
                if (error.name === "AbortError") {
                    console.warn("🚫 Request canceled:", error.message);
                } else {
                    console.error("🔥 Unexpected error:", error);
                }
            }
        }

        loadPersonProfile();




    }, []);



    
    const { toast } = useToast()



    // State for tasks
    const [tasks, setTasks] = useState<WorkPlanTasks[]>([])

    // State for the new task form
    const [newTask, setNewTask] = useState<WorkPlanTasks>({
        id: "",
        work_plan_id: "",
        category_id: "",
        activities_tasks: "",
        expected_output: "",
        timeline_from: "",
        timeline_to: "",
        assigned_person_id: "",
    })

    // State to track which task is being edited
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

     
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full p-0"
        >
 

            <div className="w-full mx-auto px-4 pt-0 mt-0 py-0">
                {/* Workplan Details {JSON.stringify(workPlanData)} */}
                <Wizard
                    mode="editing"
                    title='Work Plan Edit'
                    description='Edit work plan for the beneficiaries'
                    beneficiariesData={beneficiariesData}
                    workPlanDetails={workPlanData}
                    workPlanTasks={tasks}
                    deploymentAreaName={workPlanData.deployment_area_name}

                />
                {/* {beneficiariesData.map((beneficiary) => (
          <div key={beneficiary.id} className="mb-4">
            <h2 className="text-lg font-semibold">{beneficiary.first_name} {beneficiary.middle_name} {beneficiary.extension_name} {beneficiary.last_name}</h2>
            <p>{beneficiary.status}</p>
          </div>
        ))} */}


            </div>
        </motion.div >

    )
}
