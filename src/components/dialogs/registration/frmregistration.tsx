import type React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogFooter } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { cn, hashPassword } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import PasswordFields from "@/components/forms/form-password"
import { Button } from "@/components/ui/button"
import type { IUser, IUserAccess } from "@/components/interfaces/iuser"
import { getModules, getPermissions, getRoles } from "@/db/offline/Dexie/schema/library-service"
import { toast } from "@/hooks/use-toast"
import { addUser, addUserAccess, checkUserExists, trxAddUserWithAccess } from "@/db/offline/Dexie/schema/user-service"
import { v4 as uuidv4 } from 'uuid';
import { redirect, useRouter } from "next/navigation"
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb"

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
  const router = useRouter();
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
        const _role = (await getRoles()).filter(w => w.role_description === "Guest");
        const _module = (await getModules()).filter(w => w.module_description === "Person Profile")
        const _permission = (await getPermissions()).filter(w => w.permission_description === "Can Add") 

        if(_role.length <= 0 || _module.length <= 0 || _permission.length <= 0){
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Please refresh the page and try again!.",
            })
            return;
        }

        const _id = uuidv4();
        const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt
        const hashedPassword : string = await hashPassword(data.password, salt);
        const formUser: IUser = {
        id: _id,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        salt: salt,
        role_id: _role[0].id,
        created_date: new Date().toISOString(),
        created_by: _id,
        last_modified_date: "",
        last_modified_by: "",
        push_status_id: 2, //1 Uploaded, 2 For Uploading
        push_date: "",
        deleted_date: "",
        deleted_by: "",
        is_deleted: false,
        remarks: "",
        }
        
        const formUserAccess: IUserAccess ={
          id: uuidv4(),
          user_id: _id,
          module_id: _module[0].id,
          permission_id: _permission[0].id,
          created_date: new Date().toISOString(),
          created_by: _id,
          last_modified_date: "",
          last_modified_by: "",
          push_status_id: 2, //1 Uploaded, 2 For Uploading
          push_date: "",
          deleted_date: "",
          deleted_by: "",
          is_deleted: false,
          remarks: "",
        }

        //OFFLINE
        await dexieDb.open();
        
        const isExist = await checkUserExists(data.email, data.username);
        if(isExist){
          toast({
            variant: "warning",
            title: "Warning!",
            description: "The Email or Username is already exist!",
          })
          return;
        }

        dexieDb.transaction('rw', [dexieDb.users, dexieDb.useraccess], async () => {
            try {
                await dexieDb.users.add(formUser);
                await dexieDb.useraccess.add(formUserAccess);
                console.log("User: ", formUser);
                console.log("Access: ",formUserAccess);
            } catch (error) {
                console.error('Transaction failed: ', error);
                throw error; 
            }
        }).catch((error) => {
            console.error('Transaction failed: ', error);
        });

        //ONLINE
        //DITO ILALAGAY YUNG FUNCTIONS FOR ONLINE SYNC
        toast({
          variant: "green",
          title: "Success.",
          description: "User Successfully Registered!",
          onTransitionEnd: () => {
            reset()
            window.location.reload();
          }
        })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again >> " +error,
      })
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

