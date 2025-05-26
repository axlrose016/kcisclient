"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronLeft, ChevronRight, Users, ClipboardList, ListTodo, Eye, Save, Edit, Trash2 } from "lucide-react"
import { AppTable } from "@/components/app-table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

type WizardProps = {
    title: string
    description: string
    beneficiariesData?: any[]
    workPlanDetails?: any
    workPlanTasks?: any[]
}
const columnsMasterlist = [

    // {
    //     id: 'id',
    //     header: 'ID',
    //     accessorKey: 'id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "center",

    // },
    {
        id: 'status_name',
        header: 'Status',
        accessorKey: 'status_name',
        filterType: 'text',
        sortable: true,
        align: "center",
        cell: (value: any) => <Badge variant={value == "Available" ? "green" : "default"
        } >{value}</Badge>
    },
    {
        id: 'full_name',
        header: 'Full Name',
        accessorKey: 'full_name',
        filterType: 'text',
        sortable: true,
        align: "left",


    },
    // {
    //     id: 'middle_name',
    //     header: 'Middle Name',
    //     accessorKey: 'middle_name',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",

    // },
    // {
    //     id: 'last_name',
    //     header: 'Last Name',
    //     accessorKey: 'last_name',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",

    // },

    // {
    //     id: 'extension_name',
    //     header: 'Extension Name',
    //     accessorKey: 'extension_name',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",

    // },
    {
        id: 'course_name',
        header: 'Course Name',
        accessorKey: 'course_name',
        filterType: 'text',
        sortable: true,
        align: "left",

    },
    {
        id: 'school_name',
        header: 'School Name',
        accessorKey: 'school_name',
        filterType: 'text',
        sortable: true,
        align: "left",

    },
    // {
    //     id: 'is_selected',
    //     header: 'Selected',
    //     accessorKey: 'is_selected',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "center",

    // },

];
let totalNumberOfSelectedBeneficiaries = 0

