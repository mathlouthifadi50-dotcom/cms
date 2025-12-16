'use server'

import { z } from 'zod'
import { fetchStrapi } from '../lib/strapi-client'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation Error',
    }
  }

  try {
    const response = await fetchStrapi('/contact-submissions', {}, {
      method: 'POST',
      body: JSON.stringify({ data: validatedFields.data }),
    });
    
    if (!response) {
       return { message: 'Failed to submit form' };
    }

    return { success: true, message: 'Message sent successfully!' }
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { message: 'Failed to submit form' }
  }
}
