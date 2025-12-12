'use server'

import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { gradeEssay } from '@/lib/openai';

// Define types for our database tables
type Score = {
  id?: string;
  person: string;
  meeting_two_score?: number;
  meeting_three_score?: number;
  essay_answer?: string;
  motivation_answer?: string;
};

// Helper function to get person ID from cookies
async function getPersonIdFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const userName = cookieStore.get('userName')?.value
    const userEmail = cookieStore.get('userEmail')?.value

    if (!userName || !userEmail) {
      console.error('User name or email not found in cookies.')
      return null
    }

    const { data, error } = await supabase
      .from('personal_details')
      .select('id')
      .eq('name', userName)
      .eq('email', userEmail)
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching person ID:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Unexpected error in getPersonIdFromCookies:', error)
    return null
  }
}

// Removed unused SupabaseError type

// Helper function to retry operations with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 100
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed, retrying...`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after all retries');
}

// Unified function to update scores with transaction support
async function updateScores(updates: {
  meetingTwoScore?: number;
  meetingThreeScore?: number;
  essayAnswer?: string;
  motivationAnswer?: string;
}) {
  const personId = await getPersonIdFromCookies();
  if (!personId) {
    throw new Error('Person ID not found in cookies');
  }

  // Validate scores
  if (updates.meetingTwoScore !== undefined && 
      (typeof updates.meetingTwoScore !== 'number' || isNaN(updates.meetingTwoScore))) {
    throw new Error('Invalid meeting two score');
  }

  if (updates.meetingThreeScore !== undefined && 
      (typeof updates.meetingThreeScore !== 'number' || isNaN(updates.meetingThreeScore))) {
    throw new Error('Invalid meeting three score');
  }

  // Define interface for the update data
  interface ScoreUpdateData {
    person: string;
    meeting_two_score?: number;
    meeting_three_score?: number;
    essay_answer?: string;
    motivation_answer?: string;
  }

  // Prepare update data with only defined values
  const updateData: ScoreUpdateData = { person: personId };
  if (updates.meetingTwoScore !== undefined) updateData.meeting_two_score = updates.meetingTwoScore;
  if (updates.meetingThreeScore !== undefined) updateData.meeting_three_score = updates.meetingThreeScore;
  if (updates.essayAnswer !== undefined) updateData.essay_answer = updates.essayAnswer;
  if (updates.motivationAnswer !== undefined) updateData.motivation_answer = updates.motivationAnswer;

  // Execute with retry logic
  return withRetry<Score>(async () => {
    // First, check if a record exists for this person
    const { data: existingData } = await supabase
      .from('score')
      .select('id')
      .eq('person', personId)
      .maybeSingle();

    let data, error;
    
    try {
      if (existingData) {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('score')
          .update(updateData)
          .eq('person', personId)
          .select('id, person, meeting_two_score, meeting_three_score, essay_answer, motivation_answer')
          .single();
        
        data = updatedData;
        error = updateError;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('score')
          .insert(updateData)
          .select('id, person, meeting_two_score, meeting_three_score, essay_answer, motivation_answer')
          .single();
        
        data = insertedData;
        error = insertError;
      }
    
      if (error) {
        console.error('Error updating scores:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from the database operation');
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in updateScores:', err);
      throw err;
    }
  });
}

// Define a type for the response data
type ValidationResponse = {
  data: {
    essay_answer?: string;
    meeting_three_score?: number;
    motivation_answer?: string;
  };
  error?: string;
};

// Public API functions
export async function saveM3Q2Feedback(essayAnswer: string): Promise<ValidationResponse> {
  try {
    // Just validate but don't save yet
    if (!essayAnswer?.trim()) {
      throw new Error('Essay answer cannot be empty');
    }
    
    const gradedScore = await gradeEssay(essayAnswer);
    if (typeof gradedScore !== 'number' || isNaN(gradedScore)) {
      throw new Error('Invalid score returned from essay grading');
    }
    
    // Return the data without saving
    return { 
      data: {
        essay_answer: essayAnswer,
        meeting_three_score: gradedScore
      }
    };
  } catch (error) {
    console.error('Error validating essay:', error);
    return { 
      data: {},
      error: error instanceof Error ? error.message : 'Failed to validate essay'
    };
  }
}

export async function saveM3Q3Feedback(motivationAnswer: string): Promise<ValidationResponse> {
  try {
    // Just validate but don't save yet
    if (!motivationAnswer?.trim()) {
      throw new Error('Motivation answer cannot be empty');
    }
    
    // Return the data without saving
    return { 
      data: { 
        motivation_answer: motivationAnswer 
      }
    };
  } catch (error) {
    console.error('Error validating motivation:', error);
    return { 
      data: {},
      error: error instanceof Error ? error.message : 'Failed to validate motivation'
    };
  }
}

type ActionResponse = {
  data?: Score;
  error?: string;
};

export async function saveMeetingTwoScore(score: number): Promise<ActionResponse> {
  try {
    if (typeof score !== 'number' || isNaN(score)) {
      throw new Error('Invalid score provided');
    }
    
    const result = await updateScores({ meetingTwoScore: score });
    return { data: result };
  } catch (error) {
    console.error('Error in saveMeetingTwoScore:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to save meeting two score' 
    };
  }
}

export async function getScoresForCurrentUser() {
  try {
    const personId = await getPersonIdFromCookies()
    if (!personId) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('score')
      .select('meeting_two_score, meeting_three_score')
      .eq('person', personId)
      .single();

    if (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }

    return {
      meetingTwoScore: data?.meeting_two_score || 0,
      meetingThreeScore: data?.meeting_three_score || 0
    };
  } catch (error) {
    console.error('Error in getScoresForCurrentUser:', error);
    return {
      meetingTwoScore: 0,
      meetingThreeScore: 0,
      error: 'An unexpected error occurred'
    };
  }
}
