import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Setting from '@/models/Setting';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const ADMIN_USER = 'admin';

const defaultSettings = {
  showHeader: false,
  showLogo: true,
  allowModelSearch: true,
  allowInstallationFailed: false,
  allowCompleteSetup: false,
  allowStartNow: false,
};

function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.username === ADMIN_USER;
  } catch (error) {
    return false;
  }
}

function buildResponse(settings) {
  return {
    ...defaultSettings,
    ...(settings || {}),
  };
}

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.findById('global').lean();
    return NextResponse.json(buildResponse(settings));
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to load settings.' }, { status: 500 });
  }
}

async function updateSettings(request) {
  const body = await request.json();
  const updatedData = {};

  if (typeof body.showHeader === 'boolean') {
    updatedData.showHeader = body.showHeader;
  }
  if (typeof body.showLogo === 'boolean') {
    updatedData.showLogo = body.showLogo;
  }
  if (typeof body.allowModelSearch === 'boolean') {
    updatedData.allowModelSearch = body.allowModelSearch;
  }
  if (typeof body.allowInstallationFailed === 'boolean') {
    updatedData.allowInstallationFailed = body.allowInstallationFailed;
  }
  if (typeof body.allowCompleteSetup === 'boolean') {
    updatedData.allowCompleteSetup = body.allowCompleteSetup;
  }
  if (typeof body.allowStartNow === 'boolean') {
    updatedData.allowStartNow = body.allowStartNow;
  }

  await connectDB();
  const settings = await Setting.findOneAndUpdate(
    { _id: 'global' },
    { $set: updatedData },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  return settings;
}

export async function PUT(request) {
  try {
    const settings = await updateSettings(request);
    return NextResponse.json({ success: true, data: buildResponse(settings) });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const settings = await updateSettings(request);
    return NextResponse.json({ success: true, data: buildResponse(settings) });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings.' }, { status: 500 });
  }
}
