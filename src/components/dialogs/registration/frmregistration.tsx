import type React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogFooter } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import PasswordFields from "@/components/forms/form-password"
import { Button } from "@/components/ui/button"
import { addUser, getUsers } from "@/db/offline/Dexie/schema/user-service"
import type { IUser } from "@/components/interfaces/iuser"

const formSchema = z
  .object({
    username: z.string().min(8, { message: "Username must be at least 8 characters" }),
    email: z.string().email({ message: "Invalid Email Address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export default function RegistrationForm({ className, ...props }: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const formSubmission: IUser = {
        id: crypto.randomUUID(),
        username: data.username,
        email: data.email,
        password: data.password,
        role_id: "UUID",
        created_date: new Date().toISOString(),
        created_by: "UUID",
        last_modified_date: "",
        last_modified_by: "",
        push_status_id: 1,
        push_date: "",
        deleted_date: "",
        deleted_by: "",
        is_deleted: false,
        remarks: "",
      }

      await addUser(formSubmission)
      const _users = await getUsers();
      console.log("Users: ",_users);
      alert("User added successfully!")
      reset()
    } catch (error) {
      console.error("Error adding user:", error)
      alert("Failed to add user. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
      <div className={cn("flex flex-col gap-6 overflow-auto max-h-[80vh] scrollbar-hide p-4", className)} {...props}>
        <div className="pb-5">
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
            <div className="sm:col-span-8">
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <Input id="username" type="text" {...register("username")} placeholder="Juan D. Dragon" />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div className="sm:col-span-8">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <Input id="email" type="email" {...register("email")} placeholder="email@example.com" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
            <PasswordFields register={register} errors={errors} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="destructive">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogFooter>
    </form>
  )
}

