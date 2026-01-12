import Script from "next/script";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mohammedhuzaifa.vercel.app/#person",
        "name": "Mohammed Huzaifa",
        "alternateName": "Huzaifa Mohammed",
        "description": "Graduate Student, D365 Customizer, Full Stack Developer, UI/UX Designer",
        "image": "https://mohammedhuzaifa.vercel.app/picture.png",
        "sameAs": [
          "https://github.com/mohammedhuzaifa",
          "https://linkedin.com/in/mohammedhuzaifa",
          "https://twitter.com/mohammedhuzaifa"
        ],
        "knowsAbout": [
          "Full Stack Development",
          "Microsoft Dynamics 365",
          "React.js",
          "Next.js",
          "TypeScript",
          "Node.js",
          "UI/UX Design",
          "Web Development",
          "JavaScript",
          "Python",
          "AWS",
          "Azure"
        ],
        "hasOccupation": [
          {
            "@type": "Occupation",
            "name": "Full Stack Developer",
            "occupationLocation": {
              "@type": "City",
              "name": "Mumbai",
              "addressCountry": "IN"
            }
          },
          {
            "@type": "Occupation",
            "name": "D365 Customizer",
            "occupationLocation": {
              "@type": "City",
              "name": "Mumbai",
              "addressCountry": "IN"
            }
          },
          {
            "@type": "Occupation",
            "name": "UI/UX Designer",
            "occupationLocation": {
              "@type": "City",
              "name": "Mumbai",
              "addressCountry": "IN"
            }
          }
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "University of Mumbai"
        },
        "jobTitle": "Graduate Student & Developer",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Mumbai",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://mohammedhuzaifa.vercel.app/#website",
        "url": "https://mohammedhuzaifa.vercel.app",
        "name": "Mohammed Huzaifa - Portfolio",
        "description": "Portfolio website of Mohammed Huzaifa - Graduate Student, D365 Customizer, Full Stack Developer, UI/UX Designer",
        "publisher": {
          "@id": "https://mohammedhuzaifa.vercel.app/#person"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://mohammedhuzaifa.vercel.app/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "WebPage",
        "@id": "https://mohammedhuzaifa.vercel.app/#webpage",
        "url": "https://mohammedhuzaifa.vercel.app",
        "name": "Mohammed Huzaifa - Portfolio",
        "isPartOf": {
          "@id": "https://mohammedhuzaifa.vercel.app/#website"
        },
        "about": {
          "@id": "https://mohammedhuzaifa.vercel.app/#person"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://mohammedhuzaifa.vercel.app/picture.png"
        },
        "datePublished": "2024-01-01T00:00:00+00:00",
        "dateModified": new Date().toISOString().split('T')[0] + "T00:00:00+00:00"
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 0),
      }}
    />
  );
}