'use server'

import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function createPersonalDetails(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  const { data: personalDetailsData, error: personalDetailsError } = await supabase
    .from('personal_details')
    .insert([{ name, email }])
    .select()
    .single()

  if (personalDetailsError) {
    console.error('Error inserting personal details:', personalDetailsError)
    return { error: personalDetailsError }
  }

  // Set cookies for the user session
  const cookieStore = await cookies()
  cookieStore.set('userName', name, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week
  cookieStore.set('userEmail', email, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week

  return { data: personalDetailsData }
}