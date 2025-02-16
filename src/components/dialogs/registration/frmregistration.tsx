"use client"

import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";
import { submit } from "./actions";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import PasswordFields from "@/components/forms/form-password";
import { ButtonSubmit } from "@/components/actions/button-submit";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { getDb } from "@/db/offline/sqlJsInit";

export default function RegistrationForm({
    className,
    ...props
  }: React.ComponentProps<"div">) {
    const [state, submitAction] = useActionState(submit, undefined)
    const { pending } = useFormStatus();

    // useEffect(() => {
    //   async function loadDb() {
    //     const database = await getDb();
    //     console.log("DB initialized:", database);
    //   }
    //   loadDb();
    // }, []);

    return (
        <>
            <form action={submitAction} className="p-6 md:p-8">
                <div className={cn("flex flex-col gap-6 overflow-auto max-h-[80vh] scrollbar-hide p-4", className)} {...props}>
                    <div className="pb-5">
                        <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
                            <div className="sm:col-span-8">
                                <label htmlFor="username" className="block text-sm/6 form-medium text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <Input id="username" type="text" name="username" placeholder="Juan D. Dragon" required/>
                                </div>
                                {state?.errors?.username && <p>{state.errors.username}</p>}
                            </div>
                            <div className="sm:col-span-8">
                                <label htmlFor="email" className="block text-sm/6 form-medium text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <Input id="email" type="email" name="email" placeholder="email@example.com" required/>
                                </div>
                                {state?.errors?.email && <p>{state.errors.email}</p>}
                            </div>
                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
                            <PasswordFields/>
                        </div>
                        {state?.errors?.password && <p>{state.errors.password}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                            Cancel
                        </Button>
                    </DialogClose>

                    <ButtonSubmit label="Submit"/>
                </DialogFooter>
            </form>
        </>
    )
}