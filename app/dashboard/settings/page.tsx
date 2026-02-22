"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Settings2 } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun, desc: "Classic light theme" },
    { value: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      desc: "Follow OS preference",
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your appearance and preferences.
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Appearance
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose how EventHub looks for you.
          </p>
        </div>

        <div className="p-6">
          {mounted ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const selected = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    )}
                    <div
                      className={`p-3 rounded-xl ${
                        selected
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      } transition-colors`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for future settings */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Notifications
        </h2>
        <p className="text-sm text-slate-500">
          Notification preferences coming soon. You&apos;ll be able to customize
          email and in-app notifications for events, registrations, and updates.
        </p>
      </div>
    </div>
  );
}
