import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const AGENCY_CONTACT = {
  phone: '+229 01 00 00 00 00',
  email: 'contact@secretscape.bj',
  address: 'Cotonou, Bénin',
  hours: 'Lundi – Samedi : 8h à 20h',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const messages = JSON.parse(localStorage.getItem('secretscape_contact_messages') || '[]');
      messages.push({ ...form, date: new Date().toISOString() });
      localStorage.setItem('secretscape_contact_messages', JSON.stringify(messages));
    } catch (err) {
      localStorage.setItem(
        'secretscape_contact_messages',
        JSON.stringify([{ ...form, date: new Date().toISOString() }])
      );
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  const inputClass =
    'w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-display font-bold text-2xl text-stone-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-amber-600" />
          <span>Contact</span>
        </h1>
        <p className="text-stone-500 text-xs mt-1">
          Laissez-nous vos informations, nous vous recontactons très rapidement.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center space-y-4 max-w-lg mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="font-display font-bold text-lg text-stone-900">Message bien reçu !</h2>
          <p className="text-stone-500 text-xs">
            Merci {form.name || ''}. Nous avons bien noté votre demande et nous reviendrons vers
            vous très vite.
          </p>
          <button
            onClick={resetForm}
            className="bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <h2 className="font-display font-bold text-sm text-stone-900">Nos coordonnées</h2>
              <div className="flex items-start gap-3 text-xs text-stone-600">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{AGENCY_CONTACT.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-stone-600">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{AGENCY_CONTACT.email}</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{AGENCY_CONTACT.address}</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-stone-600">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{AGENCY_CONTACT.hours}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
              <p className="font-semibold">Pourquoi nous écrire ?</p>
              <p>
                Réservations, circuits personnalisés, conseils de voyage ou tout autre besoin : un
                membre de notre équipe vous répond en personne.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nom complet *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Votre nom et prénom"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+229 ..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Ville</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Cotonou, Ouidah..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Sujet *</label>
              <select
                required
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" disabled>
                  Choisissez un sujet
                </option>
                <option>Réservation d'un service</option>
                <option>Demande de voyage / circuit</option>
                <option>Circuit ou excursion</option>
                <option>Hébergement</option>
                <option>Transport</option>
                <option>Autre demande</option>
              </select>
            </div>

            <div className="border-t border-stone-200 pt-4">
              <p className="text-xs font-bold text-stone-800 mb-3">Détails de votre voyage (optionnel)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Date d'arrivée</label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={form.arrivalDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Durée du séjour</label>
                  <input
                    type="number"
                    min="1"
                    name="tripDuration"
                    value={form.tripDuration}
                    onChange={handleChange}
                    placeholder="Nombre de jours"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nombre d'adultes</label>
                  <input
                    type="number"
                    min="1"
                    name="adults"
                    value={form.adults}
                    onChange={handleChange}
                    placeholder="Ex. 2"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nombre d'enfants</label>
                  <input
                    type="number"
                    min="0"
                    name="children"
                    value={form.children}
                    onChange={handleChange}
                    placeholder="Ex. 1"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Budget indicatif (FCFA)</label>
                  <input
                    type="text"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="Ex. 200 000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Type de voyage</label>
                  <select name="tripType" value={form.tripType} onChange={handleChange} className={inputClass}>
                    <option value="">Choisir...</option>
                    <option>Détente</option>
                    <option>Culture & histoire</option>
                    <option>Nature & découverte</option>
                    <option>Spiritualité</option>
                    <option>Gastronomie</option>
                    <option>Affaires</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Hébergement souhaité</label>
                  <select name="accommodation" value={form.accommodation} onChange={handleChange} className={inputClass}>
                    <option value="">Choisir...</option>
                    <option>Hôtel</option>
                    <option>Écolodge</option>
                    <option>Chez l'habitant</option>
                    <option>Peu importe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Transport</label>
                  <select name="transport" value={form.transport} onChange={handleChange} className={inputClass}>
                    <option value="">Choisir...</option>
                    <option>Transfert aéroport</option>
                    <option>Voiture avec chauffeur</option>
                    <option>Zémidjan</option>
                    <option>Pas besoin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Guide local</label>
                  <select name="guide" value={form.guide} onChange={handleChange} className={inputClass}>
                    <option value="">Choisir...</option>
                    <option>Oui, je veux un guide</option>
                    <option>Non, je préfère en autonomie</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Préférences alimentaires ou besoins particuliers</label>
                <input
                  type="text"
                  name="foodPreferences"
                  value={form.foodPreferences}
                  onChange={handleChange}
                  placeholder="Végétarien, allergie, accessibilité..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Message *</label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Décrivez votre besoin..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer le message</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
