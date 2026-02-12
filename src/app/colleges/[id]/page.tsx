import { collegesData } from '@/lib/colleges-data';
import CollegeDetailsClient from './CollegeDetailsClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CollegeDetails({ params }: Props) {
  const { id } = await params;
  const match = id.match(/^college_(\d+)$/);
  let college = null as any;

  if (match) {
    const idx = parseInt(match[1], 10) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < collegesData.length) {
      college = { id, ...collegesData[idx] };
    }
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">College not found</h2>
        </div>
      </div>
    );
  }

  return <CollegeDetailsClient college={college} />;
}
