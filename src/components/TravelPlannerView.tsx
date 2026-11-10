import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Bookmark,
  Check,
  ChevronRight,
  Landmark,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Send,
  Sparkles,
  Trees,
  Wallet,
  Waves,
  Wine,
} from 'lucide-react';

const PLANNER_IMAGE = '/images/localized/ganvie-6b0090.jpg';

const STEPS = [
  {
    id: 'planification',
    label: 'Planification',
    number: '01',
    title: 'Quel voyage vous ressemble ?',
    subtitle: 'Quelques indices suffisent pour esquisser votre séjour.',
  },
  {
    id: 'participants',
    label: 'Participants et dates',
    number: '02',
    title: 'Qui part, et quand ?',
    subtitle: 'Précisez les personnes et la période qui vous conviennent.',
  },
  {
    id: 'projet',
    label: 'Projet de voyage',
    number: '03',
    title: 'Votre Bénin, vos envies',
    subtitle: 'Les lieux et les expériences qui vous font envie.',
  },
  {
    id: 'budget',
    label: 'Budget',
    number: '04',
    title: 'Le bon équilibre',
    subtitle: 'Un budget indicatif nous aide à choisir les bonnes adresses.',
  },
  {
    id: 'informations',
    label: 'Informations personnelles',
    number: '05',
    title: 'Restons en contact',
    subtitle: 'Vos coordonnées pour recevoir votre proposition sur mesure.',
  },
] as const;

const TRIP_TYPES = [
  'Culture & patrimoine',
  'Nature & safari',
  'Plages & détente',
  'Spiritualité & traditions',
  'En famille',
  'Entre amis',
];

const TRIP_TYPE_META: Record<string, { icon: React.ElementType; hint: string }> = {
  'Culture & patrimoine': { icon: Landmark, hint: 'Royaumes, musées, mémoire' },
  'Nature & safari': { icon: Trees, hint: 'Pendjari, cascades, lacs' },
  'Plages & détente': { icon: Waves, hint: 'Littoral, farniente' },
  'Spiritualité & traditions': { icon: Sparkles, hint: 'Vodun, fêtes, rites' },
  'En famille': { icon: Baby, hint: 'Rythme doux, enfants bienvenus' },
  'Entre amis': { icon: Wine, hint: 'Nuits, marchés, rencontres' },
};

const DURATIONS = ['3 à 4 jours', '5 à 7 jours', '8 à 10 jours', '11 jours et +'];

const DESTINATIONS = [
  'Cotonou',
  'Ouidah',
  'Ganvié',
  'Abomey',
  'Porto-Novo',
  'Pendjari',
  'Grand-Popo',
  'Natitingou',
];

const BUDGETS = [
  'Moins de 800 €',
  '800 à 1 500 €',
  '1 500 à 2 500 €',
  'Plus de 2 500 €',
  'À définir ensemble',
];

