import React from 'react';

type OptimizedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Chemin de l'image JPEG de repli, ex. `/images/photo.jpg`. */
  src: string;
  alt: string;
  /** Variantes WebP responsive (descripteurs `w`). */
  webpSrcSet?: string;
};

/**
 * Affiche l'image en WebP quand le navigateur le supporte, avec repli JPEG.
 * `display: contents` évite d'ajouter une boîte dans le layout : toutes les
 * classes passées à `className` continuent de s'appliquer à la balise `<img>`.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, webpSrcSet, ...rest }) => {
  // Le WebP n'est proposé que pour nos images locales : une URL distante ou
  // saisie par un visiteur n'a pas forcément de variante .webp à côté.
  const isLocal = src.startsWith('/images/');
  const webpSrc = isLocal ? src.replace(/\.(jpe?g|png)$/i, '.webp') : src;
  const sources = webpSrcSet ?? (webpSrc !== src ? webpSrc : undefined);

  return (
    <picture style={{ display: 'contents' }}>
      {sources && <source srcSet={sources} sizes={rest.sizes} type="image/webp" />}
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
};
