import { faqJsonLd, type PageSeoData } from "@/lib/seo";

// Renders the admin-managed SEO body (rich HTML) + FAQ section + FAQPage JSON-LD.
// Safe to drop into any page; renders nothing if there's no content/FAQs.
export default function SeoContent({ seo }: { seo: PageSeoData }) {
  const hasContent = !!seo.longContent?.trim();
  const faqs = (seo.faqs || []).filter((f) => f.question.trim() && f.answer.trim());
  const jsonLd = faqJsonLd(faqs);
  const customSchema = seo.schemaJsonLd?.trim() || "";

  if (!hasContent && faqs.length === 0 && !customSchema) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        {hasContent && (
          <div
            className="seo-body text-gray-600 text-sm leading-relaxed
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-700 [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
              [&_a]:text-[#01b7f2] [&_a]:underline [&_strong]:text-gray-800 [&_img]:rounded-xl [&_img]:my-3"
            dangerouslySetInnerHTML={{ __html: seo.longContent }}
          />
        )}

        {faqs.length > 0 && (
          <div className={hasContent ? "mt-12" : ""}>
            <h2 className="section-title mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="cursor-pointer list-none flex items-center justify-between p-5 font-semibold text-[#0A65AB] text-sm hover:bg-gray-50 transition-colors">
                    {f.question}
                    <span className="ml-4 text-[#01b7f2] group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {f.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}

      {/* Admin-provided custom JSON-LD schema */}
      {customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: customSchema }}
        />
      )}
    </section>
  );
}
