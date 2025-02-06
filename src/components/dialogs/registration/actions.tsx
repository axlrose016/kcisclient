"use server";
import { db } from "@/db";
import { useraccess, users } from "@/db/schema/users";
import { randomUUID } from "crypto";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { fetchModules, fetchPermissions, fetchRoles } from "@/components/_dal/libraries";
import { IModules, IPermissions, IRoles, IUserAccess, IUserData } from "@/components/interfaces/library-interface";


const formSchema = z.object({
  username: z
    .string()
    .min(8, { message: "Username must be at least 8 characters"}),
  email: z
    .string()
    .email({ message: "Invalid Email Address" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function submit(prevState: any, formData: FormData) {
  const formObject = Object.fromEntries(formData.entries());

  const result = formSchema.safeParse(formObject);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

    const { username, email, password } = result.data
    const id = randomUUID();  // Generates a new unique UUID
    
    const hashedPassword = await bcrypt.hash(password, 10)

    
    const _roles = await fetchRoles();
    const _modules = await fetchModules();
    const _permission = await fetchPermissions();
    const defaultRole = _roles.filter((w:IRoles) => w.role_description.includes("Guest"))
    const defaultModule = _modules.filter((w:IModules) => w.module_description.includes("Person Profile"))
    const defaultPermission = _permission.filter((w:IPermissions) => w.permission_description.includes("Can Add"))

    await db.transaction(async (trx) => {

      const data = await trx
      .insert(users)
      .values({
        id,
        username,email,password: hashedPassword, 
        created_by:id
      })
      .returning({id: users.id})

      const user = data[0]
      const access_id = randomUUID();  

      const access = await trx
      .insert(useraccess)
      .values({
        id: access_id,
        user_id: user.id,
        role_id: defaultRole[0].id,
        module_id: defaultModule[0].id,
        permission_id:defaultPermission[0].id,
        created_by:user.id,
      }).returning({id: useraccess.id})
  
      const role = defaultRole[0].role_description ?? "Guest";
      const permission: IUserData[] = [{
        name: "Axl",
        email:"argvillanueva@dswd.gov.ph",
        photo:"",
        userAccess:[{
          role: role,
          module: defaultModule[0].module_description,
          permission: defaultPermission[0].permission_description
        }]
      }]
      
      await createSession(user.id, role,permission);
    });
    
    redirect('/');
}
