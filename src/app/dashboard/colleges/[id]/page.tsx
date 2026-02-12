import { collegesData } from '@/lib/colleges-data';
import DashboardCollegeDetailsClient from './DashboardCollegeDetailsClient';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-bold">College not found</h2>
        </div>
      </div>
    );
  }

  return <DashboardCollegeDetailsClient college={college} />;
}
