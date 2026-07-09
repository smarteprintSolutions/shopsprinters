import mongoose, { Schema, Document } from 'mongoose';

export interface ISetupSetting extends Document {
  key: string;
  showHeader: boolean;
  showLogo: boolean;
  allowModelSearch: boolean;
  allowInstallationFailed: boolean;
  allowCompleteSetup: boolean;
  updatedAt: Date;
}

const setupSettingSchema = new Schema<ISetupSetting>(
  {
    key: { type: String, default: 'global', unique: true },
    showHeader: { type: Boolean, default: false },
    showLogo: { type: Boolean, default: true },
    allowModelSearch: { type: Boolean, default: true },
    allowInstallationFailed: { type: Boolean, default: false },
    allowCompleteSetup: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SetupSetting ||
  mongoose.model<ISetupSetting>('SetupSetting', setupSettingSchema);