export default function Wizard({ title, description, beneficiariesData, workPlanDetails, workPlanTasks }: WizardProps) {
    const [currentStep, setCurrentStep] = useState(0)



    const steps = [
        {
            id: "beneficiaries",
            name: "Beneficiaries" + " (" + totalNumberOfSelectedBeneficiaries + ")",
            icon: <Users className="h-5 w-5" />,
            component: <BeneficiariesStep beneficiariesData={beneficiariesData as any[]} title={""} description={""} />,
        },
        {
            id: "workplan",
            name: "Work Plan Details",
            icon: <ClipboardList className="h-5 w-5" />,
            component: <WorkPlanStep workPlanDetails={workPlanDetails} title={""} description={""} />,
        },
        {
            id: "tasks",
            name: "Tasks",
            icon: <ListTodo className="h-5 w-5" />,
            component: <TasksStep workPlanTasks={workPlanTasks} title="" description="" />,
        },
        {
            id: "preview",
            name: "Preview",
            icon: <Eye className="h-5 w-5" />,
            component: <PreviewStep />,
        },
    ]

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className="mx-auto px-0 py-8 mt-0">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
                    <CardDescription className="mb-5">{description}</CardDescription>
                    <br />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 gap-y-6"><div className="w-full flex items-center">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center w-full">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {index < currentStep ? <CheckCircle className="h-5 w-5 " /> : step.icon}
                                </div>
                                <div
                                    className={`hidden md:block text-sm mx-2 ${index <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                                        }`}
                                >
                                    {step.name}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">{steps[currentStep].component}</CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                    <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                        {currentStep === steps.length - 1 ? "Finish" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function BeneficiariesStep({ beneficiariesData }: WizardProps) {

    const [listOfBeneficiaries, setListOfBeneficiaries] = useState<any[]>(beneficiariesData || [])
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<any[]>([])


    useEffect(() => {
        const selectedBenes = localStorage.getItem("selectedBeneficiaries")
        if (selectedBenes) {
            let parsedBenes: any[] = [];
            try {
                parsedBenes = JSON.parse(selectedBenes);
                if (!Array.isArray(parsedBenes)) {
                    parsedBenes = [];
                }
            } catch {
                parsedBenes = [];
            }

            setSelectedBeneficiaries(parsedBenes);

        }
    }, [listOfBeneficiaries])
    type Beneficiary = {
        id: string;
        status_name: string;
        full_name: string;
        course_name?: string;
        school_name?: string;
        // is_selected?: string;
        [key: string]: any;
    };

    const handleBeneficiarySelection = (selectedRows: Beneficiary | Beneficiary[]) => {
        if (Array.isArray(selectedRows) && selectedRows.length > 0) {
            const selectedRow = selectedRows[0];
            if (selectedRow.status_name !== "Available") {
                return; // Do not select if not available
            }
        } else if (selectedRows && !Array.isArray(selectedRows) && (selectedRows as Beneficiary).status_name !== "Available") {
            return; // Do not select if not available
        }
        // setSelectedBeneficiaries(selectedRows)
        // const selectedRow = JSON.stringify(selectedRows)
        // alert(selectedRow)
        const selectedBenes = localStorage.getItem("selectedBeneficiaries") //&& localStorage.removeItem("selectedBeneficiaries")
        if (selectedBenes) {
            let parsedBenes: Beneficiary[] = [];
            try {
                parsedBenes = JSON.parse(selectedBenes);
                if (!Array.isArray(parsedBenes)) {
                    parsedBenes = [];
                }
            } catch {
                parsedBenes = [];
            }

            // selectedRows is a single row (from onRowClick)
            const selectedRow = Array.isArray(selectedRows) ? selectedRows[0] : selectedRows;
            const existingIndex = parsedBenes.findIndex((bene: Beneficiary) => bene.id === selectedRow?.id);

            if (existingIndex !== -1) {
                // If already there, remove it
                parsedBenes.splice(existingIndex, 1);
                toast({
                    title: "Beneficiary removed",
                    description: `${selectedRow?.full_name} has been removed from the selected beneficiaries.`,
                    variant: "destructive",
                });
            } else {
                // Else, add new
                parsedBenes.push(selectedRow);
                toast({
                    title: "Beneficiary added",
                    description: `${selectedRow?.full_name} has been added to the selected beneficiaries.`,
                    variant: "green",
                });
            }

            localStorage.setItem("selectedBeneficiaries", JSON.stringify(parsedBenes));
            const lst = localStorage.getItem("selectedBeneficiaries")
            if (lst) {
                const parsedList = JSON.parse(lst);
                totalNumberOfSelectedBeneficiaries = parsedList.length
                setSelectedBeneficiaries(parsedList);
            }
        }


    }
    useEffect(() => {
        debugger;
        const lst = localStorage.getItem("selectedBeneficiaries")
        if (lst) {
            const parsedList = JSON.parse(lst);
            totalNumberOfSelectedBeneficiaries = parsedList.length
            setSelectedBeneficiaries(parsedList);
        }

    }, [])
    // useEffect(() => {
    //     localStorage.setItem("selectedBeneficiaries", JSON.stringify(selectedBeneficiaries));

    // }, [selectedBeneficiaries])
    return (
        <div >
            <div className="mb-4">
                <div className="flex items-start  bg-blue-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <span className="mr-3 mt-1 text-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </span>
                    <div>
                        <h2 className="text-lg font-medium text-yellow-800">Select Beneficiaries</h2>
                        <p className="text-yellow-700">
                            Choose the beneficiaries who are going to deploy under you.
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-yellow-800 space-y-1">
                            <li>You can only select beneficiaries with <span className="font-semibold">Available</span> status.</li>
                            <li>Click on a beneficiary row to add or remove them from your selection.</li>
                            <li>Your selections are saved automatically and will be used in the next steps.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap mb-4">
                <p className="text-muted-foreground mr-2">Selected Beneficiaries:</p>

                {selectedBeneficiaries.map((bene) => {
                    return (
                        <div key={bene.id} className="inline-flex items-center mr-2 mb-2">
                            <Badge variant="green" className="flex items-center gap-2 pr-2">
                                {bene.full_name}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="ml-1 h-4 w-4 p-0"
                                    onClick={() => {
                                        // Remove this beneficiary from selectedBeneficiaries and localStorage
                                        const updated = selectedBeneficiaries.filter((b: any) => b.id !== bene.id);
                                        setSelectedBeneficiaries(updated);
                                        localStorage.setItem("selectedBeneficiaries", JSON.stringify(updated));
                                        totalNumberOfSelectedBeneficiaries = updated.length
                                        toast({
                                            title: "Beneficiary removed",
                                            description: `${bene.full_name} has been removed from the selected beneficiaries.`,
                                            variant: "destructive",
                                        });

                                    }}
                                >
                                    <span className="sr-only">Remove</span>
                                    ×
                                </Button>
                            </Badge>
                        </div>
                    )

                })}

            </div>
            {/* <div className="flex flex-wrap mb-4">
                <p className="text-muted-foreground mr-2">Total Number of Selected Beneficiaries: {selectedBeneficiaries.length}</p>
            </div> */}

            <div className="border rounded-md p-6 bg-muted/20">

                <AppTable
                    data={listOfBeneficiaries as any[]}
                    columns={columnsMasterlist}

                    // enableRowSelection={true}
                    onRowClick={(row) => handleBeneficiarySelection(row)}
                // customActions={[
                //     {
                //         // id: 'add',
                //         icon: <CheckCircle className="h-5 w-5" />,
                //         label: 'Add',
                //         onClick: (row) => console.log('Add clicked', row),
                //     },
                // ]}
                // onEdit={handleEdit}
                // onDelete={handleDelete}
                // onRowClick={handleRowClick}
                // onAddNewRecord={handleAddNewRecord}
                />
            </div>
        </div>
    )
}