interface PlannerForm {
  tripTypes: string[];
  duration: string;
  adults: number;
  children: number;
  startDate: string;
  endDate: string;
  destinations: string[];
  project: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialForm: PlannerForm = {
  tripTypes: [],
  duration: '',
  adults: 2,
  children: 0,
  startDate: '',
  endDate: '',
  destinations: [],
  project: '',
  budget: '',
  name: '',
  email: '',
  phone: '',
  message: '',
};

interface TravelPlannerViewProps {
  itineraryCount?: number;
  onOpenItinerary?: () => void;
}

const fieldBase =
  'w-full rounded-2xl border-[1.5px] border-[#E7E2D8] bg-white px-4 py-3 text-sm text-[#0b1b2b] placeholder-[#B4AEA1] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15';

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#D97706] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(217,119,6,0.25)] transition-colors hover:bg-[#B45309]';

const ghostButton =
  'inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#E7E2D8] bg-white px-5 py-2.5 text-sm font-medium text-[#8A8578] transition-colors hover:border-[#0b1b2b] hover:text-[#0b1b2b]';

const Chip: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full border-[1.5px] px-4 py-2 text-[12.5px] font-medium transition-all duration-200 ${
      active
        ? 'border-[#0b1b2b] bg-[#0b1b2b] text-white shadow-sm'
        : 'border-[#E7E2D8] bg-white text-[#8A8578] hover:border-[#D9C7A6] hover:text-[#0b1b2b]'
    }`}
  >
    {children}
  </button>
);

const FieldLabel: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="flex items-baseline justify-between gap-3">
    <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A8578]">
      {children}
    </span>
    {hint && <span className="text-[11px] text-[#B4AEA1]">{hint}</span>}
  </div>
);

const Counter: React.FC<{
  label: string;
  hint: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}> = ({ label, hint, value, min, onChange }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border-[1.5px] border-[#E7E2D8] bg-white px-4 py-3.5 transition-colors hover:border-[#D9C7A6]">
    <div>
      <p className="text-sm font-semibold text-[#0b1b2b]">{label}</p>
      <p className="mt-0.5 text-[11px] text-[#8A8578]">{hint}</p>
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Diminuer ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#E7E2D8] text-[#8A8578] transition-colors hover:border-[#D97706] hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-bold text-[#0b1b2b]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`Augmenter ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#E7E2D8] text-[#8A8578] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

function formatFrDate(value: string): string {
  if (!value) return 'À définir';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const TravelPlannerView: React.FC<TravelPlannerViewProps> = ({
  itineraryCount = 0,
  onOpenItinerary,
}) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PlannerForm>(initialForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const update = <K extends keyof PlannerForm>(key: K, value: PlannerForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleInArray = (key: 'tripTypes' | 'destinations', value: string) =>
    setForm((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });

  const goToStep = (index: number) => {
    setStep(index);
    setStatus('idle');
    setError('');
  };

  const buildSummary = () =>
    [
      `Type de voyage : ${form.tripTypes.join(', ') || 'À définir'}`,
      `Durée : ${form.duration || 'À définir'}`,
      `Participants : ${form.adults} adulte(s), ${form.children} enfant(s)`,
      `Dates : ${formatFrDate(form.startDate)} → ${formatFrDate(form.endDate)}`,
      `Destinations : ${form.destinations.join(', ') || 'À définir'}`,
      `Budget : ${form.budget || 'À définir'}`,
      `Projet : ${form.project || '—'}`,
      `Message : ${form.message || '—'}`,
    ].join('\n');

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Merci de renseigner votre nom et votre adresse email.');
      return;
    }

    setError('');
    setStatus('sending');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: '',
      subject: 'Demande de voyage personnalisé',
      arrivalDate: form.startDate,
      tripDuration: form.duration,
      adults: String(form.adults),
      children: String(form.children),
      budget: form.budget,
      tripType: form.tripTypes.join(', '),
      accommodation: '',
      transport: '',
      guide: '',
      foodPreferences: '',
      message: buildSummary(),
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
      setError("L'envoi a échoué. Vérifiez votre connexion puis réessayez.");
    }
  };

  const reset = () => {
    setForm(initialForm);
    setStatus('idle');
    setError('');
    setStep(0);
  };

  const activeStep = STEPS[step];
  const showRecap = status !== 'sent' && step < STEPS.length - 1;

  const participantsLabel = `${form.adults} adulte${form.adults > 1 ? 's' : ''}${
    form.children > 0 ? `, ${form.children} enfant${form.children > 1 ? 's' : ''}` : ''
  }`;

