import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ButtonDialogProps {
  dialogForm: React.ElementType;
  label: string; // Accepts a React component as a prop
}

export function ButtonDialog({ dialogForm: DialogForm, label }: ButtonDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <a className="underline underline-offset-4 cursor-pointer">{label}</a>
      </DialogTrigger>
      <DialogContent className="w-full p-4 sm:max-w-screen-lg sm:p-6 bg-white rounded-lg shadow-lg overflow-y-auto">
        <DialogForm /> 
      </DialogContent>
    </Dialog>
  );
}
