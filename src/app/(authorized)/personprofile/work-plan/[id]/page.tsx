"use client"
import beneficiaries from './beneficiaries.json'
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
import Wizard from './wizard'
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
  generalObjective: string;


}

type Beneficiary = {
  id: string
  full_name: string
  course_name: string
  school_name: string
  status_name: string
  // is_selected: string
}

export default function TaskManagement() {
  // Load beneficiaries from JSON
  const [beneficiariesData, setBeneficiariesData] = useState<Beneficiary[]>(beneficiaries)
  const [workPlanData, setWorkPlanData] = useState<WorkPlanProps>({
    id: "",
    work_plan_title: "",
    immediate_supervisor_id: "",
    deployment_area_name: "",
    office_name: "",
    no_of_days_program_engagement: 0,
    approved_work_schedule_from: "",
    approved_work_schedule_to: "",
    generalObjective: "",
  })

  const handleInputChangeTaskManagement = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkPlanData((prev) => ({ ...prev, [name]: value }))
    const lsWorkPlanData = localStorage.getItem("work_plan")
    if (lsWorkPlanData) {
      const parsedTM = JSON.parse(lsWorkPlanData) as WorkPlanProps
      localStorage.setItem("work_plan", JSON.stringify({ ...parsedTM, [name]: value }))
    }
    else {
      localStorage.setItem("work_plan", JSON.stringify({ ...workPlanData, [name]: value }))
    }
  }
  const { toast } = useToast()

  useEffect(() => {
    // Fetch task management data from local storage or server if needed
    const lsWorkPlanData = localStorage.getItem("work_plan")
    if (lsWorkPlanData) {
      const parsedTM = JSON.parse(lsWorkPlanData) as WorkPlanProps
      setWorkPlanData(parsedTM)
    } else {
      localStorage.setItem("work_plan", JSON.stringify(workPlanData))
    }

  }, [])
  useEffect(() => {
    // Fetch tasks from the server or local storage if needed
    // For now, we are using an empty array as initial state
    const lsWPTasks = localStorage.getItem("work_plan_tasks")
    if (lsWPTasks) {
      const parsedTasks = JSON.parse(lsWPTasks) as WorkPlanTasks[]
      setTasks(parsedTasks)
    } else {
      localStorage.setItem("work_plan_tasks", JSON.stringify([]))
      setTasks([])
    }
  }, [])
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full p-0"
    >

      {/* <main className="max-h-screen w-full bg-background py-10">
        <Wizard
          title='Work Plan Creation'
          description='Create a work plan for the beneficiaries'
        />
      </main> */}

      <div className="w-full mx-auto px-4 pt-0 mt-0 py-0">
        <Wizard
          title='Work Plan Creation'
          description='Create a work plan for the beneficiaries'
          beneficiariesData={beneficiariesData}
          workPlanDetails={workPlanData}
          workPlanTasks={tasks}
        />
        {/* {beneficiariesData.map((beneficiary) => (
          <div key={beneficiary.id} className="mb-4">
            <h2 className="text-lg font-semibold">{beneficiary.first_name} {beneficiary.middle_name} {beneficiary.extension_name} {beneficiary.last_name}</h2>
            <p>{beneficiary.status}</p>
          </div>
        ))} */}

        <Card className='hidden'>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Work Plan
              <p className="text-sm font-regular">Deployment Area Name</p>
            </CardTitle>

          </CardHeader>
          <CardContent>
            <div className="mb-6 ml-2">
              {/* <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Title</Label>
                <Input
                  type="text"
                  className="mt-1"
                  name="workPlanTitle"
                  value={taskManagement.workPlanTitle ?? ""}
                  onChange={handleInputChangeTaskManagement} />
              </div> */}
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Name of Company</Label>
                <Input
                  type="text"
                  placeholder="Enter company name"
                  className="mt-1"
                  name="deployment_area_name"
                  value={workPlanData.deployment_area_name ?? ""}
                  onChange={handleInputChangeTaskManagement} />
              </div>
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Name of Office</Label>
                <Input
                  type="text"
                  placeholder="Enter office name"
                  className="mt-1"
                  name="officeName"
                  value={workPlanData.office_name}
                  onChange={handleInputChangeTaskManagement} />
              </div>
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Number of Days of Program Engagement</Label>
                <Input
                  type="number"
                  placeholder="Enter number of days"
                  className="mt-1"
                  min={1}
                  name="no_of_days_program_engagement"
                  value={workPlanData.no_of_days_program_engagement}
                  onChange={handleInputChangeTaskManagement} />
              </div>
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Approved Schedule (Include Lunch Break)</Label>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <Input
                      type="date"
                      placeholder="Start date"
                      className="mt-1"
                      name="approved_work_schedule_from"
                      value={workPlanData.approved_work_schedule_from}
                      onChange={handleInputChangeTaskManagement} />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="flex flex-col">
                    <Input
                      type="date"
                      placeholder="End date"
                      className="mt-1"
                      name="approved_work_schedule_to"
                      value={workPlanData.approved_work_schedule_to}
                      onChange={handleInputChangeTaskManagement} />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">General Objective</Label>
                <Textarea
                  rows={3}
                  placeholder="Enter general objective"
                  className="mt-1"
                  name="generalObjective"
                  value={workPlanData.generalObjective}
                  onChange={handleInputChangeTaskManagement} />
              </div>
            </div>
            <div className="overflow-x-auto ml-2">
              <h1 className="font-bold text-2xl mb-2">Task List</h1>
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
          </CardContent>
          <CardFooter >
            <Button onClick={submitWorkPlan}>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div >

  )
}
