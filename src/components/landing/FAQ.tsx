import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is my transcript stored anywhere?",
    a: "No. Your transcript is processed in memory and discarded immediately after results are returned. We never store your files or personal academic data.",
  },
  {
    q: "What file types are supported?",
    a: "We support PDF transcripts (both text-based and scanned), JPEG and PNG images, and multi-page documents. Phone photos work too — just make sure the image is clear and well-lit.",
  },
  {
    q: "How accurate is the AI extraction?",
    a: "Very accurate for standard university transcripts. Claude returns a confidence score with each extraction. If confidence is low, we'll tell you clearly rather than show a potentially wrong GPA.",
  },
  {
    q: "Does it work with international transcripts?",
    a: "Yes. We support US 4.0 GPA, UK classifications, ECTS, and percentage-based grading systems. More systems are being added.",
  },
  {
    q: "How is cumulative GPA calculated?",
    a: "We use the standard formula: sum of (grade points × credits) divided by total GPA-bearing credits. Pass/Fail and Withdrawn courses are excluded from the calculation.",
  },
  {
    q: "What is the What-If Calculator?",
    a: "It lets you enter your target GPA and planned future credits, then calculates exactly what GPA you need next term to reach your goal — including whether it's mathematically achievable.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required to use the GPA Analyzer. Simply upload your transcript and get your results instantly.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-muted/30 py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Common questions
          </h2>
        </div>
        <Accordion className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-lg border border-border bg-background px-4"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}