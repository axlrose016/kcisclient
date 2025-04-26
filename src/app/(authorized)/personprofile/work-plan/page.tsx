"use client"

import { useEffect, useState } from "react"
import { Save, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
// import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Toast } from "@/components/ui/toast"
// Define the task type
interface Task {
  id: string
  type: string
  task: string
  expectedOutput: string
  startDate: string
  endDate: string
  assignedPerson: string
}

export default function TaskManagement() {

  useEffect(() => {
    // Fetch tasks from the server or local storage if needed
    // For now, we are using an empty array as initial state
    const lsWP = localStorage.getItem("workPlan")
    if (lsWP) {
      const parsedTasks = JSON.parse(lsWP) as Task[]
      setTasks(parsedTasks)
    } else {
      localStorage.setItem("workPlan", JSON.stringify([]))
      setTasks([])
    }
  }, [])
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([])

  // State for the new task form
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    type: "",
    task: "",
    expectedOutput: "",
    startDate: "",
    endDate: "",
    assignedPerson: "",
  })

  // State to track which task is being edited
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  // Function to handle saving a new task
  const handleSaveTask = () => {
    if (!newTask.type || !newTask.task) {
      return // Basic validation
    }

    const taskId = Date.now().toString()
    const taskToSave = { ...newTask, id: taskId }
    // const { toast } = useToast()
    setTasks([...tasks, taskToSave])
    // debugger;
    const isTaskExist = tasks.some((task) => task.task === newTask.task && task.type === newTask.type)
    if (isTaskExist) {
      // toast({
      //   variant: "destructive",
      //   description: "Task with the same type and name already exists!"

      // })

      return
    }
    localStorage.setItem("workPlan", JSON.stringify([...tasks, taskToSave]))
    // Reset the form
    setNewTask({
      id: "",
      type: "",
      task: "",
      expectedOutput: "",
      startDate: "",
      endDate: "",
      assignedPerson: "",
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
    setTasks(tasks.map((task) => (task.id === editingTaskId ? newTask : task)))

    // Reset the form and editing state
    setNewTask({
      id: "",
      type: "",
      task: "",
      expectedOutput: "",
      startDate: "",
      endDate: "",
      assignedPerson: "",
    })
    setEditingTaskId(null)
  }

  // Function to handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left font-medium">Task Type</th>
                  <th className="p-2 text-left font-medium">Tasks</th>
                  <th className="p-2 text-left font-medium">Expected Output</th>
                  <th className="p-2 text-left font-medium">Timeline (Start - End)</th>
                  <th className="p-2 text-left font-medium">Assigned Person</th>
                  <th className="p-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Input row */}
                <tr className="border-b">
                  <td className="p-2">
                    <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Textarea
                      rows={3}
                      placeholder="Enter task"
                      value={newTask.task}
                      onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <Textarea
                      rows={3}
                      placeholder="Expected output"
                      value={newTask.expectedOutput}
                      onChange={(e) => setNewTask({ ...newTask, expectedOutput: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        {/* <span className="text-xs text-muted-foreground mb-1">Start</span> */}
                        <Input
                          type="date"
                          value={newTask.startDate}
                          onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                        />
                      </div>
                      <span className="text-muted-foreground">-</span>
                      <div className="flex flex-col">
                        {/* <span className="text-xs text-muted-foreground mb-1">End</span> */}
                        <Input
                          type="date"
                          value={newTask.endDate}
                          onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <Select
                      value={newTask.assignedPerson}
                      onValueChange={(value) => setNewTask({ ...newTask, assignedPerson: value })}
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
                    <td className="p-2">{task.type}</td>
                    <td className="p-2">{task.task}</td>
                    <td className="p-2">{task.expectedOutput}</td>
                    <td className="p-2">
                      {task.startDate && task.endDate ? (
                        <span>
                          {task.startDate} - {task.endDate}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No dates set</span>
                      )}
                    </td>
                    <td className="p-2">{task.assignedPerson}</td>
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
      </Card>
    </div>
  )
}
