// Page Content Box — the admin-managed rich-text body rendered on a page.
// Same look everywhere (cars, hotels, flights, destinations, packages, guides, blogs).
// Accepts either HTML (from RichTextEditor) or plain text with blank-line paragraphs.

export const contentBoxProse =
  "text-gray-600 text-sm leading-relaxed " +
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-3 " +
  "[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-700 [&_h3]:mt-5 [&_h3]:mb-2 " +
  "[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 " +
  "[&_li]:text-gray-600 [&_a]:text-[#01b7f2] [&_a]:underline [&_strong]:text-gray-800 " +
  "[&_img]:rounded-xl [&_img]:my-3 [&_img]:max-w-full [&_table]:w-full [&_table]:text-left " +
  "[&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_td]:border [&_td]:border-gray-200 [&_td]:p-2";

// Just the formatted body — for places that already have their own section/heading.
export function RichBody({ content, className = "" }: { content?: string | null; className?: string }) {
  const body = (content || "").trim();
  if (!body) return null;
  if (body.startsWith("<")) {
    return <div className={`${contentBoxProse} ${className}`} dangerouslySetInnerHTML={{ __html: body }} />;
  }
  return (
    <div className={`text-gray-600 text-sm leading-relaxed space-y-4 ${className}`}>
      {body.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  );
}

export default function ContentBox({
  content,
  heading,
  className = "",
  bg = "bg-white",
}: {
  content?: string | null;
  heading?: string;
  className?: string;
  bg?: string;
}) {
  const body = (content || "").trim();
  if (!body) return null;

  const isHtml = body.startsWith("<");

  return (
    <section className={`section-padding ${bg} ${className}`}>
      <div className="container-custom max-w-4xl">
        {heading && <h2 className="section-title mb-5">{heading}</h2>}
        {isHtml ? (
          <div className={contentBoxProse} dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <div className="text-gray-600 text-sm leading-relaxed space-y-4">
            {body.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
