'use client'

import { useActionState } from 'react'
import { submitContactForm } from '../actions/contact'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, null)

  return (
    <form action={formAction} className="space-y-6 max-w-lg mx-auto bg-card p-6 rounded shadow">
      {state?.success && (
        <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded">
          {state.message}
        </div>
      )}
      {state?.message && !state.success && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
          {state.message}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">Name</label>
        <input id="name" name="name" type="text" className="w-full p-3 border rounded bg-background" required />
        {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-medium">Email</label>
        <input id="email" name="email" type="email" className="w-full p-3 border rounded bg-background" required />
        {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block mb-2 font-medium">Message</label>
        <textarea id="message" name="message" rows={5} className="w-full p-3 border rounded bg-background" required />
        {state?.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message[0]}</p>}
      </div>

      <SubmitButton />
    </form>
  )
}
