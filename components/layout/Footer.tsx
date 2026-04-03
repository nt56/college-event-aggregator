import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/logo.jpg"
                alt="CollegeEventAggregator Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold tracking-tight text-primary">
                CollegeEvent<span className="text-primary">Aggregator</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The definitive platform for college event management and
              discovery. Empowering student communities worldwide.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h5 className="font-bold mb-6">Platform</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/events"
                  className="hover:text-primary transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="hover:text-primary transition-colors"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-bold mb-6">Resources</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Help Center
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  API Documentation
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Community Guidelines
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold mb-6">Legal</h5>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Cookie Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CampusConnect. All rights
            reserved.
          </p>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Developed by <span className="text-primary">Nagabhushan Tirth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
