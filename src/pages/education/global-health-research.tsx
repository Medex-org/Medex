import { SeoArticle } from "@/components/shared/seo-article";
import { SEO } from "@/data/seo";

export default function GlobalHealthResearch() {
  return (
    <SeoArticle
      seo={SEO.globalHealthResearch}
      title="Global Health Research"
      intro="Global health research asks how health is shaped by borders, systems, and inequity. This guide explains why it matters, how equitable collaborations are built, and how students can contribute without doing harm."
      sections={[
        {
          heading: "What global health research is",
          paragraphs: [
            "Global health research studies health problems and health systems across countries, cultures, and income levels. It is not simply research done abroad. It is research that takes seriously the ways power, economics, history, and geography shape who gets sick and who gets care. A global health project may examine infectious disease, maternal health, non-communicable disease, mental health, health financing, or the effects of climate change.",
            "The field overlaps with public health, epidemiology, health policy, and clinical research. What distinguishes it is a focus on equity and cross-border collaboration. Global health research asks not only whether an intervention works, but whether it is accessible, affordable, acceptable, and sustainable in the communities that need it.",
            "Because the stakes are high, the field has a long history of well-intentioned projects that failed or caused harm. Learning from that history is part of doing the work responsibly.",
          ],
        },
        {
          heading: "Why global health research matters",
          paragraphs: [
            "Health problems do not stop at borders. Infectious diseases spread, chronic conditions rise in every region, and the consequences of climate change are felt unevenly. Research helps identify shared risks, test context-appropriate solutions, and track whether progress is reaching the people who need it most. It also gives policymakers evidence to allocate scarce resources.",
            "Global health research can expose inequities that are invisible in national averages. Disaggregated data may reveal that a program works well overall but misses rural communities, informal workers, or women. Careful qualitative research can explain why a proven intervention is not being used. These insights are essential for designing services that people actually trust and access.",
            "The field also matters for students. It builds an understanding of health as a system shaped by politics and culture, not only biology. That perspective is valuable whether you practise in a large academic hospital or a small community clinic.",
          ],
        },
        {
          heading: "How equitable collaborations are built",
          paragraphs: [
            "Equitable research starts with shared ownership. Partners should agree on the question, the methods, the budget, and the use of data before work begins. Local researchers should be co-investigators, not data collectors for an outside team. Authorship, capacity building, and long-term sustainability should be discussed openly and early.",
            "Funding structures matter. When most of the money, equipment, and decision-making sit outside the host country, the project risks becoming extractive. Fair partnerships invest in local institutions, pay local staff fairly, build durable infrastructure, and plan for what happens after the grant ends.",
            "Ethics review should involve local committees and reflect local priorities. Consent processes must be culturally appropriate and genuinely understandable. Communities should learn what was found and what will happen next, not just provide data. These practices are not optional courtesy; they are conditions for credible science.",
          ],
        },
        {
          heading: "How students can contribute",
          paragraphs: [
            "Students can contribute through literature reviews, data management, translation support, community engagement, and assistance with ethics documentation. The most valuable contributions are reliable and modest: a clean dataset, an accurate summary, a well-organised recruitment log. Reliability builds trust and opens the door to deeper involvement.",
            "Global health work requires humility. If you are new to a setting, listen more than you speak. Learn about the community's history and health priorities. Avoid assuming that your training gives you authority over local knowledge. Work under supervision and respect the boundaries of your role.",
            "Students should also be cautious about short-term trips that prioritise their learning over community benefit. Ask who asked for this project, who will benefit, and what happens when the students leave. If those questions have no clear answers, reconsider your involvement.",
          ],
        },
        {
          heading: "Common pitfalls to avoid",
          paragraphs: [
            "One pitfall is parachute research: outsiders collect data, publish, and leave without building local capacity. Another is treating a single community as representative of an entire country or region. A third is ignoring implementation realities, such as supply chains, staff time, or cultural norms, so that a promising intervention cannot be sustained.",
            "Language and measurement also create risks. Translated surveys may lose meaning, and indicators designed elsewhere may not capture what matters locally. Researchers should pilot instruments, involve local experts, and explain limitations honestly.",
            "Finally, avoid overclaiming impact. A small pilot can show promise without proving effectiveness at scale. Responsible reporting distinguishes between what was observed and what can reasonably be concluded.",
          ],
        },
        {
          heading: "Building a career in global health research",
          paragraphs: [
            "A career in global health research usually combines clinical or public health training with methods skills. Epidemiology, biostatistics, qualitative methods, implementation science, and health economics are all valuable. Language skills and experience working with communities are equally important.",
            "Look for mentors who have worked in the settings you care about and who can speak candidly about the challenges. Seek training in research ethics and responsible conduct. Build a record of reliable contributions rather than chasing impressive-sounding titles.",
            "Over time, the most respected researchers are often those who maintain long-term relationships, share credit, and produce work that is useful to the communities involved. That is the standard worth pursuing.",
          ],
        },
      ]}
      faqs={[
        {
          question: "Is global health research only for doctors?",
          answer:
            "No. Teams include epidemiologists, nurses, statisticians, economists, anthropologists, engineers, and community health workers. Students from many disciplines can contribute, provided they receive appropriate supervision and training.",
        },
        {
          question: "How can I tell if a global health project is ethical?",
          answer:
            "Look for local co-investigators, community consultation, local ethics review, fair pay, transparent data plans, and a clear plan for sharing results and sustaining benefits. Be cautious of projects where outsiders control everything and communities only provide data.",
        },
        {
          question: "Do I need to travel to do global health research?",
          answer:
            "Not necessarily. Literature reviews, secondary data analysis, policy research, and support for local teams can be done remotely. In fact, remote contributions are often more sustainable and less extractive than short trips.",
        },
        {
          question: "What skills should I build first?",
          answer:
            "Start with epidemiology, biostatistics, research ethics, and critical appraisal. Then add qualitative methods and implementation science. Practical experience with a well-mentored project is the best way to learn how these skills work together.",
        },
      ]}
      related={[
        {
          label: "MEDX Research Compass",
          href: "/education/research-compass/",
          description: "Follow a step-by-step route from first question to publication.",
        },
        {
          label: "What Is Clinical Research?",
          href: "/education/what-is-clinical-research/",
          description: "A practical introduction to study design, ethics, and student involvement.",
        },
        {
          label: "Medical Exchange Guide",
          href: "/education/medical-exchange-guide/",
          description: "How to choose and apply for global clinical experiences responsibly.",
        },
        {
          label: "MEDX Research Department",
          href: "/research/",
          description: "Explore mentorship, cohort projects, and research tracking.",
        },
        {
          label: "MEDX Partnerships",
          href: "/partnerships/",
          description: "See the institutions and organizations MEDX collaborates with.",
        },
      ]}
    />
  );
}
