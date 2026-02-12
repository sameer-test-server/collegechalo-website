import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyAdminToken } from '../../../../lib/admin-auth';

function requireAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization') || undefined;
  return verifyAdminToken(auth);
}

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const health = {
    app: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
      mongoConfigured: Boolean(process.env.MONGODB_URI),
    },
    mongodb: {
      status: 'not_configured',
      latencyMs: null as number | null,
    },
  };

  if (clientPromise) {
    try {
      const started = Date.now();
      const client = await clientPromise;
      await client.db().command({ ping: 1 });
      health.mongodb.status = 'ok';
      health.mongodb.latencyMs = Date.now() - started;
    } catch (err) {
      health.mongodb.status = 'error';
    }
  }

  return NextResponse.json({ success: true, data: health });
}

