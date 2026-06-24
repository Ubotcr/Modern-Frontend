import type { ImageMetadata } from "astro";

// Importa todas las imágenes bajo public/images para que el componente <Image>
// y getImage() de Astro puedan procesarlas (optimizar formato y generar srcset).
const publicImages = import.meta.glob<{ default: ImageMetadata }>(
  "../../../public/images/**/*.{jpeg,jpg,png,gif,webp,avif}",
  { eager: true },
);

// Resuelve una ruta pública (ej: "/images/blog/portada.png") a un ImageMetadata
// procesable por <Image>. Devuelve undefined para URLs remotas o rutas fuera de
// public/images, en cuyo caso se debe usar un <img> común como respaldo.
export const resolvePublicImage = (path: string): ImageMetadata | undefined => {
  if (!path) return undefined;
  const key = `../../../public${path}`;
  return publicImages[key]?.default;
};
