"use client";

import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { submit } from "./actions"; // Server Action
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import PasswordFields from "@/components/forms/form-password";
import { ButtonSubmit } from "@/components/actions/button-submit";
import { Button } from "@/components/ui/button";
import PouchDB from "pouchdb";

const localDB = new PouchDB("users");

export default function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userData = {
      _id: new Date().toISOString(), // Unique ID for offline storage
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      // Try submitting to the server first
      const response = await submit(null,formData);
      if (response?.error) throw new Error(response.error);

      setSuccess(true);
      setError(null);
      console.log("✅ Data saved to the server");
    } catch (error) {
      console.warn("❌ Server error, saving offline:", error);
      try {
        await localDB.put(userData); // Save to PouchDB
        setSuccess(true);
        setError("Server is offline. Data saved locally.");
        console.log("📌 Data saved to PouchDB");
      } catch (dbError) {
        console.error("❌ Failed to save data offline:", dbError);
        setError("Error saving data offline.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8">
      <div className={cn("flex flex-col gap-6 overflow-auto max-h-[80vh] scrollbar-hide p-4", className)} {...props}>
        <div className="pb-5">
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
            <div className="sm:col-span-8">
              <label htmlFor="username" className="block text-sm/6 form-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <Input id="username" type="text" name="username" placeholder="Juan D. Dragon" required />
              </div>
            </div>
            <div className="sm:col-span-8">
              <label htmlFor="email" className="block text-sm/6 form-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <Input id="email" type="email" name="email" placeholder="email@example.com" required />
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
            <PasswordFields />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="destructive">
            Cancel
          </Button>
        </DialogClose>

        <ButtonSubmit label="Submit" />
      </DialogFooter>
    </form>
  );
}
