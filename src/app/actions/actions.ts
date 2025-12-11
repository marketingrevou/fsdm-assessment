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

  // Create an initial score entry with default values
  const { error: scoreError } = await supabase
    .from('score')
    .insert([{ 
      person: personalDetailsData.id,
      meeting_two_score: 0,
      meeting_three_score: 0,
      created_at: new Date().toISOString()
    }])

  if (scoreError) {
    console.error('Error creating initial score entry:', scoreError);
    // Roll back the personal details creation
    await supabase
      .from('personal_details')
      .delete()
      .eq('id', personalDetailsData.id);
      
    return { 
      error: scoreError,
      message: 'Failed to initialize user profile. Please try again.'
    };
  }

  const cookieStore = await cookies()
  cookieStore.set('userName', name, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week
  cookieStore.set('userEmail', email, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // 1 week

  return { data: personalDetailsData }
}