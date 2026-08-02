import { faqJsonLd, type PageSeoData } from "@/lib/seo";
import { collectSchemas } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import { contentBoxProse } from "@/components/ContentBox";

// Renders the admin-managed SEO body (rich HTML) + FAQ section + every JSON-LD
// schema configured for the page. Renders nothing if there's no content/FAQs.
export default function SeoContent({ seo }: { seo: PageSeoData }) {
  const hasContent = !!seo.longContent?.trim();
  const faqs = (seo.faqs || []).filter((f) => f.question.trim() && f.answer.trim());
  const jsonLd = faqJsonLd(faqs);
  const schemas = collectSchemas(seo);

  if (!hasContent && faqs.length === 0 && schemas.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        {hasContent && (
          <div
            className={`seo-body ${contentBoxProse}`}
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

      {/* FAQPage schema + every admin-configured schema tag, one script each */}
      <JsonLd source={seo} extra={[jsonLd || ""]} />
    </section>
  );
}
