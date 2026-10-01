'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Particles } from '@/components/ui/particles';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Home, Building2, Layers, Trees, Building, Plus, Minus, MapPin,
  CheckCircle2, ArrowRight, ArrowLeft, HeartHandshake, Info, Bed,
  Bath, Sofa, ChefHat, Grid, Calendar, ShieldCheck, Laptop, Gem,
  Tv, User, Mail, Phone, AlertTriangle, Shield, Check, Lock, Flame,
  Droplets, BriefcaseBusiness, Zap, Scale, Wrench, ChevronDown,
  Pencil, Key, Activity, Clock, Sparkles, CircleSlash, Share, Copy,
  BarChart2, TrendingUp, Home as HomeIcon, CreditCard, ChevronRight,
  BadgeCheck, Hash, AlertCircle, Trash2, Banknote, Star, FileText,
  Users, LayoutGrid, Expand, Package,
} from 'lucide-react';

import {
  HighValueItem,
  ClaimRecord,
  evaluateEligibility,
  calculateMonthlyEstimate,
  QuoteReadyCard,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  QuoteInput as Input,
  SectionLabel,
  FieldLabel,
  TooltipIcon,
  Divider,
  Stepper,
  RoomRow,
  CoverTypeCard,
  ToggleRow,
  RiderCard,
  YesNoButtons,
  HighValueItemRow,
  ClaimRowItem,
  PROPERTY_TYPES,
  ACCENT,
  INPUT_CLS,
  SELECT_CLS,
  CONTENT_CLS,
} from '@/features/quote';

function GetQuoteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  // ── Step 1 state ──────────────────────────────────────────────────
  const [coverType, setCoverType] = useState('both'); // 'buildings' | 'contents' | 'both'
  const [coverStartDate, setCoverStartDate] = useState('');

  // ── Step 2 state ──────────────────────────────────────────────────
  const [postcode, setPostcode] = useState(searchParams.get('postcode') || '');
  const [address, setAddress] = useState(searchParams.get('address') || '');
  const [propertyType, setPropertyType] = useState('');
  const [flatType, setFlatType] = useState('');
  const [isSelfContained, setIsSelfContained] = useState<boolean | null>(null);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [livingRooms, setLivingRooms] = useState(1);
  const [kitchens, setKitchens] = useState(1);
  const [otherRooms, setOtherRooms] = useState(0);
  const [yearBuilt, setYearBuilt] = useState('');
  const [numFloors, setNumFloors] = useState(2);
  const [wallConstruction, setWallConstruction] = useState('');
  const [roofType, setRoofType] = useState('');
  const [flatRoofPercentage, setFlatRoofPercentage] = useState('');
  const [heating, setHeating] = useState('');
  const [hasExtension, setHasExtension] = useState('');
  const [extensionType, setExtensionType] = useState('');
  const [extensionYear, setExtensionYear] = useState('');

  // ── Step 3 state ──────────────────────────────────────────────────
  const [ownership, setOwnership] = useState('');
  const [purchaseYear, setPurchaseYear] = useState('');
  const [hasMortgage, setHasMortgage] = useState<boolean | null>(null);
  const [rentalType, setRentalType] = useState('');
  const [propertyUse, setPropertyUse] = useState('main');
  const [unoccupiedPeriod, setUnoccupiedPeriod] = useState('');
  const [usedForBusiness, setUsedForBusiness] = useState('no');
  const [bizSelfContained, setBizSelfContained] = useState(false);
  const [bizVisitFreq, setBizVisitFreq] = useState('');
  const [bizEscorted, setBizEscorted] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // ── Step 4 state ──────────────────────────────────────────────────
  const [doorLocks, setDoorLocks] = useState('');
  const [windowLocked, setWindowLocked] = useState(false);
  const [burglarAlarm, setBurglarAlarm] = useState(false);
  const [alarmMonitored, setAlarmMonitored] = useState(false);
  const [hasCCTV, setHasCCTV] = useState(false);
  const [smokeAlarms, setSmokeAlarms] = useState(true);
  const [hasSafe, setHasSafe] = useState(false);
  const [floodRisk, setFloodRisk] = useState(false);

  // ── Step 5 state ──────────────────────────────────────────────────
  const [buildingsExcess, setBuildingsExcess] = useState('250');
  const [contentsExcess, setContentsExcess] = useState('250');
  const [marketValue, setMarketValue] = useState('');
  const [rebuildCost, setRebuildCost] = useState('');
  const [buildingsAccidentalDamage, setBuildingsAccidentalDamage] = useState(false);
  const [contentsAccidentalDamage, setContentsAccidentalDamage] = useState(false);
  const [legalExpenses, setLegalExpenses] = useState(false);
  const [homeEmergency, setHomeEmergency] = useState(false);

  // ── Step 6 state ──────────────────────────────────────────────────
  const [contentsValue, setContentsValue] = useState('');
  const [hasHighValueItems, setHasHighValueItems] = useState(false);
  const [highValueItems, setHighValueItems] = useState<HighValueItem[]>([]);
  const [portableValuables, setPortableValuables] = useState(false);
  const [portableValuablesAmount, setPortableValuablesAmount] = useState('');

  // ── Step 7 state ──────────────────────────────────────────────────
  const [hasClaims, setHasClaims] = useState('no');
  const [claimsHistory, setClaimsHistory] = useState<ClaimRecord[]>([]);
  const [hadFlooding, setHadFlooding] = useState(false);
  const [hadSubsidence, setHadSubsidence] = useState(false);
  const [previousInsuranceRefused, setPreviousInsuranceRefused] = useState(false);
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState<'annual' | 'monthly'>('monthly');
  const [openSections, setOpenSections] = useState<string[]>([]);

  // ── Computed ────────────────────────────────────────────────────────
  const isContentsIncluded = coverType === 'contents' || coverType === 'both';
  const isBuildingsIncluded = coverType === 'buildings' || coverType === 'both';
  const hasFlatRoof = roofType === 'flat' || roofType === 'mixed';
  const eligibility = evaluateEligibility({ ownership, coverType, propertyUse, unoccupiedPeriod });
  const coverLabel = coverType === 'both' ? 'Buildings & Contents' : coverType === 'buildings' ? 'Buildings Only' : 'Contents Only';
  const todayStr = new Date().toISOString().split('T')[0];

  // Clamp currentStep if coverType changes and reduces total steps
  useEffect(() => {
    const maxStep = isContentsIncluded ? 7 : 6;
    setCurrentStep(s => Math.min(s, maxStep));
  }, [isContentsIncluded]);

  // High-value items helpers
  const addHighValueItem = () => setHighValueItems(prev => [...prev, { id: crypto.randomUUID(), category: '', description: '', value: '', awayFromHome: false }]);
  const removeHighValueItem = (id: string) => setHighValueItems(prev => prev.filter(i => i.id !== id));
  const updateHighValueItem = (id: string, updated: HighValueItem) => setHighValueItems(prev => prev.map(i => i.id === id ? updated : i));

  // Claims helpers
  const addClaim = () => setClaimsHistory(prev => [...prev, { id: crypto.randomUUID(), type: '', date: '', amountClaimed: '', description: '' }]);
  const removeClaim = (id: string) => setClaimsHistory(prev => prev.filter(c => c.id !== id));
  const updateClaim = (id: string, updated: ClaimRecord) => setClaimsHistory(prev => prev.map(c => c.id === id ? updated : c));

  // Section toggle (review)
  const toggleSection = (label: string) => setOpenSections(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);

  // ── Pricing estimate ────────────────────────────────────────────────
  const monthlyEstimate = () => {
    let base = coverType === 'buildings' ? 22 : coverType === 'contents' ? 18 : 35;
    base += bedrooms * 2.5;
    if (isContentsIncluded) {
      const val = parseInt(contentsValue || '0', 10);
      if (val > 30000) base += 8;
      if (val > 50000) base += 12;
      if (portableValuables) base += 2;
      if (contentsAccidentalDamage) base += 3;
      if (hasHighValueItems && highValueItems.length > 0) {
        const hvTotal = highValueItems.reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
        base += Math.min(12, hvTotal / 5000 * 2);
      }
    }
    if (isBuildingsIncluded) {
      if (buildingsAccidentalDamage) base += 4;
      const be = parseInt(buildingsExcess || '250', 10);
      if (be >= 500) base -= 3;
      if (be >= 1000) base -= 5;
      if (roofType === 'flat') base += 4;
      if (roofType === 'mixed') base += 2;
      if (hasExtension === 'yes') base += 1.5;
    }
    if (burglarAlarm) base -= 2;
    if (alarmMonitored) base -= 1;
    if (hasCCTV) base -= 0.5;
    if (legalExpenses) base += 2;
    if (homeEmergency) base += 3;
    const claimCount = claimsHistory.length;
    if (claimCount === 1) base += 5;
    else if (claimCount === 2) base += 10;
    else if (claimCount >= 3) base += 18;
    if (floodRisk || hadFlooding) base += 5;
    if (hadSubsidence) base += 8;
    return Math.max(15, base).toFixed(2);
  };

  // ── Validation ──────────────────────────────────────────────────────
  const TOTAL_STEPS = isContentsIncluded ? 7 : 6;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!coverStartDate) errs.coverStartDate = 'Please select your cover start date.';
      if (!coverType) errs.coverType = 'Please select a cover type.';
    }
    if (currentStep === 2) {
      if (!postcode.trim()) errs.postcode = 'Please enter your postcode.';
      if (!propertyType) errs.propertyType = 'Please select your property type.';
      if (propertyType === 'flat') {
        if (!flatType) errs.flatType = 'Please select the flat type.';
        if (isSelfContained === null) errs.isSelfContained = 'Please indicate if it is self-contained.';
      }
      // Construction fields are only required when buildings cover is included
      if (isBuildingsIncluded) {
        if (!yearBuilt) errs.yearBuilt = 'Please enter the year built.';
        if (!wallConstruction) errs.wallConstruction = 'Please select the wall construction.';
        if (!roofType) errs.roofType = 'Please select the roof type.';
        if (hasFlatRoof && !flatRoofPercentage) errs.flatRoofPercentage = 'Please select the flat roof percentage.';
        if (!heating) errs.heating = 'Please select the type of heating.';
        if (!hasExtension) errs.hasExtension = 'Please indicate if there are extensions.';
        if (hasExtension === 'yes') {
          if (!extensionType) errs.extensionType = 'Please select the extension type.';
          if (!extensionYear) errs.extensionYear = 'Please enter the extension year.';
        }
      }
    }
    if (currentStep === 3) {
      if (!ownership) errs.ownership = 'Please tell us your relationship to the property.';
      if (ownership === 'owner' || ownership === 'buying') {
        if (!purchaseYear) errs.purchaseYear = 'Please enter the purchase year.';
        if (hasMortgage === null) errs.hasMortgage = 'Please indicate if you have a mortgage.';
      }
      if (ownership === 'tenant' && !rentalType) errs.rentalType = 'Please select who you are renting from.';
      if (propertyUse === 'let' || propertyUse === 'holiday') errs.propertyUse = 'Please ensure you check with us directly for this property use.';
      if (usedForBusiness === 'wfh-visitors' || usedForBusiness === 'other') {
        if (!bizVisitFreq) errs.bizVisitFreq = 'Please specify how often visitors attend.';
      }
      if (!eligibility.eligible) { setError(eligibility.reasons[0]); return false; }
    }
    if (currentStep === 4) {
      if (!doorLocks) errs.doorLocks = 'Please select the type of door lock.';
    }
    if (currentStep === 5) {
      if (isBuildingsIncluded) {
        if (!marketValue) errs.marketValue = 'Please enter the estimated market value.';
        if (!rebuildCost) errs.rebuildCost = 'Please enter the rebuild cost.';
      }
    }
    if (currentStep === 6 && isContentsIncluded) {
      if (!contentsValue) errs.contentsValue = 'Please enter the estimated contents value.';
      if (portableValuables && !portableValuablesAmount) errs.portableValuablesAmount = 'Please enter the away-from-home cover amount.';
    }
    if (currentStep === TOTAL_STEPS) {
      if (!hasClaims) errs.hasClaims = 'Please indicate if you have any claims.';
      if (!title) errs.title = 'Please select your title.';
      if (!firstName.trim()) errs.firstName = 'Please enter your first name.';
      if (!surname.trim()) errs.surname = 'Please enter your surname.';
      if (!dob) errs.dob = 'Please enter your date of birth.';
      if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address.';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please fill in all required fields highlighted below.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    setFieldErrors({});
    if (!validate()) return;
    if (currentStep < TOTAL_STEPS) setCurrentStep(s => s + 1);
    else setDone(true);
  };
  const handleBack = () => { setError(''); setFieldErrors({}); if (currentStep > 1) setCurrentStep(s => s - 1); };

  // Compare plans URL with params
  const compareUrl = `/compare-plans?coverType=${coverType}&bedrooms=${bedrooms}&postcode=${encodeURIComponent(postcode)}&excess=${buildingsExcess || contentsExcess}&accidental=${buildingsAccidentalDamage || contentsAccidentalDamage}&legal=${legalExpenses}&emergency=${homeEmergency}&estimate=${monthlyEstimate()}`;

  // ════════════════════════════════════════════════════════════════════
  // STEP 1 — COVER TYPE & START DATE
  // ════════════════════════════════════════════════════════════════════
  const step1 = (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionLabel>What would you like to protect?</SectionLabel>
        <p className="text-xs text-gray-500 -mt-1 leading-relaxed">Your selection controls the rest of this questionnaire — you&apos;ll only see questions relevant to your cover.</p>
        <div className="grid grid-cols-1 gap-2">
          <CoverTypeCard label="Buildings & Contents" description="Protect the physical structure of your home and all your belongings inside." icon={ShieldCheck} selected={coverType === 'both'} error={!!fieldErrors.coverType} onClick={() => { setCoverType('both'); setFieldErrors(p => ({...p, coverType: ''})) }} />
          <CoverTypeCard label="Buildings Only" description="Cover the structure of your property against structural damage, fire, flood and more." icon={Home} selected={coverType === 'buildings'} error={!!fieldErrors.coverType} onClick={() => { setCoverType('buildings'); setFieldErrors(p => ({...p, coverType: ''})) }} />
          <CoverTypeCard label="Contents Only" description="Protect your personal belongings, furniture and household items." icon={Laptop} selected={coverType === 'contents'} error={!!fieldErrors.coverType} onClick={() => { setCoverType('contents'); setFieldErrors(p => ({...p, coverType: ''})) }} />
        </div>
        {fieldErrors.coverType && <p className="text-red-400 text-xs mt-1">{fieldErrors.coverType}</p>}
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Cover Start Date</SectionLabel>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <FieldLabel htmlFor="coverStart">When would you like your cover to begin?</FieldLabel>
          </div>
          <div className="relative">
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <Input id="coverStart" type="date" value={coverStartDate} min={todayStr} onChange={e => { setCoverStartDate(e.target.value); setFieldErrors(p => ({...p, coverStartDate: ''})) }} className="pl-9 h-10 [color-scheme:dark]" error={!!fieldErrors.coverStartDate} />
          </div>
          {fieldErrors.coverStartDate && <p className="text-red-400 text-xs mt-1">{fieldErrors.coverStartDate}</p>}
          <AnimatePresence>
            {coverStartDate && !fieldErrors.coverStartDate && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-[#00c685] flex items-center gap-1.5 mt-1">
                <CheckCircle2 size={12} />
                Your cover will begin on {new Date(coverStartDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 flex gap-3">
        <Shield size={16} className="text-[#00c685] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">Your cover can start today or up to 60 days in the future. You can change the date at any time before your certificate is issued.</p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // STEP 2 — YOUR PROPERTY
  // ════════════════════════════════════════════════════════════════════
  const step2 = (
    <div className="space-y-6">
      {/* Contents-only info banner */}
      {!isBuildingsIncluded && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-[#00c685]/25 bg-[#00c685]/8">
          <Laptop size={15} className="text-[#00c685] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#00c685] leading-snug">Contents Only — fewer questions needed</p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">We only need your property details and room count. Construction questions are skipped since you&apos;re not insuring the building structure.</p>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="space-y-3">
        <SectionLabel>Property Location</SectionLabel>
        {address && (
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5">
            <MapPin size={14} className="text-[#00c685] mt-0.5 shrink-0" />
            <div>
              <p className="text-white text-sm font-medium leading-snug">{address}</p>
              <p className="text-[#00c685] text-xs font-mono mt-0.5">{postcode}</p>
            </div>
          </div>
        )}
        <div className="relative">
          <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input value={postcode} onChange={e => { setPostcode(e.target.value.toUpperCase()); setFieldErrors(p => ({...p, postcode: ''})) }} placeholder="Postcode e.g. SW1A 2AA" className={INPUT_CLS} error={!!fieldErrors.postcode} />
        </div>
        {fieldErrors.postcode && <p className="text-red-400 text-xs mt-1">{fieldErrors.postcode}</p>}
      </div>

      <Divider />

      {/* Property Type */}
      <div className="space-y-3">
        <SectionLabel>Property Type</SectionLabel>
        <div className="grid grid-cols-5 gap-2">
          {PROPERTY_TYPES.map(({ label, value, icon: Icon }) => (
            <button key={value} type="button" onClick={() => { setPropertyType(value); setFieldErrors(p => ({...p, propertyType: ''})) }}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer ${propertyType === value ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : fieldErrors.propertyType ? 'border-red-500/50 bg-red-500/5 text-red-200' : 'border-white/8 bg-white/[0.02] text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 hover:border-white/15'}`}>
              <Icon size={20} />
              <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
        {fieldErrors.propertyType && <p className="text-red-400 text-xs mt-1">{fieldErrors.propertyType}</p>}

        {/* Flat sub-questions */}
        <AnimatePresence>
          {propertyType === 'flat' && (
            <motion.div key="flat-sub" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-4 mt-2">
                <p className="text-xs font-semibold text-[#00c685] uppercase tracking-wide">Flat details</p>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="flatType">What type of flat is it?</FieldLabel>
                  <Select value={flatType} onValueChange={v => { setFlatType(v); setFieldErrors(p => ({...p, flatType: ''})) }}>
                    <SelectTrigger id="flatType" className={SELECT_CLS} error={!!fieldErrors.flatType}><SelectValue /></SelectTrigger>
                    <SelectContent className={CONTENT_CLS}>
                      <SelectItem value="basement" icon={<Minus className="w-3.5 h-3.5" />}>Basement flat</SelectItem>
                      <SelectItem value="ground" icon={<Home className="w-3.5 h-3.5" />}>Ground floor flat</SelectItem>
                      <SelectItem value="first" icon={<Building className="w-3.5 h-3.5" />}>First floor flat</SelectItem>
                      <SelectItem value="second-plus" icon={<Building2 className="w-3.5 h-3.5" />}>Second floor or above</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.flatType && <p className="text-red-400 text-xs mt-1">{fieldErrors.flatType}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <FieldLabel>Is the flat self-contained?</FieldLabel>
                    <TooltipIcon text="A self-contained flat has its own kitchen, bathroom and a secure entrance separate from other properties in the building." />
                  </div>
                  <YesNoButtons value={isSelfContained} onChange={v => { setIsSelfContained(v); setFieldErrors(p => ({...p, isSelfContained: ''})) }} error={!!fieldErrors.isSelfContained} />
                  {fieldErrors.isSelfContained && <p className="text-red-400 text-xs mt-1">{fieldErrors.isSelfContained}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Divider />

      {/* Room Details */}
      <div className="space-y-3">
        <SectionLabel>Room Details</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <RoomRow icon={Bed} label="Bedrooms" value={bedrooms} onChange={setBedrooms} />
          <RoomRow icon={Bath} label="Bathrooms" value={bathrooms} onChange={setBathrooms} />
          <RoomRow icon={Sofa} label="Living Rooms" value={livingRooms} onChange={setLivingRooms} />
          <RoomRow icon={ChefHat} label="Kitchens" value={kitchens} onChange={setKitchens} />
          <RoomRow icon={Grid} label="Other Rooms" value={otherRooms} onChange={setOtherRooms} />
        </div>
        <p className="text-[11px] text-gray-600">Other rooms: utility, study, storage. Do not include hallways or corridors.</p>
      </div>

      <Divider />

      {/* Property Details — buildings cover only */}
      {isBuildingsIncluded && (<div className="space-y-3">
        <SectionLabel>Construction &amp; Age</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="yearBuilt">Year built</FieldLabel>
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input id="yearBuilt" value={yearBuilt} onChange={e => { setYearBuilt(e.target.value); setFieldErrors(p => ({...p, yearBuilt: ''})) }} placeholder="YYYY" maxLength={4} className={INPUT_CLS} error={!!fieldErrors.yearBuilt} />
            </div>
            {fieldErrors.yearBuilt && <p className="text-red-400 text-xs mt-1">{fieldErrors.yearBuilt}</p>}
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Number of floors</FieldLabel>
            <div className="flex items-center h-10 px-3 rounded-xl border border-white/8 bg-white/[0.04]">
              <Stepper value={numFloors} onChange={setNumFloors} min={1} max={5} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label htmlFor="wall" className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Wall construction</label>
              <TooltipIcon text="The main material used for the external walls of the property." />
            </div>
            <Select value={wallConstruction} onValueChange={v => { setWallConstruction(v); setFieldErrors(p => ({...p, wallConstruction: ''})) }}>
              <SelectTrigger id="wall" className={SELECT_CLS} error={!!fieldErrors.wallConstruction}><SelectValue /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="brick" icon={<Layers className="w-3.5 h-3.5" />}>Brick</SelectItem>
                <SelectItem value="stone" icon={<Gem className="w-3.5 h-3.5" />}>Stone</SelectItem>
                <SelectItem value="timber" icon={<Trees className="w-3.5 h-3.5" />}>Timber frame</SelectItem>
                <SelectItem value="concrete" icon={<Building className="w-3.5 h-3.5" />}>Concrete</SelectItem>
                <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other / Not sure</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.wallConstruction && <p className="text-red-400 text-xs mt-1">{fieldErrors.wallConstruction}</p>}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label htmlFor="roof" className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Roof type</label>
              <TooltipIcon text="Flat roofs carry a higher moisture and leak risk and may affect your contribution." />
            </div>
            <Select value={roofType} onValueChange={v => { setRoofType(v); if (v !== 'flat' && v !== 'mixed') setFlatRoofPercentage(''); setFieldErrors(p => ({...p, roofType: ''})) }}>
              <SelectTrigger id="roof" className={SELECT_CLS} error={!!fieldErrors.roofType}><SelectValue /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="pitched-tiles" icon={<Layers className="w-3.5 h-3.5" />}>Pitched – Tiles</SelectItem>
                <SelectItem value="pitched-slate" icon={<Grid className="w-3.5 h-3.5" />}>Pitched – Slate</SelectItem>
                <SelectItem value="flat" icon={<Minus className="w-3.5 h-3.5" />}>Flat roof</SelectItem>
                <SelectItem value="mixed" icon={<Layers className="w-3.5 h-3.5" />}>Mixed (part flat, part pitched)</SelectItem>
                <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other / Not sure</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.roofType && <p className="text-red-400 text-xs mt-1">{fieldErrors.roofType}</p>}
          </div>
        </div>

        {/* Flat roof % — conditional */}
        <AnimatePresence>
          {hasFlatRoof && (
            <motion.div key="flatroofpct" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Proportion of flat roof</label>
                  <TooltipIcon text="An estimate is fine. This helps us understand the risk exposure of your property." />
                </div>
                <Select value={flatRoofPercentage} onValueChange={v => { setFlatRoofPercentage(v); setFieldErrors(p => ({...p, flatRoofPercentage: ''})) }}>
                  <SelectTrigger className={SELECT_CLS} error={!!fieldErrors.flatRoofPercentage}><SelectValue /></SelectTrigger>
                  <SelectContent className={CONTENT_CLS}>
                    <SelectItem value="lt10" icon={<Layers className="w-3.5 h-3.5" />}>Up to 10%</SelectItem>
                    <SelectItem value="lt20" icon={<Layers className="w-3.5 h-3.5" />}>Up to 20%</SelectItem>
                    <SelectItem value="lt30" icon={<Layers className="w-3.5 h-3.5" />}>Up to 30%</SelectItem>
                    <SelectItem value="lt50" icon={<Layers className="w-3.5 h-3.5" />}>Up to 50%</SelectItem>
                    <SelectItem value="gt50" icon={<Layers className="w-3.5 h-3.5" />}>More than 50%</SelectItem>
                    <SelectItem value="all" icon={<Minus className="w-3.5 h-3.5" />}>Entire roof is flat</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.flatRoofPercentage && <p className="text-red-400 text-xs mt-1">{fieldErrors.flatRoofPercentage}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heating */}
        <div className="space-y-1.5">
          <FieldLabel htmlFor="heating">Type of heating</FieldLabel>
          <Select value={heating} onValueChange={v => { setHeating(v); setFieldErrors(p => ({...p, heating: ''})) }}>
            <SelectTrigger id="heating" className={SELECT_CLS} error={!!fieldErrors.heating}><SelectValue /></SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="gas-central" icon={<Flame className="w-3.5 h-3.5" />}>Gas Central Heating</SelectItem>
              <SelectItem value="gas-tank" icon={<Flame className="w-3.5 h-3.5" />}>Gas with Hot Water Tank</SelectItem>
              <SelectItem value="electric" icon={<Zap className="w-3.5 h-3.5" />}>Electric Heating</SelectItem>
              <SelectItem value="oil" icon={<Droplets className="w-3.5 h-3.5" />}>Oil-Fired Heating</SelectItem>
              <SelectItem value="heat-pump" icon={<Wrench className="w-3.5 h-3.5" />}>Heat Pump</SelectItem>
              <SelectItem value="solid-fuel" icon={<Trees className="w-3.5 h-3.5" />}>Solid Fuel / Multi-Fuel</SelectItem>
              <SelectItem value="none" icon={<CircleSlash className="w-3.5 h-3.5" />}>No Central Heating</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.heating && <p className="text-red-400 text-xs mt-1">{fieldErrors.heating}</p>}
        </div>
      </div>)}

      {isBuildingsIncluded && <Divider />}

      {/* Extensions — buildings cover only */}
      {isBuildingsIncluded && (<div className="space-y-3">
        <SectionLabel>Extensions &amp; Alterations</SectionLabel>
        <div className="space-y-1.5">
          <FieldLabel>Has the property been extended or structurally altered?</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {[{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }, { v: 'not-sure', l: 'Not sure' }].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => { setHasExtension(v); setFieldErrors(p => ({...p, hasExtension: ''})) }}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${hasExtension === v ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : fieldErrors.hasExtension ? 'border-red-500/50 bg-red-500/5 text-red-200 hover:bg-red-500/10' : 'border-white/8 bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-gray-200'}`}>
                {l}
              </button>
            ))}
          </div>
          {fieldErrors.hasExtension && <p className="text-red-400 text-xs mt-1">{fieldErrors.hasExtension}</p>}
        </div>
        <AnimatePresence>
          {hasExtension === 'yes' && (
            <motion.div key="ext" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="extType">Type of extension</FieldLabel>
                  <Select value={extensionType} onValueChange={v => { setExtensionType(v); setFieldErrors(p => ({...p, extensionType: ''})) }}>
                    <SelectTrigger id="extType" className={SELECT_CLS} error={!!fieldErrors.extensionType}><SelectValue /></SelectTrigger>
                    <SelectContent className={CONTENT_CLS}>
                      <SelectItem value="rear" icon={<Expand className="w-3.5 h-3.5" />}>Rear extension</SelectItem>
                      <SelectItem value="side" icon={<Expand className="w-3.5 h-3.5" />}>Side extension</SelectItem>
                      <SelectItem value="loft" icon={<Building2 className="w-3.5 h-3.5" />}>Loft conversion</SelectItem>
                      <SelectItem value="garage" icon={<Home className="w-3.5 h-3.5" />}>Garage conversion</SelectItem>
                      <SelectItem value="conservatory" icon={<LayoutGrid className="w-3.5 h-3.5" />}>Conservatory</SelectItem>
                      <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.extensionType && <p className="text-red-400 text-xs mt-1">{fieldErrors.extensionType}</p>}
                </div>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="extYear">Approximate year</FieldLabel>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input id="extYear" value={extensionYear} onChange={e => { setExtensionYear(e.target.value); setFieldErrors(p => ({...p, extensionYear: ''})) }} placeholder="YYYY" maxLength={4} className={INPUT_CLS} error={!!fieldErrors.extensionYear} />
                  </div>
                  {fieldErrors.extensionYear && <p className="text-red-400 text-xs mt-1">{fieldErrors.extensionYear}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>)}
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // STEP 3 — OWNERSHIP & OCCUPANCY
  // ════════════════════════════════════════════════════════════════════
  const step3 = (
    <div className="space-y-6">
      {/* Ownership */}
      <div className="space-y-3">
        <SectionLabel>Your Relationship to the Property</SectionLabel>
        <div className="grid grid-cols-1 gap-2">
          <CoverTypeCard label="I own the property" description="Freeholder or leaseholder — you own the property outright or have purchased the lease." icon={Home} selected={ownership === 'owner'} error={!!fieldErrors.ownership} onClick={() => { setOwnership('owner'); setFieldErrors(p => ({...p, ownership: ''})) }} />
          <CoverTypeCard label="I am buying the property" description="You are in the process of purchasing — exchange or completion is pending." icon={Key} selected={ownership === 'buying'} error={!!fieldErrors.ownership} onClick={() => { setOwnership('buying'); setFieldErrors(p => ({...p, ownership: ''})) }} />
          <CoverTypeCard label="I rent the property" description="You are a tenant renting from a private landlord, housing association or council." icon={Building2} selected={ownership === 'tenant'} error={!!fieldErrors.ownership} onClick={() => { setOwnership('tenant'); setFieldErrors(p => ({...p, ownership: ''})) }} />
        </div>
        {fieldErrors.ownership && <p className="text-red-400 text-xs mt-1">{fieldErrors.ownership}</p>}
      </div>

      {/* Eligibility gate */}
      <AnimatePresence>
        {ownership && !eligibility.eligible && (
          <motion.div key="elig" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-red-500/30 bg-red-500/8 p-4 flex gap-3">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1">Cover combination not available</p>
              {eligibility.reasons.map((r, i) => <p key={i} className="text-xs text-red-300/80 leading-relaxed">{r}</p>)}
            </div>
          </motion.div>
        )}
        {eligibility.warnings.map((w, i) => (
          <motion.div key={`warn-${i}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 flex gap-3">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80 leading-relaxed">{w}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ownership conditionals */}
      <AnimatePresence>
        {(ownership === 'owner' || ownership === 'buying') && (
          <motion.div key="owner-buying" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="purchaseYear">
                  {ownership === 'buying' ? 'Expected purchase year' : 'Year of purchase'}
                </FieldLabel>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input id="purchaseYear" value={purchaseYear} onChange={e => { setPurchaseYear(e.target.value); setFieldErrors(p => ({...p, purchaseYear: ''})) }} placeholder="YYYY" maxLength={4} className={INPUT_CLS} error={!!fieldErrors.purchaseYear} />
                </div>
                {fieldErrors.purchaseYear && <p className="text-red-400 text-xs mt-1">{fieldErrors.purchaseYear}</p>}
              </div>
              <div className="space-y-1.5">
                <FieldLabel>{ownership === 'buying' ? 'Will you have a mortgage?' : 'Do you have a mortgage?'}</FieldLabel>
                <YesNoButtons value={hasMortgage} onChange={v => { setHasMortgage(v); setFieldErrors(p => ({...p, hasMortgage: ''})) }} error={!!fieldErrors.hasMortgage} />
                {fieldErrors.hasMortgage && <p className="text-red-400 text-xs mt-1">{fieldErrors.hasMortgage}</p>}
              </div>
            </div>
          </motion.div>
        )}
        {ownership === 'tenant' && (
          <motion.div key="tenant" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="rentalType">Who are you renting from?</FieldLabel>
              <Select value={rentalType} onValueChange={v => { setRentalType(v); setFieldErrors(p => ({...p, rentalType: ''})) }}>
                <SelectTrigger id="rentalType" className={SELECT_CLS} error={!!fieldErrors.rentalType}><SelectValue /></SelectTrigger>
                <SelectContent className={CONTENT_CLS}>
                  <SelectItem value="private-furnished" icon={<Home className="w-3.5 h-3.5" />}>Private landlord — furnished</SelectItem>
                  <SelectItem value="private-unfurnished" icon={<Home className="w-3.5 h-3.5" />}>Private landlord — unfurnished</SelectItem>
                  <SelectItem value="council" icon={<Building className="w-3.5 h-3.5" />}>Local authority / Council</SelectItem>
                  <SelectItem value="housing-assoc" icon={<Users className="w-3.5 h-3.5" />}>Housing association</SelectItem>
                  <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other arrangement</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.rentalType && <p className="text-red-400 text-xs mt-1">{fieldErrors.rentalType}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Divider />

      {/* Property Use */}
      <div className="space-y-3">
        <SectionLabel>Property Use</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {[{ v: 'main', l: 'Main residence', d: 'Your primary home' }, { v: 'second', l: 'Second home', d: 'Occasional use' }, { v: 'holiday', l: 'Holiday home', d: 'Seasonal or short-term' }, { v: 'let', l: 'Let property', d: 'Rented to tenants' }].map(({ v, l, d }) => (
            <button key={v} type="button" onClick={() => { setPropertyUse(v); setFieldErrors(p => ({...p, propertyUse: ''})) }}
              className={`text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${propertyUse === v ? 'border-[#00c685]/50 bg-[#00c685]/10' : fieldErrors.propertyUse ? 'border-red-500/50 bg-red-500/5 text-red-200' : 'border-white/8 bg-white/[0.02] hover:border-white/15'}`}>
              <p className={`text-sm font-semibold ${propertyUse === v ? 'text-white' : fieldErrors.propertyUse ? 'text-red-200' : 'text-gray-300'}`}>{l}</p>
              <p className={`text-xs mt-0.5 ${fieldErrors.propertyUse ? 'text-red-400/80' : 'text-gray-500'}`}>{d}</p>
            </button>
          ))}
        </div>
        {fieldErrors.propertyUse && <p className="text-red-400 text-xs mt-1">{fieldErrors.propertyUse}</p>}
      </div>

      <Divider />

      {/* Occupancy */}
      <div className="space-y-3">
        <SectionLabel>Occupancy</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <AnimatePresence>
            {propertyUse !== 'main' && (
              <motion.div key="unoccupied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-3 space-y-1.5">
                <FieldLabel htmlFor="unoccupied">How long is the property unoccupied per year?</FieldLabel>
                <Select value={unoccupiedPeriod} onValueChange={setUnoccupiedPeriod}>
                  <SelectTrigger id="unoccupied" className={SELECT_CLS}><SelectValue /></SelectTrigger>
                  <SelectContent className={CONTENT_CLS}>
                    <SelectItem value="lt30" icon={<Clock className="w-3.5 h-3.5" />}>Less than 30 days</SelectItem>
                    <SelectItem value="30-60" icon={<Clock className="w-3.5 h-3.5" />}>30–60 days</SelectItem>
                    <SelectItem value="60-90" icon={<Clock className="w-3.5 h-3.5" />}>60–90 days</SelectItem>
                    <SelectItem value="gt90" icon={<Clock className="w-3.5 h-3.5" />}>More than 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="py-3 space-y-2">
            <FieldLabel htmlFor="business">Is the property used for any business activity?</FieldLabel>
            <Select value={usedForBusiness} onValueChange={setUsedForBusiness}>
              <SelectTrigger id="business" className={SELECT_CLS}><SelectValue /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="no" icon={<CircleSlash className="w-3.5 h-3.5" />}>No business use</SelectItem>
                <SelectItem value="wfh" icon={<Laptop className="w-3.5 h-3.5" />}>Working from home — clerical only, no visitors</SelectItem>
                <SelectItem value="wfh-visitors" icon={<User className="w-3.5 h-3.5" />}>Working from home — clerical with occasional visitors</SelectItem>
                <SelectItem value="other" icon={<BriefcaseBusiness className="w-3.5 h-3.5" />}>Other business use</SelectItem>
              </SelectContent>
            </Select>

            <AnimatePresence>
              {(usedForBusiness === 'wfh-visitors' || usedForBusiness === 'other') && (
                <motion.div key="biz-sub" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                  <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.06] overflow-hidden">
                    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                      <div>
                        <p className="text-sm text-white font-medium">Is the business area self-contained?</p>
                        <p className="text-xs text-gray-500 mt-0.5">Business visitors won&apos;t pass through residential areas.</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[true, false].map(v => (
                          <button key={String(v)} type="button" onClick={() => setBizSelfContained(v)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${bizSelfContained === v ? (v ? 'bg-[#00c685] border-[#00c685] text-white' : 'bg-white/10 border-white/20 text-white') : 'bg-transparent border-white/15 text-gray-400 hover:border-white/30'}`}>
                            {v ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-3.5 space-y-2">
                      <p className="text-sm text-white font-medium">How often do business visitors attend?</p>
                      <Select value={bizVisitFreq} onValueChange={v => { setBizVisitFreq(v); setFieldErrors(p => ({...p, bizVisitFreq: ''})) }}>
                        <SelectTrigger className={SELECT_CLS} error={!!fieldErrors.bizVisitFreq}><SelectValue /></SelectTrigger>
                        <SelectContent className={CONTENT_CLS}>
                          <SelectItem value="never" icon={<CircleSlash className="w-3.5 h-3.5" />}>Never</SelectItem>
                          <SelectItem value="occasionally" icon={<Clock className="w-3.5 h-3.5" />}>Occasionally</SelectItem>
                          <SelectItem value="monthly" icon={<Clock className="w-3.5 h-3.5" />}>Monthly</SelectItem>
                          <SelectItem value="weekly" icon={<Clock className="w-3.5 h-3.5" />}>Weekly</SelectItem>
                          <SelectItem value="several-week" icon={<Clock className="w-3.5 h-3.5" />}>Several times per week</SelectItem>
                          <SelectItem value="daily" icon={<User className="w-3.5 h-3.5" />}>Daily</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.bizVisitFreq && <p className="text-red-400 text-xs mt-1">{fieldErrors.bizVisitFreq}</p>}
                    </div>
                    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                      <p className="text-sm text-white font-medium">Are business visitors escorted at all times?</p>
                      <div className="flex items-center gap-1 shrink-0">
                        {[true, false].map(v => (
                          <button key={String(v)} type="button" onClick={() => setBizEscorted(v)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${bizEscorted === v ? (v ? 'bg-[#00c685] border-[#00c685] text-white' : 'bg-white/10 border-white/20 text-white') : 'bg-transparent border-white/15 text-gray-400 hover:border-white/30'}`}>
                            {v ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Divider />

      {/* Occupants */}
      <div className="space-y-3">
        <SectionLabel>Occupants</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-300">Adults (18+)</span>
            <Stepper value={adults} onChange={setAdults} min={1} max={10} />
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-300">Children under 18</span>
            <Stepper value={children} onChange={setChildren} min={0} max={10} />
          </div>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // STEP 4 — SECURITY
  // ════════════════════════════════════════════════════════════════════
  const step4 = (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionLabel>Locks &amp; Access</SectionLabel>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <label htmlFor="doorLocks" className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Type of lock on main entrance</label>
            <TooltipIcon text="Multi-point locks and 5-lever mortice deadlocks significantly reduce break-in risk and may lower your contribution." />
          </div>
          <Select value={doorLocks} onValueChange={v => { setDoorLocks(v); setFieldErrors(p => ({...p, doorLocks: ''})) }}>
            <SelectTrigger id="doorLocks" className={SELECT_CLS} error={!!fieldErrors.doorLocks}><SelectValue /></SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="5lever-bs3621" icon={<Lock className="w-3.5 h-3.5" />}>5-lever mortice deadlock (BS 3621)</SelectItem>
              <SelectItem value="5lever" icon={<Lock className="w-3.5 h-3.5" />}>5-lever mortice deadlock</SelectItem>
              <SelectItem value="multipoint" icon={<Key className="w-3.5 h-3.5" />}>Key-operated multi-point locking system</SelectItem>
              <SelectItem value="yale" icon={<Shield className="w-3.5 h-3.5" />}>Rim automatic deadlatch (Yale-type)</SelectItem>
              <SelectItem value="smart" icon={<Laptop className="w-3.5 h-3.5" />}>Smart lock</SelectItem>
              <SelectItem value="other" icon={<Plus className="w-3.5 h-3.5" />}>Other</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.doorLocks && <p className="text-red-400 text-xs mt-1">{fieldErrors.doorLocks}</p>}
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow label="Do accessible windows have key-operated locks?" hint="Accessible windows include ground floor and easily reachable upper windows." value={windowLocked} onChange={setWindowLocked} />
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Alarm &amp; Surveillance</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow label="Does the property have a burglar alarm?" value={burglarAlarm} onChange={setBurglarAlarm} />
          <AnimatePresence>
            {burglarAlarm && (
              <motion.div key="alarm-mon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ToggleRow label="Is the alarm professionally monitored 24/7?" hint="Monitored alarms typically qualify for a contribution discount." value={alarmMonitored} onChange={setAlarmMonitored} />
              </motion.div>
            )}
          </AnimatePresence>
          <ToggleRow label="Does the property have CCTV?" value={hasCCTV} onChange={setHasCCTV} />
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <SectionLabel>Safety &amp; Environmental</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow label="Are working smoke detectors fitted on each floor?" hint="A legal requirement in England — one on each storey of the property." value={smokeAlarms} onChange={setSmokeAlarms} />
          <ToggleRow label="Is there a bolted or certified safe on the premises?" hint="A bolted safe may allow higher individual item cover limits." value={hasSafe} onChange={setHasSafe} />
          <ToggleRow label="Is the property in a known flood risk area?" hint="You can check using the Environment Agency flood map for planning." value={floodRisk} onChange={setFloodRisk} />
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 flex gap-3">
        <Shield size={16} className="text-[#00c685] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">Security measures directly influence your Takaful contribution. Better security lowers risk for the entire community pool — and may reduce your monthly amount.</p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // STEP 5 — COVER DETAILS
  // ════════════════════════════════════════════════════════════════════
  const step5 = (
    <div className="space-y-6">
      {/* Buildings cover details */}
      {isBuildingsIncluded && (
        <>
          <div className="space-y-3">
            <SectionLabel>Buildings Cover</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label htmlFor="mktVal" className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Market value</label>
                  <TooltipIcon text="The approximate sale price of your property. This is different from the rebuild cost." />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">£</span>
                  <Input id="mktVal" value={marketValue} onChange={e => { setMarketValue(e.target.value); setFieldErrors(p => ({...p, marketValue: ''})) }} placeholder="e.g. 350000" type="number" min="0" className="pl-8 h-10" error={!!fieldErrors.marketValue} />
                </div>
                {fieldErrors.marketValue && <p className="text-red-400 text-xs mt-1">{fieldErrors.marketValue}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label htmlFor="rebuild" className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Rebuild cost</label>
                  <TooltipIcon text="The estimated cost to completely rebuild your home from the ground up — typically less than the market value. Your insurer uses this figure, not the sale price." />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">£</span>
                  <Input id="rebuild" value={rebuildCost} onChange={e => { setRebuildCost(e.target.value); setFieldErrors(p => ({...p, rebuildCost: ''})) }} placeholder="e.g. 180000" type="number" min="0" className="pl-8 h-10" error={!!fieldErrors.rebuildCost} />
                </div>
                {fieldErrors.rebuildCost && <p className="text-red-400 text-xs mt-1">{fieldErrors.rebuildCost}</p>}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-white/6 bg-white/[0.02] text-xs text-gray-500 leading-relaxed">
              Not sure of your rebuild cost? An RICS surveyor can provide an accurate figure. The Building Cost Information Service (BCIS) calculator is also available online.
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <FieldLabel htmlFor="bldExcess">Buildings voluntary excess</FieldLabel>
              <TooltipIcon text="The amount you agree to contribute towards a buildings claim, on top of any compulsory excess. A higher excess lowers your monthly contribution." />
            </div>
            <Select value={buildingsExcess} onValueChange={setBuildingsExcess}>
              <SelectTrigger id="bldExcess" className={SELECT_CLS}><SelectValue /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                <SelectItem value="0" icon={<Scale className="w-3.5 h-3.5" />}>£0</SelectItem>
                <SelectItem value="150" icon={<Scale className="w-3.5 h-3.5" />}>£150</SelectItem>
                <SelectItem value="250" icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]" />}>£250 — Recommended</SelectItem>
                <SelectItem value="500" icon={<Scale className="w-3.5 h-3.5" />}>£500</SelectItem>
                <SelectItem value="1000" icon={<Scale className="w-3.5 h-3.5" />}>£1,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <SectionLabel>Buildings Add-ons</SectionLabel>
            <RiderCard icon={Zap} label="Buildings Accidental Damage" desc="Covers sudden, unexpected damage to the fabric of your home — e.g. accidentally putting a foot through the ceiling." selected={buildingsAccidentalDamage} onClick={() => setBuildingsAccidentalDamage(v => !v)} />
          </div>

          {isContentsIncluded && <Divider />}
        </>
      )}

      {/* Contents cover details */}
      {isContentsIncluded && (
        <>
          <div className="space-y-3">
            <SectionLabel>Contents Cover</SectionLabel>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FieldLabel htmlFor="ctExcess">Contents voluntary excess</FieldLabel>
                <TooltipIcon text="The amount you agree to contribute towards a contents claim. A higher excess lowers your monthly contribution." />
              </div>
              <Select value={contentsExcess} onValueChange={setContentsExcess}>
                <SelectTrigger id="ctExcess" className={SELECT_CLS}><SelectValue /></SelectTrigger>
                <SelectContent className={CONTENT_CLS}>
                  <SelectItem value="0" icon={<Scale className="w-3.5 h-3.5" />}>£0</SelectItem>
                  <SelectItem value="100" icon={<Scale className="w-3.5 h-3.5" />}>£100</SelectItem>
                  <SelectItem value="250" icon={<Sparkles className="w-3.5 h-3.5 text-[#0CF2A0]" />}>£250 — Recommended</SelectItem>
                  <SelectItem value="500" icon={<Scale className="w-3.5 h-3.5" />}>£500</SelectItem>
                  <SelectItem value="1000" icon={<Scale className="w-3.5 h-3.5" />}>£1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <SectionLabel>Contents Add-ons</SectionLabel>
            <RiderCard icon={Zap} label="Contents Accidental Damage" desc="Covers accidental damage to your belongings — e.g. spilling a drink on a laptop or dropping your television." selected={contentsAccidentalDamage} onClick={() => setContentsAccidentalDamage(v => !v)} />
          </div>
        </>
      )}

      <Divider />

      {/* Shared add-ons */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <SectionLabel>Optional Extras</SectionLabel>
          <span className="text-[10px] text-gray-500">(select any that apply)</span>
        </div>
        <RiderCard icon={Scale} label="Legal Expenses Cover" desc="Up to £100,000 for property disputes, employment tribunals and neighbour issues." selected={legalExpenses} onClick={() => setLegalExpenses(v => !v)} />
        <RiderCard icon={Wrench} label="Home Emergency Cover" desc="24/7 callout for boiler breakdowns, burst pipes, lost keys and power failures." selected={homeEmergency} onClick={() => setHomeEmergency(v => !v)} />
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // STEP 6 — YOUR BELONGINGS (skipped for buildings-only)
  // ════════════════════════════════════════════════════════════════════
  const step6 = (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionLabel>Contents Valuation</SectionLabel>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <label htmlFor="contentsVal" className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Estimated total contents value</label>
            <TooltipIcon text="Include all furniture, appliances, clothing, electronics, and personal items. Estimate replacement cost at today's prices, not what you paid originally." />
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">£</span>
            <Input id="contentsVal" value={contentsValue} onChange={e => { setContentsValue(e.target.value); setFieldErrors(p => ({...p, contentsValue: ''})) }} placeholder="e.g. 30000" type="number" min="0" className="pl-8 h-10" error={!!fieldErrors.contentsValue} />
          </div>
          {fieldErrors.contentsValue && <p className="text-red-400 text-xs mt-1">{fieldErrors.contentsValue}</p>}
          <p className="text-[11px] text-gray-500">Include bedroom, living room, kitchen, bathroom, and garden contents. High-value items can be listed separately below.</p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">Under-insuring your contents can leave you out of pocket. We recommend estimating generously — even a small additional contribution can significantly increase your protection.</p>
      </div>

      <Divider />

      {/* High-value items */}
      <div className="space-y-3">
        <SectionLabel>High-Value Items</SectionLabel>
        <p className="text-xs text-gray-500 -mt-1 leading-relaxed">Individual items over £1,500 may need to be listed separately to ensure they are fully covered.</p>
        <div className="grid grid-cols-2 gap-2">
          {[{ v: true, l: 'Yes, I have high-value items' }, { v: false, l: 'No high-value items' }].map(({ v, l }) => (
            <button key={String(v)} type="button" onClick={() => { setHasHighValueItems(v); if (!v) setHighValueItems([]); }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${hasHighValueItems === v ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : 'border-white/8 bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-gray-200'}`}>
              {l}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {hasHighValueItems && (
            <motion.div key="hvi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <AnimatePresence>
                {highValueItems.map((item, i) => (
                  <HighValueItemRow key={item.id} item={item} index={i} onRemove={() => removeHighValueItem(item.id)} onChange={u => updateHighValueItem(item.id, u)} />
                ))}
              </AnimatePresence>
              <button type="button" onClick={addHighValueItem}
                className="w-full py-3 rounded-xl border border-dashed border-white/15 text-sm text-gray-400 hover:border-[#00c685]/40 hover:text-[#00c685] transition-all cursor-pointer flex items-center justify-center gap-2">
                <Plus size={14} /> Add {highValueItems.length === 0 ? 'an item' : 'another item'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Divider />

      {/* Away from home */}
      <div className="space-y-3">
        <SectionLabel>Away-from-Home Cover</SectionLabel>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4">
          <ToggleRow label="Do you want your contents protected away from home?" hint="Covers phones, laptops, cameras, jewellery and other valuables when you take them outside your property." value={portableValuables} onChange={setPortableValuables} />
        </div>
        <AnimatePresence>
          {portableValuables && (
            <motion.div key="portable-amt" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wide text-white/40 leading-none">Away-from-home cover amount</label>
                  <TooltipIcon text="The maximum total value of items you'll take outside your home. Individual item limits still apply." />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00c685] text-sm font-semibold font-mono">£</span>
                  <Input value={portableValuablesAmount} onChange={e => { setPortableValuablesAmount(e.target.value); setFieldErrors(p => ({...p, portableValuablesAmount: ''})) }} placeholder="e.g. 2000" type="number" min="0" className="pl-8 h-10" error={!!fieldErrors.portableValuablesAmount} />
                </div>
                {fieldErrors.portableValuablesAmount && <p className="text-red-400 text-xs mt-1">{fieldErrors.portableValuablesAmount}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // STEP 7 — ABOUT YOU & REVIEW
  // ════════════════════════════════════════════════════════════════════
  const reviewSections = [
    {
      label: 'Cover',
      step: 1,
      rows: [
        ['Cover type', coverLabel],
        ['Start date', coverStartDate || '—'],
      ],
    },
    {
      label: 'Property',
      step: 2,
      rows: [
        ['Postcode', postcode || '—'],
        ['Type', propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1).replace('-', '‑') : '—'],
        ['Bedrooms / Bathrooms', `${bedrooms} bd · ${bathrooms} ba`],
        ['Living / Kitchens', `${livingRooms} · ${kitchens}`],
        ['Year built', yearBuilt || '—'],
        ['Wall / Roof', `${wallConstruction || '—'} / ${roofType || '—'}`],
        ['Heating', heating || '—'],
        ['Extensions', hasExtension === 'yes' ? `Yes — ${extensionType || 'type not specified'}` : hasExtension === 'no' ? 'No' : '—'],
      ],
    },
    {
      label: 'Ownership',
      step: 3,
      rows: [
        ['Relationship', ownership === 'owner' ? 'Owner' : ownership === 'buying' ? 'Buying' : ownership === 'tenant' ? 'Tenant' : '—'],
        ['Property use', propertyUse || '—'],
        ['Business use', usedForBusiness === 'no' ? 'None' : usedForBusiness || '—'],
        ['Occupants', `${adults} adult${adults !== 1 ? 's' : ''}, ${children} child${children !== 1 ? 'ren' : ''}`],
      ],
    },
    {
      label: 'Security',
      step: 4,
      rows: [
        ['Door locks', doorLocks || '—'],
        ['Window locks', windowLocked ? 'Yes' : 'No'],
        ['Burglar alarm', burglarAlarm ? (alarmMonitored ? 'Yes — monitored' : 'Yes') : 'No'],
        ['Smoke alarms', smokeAlarms ? 'Yes' : 'No'],
        ['CCTV', hasCCTV ? 'Yes' : 'No'],
        ['Flood risk', floodRisk ? 'Yes' : 'No'],
      ],
    },
    {
      label: 'Cover Details',
      step: 5,
      rows: [
        ...(isBuildingsIncluded ? [
          ['Rebuild cost', rebuildCost ? `£${Number(rebuildCost).toLocaleString()}` : '—'],
          ['Buildings excess', `£${buildingsExcess}`],
          ['Buildings accidental damage', buildingsAccidentalDamage ? 'Yes' : 'No'],
        ] : []),
        ...(isContentsIncluded ? [
          ['Contents excess', `£${contentsExcess}`],
          ['Contents accidental damage', contentsAccidentalDamage ? 'Yes' : 'No'],
        ] : []),
        ['Legal expenses', legalExpenses ? 'Yes' : 'No'],
        ['Home emergency', homeEmergency ? 'Yes' : 'No'],
      ],
    },
    ...(isContentsIncluded ? [{
      label: 'Belongings',
      step: 6,
      rows: [
        ['Contents value', contentsValue ? `£${Number(contentsValue).toLocaleString()}` : '—'],
        ['High-value items', hasHighValueItems ? `${highValueItems.length} item${highValueItems.length !== 1 ? 's' : ''} listed` : 'None'],
        ['Away from home', portableValuables ? (portableValuablesAmount ? `Yes — £${portableValuablesAmount}` : 'Yes') : 'No'],
      ],
    }] : []),
  ];

  const step7 = (
    <div className="space-y-6">
      {/* Claims History */}
      <div className="space-y-3">
        <SectionLabel>Claims History — Last 5 Years</SectionLabel>
        <div className="space-y-1.5">
          <FieldLabel>Have you or anyone living at the property made any home insurance claims or experienced losses in the last 5 years?</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {[{ v: 'no', l: 'No claims' }, { v: 'yes', l: 'Yes' }, { v: 'not-sure', l: 'Not sure' }].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => { setHasClaims(v); setFieldErrors(p => ({...p, hasClaims: ''})); if (v !== 'yes') setClaimsHistory([]); }}
                className={`py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${hasClaims === v ? 'border-[#00c685]/50 bg-[#00c685]/10 text-[#00c685]' : fieldErrors.hasClaims ? 'border-red-500/50 bg-red-500/5 text-red-200' : 'border-white/8 bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-gray-200'}`}>
                {l}
              </button>
            ))}
          </div>
          {fieldErrors.hasClaims && <p className="text-red-400 text-xs mt-1">{fieldErrors.hasClaims}</p>}
        </div>

        <AnimatePresence>
          {hasClaims === 'not-sure' && (
            <motion.div key="not-sure-help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 flex gap-3">
              <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">If you are not sure, you can continue. You are required to disclose any claims you become aware of before your certificate is issued. You can call us to discuss if needed.</p>
            </motion.div>
          )}
          {hasClaims === 'yes' && (
            <motion.div key="claims-builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <AnimatePresence>
                {claimsHistory.map((claim, i) => (
                  <ClaimRowItem key={claim.id} claim={claim} index={i} onRemove={() => removeClaim(claim.id)} onChange={u => updateClaim(claim.id, u)} />
                ))}
              </AnimatePresence>
              <button type="button" onClick={addClaim}
                className="w-full py-3 rounded-xl border border-dashed border-amber-500/25 text-sm text-gray-400 hover:border-amber-500/50 hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center gap-2">
                <Plus size={14} /> {claimsHistory.length === 0 ? 'Add an incident' : 'Add another incident'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 divide-y divide-white/5">
          <ToggleRow label="Any flooding incidents in the last 5 years?" value={hadFlooding} onChange={setHadFlooding} />
          <ToggleRow label="Any subsidence issues at this or a previous property?" value={hadSubsidence} onChange={setHadSubsidence} />
          <ToggleRow label="Has insurance ever been refused, cancelled or voided for you?" hint="You are required to disclose this information for the certificate to be valid." value={previousInsuranceRefused} onChange={setPreviousInsuranceRefused} />
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-[#00c685]/20 bg-[#00c685]/5 flex gap-3">
        <Shield size={16} className="text-[#00c685] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">In Takaful, honest disclosure ensures fairness for the entire community pool. All disclosures are treated with strict confidentiality and in accordance with UK data protection law.</p>
      </div>

      <Divider />

      {/* Policyholder */}
      <div className="space-y-3">
        <SectionLabel>Your Details</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="ptitle">Title</FieldLabel>
            <Select value={title} onValueChange={v => { setTitle(v); setFieldErrors(p => ({...p, title: ''})) }}>
              <SelectTrigger id="ptitle" className={SELECT_CLS} error={!!fieldErrors.title}><SelectValue /></SelectTrigger>
              <SelectContent className={CONTENT_CLS}>
                {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Other'].map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            {fieldErrors.title && <p className="text-red-400 text-xs mt-1">{fieldErrors.title}</p>}
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <Input id="firstName" value={firstName} onChange={e => { setFirstName(e.target.value); setFieldErrors(p => ({...p, firstName: ''})) }} placeholder="Jane" className="h-10" error={!!fieldErrors.firstName} />
            {fieldErrors.firstName && <p className="text-red-400 text-xs mt-1">{fieldErrors.firstName}</p>}
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="surname">Surname</FieldLabel>
            <Input id="surname" value={surname} onChange={e => { setSurname(e.target.value); setFieldErrors(p => ({...p, surname: ''})) }} placeholder="Smith" className="h-10" error={!!fieldErrors.surname} />
            {fieldErrors.surname && <p className="text-red-400 text-xs mt-1">{fieldErrors.surname}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
          <div className="relative">
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input id="dob" type="date" value={dob} onChange={e => { setDob(e.target.value); setFieldErrors(p => ({...p, dob: ''})) }} className="pl-9 h-10 [color-scheme:dark]" error={!!fieldErrors.dob} />
          </div>
          {fieldErrors.dob && <p className="text-red-400 text-xs mt-1">{fieldErrors.dob}</p>}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input id="email" type="email" value={email} onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({...p, email: ''})) }} placeholder="jane@example.com" className={INPUT_CLS} error={!!fieldErrors.email} />
            </div>
            {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="phone">Phone <span className="text-gray-600 normal-case">(optional)</span></FieldLabel>
            <div className="relative">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07123 456789" className={INPUT_CLS} />
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">We&apos;ll use your email to send your quote and important information. We will not use it for marketing without your explicit consent.</p>
      </div>

      <Divider />

      {/* Payment Preference */}
      <div className="space-y-3">
        <SectionLabel>Contribution Frequency</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {([['monthly', 'Monthly', 'Spread your contribution across 12 payments'], ['annual', 'Annual', 'Pay in full and typically save on your contribution']] as const).map(([v, l, d]) => (
            <button key={v} type="button" onClick={() => setPaymentFrequency(v)}
              className={`text-left px-3.5 py-3.5 rounded-xl border transition-all cursor-pointer ${paymentFrequency === v ? 'border-[#00c685]/50 bg-[#00c685]/10' : 'border-white/8 bg-white/[0.02] hover:border-white/15'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Banknote size={14} className={paymentFrequency === v ? 'text-[#00c685]' : 'text-gray-500'} />
                <p className={`text-sm font-semibold ${paymentFrequency === v ? 'text-white' : 'text-gray-300'}`}>{l}</p>
                {paymentFrequency === v && <Check size={12} className="text-[#00c685] ml-auto" />}
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{d}</p>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Review */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Review Your Details</SectionLabel>
          <span className="text-[10px] text-gray-600">Tap a section to expand · Click Edit to change</span>
        </div>
        {reviewSections.map(section => {
          const isOpen = openSections.includes(section.label);
          return (
            <div key={section.label} className="rounded-xl border border-white/8 overflow-hidden">
              <div role="button" tabIndex={0} onClick={() => toggleSection(section.label)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection(section.label); } }}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer select-none">
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#00c685]">{section.label}</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={e => { e.stopPropagation(); setCurrentStep(section.step); }}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#00c685] transition-colors font-medium cursor-pointer" aria-label={`Edit ${section.label}`}>
                    <Pencil size={10} /> Edit
                  </button>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-white/5">
                  {section.rows.map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center px-4 py-2.5 border-b border-white/5 last:border-0 bg-white/[0.01]">
                      <span className="text-gray-400 text-sm">{k}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[55%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed text-center pt-1">
        By generating your quote you confirm all information provided is true and accurate. Incorrect information may affect the validity of your Takaful certificate.
      </p>
    </div>
  );

  // ── Dynamic step array ──────────────────────────────────────────────
  const STEP_CONTENT = isContentsIncluded
    ? [step1, step2, step3, step4, step5, step6, step7]
    : [step1, step2, step3, step4, step5, step7];

  const STEP_TITLES_ALL = [
    'What would you like to protect?',
    'Your Property',
    'Ownership & Occupancy',
    'Security',
    'Cover Details',
    'Your Belongings',
    'About You & Review',
  ];
  const STEP_DESCS_ALL = [
    'Choose your cover type and your preferred cover start date.',
    'Tell us about the property you\'d like to protect.',
    'Tell us about your relationship to the property and how it\'s used.',
    'Help us understand the security measures in place at your property.',
    'Configure your cover levels, excess amounts, and optional extras.',
    'Estimate the value of your contents and any high-value items.',
    'A few final details, then review everything before generating your quote.',
  ];

  const STEP_TITLES = isContentsIncluded ? STEP_TITLES_ALL : [...STEP_TITLES_ALL.slice(0, 5), STEP_TITLES_ALL[6]];
  const STEP_DESCS  = isContentsIncluded ? STEP_DESCS_ALL  : [...STEP_DESCS_ALL.slice(0, 5),  STEP_DESCS_ALL[6]];

  return (
    <div className="relative min-h-screen w-full bg-[#0a1a14] flex flex-col items-center py-10 px-4 overflow-x-hidden">
      <Particles color={ACCENT} quantity={90} ease={20} className="absolute inset-0 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="bg-[radial-gradient(50%_50%_at_50%_0%,rgba(0,198,133,0.05)_0,transparent_100%)] absolute top-0 w-full h-[60vh]" />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-50">
        <img src="/brand/logo-light.png" alt="Takaful" className="h-6" fetchPriority="high" />
      </Link>

      {!done ? (
        <div className="w-full max-w-[700px] mt-16 z-10">
          {error && (
            <Alert variant="destructive" className="mb-3 bg-red-950/20 border-red-900/30 text-red-300 py-2.5">
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
          <MultiStepForm
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title={STEP_TITLES[currentStep - 1]}
            description={STEP_DESCS[currentStep - 1]}
            onBack={handleBack}
            onNext={handleNext}
            onClose={() => router.push('/')}
            nextButtonText={currentStep === TOTAL_STEPS ? 'Generate My Quote' : 'Continue'}
            backButtonText="Back"
            footerContent={
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                <HeartHandshake size={13} className="text-[#00c685]" />
                Sharia-compliant home protection
              </div>
            }
          >
            {STEP_CONTENT[currentStep - 1]}
          </MultiStepForm>
        </div>
      ) : (
        <QuoteReadyCard
          postcode={postcode}
          email={email}
          monthlyEstimate={monthlyEstimate()}
          coverType={coverType}
          bedrooms={bedrooms}
          accidentalDamage={buildingsAccidentalDamage || contentsAccidentalDamage}
          legalExpenses={legalExpenses}
          homeEmergency={homeEmergency}
          onBack={() => router.push('/')}
          compareUrl={compareUrl}
        />
      )}
    </div>
  );
}

export default function GetQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0a1a14] flex items-center justify-center text-white">
        <div className="text-sm font-semibold tracking-wider uppercase text-[#00c685] animate-pulse">Loading Quote Engine…</div>
      </div>
    }>
      <GetQuoteForm />
    </Suspense>
  );
}
