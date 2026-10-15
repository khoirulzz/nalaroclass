export default function LandingPhoto({ name, alt, priority = false, className = '', sizes = '(max-width: 700px) 90vw, 50vw' }) {
  const portrait = name === 'teacher';
  return <img
    className={className}
    src={`/images/landing/${name}-1280.webp`}
    srcSet={`/images/landing/${name}-640.webp 640w, /images/landing/${name}-1280.webp 1280w`}
    sizes={sizes}
    width="1280" height={portrait ? '1600' : '853'}
    alt={alt} loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'} decoding="async"
  />;
}
