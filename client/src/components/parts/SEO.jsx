import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Reusable SEO component for consistent metadata across pages
 *
 * @param {Object} props Component props
 * @param {string} props.title Page title
 * @param {string} props.description Meta description
 * @param {string} props.keywords Meta keywords
 * @param {string} props.canonicalUrl Canonical URL
 * @param {string} props.ogImage Open Graph image URL
 * @param {Object} props.schema JSON-LD schema object
 * @param {string} props.ogType Open Graph type
 */
const SEO = ({
  title = "Quantercise | Master Quantitative Skills Through Practice",
  description = "Strengthen your quantitative thinking with over 150+ industry-standard practice problems.",
  keywords = "quantitative practice, financial math, statistics problems, quant interview prep",
  canonicalUrl = "https://quantercise.com",
  ogImage = "https://quantercise.com/og-image.jpg",
  schema = null,
  ogType = "website",
}) => {
  // Default schema for pages that don't provide one
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: canonicalUrl,
  };

  // Use provided schema or default
  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Quantercise" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@quantercise" />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};

export default SEO;
