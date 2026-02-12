import { GET } from '../src/app/api/colleges/route';

function makeReq(query: string) {
  return { nextUrl: { searchParams: new URLSearchParams(query) } } as any;
}

test('GET /api/colleges with search and placement params responds', async () => {
  const req = makeReq('search=IIT&minPlacement=90');
  const res: any = await GET(req);
  const body = await res.json();
  expect(body).toHaveProperty('success', true);
  expect(Array.isArray(body.data)).toBe(true);
});
