import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck2,
  Search,
  MousePointerClick,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  MapPin,
  Navigation,
  DoorOpen,
  Calendar,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Filter events by category, date, or department. Find exactly what sparks your interest in seconds.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Reg",
    description:
      "Skip the long forms. Register for any event with a single tap using your student profile.",
  },
  {
    icon: ShieldCheck,
    title: "Verified",
    description:
      "Every event is vetted by university admins to ensure high quality and genuine campus activities.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Personalized calendar for students and powerful analytics tools for event organizers.",
  },
];

const previewEvents = [
  {
    date: "MAR 24",
    category: "Technology",
    venue: "Main Auditorium",
    title: "National Tech Symposium 2026",
    description:
      "Join the brightest minds in engineering for a two-day event featuring keynote speakers from top tech firms.",
  },
  {
    date: "APR 02",
    category: "Arts & Music",
    venue: "Open Grounds",
    title: "Spring Beats Music Festival",
    description:
      "An evening filled with local student bands and guest performances to celebrate the spring semester.",
  },
  {
    date: "APR 15",
    category: "Workshop",
    venue: "Business School",
    title: "Entrepreneurship Boot Camp",
    description:
      "Learn the basics of building a startup from zero to one with successful alumni entrepreneurs.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0f0a1e] text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 mb-8 animate-fade-in">
            <CalendarCheck2 className="h-4 w-4 mr-1.5" />
            New: University-wide Career Fairs 2026
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white animate-fade-in-up">
            Discover College Events.
            <br />
            One Platform.
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed animate-fade-in-up delay-100">
            Connect with your campus like never before. From hackathons to
            cultural fests, find everything happening in your university in one
            unified feed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link href="/events">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-white px-8 py-6 rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform text-base"
              >
                Explore Events
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors text-base"
              >
                Organize an Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="max-w-4xl mx-auto mt-12 px-4 animate-fade-in-up delay-300">
          <Image
            src="/hero.png"
            alt="College Event Aggregator – students discovering campus events"
            width={1024}
            height={1024}
            className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white dark:border-slate-800"
            priority
          />
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to stay involved
            </h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-[#f6f6f8] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-24" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Handpicked activities happening this season
              </p>
            </div>
            <Link
              href="/events"
              className="text-primary font-semibold flex items-center hover:underline transition-all"
            >
              View All Events
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewEvents.map((event, i) => (
              <div
                key={event.title}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                    {event.date}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {event.category}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.venue}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                    {event.description}
                  </p>
                  <Link href="/events">
                    <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold transition-all">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Teaser */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">
                Localized for your Campus
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                CampusConnect integrates with your university to provide
                seamless event discovery, real-time updates, and venue
                directions for every event on campus.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <span className="font-medium">
                    Real-time navigation to venues
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <DoorOpen className="h-5 w-5" />
                  </div>
                  <span className="font-medium">
                    Indoor mapping for large buildings
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-medium">
                    Community-driven event suggestions
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] relative border-4 border-white dark:border-slate-800 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-20 w-20 text-primary/40 mx-auto mb-4 animate-float" />
                  <p className="text-primary/60 font-bold text-lg">
                    Interactive Campus Map
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 animate-fade-in-up">
            Join thousands of students already discovering campus events on
            CampusConnect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-100">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-primary text-white px-10 py-6 rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform text-base"
              >
                Create Free Account
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-6 rounded-xl font-bold border-2 hover:border-primary transition-colors text-base"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
