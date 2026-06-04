/**
 * Category utility to map various dynamic service category strings 
 * (from the 58 service categories taxonomy) to one of the 4 supported 
 * console vertical layouts (Dental, Fitness, Salon, Dining) or default.
 */
export function getVerticalFromCategory(category: string): 'Dental' | 'Fitness' | 'Salon' | 'Dining' | 'Wellness' | 'Default' {
  if (!category) return 'Default';
  const c = category.toLowerCase();
  
  if (c.includes('dental') || c.includes('doctor') || c.includes('clinic')) {
    return 'Dental';
  }
  if (c.includes('fit') || c.includes('yoga') || c.includes('gym')) {
    return 'Fitness';
  }
  if (c.includes('salon') || c.includes('spa') || c.includes('beauty') || c.includes('hair') || c.includes('grooming')) {
    return 'Salon';
  }
  if (c.includes('dine') || c.includes('dining') || c.includes('restaurant') || c.includes('table')) {
    return 'Dining';
  }
  if (c.includes('wellness')) {
    return 'Wellness';
  }
  
  return 'Default';
}
