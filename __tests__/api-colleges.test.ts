import { GET } from '../src/app/api/colleges/route';

function makeReq(query: string) {
  return { nextUrl: { searchParams: new URLSearchParams(query) } } as any;
}

test('GET /api/colleges?id=college_1 returns college', async () => {
  const req = makeReq('id=college_1');
  const res: any = await GET(req);
  // NextResponse.json returns a Response-like object with json() method
  const body = await res.json();
  expect(body).toHaveProperty('success', true);
  expect(body).toHaveProperty('data');
  expect(body.data).toHaveProperty('id', 'college_1');
});
