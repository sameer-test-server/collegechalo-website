import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyAdminToken } from '../../../../lib/admin-auth';
import {
  createAdminCollege,
  deleteAdminCollege,
  listAdminColleges,
  updateAdminCollege,
} from '../../../../lib/admin-colleges-store';

function requireAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization') || undefined;
  return verifyAdminToken(auth);
}

function normalizePayload(body: any) {
  return {
    name: String(body?.name || '').trim(),
    location: String(body?.location || '').trim(),
    state: String(body?.state || '').trim(),
    founded: Number(body?.founded || 2000),
    ranking: Number(body?.ranking || 999),
    fees: Number(body?.fees || 0),
    placement_rate: Number(body?.placement_rate || 0),
    rating: Number(body?.rating || 0),
    description: String(body?.description || '').trim(),
    courses: Array.isArray(body?.courses)
      ? body.courses.map((x: unknown) => String(x).trim()).filter(Boolean)
      : String(body?.courses || '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
    reviews_count: Number(body?.reviews_count || 0),
    image_url: String(body?.image_url || '').trim(),
    type: String(body?.type || 'Government').trim(),
    website: String(body?.website || '').trim(),
  };
}

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const data = await db.collection('colleges').find({}).sort({ ranking: 1 }).limit(500).toArray();
      return NextResponse.json({ success: true, data, source: 'mongodb' });
    } catch (err) {
      console.warn('[admin-colleges] MongoDB read failed, falling back to memory');
    }
  }

  return NextResponse.json({ success: true, data: listAdminColleges(), source: 'memory' });
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  const payload = normalizePayload(body);
  if (!payload.name || !payload.location) {
    return NextResponse.json({ success: false, error: 'Name and location are required' }, { status: 400 });
  }

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const item = { ...payload, id: `college_custom_${Date.now()}`, created_at: new Date().toISOString() };
      await db.collection('colleges').insertOne(item);
      return NextResponse.json({ success: true, data: item, source: 'mongodb' }, { status: 201 });
    } catch (err) {
      console.warn('[admin-colleges] MongoDB create failed, falling back to memory');
    }
  }

  const created = createAdminCollege(payload);
  return NextResponse.json({ success: true, data: created, source: 'memory' }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = String(body?.id || '').trim();
  if (!id) return NextResponse.json({ success: false, error: 'College id is required' }, { status: 400 });
  const payload = normalizePayload(body);

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('colleges').updateOne(
        { id },
        { $set: { ...payload, updated_at: new Date().toISOString() } },
      );
      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
      }
      const updated = await db.collection('colleges').findOne({ id });
      return NextResponse.json({ success: true, data: updated, source: 'mongodb' });
    } catch (err) {
      console.warn('[admin-colleges] MongoDB update failed, falling back to memory');
    }
  }

  const updated = updateAdminCollege(id, payload);
  if (!updated) return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: updated, source: 'memory' });
}

export async function DELETE(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const id = String(request.nextUrl.searchParams.get('id') || '').trim();
  if (!id) return NextResponse.json({ success: false, error: 'College id is required' }, { status: 400 });

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('colleges').deleteOne({ id });
      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, deleted: id, source: 'mongodb' });
    } catch (err) {
      console.warn('[admin-colleges] MongoDB delete failed, falling back to memory');
    }
  }

  const deleted = deleteAdminCollege(id);
  if (!deleted) return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
  return NextResponse.json({ success: true, deleted: id, source: 'memory' });
}
