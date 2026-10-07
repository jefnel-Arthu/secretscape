import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Headphones,
  Sparkles,
  Shield,
  Heart,
} from 'lucide-react';

const AGENCY_CONTACT = {
  phone: '+229 01 91 72 29 07',
  email: 'ajefnel@gmail.com',
  address: 'Cotonou, Benin',
  hours: 'Lundi - Dimanche : 8h a 22h',
};

const initialForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  subject: '',
  arrivalDate: '',
  tripDuration: '',
  adults: '',
  children: '',
  budget: '',
  tripType: '',
  accommodation: '',
  transport: '',
  guide: '',
  foodPreferences: '',
  message: '',
};

export const ContactView: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://formspree.io/f/xppaydyr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      // silencieux
    }
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      // silencieux
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  const inputBase =
    'w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all duration-200';

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-blue-600">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-semibold tracking-wide uppercase">Contact</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
              Parlons de votre voyage
            </h1>

            <p className="text-sky-100 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Repondez-nous avec les details de votre projet et un membre de notre
              equipe vous recontacte sous 24 heures.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white">
                <Clock className="w-3.5 h-3.5 text-white" />
                Reponse sous 24h
              </span>
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Conseils gratuits
              </span>
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white">
                <Shield className="w-3.5 h-3.5 text-white" />
                Sur mesure
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {submitted ? (
          /* Success State */
          <div className="max-w-xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-10 text-center space-y-6">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
              </div>

              <div className="relative space-y-2">
                <h2 className="font-display font-bold text-2xl text-stone-900">
                  Message bien recu !
                </h2>
                <p className="text-stone-500 text-sm max-w-sm mx-auto">
                  Merci {form.name || 'pour votre message'}. Nous avons bien note votre demande et
                  nous reviendrons vers vous tres vite.
                </p>
              </div>

              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 shadow-lg shadow-sky-500/25"
                >
                  <Send className="w-4 h-4" />
                  Envoyer un autre message
                </button>
                <button
                  onClick={resetForm}
                  className="bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  Nous appeler directement
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form + Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-5">
              {/* Contact Info Card */}
              <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-white to-sky-50/30 p-6 space-y-5">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6 text-sky-600" />
                  </div>
                  <h2 className="font-display font-bold text-base text-stone-900">Nos coordonnees</h2>
                  <p className="text-stone-400 text-xs mt-1">Une equipe dediee, toujours disponible</p>
                </div>

                <div className="relative space-y-3.5">
                  <a
                    href={`tel:${AGENCY_CONTACT.phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                      <Phone className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Telephone</p>
                      <p className="text-sm font-semibold text-stone-800 group-hover:text-sky-700 transition-colors">
                        {AGENCY_CONTACT.phone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${AGENCY_CONTACT.email}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                      <Mail className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Email</p>
                      <p className="text-sm font-semibold text-stone-800 group-hover:text-sky-700 transition-colors">
                        {AGENCY_CONTACT.email}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Adresse</p>
                      <p className="text-sm font-semibold text-stone-800">{AGENCY_CONTACT.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Horaires</p>
                      <p className="text-sm font-semibold text-stone-800">{AGENCY_CONTACT.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="relative pt-3 border-t border-stone-100">
                  <a
                    href={`tel:${AGENCY_CONTACT.phone.replace(/\s/g, '')}`}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-stone-950 font-bold px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler maintenant
                  </a>
                </div>
              </div>

              {/* Pourquoi nous ecrire */}
              <div className="relative overflow-hidden rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50 via-sky-50/80 to-blue-50/40 p-6 space-y-3">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative flex items-center gap-2">
                  <Heart className="w-4 h-4 text-sky-600" />
                  <p className="font-display font-bold text-sm text-stone-900">Pourquoi nous ecrire ?</p>
                </div>
                <p className="relative text-xs text-stone-600 leading-relaxed">
                  Reservations, circuits personnalises, conseils de voyage ou tout autre
                  besoin : un membre de notre equipe vous repond en personne, avec des
                  recommandations adaptees a votre projet.
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6"
            >
              {/* Section: Informations personnelles */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-stone-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-stone-900">
                      Vos informations
                    </h3>
                    <p className="text-xs text-stone-400">Coordinateurs et sujet</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Votre nom et prenom"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+229 ..."
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="vous@exemple.com"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Cotonou, Ouidah..."
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Sujet *
                  </label>
                  <select
                    required
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="" disabled>
                      Choisissez un sujet
                    </option>
                    <option>Reservation d'un service</option>
                    <option>Demande de voyage / circuit</option>
                    <option>Circuit ou excursion</option>
                    <option>Hebergement</option>
                    <option>Transport</option>
                    <option>Autre demande</option>
                  </select>
                </div>
              </div>

              {/* Section: Details du voyage */}
              <div className="border-t border-stone-100 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-stone-900">
                      Details de votre voyage
                    </h3>
                    <p className="text-xs text-stone-400">Optionnel mais tres utile</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Date d'arrivee
                    </label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={form.arrivalDate}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Duree du sejour
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="tripDuration"
                      value={form.tripDuration}
                      onChange={handleChange}
                      placeholder="Nombre de jours"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Nombre d'adultes
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="adults"
                      value={form.adults}
                      onChange={handleChange}
                      placeholder="Ex. 2"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Nombre d'enfants
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="children"
                      value={form.children}
                      onChange={handleChange}
                      placeholder="Ex. 1"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Budget indicatif (FCFA)
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="Ex. 200 000"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Type de voyage
                    </label>
                    <select
                      name="tripType"
                      value={form.tripType}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Choisir...</option>
                      <option>Detente</option>
                      <option>Culture & histoire</option>
                      <option>Nature & decouverte</option>
                      <option>Spiritualite</option>
                      <option>Gastronomie</option>
                      <option>Affaires</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Hebergement souhaite
                    </label>
                    <select
                      name="accommodation"
                      value={form.accommodation}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Choisir...</option>
                      <option>Hotel</option>
                      <option>Ecolodge</option>
                      <option>Chez l'habitant</option>
                      <option>Peu importe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Transport
                    </label>
                    <select
                      name="transport"
                      value={form.transport}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Choisir...</option>
                      <option>Gozem</option>
                      <option>Yango</option>
                      <option>Pas besoin</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Guide local
                    </label>
                    <select
                      name="guide"
                      value={form.guide}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Choisir...</option>
                      <option>Oui, je veux un guide</option>
                      <option>Non, je prefere en autonomie</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Preferences alimentaires ou besoins particuliers
                  </label>
                  <input
                    type="text"
                    name="foodPreferences"
                    value={form.foodPreferences}
                    onChange={handleChange}
                    placeholder="Vegetarien, allergie, accessibilite..."
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="border-t border-stone-100 pt-6">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Decrivez votre besoin, vos envies, votre budget approximatif..."
                  className={`${inputBase} resize-none`}
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-stone-400">
                  * champs obligatoires. Vos donnees ne sont jamais partagees.
                </p>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-stone-950 font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 shadow-sm shadow-sky-500/20 hover:shadow-md hover:shadow-sky-500/30 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
