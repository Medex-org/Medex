import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { User } from "lucide-react";

// Global Main Officers — using real .webp assets
import sangeenImg from "@assets/sangeen-khan.webp";
import smyanImg from "@assets/smyan-reddy.webp";
import sohamImg from "@assets/soham-biren.webp";
import monishaImg from "@assets/monisha-pathi.webp";
import aruzhanImg from "@assets/aruzhan-maratova.webp";
import kamilImg from "@assets/kamil-sheikh.webp";
import shanmukaImg from "@assets/shanmuka-gottimukkala.webp";
import abdulMoizImg from "@assets/abdul-moiz.webp";
import anshikaImg from "@assets/anshika-jaiswal.webp";
import amnaImg from "@assets/amna-ahmed.webp";
import fahimaImg from "@assets/fahima-hossain-muna.webp";
import ifzaImg from "@assets/ifza-zia.webp";
import adityaImg from "@assets/aditya-amarjeet-singh.webp";
import syedaMominaImg from "@assets/syeda-momina.webp";
import taroobaImg from "@assets/tarooba-khan.webp";
import sashaImg from "@assets/sasha-zaki.webp";
import sanatImg from "@assets/sanat-tibrewal.webp";
import zohaibImg from "@assets/zohaib-hassan.webp";

interface Person {
  name: string;
  role: string;
  quote: string;
  bio?: string;
  image: string | null;
}

const teamMembers: Person[] = [
  {
    name: "Sangeen Khan",
    role: "Founder & CEO · Director of Chapter Quality",
    quote: "Building something incredible, together.",
    bio: "Medical student and founder of MEDX R&Ed. Passionate about connecting students globally through research and education.",
    image: sangeenImg,
  },
  {
    name: "Smyan Reddy",
    role: "Chief Advisor",
    quote: "In the labyrinth of knowledge, curiosity is our Ariadne's thread.",
    image: smyanImg,
  },
  {
    name: "Soham Katlariwala",
    role: "Research Operations",
    quote: "Reality rewards those who challenge its assumptions.",
    image: sohamImg,
  },
  {
    name: "Monisha Pathi",
    role: "Chief Technology Officer",
    quote: "Don't watch the clock; do what it does. Keep going.",
    image: monishaImg,
  },
  {
    name: "Aruzhan Maratova",
    role: "Lead Web Developer",
    quote:
      "Designing seamless digital experiences that make medical education and collaboration accessible to all.",
    image: aruzhanImg,
  },
  {
    name: "Kamil Shaikh",
    role: "Partnerships Officer",
    quote: "Partnerships aren't signed, they're earned.",
    image: kamilImg,
  },
  {
    name: "Aditya Amarjeet Singh",
    role: "Chief Programs Officer",
    quote: "The future doesn't belong to those who predict it. It belongs to those who build it.",
    image: adityaImg,
  },
  {
    name: "Sasha Zaki",
    role: "Research Mentor · Senior Advisor",
    quote: "Doubt kills more dreams than failure ever will.",
    image: sashaImg,
  },
  {
    name: "Abdul Moiz",
    role: "Programs Officer · SRMA Mentor",
    quote: "The opportunities I searched for at the beginning of my journey are the ones I aspire to create for others.",
    image: abdulMoizImg,
  },
  {
    name: "Amna Ahmed",
    role: "Research & Programs",
    quote: "In the constellation of dreams, vision is the north star.",
    image: amnaImg,
  },
  {
    name: "Shanmuka G.",
    role: "Web Developer",
    quote: "Start where you are, use what you know, and create what the world needs.",
    image: shanmukaImg,
  },
  {
    name: "Anshika Jaiswal",
    role: "Social Media & Content",
    quote: "Every story told shapes the story yet to come.",
    image: anshikaImg,
  },
  {
    name: "Fahima Hossain Muna",
    role: "Member",
    quote: "Work hard until your dreams become your reality.",
    image: fahimaImg,
  },
  {
    name: "Ifza Zia",
    role: "Member",
    quote: "Knowledge knows no borders.",
    image: ifzaImg,
  },
  {
    name: "Syeda Momina Bokhari",
    role: "Member",
    quote: "Knowledge knows no borders. Neither should medicine.",
    image: syedaMominaImg,
  },
  {
    name: "Tarooba Khan",
    role: "Member",
    quote: "Stay humble enough to learn, and determined enough to lead.",
    image: taroobaImg,
  },
  {
    name: "Sanat Tibrewal",
    role: "Member",
    quote: "Carry confidence in your vision and humility in your success.",
    image: sanatImg,
  },
  {
    name: "Zohaib Hassan",
    role: "Member",
    quote: "With trust, dedication and hard work you achieve what looks unachievable.",
    image: zohaibImg,
  },
  {
    name: "Imad Khan",
    role: "Awareness Department · Lecturer",
    quote: "The ink of learning never dries; it continues to write the story of every curious soul.",
    image: null,
  },
  {
    name: "Shehzad Roonjha",
    role: "Graphic Designer",
    quote: "Carry confidence in your vision and humility in your success.",
    image: null,
    bio: "Premed student from Bela, Balochistan. Responsible for MEDX visual identity and poster design.",
  },
  {
    name: "Rakshitha Lokesh",
    role: "Communications",
    quote: "The ink of learning never dries; it continues to write the story of every curious soul.",
    image: null,
  },
  {
    name: "Bisma Bashir",
    role: "Research Mentor",
    quote: "Stay humble enough to learn, and determined enough to lead.",
    image: null,
  },
];

function MemberCard({ person }: { person: Person }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-44 h-44 rounded-full overflow-hidden border-[1px] border-border mb-6 bg-muted relative img-scholarly flex-shrink-0">
        {person.image ? (
          <img
            src={person.image}
            alt={`${person.name}, ${person.role}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
            <User size={48} strokeWidth={1} />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-1">{person.name}</h3>
      <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
        {person.role}
      </span>
      {person.bio && (
        <p className="text-sm text-muted-foreground mb-3 max-w-xs font-serif">
          {person.bio}
        </p>
      )}
      <p className="font-serif italic text-muted-foreground text-sm max-w-xs leading-relaxed">
        <span className="text-xl text-border not-italic mr-0.5" aria-hidden="true">"</span>
        {person.quote}
        <span className="text-xl text-border not-italic ml-0.5" aria-hidden="true">"</span>
      </p>
    </div>
  );
}

export default function Team() {
  return (
    <Layout>
      <PageMeta
        title="Our Team"
        description="Meet the global main officers, team members, and contributors who power MEDX R&Ed — united by a shared mission to advance medical research and education."
      />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              The People Behind MEDX
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Our Team
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-serif text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              A team united for a purpose — working together to build, learn,
              research, and create impact through MEDX R&amp;Ed.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Unified Members Grid */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 mb-28">
            {teamMembers.map((person, i) => (
              <StaggerItem key={i}>
                <MemberCard person={person} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Alone we can do so little; together we can do so much."
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mt-6">
            One Team · One Vision · One Impact
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}