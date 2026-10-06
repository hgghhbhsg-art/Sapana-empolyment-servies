import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  Check, 
  Camera, 
  Image as ImageIcon, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Trash2
} from 'lucide-react';

export const ApplicationModal: React.FC = () => {
  const { applyingForJob, setApplyingForJob, submitApplication, setActiveTab, currentUser } = useApp();

  const [fullName, setFullName] = useState(() => currentUser?.name || '');
  const [phone, setPhone] = useState(() => currentUser?.phoneOrEmail || '');
  const [passportNumber, setPassportNumber] = useState(() => currentUser?.passportNumber || '');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [email, setEmail] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [notes, setNotes] = useState('');

  // Uploaded documents state (Data URLs or URLs)
  const [passportFrontUrl, setPassportFrontUrl] = useState<string>('');
  const [passportBackUrl, setPassportBackUrl] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [experienceCertUrl, setExperienceCertUrl] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!applyingForJob) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      // Compress/resize image for efficient Firestore storage
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setter(compressed);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFillDemoData = () => {
    setFullName('Prakash Bahadur KC');
    setPhone('+977 9851098765');
    setPassportNumber('PP-98172645');
    setPassportExpiry('2031-10-15');
    setEmail('prakash.kc@gmail.com');
    setCurrentAddress('Kapan-03, Kathmandu, Nepal');
    setDateOfBirth('1997-06-18');
    setNotes('2 years experience in goods handling and inventory. Ready for immediate flight.');
    // Demo photos
    setPassportFrontUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Full name as written on passport is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Valid mobile phone number is required.');
      return;
    }
    if (!passportNumber.trim()) {
      setErrorMsg('Passport number is required for foreign employment verification.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const code = submitApplication({
        jobId: applyingForJob.id,
        jobTitle: applyingForJob.title,
        country: applyingForJob.country,
        fullName: fullName.trim(),
        phone: phone.trim(),
        passportNumber: passportNumber.trim().toUpperCase(),
        passportExpiry,
        email: email.trim() || undefined,
        currentAddress: currentAddress.trim() || 'Kathmandu, Nepal',
        dateOfBirth,
        gender,
        documents: {
          passportFrontUrl: passportFrontUrl || undefined,
          passportBackUrl: passportBackUrl || undefined,
          photoUrl: photoUrl || undefined,
          experienceCertUrl: experienceCertUrl || undefined,
        },
        notes: notes.trim(),
      });

      setIsSubmitting(false);
      setSubmittedCode(code);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#0D1A33] border border-[#233C6B] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle */}
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-[#1E3661] flex items-center justify-between bg-[#0A162B]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Foreign Employment Application Form
            </h3>
            <p className="text-xs text-amber-400 font-medium">
              Sapana Employment Service Pvt. Ltd.
            </p>
          </div>
          <button
            onClick={() => setApplyingForJob(null)}
            className="w-8 h-8 rounded-full bg-[#162747] hover:bg-[#203763] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        {submittedCode ? (
          /* Submission Success State */
          <div className="p-6 text-center space-y-4 my-auto overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Application Registered Successfully
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Namaste, {fullName}!
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Your application for <strong>{applyingForJob.title} ({applyingForJob.country})</strong> has been received by our office.
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="p-4 rounded-xl bg-[#122346] border border-amber-400/40 max-w-sm mx-auto">
              <span className="text-[11px] text-amber-300 block uppercase tracking-wider font-semibold">
                Your Application Reference Code
              </span>
              <p className="text-2xl font-bold text-white font-mono mt-1 tracking-wider tabular-nums">
                {submittedCode}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Please save this code for inquiry & passport verification.
              </p>
            </div>

            {/* Next Steps Guide */}
            <div className="p-3.5 rounded-xl bg-[#091428] border border-[#1C3259] text-left text-xs space-y-2 max-w-sm mx-auto">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Next Steps at Sapana Employment:</span>
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                1. Our documentation officer will verify your passport details within 24 hours.
                <br />
                2. You will receive an SMS/Call regarding your interview slot.
                <br />
                3. Check the "My Status" tab anytime to track your visa progress.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <button
                onClick={() => {
                  setApplyingForJob(null);
                  setActiveTab('applications');
                }}
                className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>View In "My Status"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setApplyingForJob(null)}
                className="w-full min-h-[44px] rounded-xl bg-[#15274B] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            {/* Vacancy Header Card */}
            <div className="p-3 rounded-xl bg-[#112140] border border-[#1E3661] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Applying For Vacancy:</span>
                <p className="text-sm font-bold text-white">{applyingForJob.title}</p>
                <p className="text-xs text-amber-400 font-medium">
                  {applyingForJob.country} · {applyingForJob.companyName} · {applyingForJob.salaryMonthly}
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemoData}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold transition-colors whitespace-nowrap"
              >
                Auto-Fill Sample
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Field: Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Full Name (As written in Passport) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Bahadur Gurung"
                className="w-full px-3.5 py-2.5 bg-[#122244] border border-[#213866] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              />
            </div>

            {/* Field 2 cols: Phone Number & Passport Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-[#122244] border border-[#213866] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Passport Number *
                </label>
                <input
                  type="text"
                  required
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="e.g. PP-12345678"
                  className="w-full px-3.5 py-2.5 bg-[#122244] border border-[#213866] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 uppercase transition-colors"
                />
              </div>
            </div>

            {/* Field 3 cols: Passport Expiry, Gender, Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Passport Expiry Date
                </label>
                <input
                  type="date"
                  value={passportExpiry}
                  onChange={(e) => setPassportExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Field: Current Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Permanent / Current Address in Nepal
              </label>
              <input
                type="text"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="District, Municipality / Ward No., City (e.g. Pokhara-04, Kaski)"
                className="w-full px-3.5 py-2.5 bg-[#122244] border border-[#213866] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Document Photo Upload Section */}
            <div className="space-y-2 pt-2 border-t border-[#1C3259]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Document & Photo Uploads
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Upload clear smartphone photos of your passport & PP photo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Passport Front Page */}
                <div className="bg-[#101F3D] border border-[#1E3661] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      Passport Front Page (Bio)
                    </span>
                    {passportFrontUrl && (
                      <button
                        type="button"
                        onClick={() => setPassportFrontUrl('')}
                        className="text-red-400 hover:text-red-300"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {passportFrontUrl ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-emerald-500/40">
                      <img
                        src={passportFrontUrl}
                        alt="Passport Front"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        Uploaded
                      </span>
                    </div>
                  ) : (
                    <label className="h-28 rounded-lg border-2 border-dashed border-[#263D69] hover:border-amber-400/60 flex flex-col items-center justify-center cursor-pointer bg-[#0D1933] transition-colors p-2 text-center group">
                      <Camera className="w-6 h-6 text-slate-400 group-hover:text-amber-400 mb-1 transition-colors" />
                      <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                        Upload Passport Photo
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        JPG, PNG, or Camera Scan
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setPassportFrontUrl)}
                      />
                    </label>
                  )}
                </div>

                {/* 2. Passport Photo (PP Size) */}
                <div className="bg-[#101F3D] border border-[#1E3661] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      Applicant Photo (PP Size)
                    </span>
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="text-red-400 hover:text-red-300"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {photoUrl ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-emerald-500/40">
                      <img
                        src={photoUrl}
                        alt="PP Photo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded">
                        Uploaded
                      </span>
                    </div>
                  ) : (
                    <label className="h-28 rounded-lg border-2 border-dashed border-[#263D69] hover:border-amber-400/60 flex flex-col items-center justify-center cursor-pointer bg-[#0D1933] transition-colors p-2 text-center group">
                      <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-amber-400 mb-1 transition-colors" />
                      <span className="text-xs text-slate-300 group-hover:text-white font-medium">
                        Upload PP Photograph
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        White background preferred
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setPhotoUrl)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Experience / Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Overseas Work Experience or Skills (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any prior Gulf, Malaysia or Europe work experience, English knowledge, or vocational training..."
                className="w-full px-3.5 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="p-3 rounded-xl bg-[#091428] border border-[#1B2F52] text-xs text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                I hereby declare that all passport details provided are genuine. I authorize Sapana Employment Service Pvt. Ltd. (Govt. Lic. 1234/078/079) to process my application for overseas selection under Nepal government regulations.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setApplyingForJob(null)}
                className="w-1/3 min-h-[44px] rounded-xl bg-[#15274B] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Application...</span>
                ) : (
                  <>
                    <span>Submit Official Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
