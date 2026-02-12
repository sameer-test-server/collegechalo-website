import Link from 'next/link';
import { Header, Footer, Card } from '@/components';
import { collegesData } from '@/lib/colleges-data';
import { generateIndexId } from '@/lib/id-generator';

interface Props {
  searchParams: Promise<{
    state?: string;
    type?: string;
    search?: string;
  }>;
}

export default async function CollegesPage({ searchParams }: Props) {
  const params = await searchParams;
  const stateFilter = (params.state || '').trim().toLowerCase();
  const typeFilter = (params.type || '').trim().toLowerCase();
  const searchFilter = (params.search || '').trim().toLowerCase();

  const filteredColleges = collegesData.filter((college) => {
    const state = (college.state || '').toLowerCase();
    const type = (college.type || '').toLowerCase();
    const text = `${college.name} ${college.location} ${college.state || ''}`.toLowerCase();

    if (stateFilter && state !== stateFilter) return false;
    if (typeFilter && type !== typeFilter) return false;
    if (searchFilter && !text.includes(searchFilter)) return false;
    return true;
  });

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
          {(stateFilter || typeFilter || searchFilter) && (
            <div className="mb-6 rounded-2xl border border-slate-300 bg-white p-4">
              <p className="text-sm font-semibold text-slate-700">
                Active filters:
                {stateFilter && <span className="ml-2 rounded bg-indigo-50 px-2 py-0.5 text-indigo-700">State: {params.state}</span>}
                {typeFilter && <span className="ml-2 rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">Type: {params.type}</span>}
                {searchFilter && <span className="ml-2 rounded bg-amber-50 px-2 py-0.5 text-amber-700">Search: {params.search}</span>}
              </p>
              <Link href="/colleges" className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline">
                Clear filters
              </Link>
            </div>
          )}

          {filteredColleges.length === 0 && (
            <div className="mb-8 rounded-2xl border border-slate-300 bg-white p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-900">No colleges found</h2>
              <p className="mt-2 text-slate-600">Try changing filters or search criteria.</p>
              <Link href="/colleges" className="mt-4 inline-block text-sm font-semibold text-indigo-700 hover:underline">
                View all colleges
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college, index) => {
              const originalIndex = collegesData.findIndex((item) => item.name === college.name && item.location === college.location);
              const id = originalIndex >= 0 ? generateIndexId('college', originalIndex) : `college_${index + 1}`;
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
