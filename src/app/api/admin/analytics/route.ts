import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyAdminToken } from '../../../../lib/admin-auth';
import { getAllUsers } from '../../../../lib/users';

function requireAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization') || undefined;
  return verifyAdminToken(auth);
}

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  let users: any[] = [];
  let applications: any[] = [];
  let source = 'memory';

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      users = await db.collection('users').find({}).toArray();
      applications = await db.collection('applications').find({}).toArray();
      source = 'mongodb';
    } catch (err) {
      console.warn('[admin-analytics] MongoDB read failed, falling back to memory');
    }
  }

  if (users.length === 0) {
    users = getAllUsers();
  }

  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === 'admin').length;
  const studentUsers = totalUsers - adminUsers;
  const newUsers7d = users.filter((user) => {
    const t = new Date(user.created_at || 0).getTime();
    return Number.isFinite(t) && t >= sevenDaysAgo;
  }).length;

  const applicationStatus = {
    pending: applications.filter((app) => app.status === 'pending').length,
    accepted: applications.filter((app) => app.status === 'accepted').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
    submitted: applications.filter((app) => app.status === 'submitted').length,
    waitlisted: applications.filter((app) => app.status === 'waitlisted').length,
  };

  const totalApplications = applications.length;

  return NextResponse.json({
    success: true,
    data: {
      totalUsers,
      adminUsers,
      studentUsers,
      newUsers7d,
      totalApplications,
      applicationStatus,
      conversionRate:
        totalUsers > 0 ? Number(((totalApplications / totalUsers) * 100).toFixed(1)) : 0,
    },
    source,
  });
}
