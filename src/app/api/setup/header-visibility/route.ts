import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import SetupSetting from "@/models/SetupSetting";

const defaultSettings = {
  showHeader: false,
  showLogo: true,
  allowModelSearch: true,
  allowCompleteSetup: false,
  allowInstallationFailed: false,
};

let fallbackSettings = { ...defaultSettings };

export async function GET() {
  try {
    await connectDB();

    let settings = await SetupSetting.findOne({ key: "global" });

    if (!settings) {
      settings = await SetupSetting.create({ key: "global" });
    }

    fallbackSettings = {
      showHeader: settings.showHeader,
      showLogo: settings.showLogo,
      allowModelSearch: settings.allowModelSearch,
      allowInstallationFailed: settings.allowInstallationFailed,
      allowCompleteSetup: settings.allowCompleteSetup,
    };

    return NextResponse.json({
      ...fallbackSettings,
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    console.error("Header visibility GET failed:", error);

    return NextResponse.json({
      ...fallbackSettings,
      message: "Falling back to default setup settings.",
    });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updatedSettings = {
    showHeader: body.showHeader ?? fallbackSettings.showHeader,
    showLogo: body.showLogo ?? fallbackSettings.showLogo,
    allowModelSearch:
      body.allowModelSearch ?? body.showModelSearch ?? fallbackSettings.allowModelSearch,
    allowInstallationFailed:
      body.allowInstallationFailed ?? body.showInstallationFailed ?? fallbackSettings.allowInstallationFailed,
    allowCompleteSetup:
      body.allowCompleteSetup ?? body.showCompleteSetup ?? fallbackSettings.allowCompleteSetup,
  };

  try {
    await connectDB();

    const settings = await SetupSetting.findOneAndUpdate(
      { key: "global" },
      updatedSettings,
      {
        new: true,
        upsert: true,
      }
    );

    fallbackSettings = {
      showHeader: settings.showHeader,
      showLogo: settings.showLogo,
      allowModelSearch: settings.allowModelSearch,
      allowInstallationFailed: settings.allowInstallationFailed,
      allowCompleteSetup: settings.allowCompleteSetup,
    };

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Header visibility PUT failed:", error);

    fallbackSettings = updatedSettings;

    return NextResponse.json({
      success: true,
      message:
        "Settings were updated in memory because the database is unavailable.",
      data: fallbackSettings,
    });
  }
}