import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vacancy, DestinationCountry, JobCategory } from '../../types';
import { ASSET_IMAGES } from '../../data/initialData';
import { 
  FolderPlus, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  MapPin, 
  Building2, 
  Clock, 
  Users, 
  CheckCircle2, 
  Image as ImageIcon, 
  Search,
  Upload,
  AlertCircle
} from 'lucide-react';

const PRESET_POSTERS = [
  { label: 'Warehouse & Logistics (Greece)', url: ASSET_IMAGES.jobLogistics },
  { label: 'Civil Construction (UAE)', url: ASSET_IMAGES.jobConstruction },
  { label: 'Agency Head Office (Kathmandu)', url: ASSET_IMAGES.agencyOffice },
  { label: 'Recruitment Consultation', url: ASSET_IMAGES.heroConsultation },
];

export const AdminVacanciesView: React.FC = () => {
  const { vacancies, addVacancy, updateVacancy, deleteVacancy } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState<DestinationCountry>('Greece');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<JobCategory>('Warehouse & Logistics');
  const [salaryMonthly, setSalaryMonthly] = useState('');
  const [salaryNPRApprox, setSalaryNPRApprox] = useState('');
  const [dutyHours, setDutyHours] = useState('8 Hours / 6 Days');
  const [overtime, setOvertime] = useState('Available as per labor law');
  const [contractPeriod, setContractPeriod] = useState('2 Years (Renewable)');
  const [foodAccommodation, setFoodAccommodation] = useState('Free Accommodation & Duty Meals');
  const [vacancyCount, setVacancyCount] = useState(25);
  const [deadline, setDeadline] = useState('2026-11-15');
  const [isUrgent, setIsUrgent] = useState(false);
  const [posterImage, setPosterImage] = useState(ASSET_IMAGES.jobLogistics);
  const [requirementsText, setRequirementsText] = useState(
    'Age 21-38 years\nBasic English speaking ability\nPassport valid for at least 2 years\nClean police record'
  );
  const [benefitsText, setBenefitsText] = useState(
    'Free return airfare ticket upon completion\nFree comprehensive medical insurance\nOvertime bonus'
  );

  const resetForm = () => {
    setTitle('');
    setCompanyName('');
    setCountry('Greece');
    setCity('');
    setCategory('Warehouse & Logistics');
    setSalaryMonthly('€950 - €1,150 + Overtime');
    setSalaryNPRApprox('NPR 1,35,000 - 1,65,000 / month');
    setDutyHours('8 Hours / 6 Days');
    setOvertime('Available as per labor law');
    setContractPeriod('2 Years (Renewable)');
    setFoodAccommodation('Free Accommodation & Duty Meals');
    setVacancyCount(30);
    setDeadline('2026-11-20');
    setIsUrgent(false);
    setPosterImage(ASSET_IMAGES.jobLogistics);
    setRequirementsText('Age 21-38 years\nBasic English communication\nValid passport minimum 2 years\nMedical fitness');
    setBenefitsText('Free air ticket & visa processing\nHealth & accident insurance\nAnnual leave entitlement');
    setEditingVacancyId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vacancy) => {
    setEditingVacancyId(v.id);
    setTitle(v.title);
    setCompanyName(v.companyName);
    setCountry(v.country);
    setCity(v.city);
    setCategory(v.category);
    setSalaryMonthly(v.salaryMonthly);
    setSalaryNPRApprox(v.salaryNPRApprox);
    setDutyHours(v.dutyHours);
    setOvertime(v.overtime);
    setContractPeriod(v.contractPeriod);
    setFoodAccommodation(v.foodAccommodation);
    setVacancyCount(v.vacancyCount);
    setDeadline(v.deadline);
    setIsUrgent(!!v.isUrgent);
    setPosterImage(v.posterImage);
    setRequirementsText(v.requirements.join('\n'));
    setBenefitsText(v.benefits.join('\n'));
    setIsModalOpen(true);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

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
        setPosterImage(compressed);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !companyName.trim()) {
      setFormError('Please fill in Job Title and Company Name');
      return;
    }

    const reqList = requirementsText.split('\n').map(s => s.trim()).filter(Boolean);
    const benList = benefitsText.split('\n').map(s => s.trim()).filter(Boolean);

    const countryCodeMap: Record<string, string> = {
      Greece: 'GR',
      Malaysia: 'MY',
      UAE: 'AE',
      Croatia: 'HR',
      Qatar: 'QA',
      Poland: 'PL',
      'Saudi Arabia': 'SA',
      Japan: 'JP',
    };

    if (editingVacancyId) {
      updateVacancy(editingVacancyId, {
        title: title.trim(),
        companyName: companyName.trim(),
        country,
        countryCode: countryCodeMap[country] || 'XX',
        city: city.trim() || country,
        category,
        salaryMonthly: salaryMonthly.trim(),
        salaryNPRApprox: salaryNPRApprox.trim(),
        dutyHours: dutyHours.trim(),
        overtime: overtime.trim(),
        contractPeriod: contractPeriod.trim(),
        foodAccommodation: foodAccommodation.trim(),
        vacancyCount: Number(vacancyCount),
        deadline,
        isUrgent,
        posterImage,
        requirements: reqList,
        benefits: benList,
      });
      setToastMessage('Vacancy updated successfully.');
    } else {
      addVacancy({
        title: title.trim(),
        companyName: companyName.trim(),
        country,
        countryCode: countryCodeMap[country] || 'XX',
        city: city.trim() || country,
        category,
        salaryMonthly: salaryMonthly.trim(),
        salaryNPRApprox: salaryNPRApprox.trim(),
        dutyHours: dutyHours.trim(),
        overtime: overtime.trim(),
        contractPeriod: contractPeriod.trim(),
        foodAccommodation: foodAccommodation.trim(),
        vacancyCount: Number(vacancyCount),
        deadline,
        isUrgent,
        featured: true,
        posterImage,
        requirements: reqList,
        benefits: benList,
        status: 'active',
      });
      setToastMessage('New foreign employment vacancy published successfully.');
    }

    setTimeout(() => setToastMessage(null), 4000);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteVacancy(deleteConfirm.id);
      setToastMessage(`Vacancy "${deleteConfirm.title}" removed.`);
      setTimeout(() => setToastMessage(null), 3000);
      setDeleteConfirm(null);
    }
  };

  const filtered = vacancies.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      v.title.toLowerCase().includes(q) ||
      v.country.toLowerCase().includes(q) ||
      v.companyName.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q);
  });

  return (
    <div className="pb-24 pt-3 max-w-7xl mx-auto px-3 sm:px-6 space-y-4 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-0.5">
            ✕
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1A33] border border-[#233C6B] rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Confirm Vacancy Deletion</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove the job listing <strong className="text-amber-400">"{deleteConfirm.title}"</strong>? This will remove it from candidate listings.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C3259]">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-3.5 py-1.5 rounded-xl bg-[#142340] text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
              >
                Yes, Remove Vacancy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0D1A33] p-4 sm:p-5 rounded-2xl border border-[#213866] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <FolderPlus className="w-4 h-4" />
            <span>Vacancy Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Overseas Job Listings & Demand Posters
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Add new overseas quotas, edit salaries, contract terms, and update posters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Vacancy</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posted vacancies by job title, country, employer..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0E1C36] border border-[#213966] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Vacancies List */}
      <div className="space-y-3">
        {filtered.map(v => (
          <div
            key={v.id}
            className="p-4 rounded-xl bg-[#0E1B36] border border-[#203661] hover:border-[#2D4D85] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            {/* Vacancy Poster thumbnail + Info */}
            <div className="flex items-start gap-3.5">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-800 border border-[#223966] shrink-0">
                <img
                  src={v.posterImage}
                  alt={v.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-amber-400">{v.country} ({v.city})</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300">{v.category}</span>
                  {v.isUrgent && (
                    <span className="text-red-400 font-semibold text-[10px] bg-red-400/10 px-1.5 py-0.2 rounded border border-red-400/20">
                      Urgent Quota
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mt-0.5">{v.title}</h3>
                <p className="text-xs text-slate-400">{v.companyName}</p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 mt-1">
                  <span className="font-mono text-amber-300 font-bold">{v.salaryMonthly}</span>
                  <span className="text-slate-500">·</span>
                  <span>{v.dutyHours}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {v.vacancyCount} Total ({v.appliedCount} applied)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1A2E55]">
              <button
                onClick={() => handleOpenEdit(v)}
                className="px-3 py-1.5 rounded-lg bg-[#15274B] hover:bg-[#1E3766] border border-[#233F72] text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(v.id, v.title)}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Vacancy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-2xl bg-[#0D1A33] border border-[#233C6B] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5 sm:hidden" />

            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-[#1E3661] flex items-center justify-between bg-[#0A162B]">
              <h3 className="text-base font-bold text-white tracking-tight">
                {editingVacancyId ? 'Edit Vacancy Listing' : 'Publish New Foreign Employment Vacancy'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#162747] hover:bg-[#203763] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Warehouse Inventory Specialist"
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Overseas Company / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Hellenic Logistics S.A."
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Destination Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as DestinationCountry)}
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Greece">Greece</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="UAE">UAE</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Poland">Poland</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Athens / Dubai"
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Job Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JobCategory)}
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                    <option value="Construction & Engineering">Construction & Engineering</option>
                    <option value="Security Services">Security Services</option>
                    <option value="Hospitality & Catering">Hospitality & Catering</option>
                    <option value="Manufacturing & Factory">Manufacturing & Factory</option>
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Cleaning & Facility">Cleaning & Facility</option>
                  </select>
                </div>
              </div>

              {/* Salary & Duty specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Monthly Salary (Foreign Currency) *
                  </label>
                  <input
                    type="text"
                    required
                    value={salaryMonthly}
                    onChange={(e) => setSalaryMonthly(e.target.value)}
                    placeholder="e.g. €950 - €1,150 + Overtime"
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Estimated NPR Equivalent
                  </label>
                  <input
                    type="text"
                    value={salaryNPRApprox}
                    onChange={(e) => setSalaryNPRApprox(e.target.value)}
                    placeholder="e.g. NPR 1,35,000 - 1,65,000 / month"
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Duty Hours
                  </label>
                  <input
                    type="text"
                    value={dutyHours}
                    onChange={(e) => setDutyHours(e.target.value)}
                    placeholder="e.g. 8 Hours / 6 Days"
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Contract Period
                  </label>
                  <input
                    type="text"
                    value={contractPeriod}
                    onChange={(e) => setContractPeriod(e.target.value)}
                    placeholder="e.g. 2 Years Renewable"
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Total Quota / Seats *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={vacancyCount}
                    onChange={(e) => setVacancyCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Food & Accommodation Policy
                </label>
                <input
                  type="text"
                  value={foodAccommodation}
                  onChange={(e) => setFoodAccommodation(e.target.value)}
                  placeholder="e.g. Free Accommodation & Duty Meals Provided"
                  className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Poster Image Selector */}
              <div className="space-y-2 pt-1 border-t border-[#1C3259]">
                <label className="block text-xs font-semibold text-slate-200">
                  Poster Image Attachment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_POSTERS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPosterImage(preset.url)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-1 bg-[#101F3E] ${
                        posterImage === preset.url ? 'border-amber-400 scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="h-16 rounded overflow-hidden">
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-slate-300 block truncate mt-1 text-center font-medium">
                        {preset.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Or Custom Upload */}
                <div className="pt-1 flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#15274B] hover:bg-[#1E3766] text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Custom Poster File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCustomImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Requirements & Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Requirements (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Benefits & Perks (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#122244] border border-[#213866] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-[#213866] text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="urgentCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Mark as Urgent Quota (Immediate Flight Deployment)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1C3259]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#15274B] text-slate-300 text-xs font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  {editingVacancyId ? 'Save Changes' : 'Publish Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
