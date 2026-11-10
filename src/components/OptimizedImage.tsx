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
  const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');
  const sources = webpSrcSet ?? (webpSrc !== src ? webpSrc : undefined);

  return (
    <picture style={{ display: 'contents' }}>
      {sources && <source srcSet={sources} sizes={rest.sizes} type="image/webp" />}
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
};
