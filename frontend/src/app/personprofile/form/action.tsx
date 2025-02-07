'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  first_name: z.string().min(2, 'First name must be at least 2 characters long'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters long'),
  middle_name: z.string().min(2, 'Middle name must be at least 2 characters long'),
  extension_name: z.string().min(2, 'Extension name must be at least 2 characters long'),
  birthdate: z.string().min(2, 'Birthdate must be at least 2 characters long'),
  age: z.string().min(2, 'Age must be at least 2 characters long'),
  

  

})

export async function onSubmit(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors }
  }

  // Here you would typically save the user to your database
  // For this example, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true, message: 'User registered successfully!' }
}