function WorkPlanStep({ workPlanDetails }: WizardProps) {
    const [workPlanDetailsData, setWorkPlanDetailsData] = useState<any>(workPlanDetails || "")
    const [workPlanTitle, setWorkPlanTitle] = useState("")


    const updateWorkPlanDetails = (field: any, value: any) => {
        setWorkPlanDetailsData((prevDetails: any) => ({
            ...prevDetails,
            [field]: value,
        }))
        localStorage.setItem("work_plan", JSON.stringify({ ...workPlanDetailsData, [field]: value }))

    }

    useEffect(() => {
        const workPlanDetails = localStorage.getItem("work_plan")
        if (workPlanDetails) {
            let parsedWorkPlanDetails: any = {};
            try {
                parsedWorkPlanDetails = JSON.parse(workPlanDetails);
                if (typeof parsedWorkPlanDetails !== "object") {
                    parsedWorkPlanDetails = {};
                }
            } catch {
                parsedWorkPlanDetails = {};
            }

            setWorkPlanDetailsData(parsedWorkPlanDetails);

        }
    }, [])
    return (
        <div >
            {/* Data: {JSON.stringify(workPlanDetailsData)} */}
            <h2 className="text-lg font-medium">Work Plan Details</h2>
            <p className="text-muted-foreground ">Define the overall plan, timeline, and objectives for this program.</p>
            <p className="py-3">Work Plan Title :  deployment area short name - office - approved from and to - number of days - number of bene </p>
            {/* deployment area short name - office - approved from and to - number of bene - number of days */}
            <div className="border rounded-md p-6 bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="office_name">
                            Name of Office
                        </label>
                        <input
                            id="office_name"
                            name="office_name"
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter office name"
                            value={workPlanDetailsData?.office_name || ""}
                            onChange={(e) => updateWorkPlanDetails("office_name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="numDays">
                            No. of Days of Program Engagement
                        </label>
                        <input
                            id="no_of_days_program_engagement"
                            name="no_of_days_program_engagement"
                            type="number"
                            min={1}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="e.g. 30"
                            value={workPlanDetailsData?.no_of_days_program_engagement || ""}
                            onChange={(e) => updateWorkPlanDetails("no_of_days_program_engagement", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="scheduleFrom">
                            Approved Schedule (From)
                        </label>
                        <input
                            id="approved_work_schedule_from"
                            name="approved_work_schedule_from"
                            type="date"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={workPlanDetailsData?.approved_work_schedule_from || ""}
                            onChange={(e) => updateWorkPlanDetails("approved_work_schedule_from", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="scheduleTo">
                            Approved Schedule (To)
                        </label>
                        <input
                            id="approved_work_schedule_to"
                            name="approved_work_schedule_to"
                            type="date"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={workPlanDetailsData?.approved_work_schedule_to || ""}
                            onChange={(e) => updateWorkPlanDetails("approved_work_schedule_to", e.target.value)}
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium mb-1" htmlFor="objectives">
                            General Objectives
                        </label>
                        <textarea
                            id="objectives"
                            name="objectives"
                            rows={4}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Describe the general objectives of the program"
                            value={workPlanDetailsData?.objectives || ""}
                            onChange={(e) => updateWorkPlanDetails("objectives", e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
type WorkPlanTasks = {
    id: string
    work_plan_id: string
    category_id: string //General, Specific, or Other
    activities_tasks: string
    expected_output: string
    timeline_from: string
    timeline_to: string
    assigned_person_id: string //person_profile_id = record_id
}




function TasksStep({ workPlanTasks }: WizardProps) {
    const [tasks, setTasks] = useState<WorkPlanTasks[]>([])
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
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
    // Function to handle saving a new task
    const handleSaveTask = () => {
        if (!newTask.category_id || !newTask.activities_tasks) {
            return // Basic validation
        }

        const taskId = Date.now().toString()
        const taskToSave = { ...newTask, id: taskId }
        // const { toast } = useToast()
        // debugger;
        const isTaskExist = tasks.some((task) => task.activities_tasks.toLowerCase().trim() === newTask.activities_tasks.toLowerCase().trim() && task.category_id.toLowerCase().trim() === newTask.category_id.toLowerCase().trim())
        if (isTaskExist) {
            toast({
                variant: "destructive",
                description: "Task with the same type and name already exists!"

            })

            return;
        }
        setTasks([...tasks, taskToSave])
        localStorage.setItem("workPlan", JSON.stringify([...tasks, taskToSave]))
        // Reset the form
        setNewTask({
            id: "",
            work_plan_id: "",
            category_id: "",
            activities_tasks: "",
            expected_output: "",
            timeline_from: "",
            timeline_to: "",
            assigned_person_id: "",
        })
    }

    // Function to handle editing a task
    const handleEditTask = (taskId: string) => {
        setEditingTaskId(taskId)
        const taskToEdit = tasks.find((task) => task.id === taskId)
        if (taskToEdit) {
            setNewTask(taskToEdit)
        }
    }

    // Function to handle updating a task
    const handleUpdateTask = () => {
        const updatedTasks = tasks.map((task) => (task.id === editingTaskId ? newTask : task))
        setTasks(updatedTasks)
        localStorage.setItem("work_plan_tasks", JSON.stringify(updatedTasks))
        // Reset the form and editing state
        setNewTask({
            id: "",
            work_plan_id: "",
            category_id: "",
            activities_tasks: "",
            expected_output: "",
            timeline_from: "",
            timeline_to: "",
            assigned_person_id: "",
        })
        setEditingTaskId(null)
    }

    // Function to handle deleting a task
    const handleDeleteTask = (taskId: string) => {
        const deleteTask = tasks.filter((task) => task.id !== taskId)
        setTasks(deleteTask)
        localStorage.setItem("work_plan_tasks", JSON.stringify(deleteTask))
    }
    const submitWorkPlan = () => {
        alert("Submitting")
    }
    return (
        <div >
            <h2 className="text-lg font-medium">Define Tasks</h2>
            <p className="text-muted-foreground mb-5">Break down the work plan into specific tasks and assign responsibilities.</p>
            <div className="border rounded-md p-6 bg-muted/20 ">

                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-2 text-left font-medium min-w-[200px] md:w-[30%] lg:w-[10%]">Task Type</th>
                            <th className="p-2 text-left font-medium min-w-[200px] w-full md:w-[30%] lg:w-[40%]">Tasks</th>
                            <th className="p-2 text-left font-medium min-w-[200px] w-full md:w-[30%] lg:w-[40%]">Expected Output</th>
                            <th className="p-2 text-left font-medium">Timeline (Start - End)</th>
                            <th className="p-2 text-left font-medium">Assigned Person</th>
                            <th className="p-2 text-left font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Input row */}
                        <tr className="border-b">
                            <td className="p-2">
                                <Select value={newTask.category_id} onValueChange={(value) => setNewTask({ ...newTask, category_id: value })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">General</SelectItem>
                                        <SelectItem value="2">Specific</SelectItem>
                                    </SelectContent>
                                </Select>
                            </td>
                            <td className="p-2">
                                <Textarea
                                    rows={3}
                                    className="sm:w-[200px] md:w-full"
                                    placeholder="Enter task"
                                    value={newTask.activities_tasks}
                                    onChange={(e) => setNewTask({ ...newTask, activities_tasks: e.target.value })} />
                            </td>
                            <td className="p-2">
                                <Textarea
                                    rows={3}
                                    className="sm:w-[200px] md:w-full"
                                    placeholder="Expected output"
                                    value={newTask.expected_output}
                                    onChange={(e) => setNewTask({ ...newTask, expected_output: e.target.value })} />
                            </td>
                            <td className="p-2">
                                <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:justify-between">
                                    <Input
                                        type="date"
                                        className="w-full md:w-[140px]" // Adjust width as needed
                                        value={newTask.timeline_from}
                                        onChange={(e) => setNewTask({ ...newTask, timeline_from: e.target.value })}
                                    />
                                    <span className="text-center text-muted-foreground hidden md:inline">-</span>
                                    <Input
                                        type="date"
                                        className="w-full md:w-[140px]" // Adjust width as needed
                                        value={newTask.timeline_to}
                                        onChange={(e) => setNewTask({ ...newTask, timeline_to: e.target.value })}
                                    />
                                </div>
                            </td>


                            <td className="p-2">
                                <Select
                                    value={newTask.assigned_person_id}
                                    onValueChange={(value) => setNewTask({ ...newTask, assigned_person_id: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Assign to" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="john">John Doe</SelectItem>
                                        <SelectItem value="jane">Jane Smith</SelectItem>
                                        <SelectItem value="alex">Alex Johnson</SelectItem>
                                        <SelectItem value="sarah">Sarah Williams</SelectItem>
                                    </SelectContent>
                                </Select>
                            </td>
                            <td className="p-2">
                                {editingTaskId ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleUpdateTask}
                                        className="flex items-center gap-1"
                                    >
                                        <Save className="h-4 w-4" />
                                        Update
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={handleSaveTask} className="flex items-center gap-1">
                                        <Save className="h-4 w-4" />
                                        Save
                                    </Button>
                                )}
                            </td>
                        </tr>

                        {/* Task rows */}
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">{task.category_id == "1" ? "General" : "Specific"}</td>
                                <td className="p-2">{task.activities_tasks}</td>
                                <td className="p-2">{task.expected_output}</td>
                                <td className="p-2">
                                    {task.timeline_from && task.timeline_to ? (
                                        <span>
                                            {task.timeline_from} - {task.timeline_to}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">No dates set</span>
                                    )}
                                </td>
                                <td className="p-2">{task.assigned_person_id}</td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditTask(task.id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div>
    )
}

function PreviewStep() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Preview</h2>
            <p className="text-muted-foreground">Review all the information before finalizing the project.</p>
            <div className="border rounded-md p-6 bg-muted/20">
                <p className="text-center text-muted-foreground">Project preview placeholder</p>
            </div>
        </div>
    )
}
