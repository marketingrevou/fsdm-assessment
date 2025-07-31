interface MarketerTypeResult {
  type: string;
  imagePath: string;
}

export function getMarketerTypeAndImage(
  meetingTwoScore: number | null,
  meetingThreeScore: number | null
): MarketerTypeResult {
  // Data Aware Marketer: meeting two >= 4 AND meeting three < 2
  if (meetingTwoScore !== null && meetingTwoScore >= 4 && 
      meetingThreeScore !== null && meetingThreeScore < 2) {
    return { type: 'Data-Aware Marketer', imagePath: '/marketer-type/data-aware.svg' };
  }
  
  // Creative Marketer: meeting two < 4 AND meeting three >= 2
  if (meetingTwoScore !== null && meetingTwoScore < 4 && 
      meetingThreeScore !== null && meetingThreeScore >= 2) {
    return { type: 'Creative Marketer', imagePath: '/marketer-type/creative.svg' };
  }
  
  // All-Around Marketer: meeting two >= 4 AND meeting three >= 2
  if (meetingTwoScore !== null && meetingTwoScore >= 4 && 
      meetingThreeScore !== null && meetingThreeScore >= 2) {
    return { type: 'All-Around Marketer', imagePath: '/marketer-type/all-around.svg' };
  }
  
  // Curious Marketer: doesn't meet any of the above requirements
  return { type: 'Curious Marketer', imagePath: '/marketer-type/curious.svg' };
}
