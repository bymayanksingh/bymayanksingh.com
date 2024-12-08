import { useEffect } from 'react';

interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create or update structured data script tag
    let script = document.querySelector('#structured-data');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'structured-data');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, [data]);

  return null;
}

export const getEngineerSchema = (about: any) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://singhpragya.netlify.app/",
  "name": about?.name || "Professional Software Engineer",
  "description": about?.shortDescription || "Professional Software Engineerure portfolio showcasing innovative design and sustainable solutions",
  "url": "https://singhpragya.netlify.app/",
  "sameAs": [
    about?.linkedin,
    about?.instagram,
    about?.behance
  ].filter(Boolean),
  "image": about?.profileImage,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": about?.location || "Manchester",
    "addressCountry": "UK"
  },
  "priceRange": "$$",
  "openingHours": "Mo-Fr 09:00-18:00",
  "telephone": about?.phone,
  "email": about?.email,
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 53.4808,
      "longitude": -2.2426
    },
    "geoRadius": "100000"
  }
});
