import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  showHeader: { type: Boolean, default: false },
  showLogo: { type: Boolean, default: true },
  allowModelSearch: { type: Boolean, default: true },
  allowInstallationFailed: { type: Boolean, default: false },
  allowCompleteSetup: { type: Boolean, default: false },
  allowStartNow: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);
