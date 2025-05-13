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
import { getUserAccessById, getUserByEmail, getUserById, getUserData, getUsers, seedUser, seedUserData } from "@/db/offline/Dexie/schema/user-service"
import { toast } from "@/hooks/use-toast"
import { IUserData } from "@/components/interfaces/iuser"
import { createSession } from "@/lib/sessions-client"
import { useRouter } from 'next/navigation'
import LoginService from "./LoginService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useOnlineStatus } from "@/hooks/use-network";
import Captcha from "@/components/general/captcha";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import UsersService from "@/components/dialogs/registration/UsersService";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
  const isOnline = useOnlineStatus()
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    console.log("API: ", process.env.NEXT_PUBLIC_API_BASE_URL_KCIS)
    seedData();
    seedUserData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({

    resolver: zodResolver(formSchema),
  })

  const offlineLogin = async (data: FormData) => {
    try {
      const user = await getUserByEmail(data.email);

      if (!user) {
        setIsLoading(false)
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

      if (isOnline) {
        const userAccess = await getUserAccessById(user.id);
        if (userAccess) {

          const uploaded = await UsersService.syncUserData(user, userAccess);
          if (uploaded) {
            // saveUser();
          }
        }

      }


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

  const cleanNameToLowercase = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
  };

  // Example:
  // const rawName = " JOhn    Martin ";
  // const cleanedName = cleanNameToLowercase(rawName);

  // console.log(cleanedName); // Output: "john martin"



  const onSubmit = async (data: FormData) => {

    
    setIsLoading(true);
    // debugger;
    try {

      if (!verified) {
        toast({
          variant: "destructive",
          title: "Captcha Error!",
          description: "Invalid Captcha, Please try again!",
        });
        setIsLoading(false)
        return;
      }

      if (isOnline) {
        const onlinePayload = await LoginService.onlineLogin(data.email, data.password);
        // debugger;
        if (onlinePayload) {
          const onlineProfile = await LoginService.getProfile(onlinePayload.user.id, onlinePayload.token);
          if (onlineProfile) {
            // save to dexie
            dexieDb.open();
            dexieDb.transaction('rw', [
              dexieDb.person_profile,
              dexieDb.person_profile_sector,
              dexieDb.person_profile_disability,
              dexieDb.person_profile_family_composition,
              dexieDb.attachments,
              dexieDb.person_profile_cfw_fam_program_details], async () => {
                try {
                  const existingRecord = await dexieDb.person_profile.get(onlineProfile.id);
                  if (existingRecord) {
                    debugger;
                    await dexieDb.person_profile.update(onlineProfile.id, onlineProfile);
                    await dexieDb.person_profile_sector.update(onlineProfile.id, onlineProfile.person_profile_sector);
                    await dexieDb.person_profile_disability.update(onlineProfile.id, onlineProfile.person_profile_disability ?? []);
                    await dexieDb.person_profile_family_composition.update(onlineProfile.id, onlineProfile.person_profile_family_composition ?? []);
                    await dexieDb.attachments.update(onlineProfile.id, onlineProfile.attachments ?? []);
                    await dexieDb.person_profile_cfw_fam_program_details.update(onlineProfile.id, onlineProfile.person_profile_cfw_fam_program_details ?? []);
                    console.log("Record updated in DexieDB:", onlineProfile.id);
                  } else {
                    await dexieDb.person_profile.add(onlineProfile);
                    if (onlineProfile.person_profile_disability.length !== 0) {
                      await dexieDb.person_profile_disability.bulkAdd(onlineProfile.person_profile_disability);
                    }
                    if (onlineProfile.person_profile_family_composition.length !== 0) {
                      for (let i = 0; i < onlineProfile.person_profile_family_composition.length; i++) {
                        const family = onlineProfile.person_profile_family_composition[i];
                        await dexieDb.person_profile_family_composition.add(family); // Save the object without raw_id
                      }
                    }
                    if (onlineProfile.person_profile_sector.length !== 0) {
                      for (let i = 0; i < onlineProfile.person_profile_sector.length; i++) {
                        await dexieDb.person_profile_sector.bulkAdd(onlineProfile.person_profile_sector);
                      }
                    }
                    if (onlineProfile.attachments.length !== 0) {
                      for (let i = 0; i < onlineProfile.attachments.length; i++) {
                        await dexieDb.attachments.bulkAdd(onlineProfile.attachments);
                      }

                    }
                    if (onlineProfile.person_profile_cfw_fam_program_details) {
                      for (let i = 0; i < onlineProfile.person_profile_cfw_fam_program_details.length; i++) {
                        await dexieDb.person_profile_cfw_fam_program_details.bulkAdd(onlineProfile.person_profile_cfw_fam_program_details);
                      }
                    }
                    console.log("➕New record added to DexieDB:", onlineProfile.id);
                  }
                } catch (error) {
                  setIsLoading(false)
                  console.log("Error saving to DexieDB:", error);
                }
              });

          }
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
      setIsLoading(false)
      console.error("Login Error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem during your login process. Please try again!",
      });
    }
  }

  const [testData, setTestData] = useState<any>(null);
  const [isVisi, setVisi] = useState(false);
  const handleOnClick = () => {
    setIsLoading(true)
    // const testData1 = testData;
    // const testDataFinal = cleanNameToLowercase(testData1);
    // setTestData(testDataFinal);
    // setVisi(true);
  }
  const [isLoading, setIsLoading] = useState(false)
  return (
    // <div className="bg-[url('/assets/Backgrounds/DSWD-Virtual-Background-01.jpg')] bg-cover bg-center bg-no-repeat">
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* <p className={`${isVisi == true ? "" : "hidden"}`}>Sorry Space, you dont have space here.</p>
      <pre className="bg-yellow-200">{testData}</pre>
      <div className="w-full h-screen flex">
        <Input
          type="text"
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
        >

        </Input>
        <Button onClick={handleOnClick}>Click</Button>
      </div> */}
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

                <ButtonSubmit label="Login" disabled={isLoading} />

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
