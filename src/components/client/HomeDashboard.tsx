import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Vacancy, DestinationCountry, JobCategory } from '../../types';
import { ASSET_IMAGES, COMPANY_CONTACTS } from '../../data/initialData';
import { Logo } from '../Logo';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  UtensilsCrossed, 
  Users, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  Phone, 
  Sparkles,
  Building2,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';

const COUNTRIES: Array<{ label: string; value: DestinationCountry | 'All'; flag: string }> = [
  { label: 'All Countries', value: 'All', flag: '🌍' },
  { label: 'Greece', value: 'Greece', flag: '🇬🇷' },
  { label: 'Malaysia', value: 'Malaysia', flag: '🇲🇾' },
  { label: 'UAE', value: 'UAE', flag: '🇦🇪' },
  { label: 'Croatia', value: 'Croatia', flag: '🇭🇷' },
  { label: 'Qatar', value: 'Qatar', flag: '🇶🇦' },
  { label: 'Poland', value: 'Poland', flag: '🇵🇱' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia', flag: '🇸🇦' },
];

const CATEGORIES: Array<{ label: string; value: JobCategory | 'All' }> = [
  { label: 'All Sectors', value: 'All' },
  { label: 'Warehouse & Logistics', value: 'Warehouse & Logistics' },
  { label: 'Construction & Engineering', value: 'Construction & Engineering' },
  { label: 'Security Services', value: 'Security Services' },
  { label: 'Hospitality & Catering', value: 'Hospitality & Catering' },
  { label: 'Manufacturing & Factory', value: 'Manufacturing & Factory' },
];

const POPULAR_KEYWORDS = [
  'Warehouse',
  'Security Guard',
  'Driver',
  'Construction',
  'Factory Line',
  'Hospitality',
  'Greece',
  'Dubai',
  'Zero Cost',
];

export const HomeDashboard: React.FC = () => {
  const { 
    vacancies, 
    setSelectedVacancy, 
    setApplyingForJob, 
    savedJobIds, 
    toggleSaveJob,
    setIsCallModalOpen,
    setActiveTab
  } = useApp();

  const [selectedCountry, setSelectedCountry] = useState<DestinationCountry | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(v => {
      if (v.status === 'closed') return false;

      const matchesCountry = selectedCountry === 'All' || v.country === selectedCountry;
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      
      const q = searchQuery.toLowerCase().trim();
      if (!q) {
        return matchesCountry && matchesCategory;
      }

      // Deep multi-field keyword search
      const inTitle = v.title.toLowerCase().includes(q);
      const inCountry = v.country.toLowerCase().includes(q);
      const inCity = v.city.toLowerCase().includes(q);
      const inCompany = v.companyName.toLowerCase().includes(q);
      const inCategory = v.category.toLowerCase().includes(q);
      const inSalary = v.salaryMonthly.toLowerCase().includes(q) || v.salaryNPRApprox.toLowerCase().includes(q);
      const inFood = v.foodAccommodation.toLowerCase().includes(q);
      const inRequirements = v.requirements.some(r => r.toLowerCase().includes(q));
      const inBenefits = v.benefits.some(b => b.toLowerCase().includes(q));

      // Keyword aliases
      const matchesZeroCost = (q.includes('zero') || q.includes('cost')) && (v.contractPeriod.toLowerCase().includes('zero') || v.benefits.some(b => b.toLowerCase().includes('zero')));
      const matchesUrgent = (q.includes('urgent') || q.includes('immediate')) && !!v.isUrgent;

      const matchesSearch = inTitle || inCountry || inCity || inCompany || inCategory || inSalary || inFood || inRequirements || inBenefits || matchesZeroCost || matchesUrgent;

      return matchesCountry && matchesCategory && matchesSearch;
    });
  }, [vacancies, selectedCountry, selectedCategory, searchQuery]);

  return (
    <div className="pb-24 pt-3 max-w-7xl mx-auto px-3 sm:px-6 space-y-5 animate-fade-in">
      
      {/* Corporate Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0C1930] via-[#102447] to-[#0A162B] border border-[#233B6B] shadow-xl">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img 
            src={ASSET_IMAGES.heroConsultation} 
            alt="Sapana Overseas Recruitment Office" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <Logo size="lg" />
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Government Approved Recruitment Agency</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Nepal Lic. 1234/078/079 · Head Office: Nepalgunj · Branch: Bhurigaun
                </p>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
              Secure Overseas Employment in Europe, Gulf & Malaysia
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sapana Employment Service Pvt. Ltd. connects Nepalese job seekers with verified foreign employers. Free food, accommodation, and high earning potentials.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hotline (+977 9716275258)</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#172B50] hover:bg-[#1E3766] border border-[#2B4679] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span>Live Chat Support</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:min-w-[280px]">
            <div className="bg-[#091428]/80 backdrop-blur-sm p-3 rounded-xl border border-[#1E3561]">
              <p className="text-xs text-slate-400 font-medium">Active Openings</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5 tabular-nums">
                {vacancies.reduce((acc, v) => acc + (v.status === 'active' ? v.vacancyCount : 0), 0)}+
              </p>
              <p className="text-[11px] text-amber-400/90 mt-0.5">Europe & Gulf Quota</p>
            </div>
            <div className="bg-[#091428]/80 backdrop-blur-sm p-3 rounded-xl border border-[#1E3561]">
              <p className="text-xs text-slate-400 font-medium">Zero Cost Schemes</p>
              <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">Malaysia</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Govt. Bilateral Flow</p>
            </div>
            <div className="bg-[#091428]/80 backdrop-blur-sm p-3 rounded-xl border border-[#1E3561]">
              <p className="text-xs text-slate-400 font-medium">Min Salary</p>
              <p className="text-base font-bold text-amber-300 font-mono mt-0.5">NPR 65K+</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Plus Overtime Pay</p>
            </div>
            <div className="bg-[#091428]/80 backdrop-blur-sm p-3 rounded-xl border border-[#1E3561]">
              <p className="text-xs text-slate-400 font-medium">Offices in Nepal</p>
              <p className="text-sm font-bold text-white mt-0.5">Nepalgunj & Bardiya</p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">BP Chowk · Bhurigaun</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-[#0D1B36] border border-[#233B6B] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Vacancies by Job Title or Keyword</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Find positions across Greece, Malaysia, UAE, Croatia, and Qatar by skill, role, or company.
            </p>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 font-medium">
                {filteredVacancies.length} {filteredVacancies.length === 1 ? 'result' : 'results'} found
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-[#152545] px-2 py-1 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type job title or keyword (e.g. Warehouse, Security Guard, Driver, Scaffolding, Zero Cost)..."
            className="w-full pl-10 pr-24 py-3 bg-[#112243] border border-[#233B6B] focus:border-amber-400 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-2 my-auto h-7 px-2.5 flex items-center gap-1 rounded-lg bg-[#182C54] hover:bg-[#20396B] text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          ) : (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[11px] text-slate-500 font-mono hidden sm:flex">
              Search Jobs
            </div>
          )}
        </div>

        {/* Popular Trending Keywords */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none no-scrollbar">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider mr-1">
            Popular:
          </span>
          {POPULAR_KEYWORDS.map((keyword) => {
            const isSelected = searchQuery.toLowerCase() === keyword.toLowerCase();
            return (
              <button
                key={keyword}
                onClick={() => {
                  if (isSelected) {
                    setSearchQuery('');
                  } else {
                    setSearchQuery(keyword);
                  }
                }}
                className={`min-h-[28px] px-2.5 py-0.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-[#122346] hover:bg-[#182D57] text-slate-300 hover:text-amber-300 border border-[#1F3763]'
                }`}
              >
                {keyword}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 1: Destination Country Horizontal Scroller */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Filter By Country
          </span>
          <span className="text-xs text-slate-400">
            {filteredVacancies.length} {filteredVacancies.length === 1 ? 'Job' : 'Jobs'} Found
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          {COUNTRIES.map((c) => {
            const isActive = selectedCountry === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCountry(c.value)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-[#122345] border border-[#223966] text-slate-300 hover:text-white hover:bg-[#182C54]'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 2: Category Filter Bar */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Job Category
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`min-h-[38px] px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-[#101F3D] border border-[#1E3561] text-slate-400 hover:text-slate-200 hover:bg-[#15284D]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vacancy Card List */}
      <div className="space-y-4">
        {filteredVacancies.length === 0 ? (
          <div className="p-8 text-center bg-[#0D1A33] border border-[#1E345F] rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {searchQuery ? `No vacancies found for "${searchQuery}"` : 'No Vacancies Matched'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'We could not find active jobs matching this title or keyword. Try searching for "Warehouse", "Security", or "Construction".'
                  : 'We could not find active vacancies matching your current filter. Try selecting "All Countries" or resetting filters.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Search Keyword</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCountry('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-[#152545] text-slate-300 text-xs font-semibold hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          filteredVacancies.map((vacancy) => {
            const isSaved = savedJobIds.includes(vacancy.id);
            const remainingSpots = vacancy.vacancyCount - vacancy.appliedCount;

            return (
              <div
                key={vacancy.id}
                className="bg-[#0E1B36] border border-[#213966] hover:border-amber-400/40 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
              >
                {/* Card Top: Country banner & quick badges */}
                <div className="px-4 sm:px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-[#1A2F57]/80 bg-[#0B162C]">
                  <div>
                    {/* Unboxed metadata line with typographic separators */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-amber-300/90 font-medium">
                      <span className="flex items-center gap-1 text-white font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {vacancy.country} ({vacancy.city})
                      </span>
                      <span aria-hidden="true" className="text-slate-500">·</span>
                      <span className="text-slate-300">{vacancy.category}</span>
                      {vacancy.isUrgent && (
                        <>
                          <span aria-hidden="true" className="text-slate-500">·</span>
                          <span className="text-red-400 font-semibold">Immediate Flight</span>
                        </>
                      )}
                    </div>

                    <h2 
                      onClick={() => setSelectedVacancy(vacancy)}
                      className="text-base sm:text-lg font-bold text-white mt-1 hover:text-amber-300 cursor-pointer transition-colors leading-snug"
                    >
                      {vacancy.title}
                    </h2>
                    
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{vacancy.companyName}</span>
                    </p>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSaveJob(vacancy.id)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-amber-400 transition-colors"
                    title={isSaved ? 'Remove from Saved' : 'Save Vacancy'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Card Body: Structured Specifications Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0E1B36]">
                  {/* Monthly Salary */}
                  <div className="bg-[#122347] p-2.5 rounded-xl border border-[#1F3663]">
                    <span className="text-[11px] text-slate-400 block">Monthly Salary</span>
                    <p className="text-sm font-bold text-amber-400 font-mono tracking-tight mt-0.5 tabular-nums">
                      {vacancy.salaryMonthly}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 tabular-nums">
                      ≈ {vacancy.salaryNPRApprox}
                    </p>
                  </div>

                  {/* Duty Hours & Overtime */}
                  <div className="bg-[#122347] p-2.5 rounded-xl border border-[#1F3663]">
                    <span className="text-[11px] text-slate-400 block">Duty Hours</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{vacancy.dutyHours}</span>
                    </p>
                    <p className="text-[10px] text-emerald-400 truncate mt-0.5">
                      {vacancy.overtime}
                    </p>
                  </div>

                  {/* Contract Period */}
                  <div className="bg-[#122347] p-2.5 rounded-xl border border-[#1F3663]">
                    <span className="text-[11px] text-slate-400 block">Contract Period</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{vacancy.contractPeriod}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Renewable Visa
                    </p>
                  </div>

                  {/* Food & Accommodation */}
                  <div className="bg-[#122347] p-2.5 rounded-xl border border-[#1F3663]">
                    <span className="text-[11px] text-slate-400 block">Food & Camp</span>
                    <p className="text-xs font-semibold text-emerald-300 mt-0.5 flex items-center gap-1 truncate">
                      <UtensilsCrossed className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{vacancy.foodAccommodation}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Included by Company
                    </p>
                  </div>
                </div>

                {/* Card Footer: Vacancy Quota & Primary Actions */}
                <div className="px-4 sm:px-5 py-3 border-t border-[#1C325B] bg-[#0A162B] flex flex-wrap items-center justify-between gap-3">
                  {/* Vacancy count info */}
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>
                      Quota: <strong className="text-white font-mono">{vacancy.vacancyCount}</strong> seats
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-emerald-400 text-[11px]">
                      {remainingSpots > 0 ? `${remainingSpots} spots remaining` : 'Filling fast'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVacancy(vacancy)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#15274B] hover:bg-[#1E3766] border border-[#243C6B] text-slate-200 text-xs font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setApplyingForJob(vacancy)}
                      className="min-h-[40px] px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Advisory Card: Foreign Employment Safety */}
      <div className="p-4 rounded-xl bg-[#091428] border border-[#192E54] text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Notice for Foreign Employment Applicants (वैदेशिक रोजगार सूचना)</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Do not give original passport or cash advance to unverified middlemen. Sapana Employment Service Pvt. Ltd. conducts all candidate documentation and briefings legally inside our registered <strong className="text-white">Head Office in Nepalgunj (BP Chowk, Banke)</strong> and <strong className="text-white">Branch Office in Bhurigaun, Bardiya</strong>. Always verify the demand letter on the official Department of Foreign Employment (DoFE) portal.
        </p>
      </div>

    </div>
  );
};
