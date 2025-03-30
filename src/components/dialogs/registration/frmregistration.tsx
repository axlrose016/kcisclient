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
import { useOnlineStatus } from "@/hooks/use-network"
import UsersService from "./UsersService"
import { datetime } from "drizzle-orm/mysql-core"

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
  const isOnline = useOnlineStatus()
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
   // try {
      const _role = (await getRoles()).filter(w => w.role_description === "Guest");
      console.log('_role',_role)
      const _module = (await getModules()).filter(w => w.module_description === "Person Profile")
      console.log('_module',_module)
      const _permission = (await getPermissions()).filter(w => w.permission_description === "Can Add")
      console.log('_permission',_permission)

      if (_role.length <= 0 || _module.length <= 0 || _permission.length <= 0) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please refresh the page and try again!.",
        })
        return;
      }

      const _id = uuidv4();
      console.log('_permission',_id)
      const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt
      console.log('salt',salt)
      console.log('data',data)
      const hashedPassword: string = await hashPassword(data.password, salt);
      console.log('hashedPassword',hashedPassword)
      const formUser: IUser = {
        id: _id,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        salt: salt,
        role_id: _role[0].id,
        created_date: new Date().toISOString(),
        created_by: _id,
        last_modified_by: null,
        last_modified_date: null,
        push_date: null,
        push_status_id: 2,
        deleted_by: null,
        deleted_date: null,
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
        last_modified_by: null,
        last_modified_date: null,
        push_date: null,
        push_status_id: 2,
        deleted_by: null,
        deleted_date: null,
        is_deleted: false,
        remarks: "",
      }

      console.log('formUserAccess',formUserAccess)

      //OFFLINE
      const saveUser = async () => {
        try {
          await dexieDb.transaction('rw', [dexieDb.users, dexieDb.useraccess], async () => {
            await Promise.all([
              dexieDb.users.add(formUser),
              dexieDb.useraccess.add(formUserAccess),
            ]);
            console.log("User: ", formUser);
            console.log("Access: ", formUserAccess);
          });
        } catch (error) {
          console.error('Transaction failed: ', error);
        }
      };

      const isExist = await checkUserExists(data.email, data.username);
      if (isExist) {
        toast({
          variant: "warning",
          title: "Warning!",
          description: "The Email or Username is already exist!",
        })
        return;
      }
      
      saveUser();

      //TRY TO SYNC 
      if(isOnline){
        const uploaded = await UsersService.syncUserData(formUser, Array(formUserAccess));
        debugger;
        if(uploaded){
          saveUser();
        }
      }

      //ONLINE
      //DITO ILALAGAY YUNG FUNCTIONS FOR ONLINE SYNC
      toast({
        variant: "green",
        title: "Success.",
        description: "Congratulations! Your account has been successfully created. You can now log in and get started.",
      });

      setTimeout(() => {
        reset();
        window.location.reload();
      }, 3000); // Adjust the delay as needed

    //   toast({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description: "There was a problem with your request. Please try again >> " + 'error',
    //  })
    // }
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
                <Input id="username" type="text" {...register("username")} placeholder="Juan D. Dragon"  className="normal-case"/>
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div className="sm:col-span-8">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <Input id="email" type="email" {...register("email")} placeholder="email@example.com" className="lowercase" />
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

