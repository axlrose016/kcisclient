"use client"

import { useEffect, useState } from "react";
import { seedData } from "@/db/offline/Dexie/schema/library-service";
import { cn, hashPassword } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonSubmit } from "@/components/actions/button-submit"
import { ButtonDialog } from "@/components/actions/button-dialog"
import RegistrationForm from "@/components/dialogs/registration/frmregistration"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUserByEmail, getUserById, getUserData, getUsers, seedUser, seedUserData } from "@/db/offline/Dexie/schema/user-service"
import { toast } from "@/hooks/use-toast"
import { IUserData } from "@/components/interfaces/iuser"
import { createSession } from "@/lib/sessions-client"
import { useRouter } from 'next/navigation'
import LoginService from "./LoginService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useOnlineStatus } from "@/hooks/use-network";
import Captcha from "@/components/general/captcha";


const formSchema = z.object({
  email: z.string().email({message:"Invalid Email Address"}).trim(),
  password: z
      .string()
      .min(8, {message:"Password must be at least 8 characters"})
      .trim(),
});

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
  const isOnline = useOnlineStatus()
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    seedData();  
    seedUserData();
  }, []);

    const {
      register,
      handleSubmit,
      formState: {errors, isSubmitting},
      reset,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
    })
    
    const offlineLogin = async (data: FormData) => {
      try {
        const user = await getUserByEmail(data.email);
    
        if (!user) {
          return toast({
            variant: "destructive",
            title: "No Record Found!",
            description: "The email was not found in the database. Please try again!",
          });
        }
    
        const decryptedPassword = await hashPassword(data.password, user.salt);
    
        if (
          user.password !== decryptedPassword ||
          (user.email !== data.email && user.username !== data.email)
        ) {
          return toast({
            variant: "destructive",
            title: "Invalid Credentials!",
            description: "The email or password is incorrect. Please try again!",
          });
        }
    
        const userData: IUserData | null = await getUserData(user.id);
    
        if (!userData) {
          return toast({
            variant: "destructive",
            title: "Login Error!",
            description: "There was a problem during login. Please try again!",
          });
        }
        console.log(userData)
        console.log(user.id)
        await createSession(user.id, userData, "ABC123");
        // await createSession(user.id, userData, "ABC123");
    
        toast({
          variant: "green",
          title: "Success!",
          description: "Welcome to KCIS!",
        });
    
        // Redirect to the profile form if the user is not yet registered
        window.location.href = "/personprofile/form";
      } catch (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Unexpected Error!",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    };
    
  
    const onSubmit = async (data: FormData) => {
      // debugger;
      try {

        if(!verified){
          toast({
            variant: "destructive",
            title: "Captcha Error!",
            description: "Invalid Captcha, Please try again!",
          });
          return;
        }

        if (isOnline) {
          const onlinePayload = await LoginService.onlineLogin(data.email, data.password);
          
          if (onlinePayload) {
            await createSession(onlinePayload.user.id, onlinePayload.user.userData, onlinePayload.token);
            toast({
              variant: "green",
              title: "Success!",
              description: "Welcome to KCIS!",
            });
            window.location.href = "/personprofile/form";
            return; // Exit after successful login
          }
        }
        
        // If online login fails or offline mode
        await offlineLogin(data);
      } catch (error) {
        console.error("Login Error: ", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem during your login process. Please try again!",
        });
      }
    }
    
    
  return (
    // <div className="bg-[url('/assets/Backgrounds/DSWD-Virtual-Background-01.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-full h-screen flex">
          {/* Left side with background image - takes full height */}
          <div className="relative hidden md:block md:w-7/12 bg-muted">
            <img
              src="/assets/Backgrounds/DSWD-Virtual-Background-01.jpg"
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black/30">
              <h1 className="text-4xl font-bold text-white mb-4">KALAHI-CIDSS</h1>
              <p className="text-xl text-white text-center">Information System for Community-Driven Development</p>
            </div>
          </div>

          {/* Right side with login form - takes full height */}
          <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-6 md:p-12 bg-background">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <h1 className="text-2xl font-bold">KALAHI-CIDSS Information System</h1>
                  <p className="text-balance text-muted-foreground">Login to your registered account</p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      name="email"
                      placeholder="m@example.com"
                      className="lowercase"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-primary underline-offset-2 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" {...register("password")} name="password" required />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  </div>

                  {(!verified && <Captcha verified={setVerified} />)}

                  <ButtonSubmit label="Login" />

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <ButtonDialog
                      dialogForm={RegistrationForm}
                      label="Register"
                      dialog_title="Welcome to KALAHI-CIDSS Information System"
                      css="underline underline-offset-4 cursor-pointer text-primary"
                    />
                  </div>
                </div>
              </form>

              <div className="mt-8 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  )
}