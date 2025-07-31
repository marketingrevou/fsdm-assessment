import { getMarketerTypeAndImage } from './marketerTypeCalculator';

describe('getMarketerTypeAndImage', () => {
  // All-Around Marketer: meeting two >= 4 AND meeting three >= 2
  it('should return All-Around Marketer when meeting two >= 4 and meeting three >= 2', () => {
    const result = getMarketerTypeAndImage(4, 2);
    expect(result.type).toBe('All-Around Marketer');
    expect(result.imagePath).toBe('/marketer-type/all-around.svg');
  });

  it('should return All-Around Marketer with higher scores', () => {
    const result = getMarketerTypeAndImage(5, 3);
    expect(result.type).toBe('All-Around Marketer');
    expect(result.imagePath).toBe('/marketer-type/all-around.svg');
  });

  // Data-Aware Marketer: meeting two >= 4 AND meeting three < 2
  it('should return Data-Aware Marketer when meeting two >= 4 and meeting three < 2', () => {
    const result = getMarketerTypeAndImage(4, 1);
    expect(result.type).toBe('Data-Aware Marketer');
    expect(result.imagePath).toBe('/marketer-type/data-aware.svg');
  });

  it('should return Data-Aware Marketer with meeting three = 0', () => {
    const result = getMarketerTypeAndImage(5, 0);
    expect(result.type).toBe('Data-Aware Marketer');
    expect(result.imagePath).toBe('/marketer-type/data-aware.svg');
  });

  // Creative Marketer: meeting two < 4 AND meeting three >= 2
  it('should return Creative Marketer when meeting two < 4 and meeting three >= 2', () => {
    const result = getMarketerTypeAndImage(3, 2);
    expect(result.type).toBe('Creative Marketer');
    expect(result.imagePath).toBe('/marketer-type/creative.svg');
  });

  it('should return Creative Marketer with low meeting two score', () => {
    const result = getMarketerTypeAndImage(0, 3);
    expect(result.type).toBe('Creative Marketer');
    expect(result.imagePath).toBe('/marketer-type/creative.svg');
  });

  // Curious Marketer: doesn't meet any of the above requirements
  it('should return Curious Marketer when meeting two < 4 and meeting three < 2', () => {
    const result = getMarketerTypeAndImage(3, 1);
    expect(result.type).toBe('Curious Marketer');
    expect(result.imagePath).toBe('/marketer-type/curious.svg');
  });

  it('should return Curious Marketer with both low scores', () => {
    const result = getMarketerTypeAndImage(0, 0);
    expect(result.type).toBe('Curious Marketer');
    expect(result.imagePath).toBe('/marketer-type/curious.svg');
  });

  // Null handling - should default to Curious Marketer
  it('should return Curious Marketer when meetingTwoScore is null', () => {
    const result = getMarketerTypeAndImage(null, 2);
    expect(result.type).toBe('Curious Marketer');
    expect(result.imagePath).toBe('/marketer-type/curious.svg');
  });

  it('should return Curious Marketer when meetingThreeScore is null', () => {
    const result = getMarketerTypeAndImage(4, null);
    expect(result.type).toBe('Curious Marketer');
    expect(result.imagePath).toBe('/marketer-type/curious.svg');
  });

  it('should return Curious Marketer when both scores are null', () => {
    const result = getMarketerTypeAndImage(null, null);
    expect(result.type).toBe('Curious Marketer');
    expect(result.imagePath).toBe('/marketer-type/curious.svg');
  });

  // Boundary condition tests
  it('should handle boundary conditions correctly', () => {
    // Test meeting two boundary (exactly 4)
    let result = getMarketerTypeAndImage(4, 0);
    expect(result.type).toBe('Data-Aware Marketer'); // 4 >= 4, 0 < 2

    result = getMarketerTypeAndImage(3, 0);
    expect(result.type).toBe('Curious Marketer'); // 3 < 4, 0 < 2

    // Test meeting three boundary (exactly 2)
    result = getMarketerTypeAndImage(0, 2);
    expect(result.type).toBe('Creative Marketer'); // 0 < 4, 2 >= 2

    result = getMarketerTypeAndImage(0, 1);
    expect(result.type).toBe('Curious Marketer'); // 0 < 4, 1 < 2

    // Test exact boundary combination
    result = getMarketerTypeAndImage(4, 2);
    expect(result.type).toBe('All-Around Marketer'); // 4 >= 4, 2 >= 2
  });
});
