import Link from 'next/link';
import { Header, Footer, Card } from '@/components';
import { collegesData } from '@/lib/colleges-data';

export default function CollegesPage() {
  const typeIcon = (type?: string) => {
    if (!type) return '🎓';
    if (type.toLowerCase().includes('government')) return '🏛️';
    if (type.toLowerCase().includes('private')) return '🎓';
    return '🏫';
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header
        title="Explore Colleges"
        subtitle="Browse and compare top colleges in India"
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collegesData.map((college, index) => {
              const id = `college_${index + 1}`;
              return (
                <Link key={id} href={`/colleges/${id}`} className="block">
                  <Card
                    title={college.name}
                    description={`${college.location} • NIRF Overall ${college.nirf_overall_rank ?? college.ranking} • Placement ${college.placement_rate}%`}
                    icon={typeIcon(college.type)}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
