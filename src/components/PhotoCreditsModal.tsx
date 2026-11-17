import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Search, X } from 'lucide-react';

interface PhotoCredit {
  author: string;
  licence: string;
  licenceUrl: string;
  source: string;
}

type CreditsMap = Record<string, PhotoCredit>;

interface PhotoCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

const labelFromPath = (path: string) =>
  path
    .replace(/^.*\//, '')
    .replace(/\.(jpe?g|webp|png)$/i, '')
    .replace(/-[0-9a-f]{6}$/i, '')
    .replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());

export const PhotoCreditsModal: React.FC<PhotoCreditsModalProps> = ({ open, onClose }) => {
  const [credits, setCredits] = useState<Array<[string, PhotoCredit]> | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open || credits) return;
    let alive = true;
    import('../data/imageCredits.json')
      .then((mod) => {
        if (!alive) return;
        const map = ((mod.default ?? mod) ?? {}) as CreditsMap;
        setCredits(Object.entries(map).sort((a, b) => labelFromPath(a[0]).localeCompare(labelFromPath(b[0]))));
      })
      .catch(() => {
        if (alive) setCredits([]);
      });
    return () => {
      alive = false;
    };
  }, [open, credits]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!credits) return null;
    const q = query.trim().toLowerCase();
    if (!q) return credits;
    return credits.filter(([path, credit]) => {
      const haystack = `${labelFromPath(path)} ${credit.author} ${credit.licence}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [credits, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Crédits photos"
        className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-stone-900 border border-stone-800 sm:rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 sm:px-7 pt-5 pb-4 border-b border-stone-800">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-100">Crédits photos</h2>
            <p className="mt-1 text-xs text-stone-400 leading-relaxed max-w-xl">
              Les photos des lieux proviennent de Wikimedia Commons et sont diffusées sous licences libres
              (majoritairement CC BY-SA). Chaque clic mène à la page source et à la licence d'origine.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-7 py-3 border-b border-stone-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un lieu, un auteur ou une licence…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-800/70 border border-stone-700 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3">
          {!filtered && (
            <p className="py-10 text-center text-sm text-stone-500">Chargement des crédits…</p>
          )}
          {filtered && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-stone-500">Aucune photo ne correspond à cette recherche.</p>
          )}
          <ul className="divide-y divide-stone-800/70">
            {(filtered ?? []).map(([path, credit]) => (
              <li key={path} className="flex items-center gap-3 sm:gap-4 py-2.5">
                <img
                  src={path}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-stone-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-200 truncate">{labelFromPath(path)}</p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {credit.author}
                    {credit.licence ? ` · ${credit.licence}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {credit.licenceUrl && (
                    <a
                      href={credit.licenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide text-amber-400/90 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                    >
                      {credit.licence || 'Licence'}
                    </a>
                  )}
                  {credit.source && (
                    <a
                      href={credit.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Source de ${labelFromPath(path)}`}
                      className="p-2 rounded-md text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-5 sm:px-7 py-3 border-t border-stone-800 text-[11px] text-stone-500">
          Les licences Creative Commons BY et BY-SA autorisent la réutilisation, y compris commerciale, à condition de
          créditer l'auteur et de partager les éventuelles adaptations sous la même licence.
        </div>
      </div>
    </div>
  );
};
