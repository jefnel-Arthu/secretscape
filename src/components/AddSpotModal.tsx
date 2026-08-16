import React, { useState } from 'react';
import { HiddenSpot, SecretCategory, SecretLevel } from '../types';
import { PlusCircle, X, MapPin, Compass, Image as ImageIcon, Check } from 'lucide-react';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpot: (spot: HiddenSpot) => void;
}

export const AddSpotModal: React.FC<AddSpotModalProps> = ({
  isOpen,
  onClose,
  onAddSpot,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<SecretCategory>('sites');
  const [city, setCity] = useState('Cotonou');
  const [region, setRegion] = useState('Bénin');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('6.3703');
  const [lng, setLng] = useState('2.3912');
  const [secretLevel, setSecretLevel] = useState<SecretLevel>('moyen');
  const [description, setDescription] = useState('');
  const [secretAccessHint, setSecretAccessHint] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('Au lever du soleil');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState(45);
  const [imageUrl, setImageUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0f/Coucher_du_soleil_sur_la_plage_Fidjross%C3%A8-Cotonou_Benin.jpg');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !secretAccessHint.trim()) return;

    const newSpot: HiddenSpot = {
      id: `user-spot-${Date.now()}`,
      title,
      subtitle: subtitle || 'Pépite secrète proposée par la communauté',
      category,
      city,
      region,
      coordinates: {
        lat: parseFloat(lat) || 6.3703,
        lng: parseFloat(lng) || 2.3912,
      },
      address: address || city,
      secretLevel,
      description,
      secretAccessHint,
      bestTimeToVisit,
      estimatedDurationMinutes: Number(estimatedDurationMinutes) || 45,
      imageUrl: imageUrl.trim() || 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Coucher_du_soleil_sur_la_plage_Fidjross%C3%A8-Cotonou_Benin.jpg',
      tags: ['Communauté', 'Lieu Caché'],
      rating: 5.0,
      reviewCount: 1,
      crowdLevel: 'faible',
      isUserSubmitted: true,
    };

    onAddSpot(newSpot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 p-6 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Proposer un Lieu Secret
              </h3>
              <p className="text-stone-400 text-xs">
                Partagez une pépite cachée ou un passage méconnu avec les voyageurs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-stone-700 uppercase">Nom du lieu secret *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Le Village Lacustre Secret de Ganvié"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SecretCategory)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="sites">Sites touristiques</option>
                <option value="plages">Plages</option>
                <option value="restaurants">Restaurants</option>
                <option value="boites">Boîtes de nuit</option>
                <option value="transports">Moyens de transport</option>
                <option value="hotels">Hôtels</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Niveau de secret</label>
              <select
                value={secretLevel}
                onChange={(e) => setSecretLevel(e.target.value as SecretLevel)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="facile">Facile à trouver (Accessible)</option>
                <option value="moyen">Bien caché (Discret)</option>
                <option value="insider">Secret d'initié (Réservé aux curieux)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Ville *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="ex: Cotonou, Ouidah, Porto-Novo, Abomey..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 uppercase">Adresse exacte</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ex: Quartier Ganvié, rive du lac Nokoué"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700 uppercase">Description & Histoire *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Racontez l'histoire du lieu, son ambiance particulière..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="space-y-1 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <label className="font-bold text-amber-950 uppercase block">Astuce Secrète d'Accès *</label>
            <textarea
              required
              value={secretAccessHint}
              onChange={(e) => setSecretAccessHint(e.target.value)}
              rows={2}
              placeholder="ex: Poussez la porte en fer forgé du n°12, traverser la cour intérieure..."
              className="w-full bg-white border border-amber-200 rounded-lg p-2.5 text-stone-900 text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700 uppercase">URL de la photo (Optionnel)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Publier ce lieu secret</span>
          </button>

        </form>

      </div>
    </div>
  );
};