  const recapRows = [
    { label: 'Style', value: form.tripTypes.join(', ') || 'À définir' },
    { label: 'Durée', value: form.duration || 'À définir' },
    { label: 'Participants', value: participantsLabel },
    {
      label: 'Dates',
      value: form.startDate
        ? `${formatFrDate(form.startDate)} → ${formatFrDate(form.endDate)}`
        : 'À définir',
    },
    { label: 'Budget', value: form.budget || 'À définir' },
    ...(form.destinations.length > 0
      ? [{ label: 'Lieux', value: form.destinations.join(' · ') }]
      : []),
  ];

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel>Votre style de voyage</FieldLabel>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {TRIP_TYPES.map((type) => {
                const meta = TRIP_TYPE_META[type];
                const Icon = meta.icon;
                const active = form.tripTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleInArray('tripTypes', type)}
                    className={`group relative flex flex-col items-start rounded-2xl border-[1.5px] p-3.5 text-left transition-all duration-200 ${
                      active
                        ? 'border-[#D97706] bg-[#FDF3E3] shadow-[0_6px_18px_rgba(217,119,6,0.12)]'
                        : 'border-[#E7E2D8] bg-white hover:border-[#D9C7A6] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                        active
                          ? 'bg-white text-[#D97706]'
                          : 'bg-[#F6F4EF] text-[#8A8578] group-hover:text-[#0b1b2b]'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    </span>
                    <span className="mt-2.5 text-[12.5px] font-semibold leading-snug text-[#0b1b2b]">
                      {type}
                    </span>
                    <span className="mt-1 text-[10.5px] leading-snug text-[#8A8578]">{meta.hint}</span>
                    {active && (
                      <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <FieldLabel hint="Une estimation suffit">Durée du séjour</FieldLabel>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {DURATIONS.map((duration) => (
                <Chip
                  key={duration}
                  active={form.duration === duration}
                  onClick={() => update('duration', form.duration === duration ? '' : duration)}
                >
                  {duration}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Counter
              label="Adultes"
              hint="12 ans et plus"
              value={form.adults}
              min={1}
              onChange={(value) => update('adults', value)}
            />
            <Counter
              label="Enfants"
              hint="Moins de 12 ans"
              value={form.children}
              min={0}
              onChange={(value) => update('children', value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <FieldLabel>Date de départ</FieldLabel>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => update('startDate', event.target.value)}
                className={fieldBase}
              />
            </label>
            <label className="block space-y-2">
              <FieldLabel>Date de retour</FieldLabel>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={(event) => update('endDate', event.target.value)}
                className={fieldBase}
              />
            </label>
          </div>
          <p className="border-l-[3px] border-[#F59E0B] bg-[#FDF3E3] py-2.5 pl-3.5 pr-3 text-xs leading-relaxed text-[#7A4A08] rounded-r-xl">
            Vous hésitez encore sur les dates ? Indiquez une période approximative, nous ajusterons ensemble.
          </p>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel hint="Plusieurs choix possibles">Les lieux qui vous attirent</FieldLabel>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {DESTINATIONS.map((destination) => (
                <Chip
                  key={destination}
                  active={form.destinations.includes(destination)}
                  onClick={() => toggleInArray('destinations', destination)}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 opacity-70" />
                    {destination}
                  </span>
                </Chip>
              ))}
            </div>
          </div>
          <label className="block space-y-2">
            <FieldLabel hint="Facultatif">Votre projet, vos envies</FieldLabel>
            <textarea
              value={form.project}
              onChange={(event) => update('project', event.target.value)}
              rows={4}
              placeholder="Un marché, un village lacustre, un festival, un lodge en pleine nature…"
              className={`${fieldBase} resize-none leading-relaxed`}
            />
          </label>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-8">
          <div>
            <FieldLabel hint="Par personne">Budget indicatif</FieldLabel>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {BUDGETS.map((budget) => {
                const active = form.budget === budget;
                return (
                  <button
                    key={budget}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update('budget', active ? '' : budget)}
                    className={`flex items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition-all duration-200 ${
                      active
                        ? 'border-[#D97706] bg-[#FDF3E3] shadow-[0_6px_18px_rgba(217,119,6,0.12)]'
                        : 'border-[#E7E2D8] bg-white hover:border-[#D9C7A6] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        active ? 'bg-white text-[#D97706]' : 'bg-[#F6F4EF] text-[#8A8578]'
                      }`}
                    >
                      <Wallet className="h-4 w-4" strokeWidth={1.9} />
                    </span>
                    <span className="flex-1 text-[13px] font-semibold text-[#0b1b2b]">{budget}</span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                        active ? 'border-[#D97706] bg-[#D97706] text-white' : 'border-[#D9C7A6] bg-white'
                      }`}
                    >
                      {active && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-r-2xl rounded-l-sm border-l-[3px] border-[#F59E0B] bg-[#FDF3E3] p-5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#B45309]">
              Bon à savoir
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#7A4A08]">
              Le budget comprend l'hébergement, les transferts et les expériences. Les vols internationaux
              restent à votre charge. Nous adaptons chaque proposition à votre équilibre.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <FieldLabel>Nom complet</FieldLabel>
            <input
              type="text"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="Votre nom"
              className={fieldBase}
              autoComplete="name"
            />
          </label>
          <label className="block space-y-2">
            <FieldLabel>Adresse email</FieldLabel>
            <input
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="vous@exemple.com"
              className={fieldBase}
              autoComplete="email"
            />
          </label>
        </div>
        <label className="block space-y-2">
          <FieldLabel hint="Facultatif">Téléphone</FieldLabel>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            placeholder="+229 …"
            className={fieldBase}
            autoComplete="tel"
          />
        </label>
        <label className="block space-y-2">
          <FieldLabel hint="Facultatif">Un dernier mot ?</FieldLabel>
          <textarea
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
            rows={3}
            placeholder="Une occasion spéciale, une contrainte, une question…"
            className={`${fieldBase} resize-none leading-relaxed`}
          />
        </label>

        <div className="rounded-2xl border-[1.5px] border-[#E7E2D8] bg-[#F6F4EF] p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#8A8578]">
            Votre voyage en un coup d'œil
          </p>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-[#8A8578]">Durée :</dt>
              <dd className="font-semibold text-[#0b1b2b]">{form.duration || 'À définir'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[#8A8578]">Participants :</dt>
              <dd className="font-semibold text-[#0b1b2b]">{participantsLabel}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[#8A8578]">Dates :</dt>
              <dd className="font-semibold text-[#0b1b2b]">
                {formatFrDate(form.startDate)} → {formatFrDate(form.endDate)}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[#8A8578]">Budget :</dt>
              <dd className="font-semibold text-[#0b1b2b]">{form.budget || 'À définir'}</dd>
            </div>
            {form.destinations.length > 0 && (
              <div className="flex gap-2 sm:col-span-2">
                <dt className="shrink-0 text-[#8A8578]">Lieux :</dt>
                <dd className="font-semibold text-[#0b1b2b]">{form.destinations.join(' · ')}</dd>
              </div>
            )}
          </dl>
        </div>

        {error && (
          <p className="rounded-xl border-l-[3px] border-rose-500 bg-rose-50 px-4 py-3 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        <p className="text-[11px] leading-relaxed text-[#8A8578]">
          En envoyant ce formulaire, vous acceptez d'être recontacté par notre équipe au sujet de votre voyage.
          Aucune donnée n'est partagée avec des tiers.
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Bandeau immersif */}
      <section
        className="relative flex w-full flex-col items-center overflow-hidden bg-[#0b1b2b]"
        style={{
          backgroundImage: `url('${PLANNER_IMAGE}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(11,27,43,0.55) 0%, rgba(11,27,43,0.86) 100%)' }}
        />

        <div className="relative z-10 flex w-full flex-col items-center px-4 pb-24 pt-14 text-center sm:px-6 sm:pb-28 sm:pt-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F59E0B]">
            Voyage sur mesure · Bénin
          </p>
          <h1
            className="font-editorial mt-3 text-white"
            style={{
              fontSize: 'clamp(2.2rem, 5.8vw, 60px)',
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 30px rgba(0,0,0,0.35)',
            }}
          >
            Créez votre voyage au Bénin
          </h1>
          <p className="mt-3 max-w-[560px] text-[13px] leading-relaxed text-[#E8E4DA]">
            Cinq étapes, une proposition personnalisée sous 48 h. Votre carnet se remplit au fil de vos choix.
          </p>
        </div>
      </section>

      {/* Stepper + contenu de l'étape */}
      <section className="bg-[#F6F4EF] pb-20">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
          {/* Carte flottante : stepper 5 étapes */}
          <div className="relative z-20 -mt-14 rounded-[24px] border border-[#E7E2D8] bg-white px-4 py-6 shadow-[0_18px_44px_rgba(11,27,43,0.14)] sm:-mt-16 sm:px-9 sm:py-7">
            <div className="overflow-x-auto scrollbar-none">
              <div className="planner-steps min-w-[560px]">
                <span className="planner-steps-line" aria-hidden="true" />
                {STEPS.map((item, index) => {
                  const isActive = index === step;
                  const isDone = index < step;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToStep(index)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`planner-step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                    >
                      <span className="planner-circle-wrap">
                        <span className="planner-circle">
                          {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                        </span>
                      </span>
                      <span className={`planner-bar ${isActive ? '' : 'is-hidden'}`} aria-hidden="true" />
                      <span className="planner-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={`mt-6 items-start gap-5 ${
              showRecap ? 'grid lg:grid-cols-[minmax(0,1fr)_290px]' : ''
            }`}
          >
            <div className="rounded-[28px] border border-[#E7E2D8] bg-white p-6 shadow-[0_18px_44px_rgba(11,27,43,0.06)] sm:p-9">
              {status === 'sent' ? (
                <div className="py-8 text-center sm:py-12">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0b1b2b] text-[#F59E0B] shadow-[0_0_0_6px_#FDF3E3]">
                    <Check className="h-7 w-7" strokeWidth={2.5} />
                  </span>
                  <h2 className="font-editorial mt-7 text-3xl text-[#0b1b2b] sm:text-4xl">
                    Votre demande est bien envoyée
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#8A8578]">
                    Merci {form.name.trim().split(' ')[0] || ''}. Notre équipe revient vers vous sous 48 h avec
                    une première proposition de voyage sur mesure.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button type="button" onClick={reset} className={primaryButton}>
                      Planifier un autre voyage
                    </button>
                    {onOpenItinerary && (
                      <button type="button" onClick={onOpenItinerary} className={ghostButton}>
                        <Bookmark className="h-4 w-4" />
                        Mon carnet d'escapade
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex flex-col gap-3 border-b border-[#E7E2D8] pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#8A8578]">
                        Étape {activeStep.number} — {activeStep.label}
                      </p>
                      <h2 className="font-editorial mt-2 text-[28px] leading-tight text-[#0b1b2b] sm:text-[34px]">
                        {activeStep.title}
                      </h2>
                      <p className="mt-1.5 text-sm text-[#8A8578]">{activeStep.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#F6F4EF] px-3 py-1 text-[11px] font-semibold text-[#8A8578]">
                      {step + 1} / {STEPS.length}
                    </span>
                  </div>

                  {renderStep()}

                  <div className="mt-9 flex items-center justify-between gap-3 border-t border-[#E7E2D8] pt-6">
                    <button
                      type="button"
                      onClick={() => goToStep(Math.max(0, step - 1))}
                      disabled={step === 0}
                      className={`${ghostButton} disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#E7E2D8] disabled:hover:text-[#8A8578]`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Précédent</span>
                    </button>

                    {step < STEPS.length - 1 ? (
                      <button type="button" onClick={() => goToStep(step + 1)} className={primaryButton}>
                        Continuer
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === 'sending'}
                        className={`${primaryButton} disabled:cursor-wait disabled:opacity-70`}
                      >
                        {status === 'sending' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Envoyer ma demande
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Récapitulatif vivant */}
            {showRecap && (
              <aside className="sticky top-24 hidden self-start overflow-hidden rounded-[24px] bg-[#0b1b2b] text-white shadow-[0_18px_44px_rgba(11,27,43,0.18)] lg:block">
                <div
                  className="h-[88px] w-full"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(11,27,43,0.15), rgba(11,27,43,0.75)), url('${PLANNER_IMAGE}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F59E0B]">
                    Votre voyage
                  </p>
                  <h3 className="font-editorial mt-1.5 text-[19px] font-medium leading-tight">
                    En un coup d'œil
                  </h3>

                  <dl className="mt-3">
                    {recapRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start justify-between gap-3 border-b border-white/10 py-2 text-[11.5px] last:border-b-0"
                      >
                        <dt className="shrink-0 text-[#9FB0C0]">{row.label}</dt>
                        <dd className="text-right font-semibold leading-snug">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#F59E0B] transition-all duration-300"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-[#9FB0C0]">
                    Étape {step + 1} sur {STEPS.length}
                  </p>
                </div>
              </aside>
            )}
          </div>

          {onOpenItinerary && status !== 'sent' && (
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={onOpenItinerary}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#E7E2D8] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0b1b2b] shadow-sm transition-colors hover:border-[#D97706] hover:text-[#B45309]"
              >
                <Bookmark className="h-4 w-4 text-[#D97706]" />
                Mon carnet d'escapade
                {itineraryCount > 0 ? ` (${itineraryCount})` : ''}
                <ChevronRight className="h-4 w-4 text-[#8A8578]" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};