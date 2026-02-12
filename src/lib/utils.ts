// lib/utils.ts

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function calculatePercentile(score: number, maxScore: number): number {
  return (score / maxScore) * 100;
}

export function getCollegeFilterOptions() {
  return {
    locations: [
      'All India',
      'North India',
      'South India',
      'East India',
      'West India',
    ],
    collegeTypes: [
      'IIT',
      'NIT',
      'University',
      'Private College',
      'Government College',
    ],
    streams: [
      'Engineering',
      'Medicine',
      'Commerce',
      'Arts',
      'Science',
    ],
  };
}
