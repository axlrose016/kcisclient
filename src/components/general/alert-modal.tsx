"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertType = "success" | "error" | "warning" | "info"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  type: AlertType
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

interface AlertState {
  isOpen: boolean
  type: AlertType
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

// Custom hook for managing alert state
export function useAlert() {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    description: "",
  })

  const showAlert = (alertData: Omit<AlertState, "isOpen">) => {
    setAlert({ ...alertData, isOpen: true })
  }

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }))
  }

  const showError = (title: string, description: string, confirmText = "OK") => {
    showAlert({ type: "error", title, description, confirmText })
  }

  const showWarning = (
    title: string,
    description: string,
    onConfirm?: () => void,
    confirmText = "Yes",
    cancelText = "Cancel",
  ) => {
    showAlert({ type: "warning", title, description, onConfirm, confirmText, cancelText })
  }

  const showSuccess = (title: string, description: string, confirmText = "OK") => {
    showAlert({ type: "success", title, description, confirmText })
  }

  const showInfo = (title: string, description: string, confirmText = "OK") => {
    showAlert({ type: "info", title, description, confirmText })
  }

  return {
    alert,
    showAlert,
    hideAlert,
    showError,
    showWarning,
    showSuccess,
    showInfo,
  }
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
}

function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  description,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
}: AlertModalProps) {
  const config = alertConfig[type]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                config.bgColor,
                config.borderColor,
                "border",
              )}
            >
              <Icon className={cn("h-5 w-5", config.iconColor)} />
            </div>
            <div>
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left pt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {onConfirm && (
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm} className="w-full sm:w-auto">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Example component showing how to use the alert in your allocation logic
export default function AllocationExample() {
  const { alert, hideAlert, showError, showWarning, showSuccess } = useAlert()

  // Simulated allocation save function
  const saveOfflineAllocation = async (allocation: any): Promise<any | undefined> => {
    try {
      let savedItem: any | undefined

      // Simulate database transaction
      const hasExist = await checkIfAllocationExists(allocation)

      if (hasExist) {
        // Show warning alert instead of browser alert
        showWarning(
          "Duplicate Allocation Found",
          `An allocation already exists for this date (${allocation.date_allocation}) with the same budget year, region, PAP, appropriation source, and type. Do you want to update the existing allocation?`,
          () => {
            // Handle update logic here
            console.log("User chose to update existing allocation")
            updateExistingAllocation(allocation)
          },
          "Update Existing",
          "Cancel",
        )
        return undefined
      }

      // Proceed with saving new allocation
      savedItem = await saveNewAllocation(allocation)
      showSuccess("Success", "Allocation saved successfully!")

      return savedItem
    } catch (error) {
      showError("Error", "Failed to save allocation. Please try again.")
      console.error("Error saving allocation:", error)
      return undefined
    }
  }

  // Simulated helper functions
  const checkIfAllocationExists = async (allocation: any): Promise<boolean> => {
    // Simulate your database check
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.5), 1000)
    })
  }

  const saveNewAllocation = async (allocation: any): Promise<any> => {
    // Simulate saving
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id: Date.now(), ...allocation }), 1000)
    })
  }

  const updateExistingAllocation = async (allocation: any): Promise<any> => {
    // Simulate updating
    showSuccess("Updated", "Existing allocation has been updated successfully!")
    return allocation
  }

  // Demo allocation data
  const demoAllocation = {
    date_allocation: "2024-01-15",
    budget_year_id: 1,
    region_code: "NCR",
    pap_id: 123,
    appropriation_source_id: 1,
    appropriation_type_id: 2,
    amount: 1000000,
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-8">Allocation Management</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Demo Allocation</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Date:</strong> {demoAllocation.date_allocation}
            </p>
            <p>
              <strong>Region:</strong> {demoAllocation.region_code}
            </p>
            <p>
              <strong>Amount:</strong> ₱{demoAllocation.amount.toLocaleString()}
            </p>
          </div>
        </div>

        <Button onClick={() => saveOfflineAllocation(demoAllocation)} className="w-full">
          Save Allocation
        </Button>

        <Button
          onClick={() => showError("Test Error", "This is a test error message.")}
          variant="outline"
          className="w-full"
        >
          Test Error Alert
        </Button>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alert.isOpen}
          onClose={hideAlert}
          type={alert.type}
          title={alert.title}
          description={alert.description}
          confirmText={alert.confirmText}
          cancelText={alert.cancelText}
          onConfirm={alert.onConfirm}
        />
      </div>
    </div>
  )
}
