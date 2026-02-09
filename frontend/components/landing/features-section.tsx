"use client";

function PremiumFeatureCard({
  iconPath,
  gradientFrom,
  stat,
  statLabel,
  title,
  items,
}: {
  iconPath: string;
  gradientFrom: string; // e.g. "from-blue-500 via-blue-600 to-indigo-600"
  stat: string;
  statLabel: string;
  title: string;
  items: [string, string][];
}) {
  const hoverBorder =
    gradientFrom.includes("blue") ? "hover:border-blue-400/50" :
    gradientFrom.includes("teal") ? "hover:border-teal-400/50" :
    gradientFrom.includes("green") ? "hover:border-green-400/50" :
    "hover:border-purple-400/50";

  const bgGlow =
    gradientFrom.includes("blue") ? "bg-blue-500/10" :
    gradientFrom.includes("teal") ? "bg-teal-500/10" :
    gradientFrom.includes("green") ? "bg-green-500/10" :
    "bg-purple-500/10";

  return (
    <div className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 ${hoverBorder} hover:shadow-xl transition-all duration-500 group overflow-hidden min-w-0`}>
      <div className={`absolute -top-20 -right-20 w-40 h-40 ${bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-start justify-between mb-5">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradientFrom} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}>
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold bg-gradient-to-r ${gradientFrom} bg-clip-text text-transparent`}>{stat}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">{statLabel}</div>
        </div>
      </div>

      <h4 className="relative font-bold text-lg text-gray-900 mb-4 group-hover:text-black transition-colors">{title}</h4>

      <ul className="relative space-y-3">
        {items.map(([text, badge]) => (
          <li key={text} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradientFrom}`} />
              {text}
            </div>
            {badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${gradientFrom} text-white`}>
                {badge}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientFrom} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
}

const ALSO_INCLUDED = [
  "Website Included", "Channel Manager", "Multi-property", "Unified Inbox",
  "Custom Reports", "API Access", "Mobile App", "Get started in minutes",
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Complete Platform
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 px-2 sm:px-0">
            Everything in One Place
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            Powerful tools designed for modern hospitality. See your operations at a glance.
          </p>
        </div>

        {/* Visual Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-10 sm:mb-16">
          {/* Calendar Preview */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-w-0 overflow-x-auto">
            <div className="bg-gradient-to-r from-[#1a365d] to-[#0f766e] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg">🏠</span>
                </div>
                <div className="text-white min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">Apartment Calendar</div>
                  <div className="text-xs text-white/70">December 2024</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-red-400" />
              </div>
            </div>
            <div className="p-3 sm:p-4 min-w-0">
              {/* Days header */}
              <div className="flex mb-2 sm:mb-3 min-w-0">
                <div className="w-16 sm:w-24 flex-shrink-0" />
                <div className="flex-1 min-w-0 grid grid-cols-7 gap-0.5 text-center">
                  {["Fri","Sat","Sun","Mon","Tue","Wed","Thu"].map((d, i) => {
                    const day = 20 + i;
                    const isToday = day === 23;
                    return (
                      <div key={d} className={`text-[10px] sm:text-xs font-medium py-1 ${isToday ? "text-teal-600" : "text-gray-500"}`}>
                        <div>{d}</div>
                        <div className={isToday ? "bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto" : ""}>
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking rows */}
              <div className="space-y-2">
                {([
                  ["Apt 1A", "John S.", 0, 3, "bg-gradient-to-r from-green-500 to-green-600"],
                  ["Apt 1B", "Emma W.", 2, 4, "bg-gradient-to-r from-teal-500 to-teal-600"],
                  ["Apt 2A", "Marco R.", 1, 2, "bg-gradient-to-r from-red-500 to-red-600"],
                  ["Apt 2B", "Lisa M.", 0, 5, "bg-gradient-to-r from-gray-400 to-gray-500"],
                  ["Studio 3", "Sophie K.", 3, 3, "bg-gradient-to-r from-teal-500 to-teal-600"],
                ] as const).map(([unit, guest, start, duration, color]) => {
                  const widthPct = ((duration - 0.1) / 7) * 100;
                  const leftPct = ((start + 0.55) / 7) * 100;
                  return (
                    <div key={unit} className="flex items-center min-w-0">
                      <div className="w-16 sm:w-24 flex-shrink-0 text-[10px] sm:text-xs font-medium text-gray-900 truncate pr-1 sm:pr-2">{unit}</div>
                      <div className="flex-1 min-w-0 grid grid-cols-7 gap-0.5 h-9 relative">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="bg-gray-50 rounded-sm border border-gray-100" />
                        ))}
                        {duration > 0 && (
                          <div
                            className={`absolute top-1 bottom-1 rounded-full flex items-center pl-2 pr-2 text-xs font-medium text-white shadow-sm ${color}`}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          >
                            <span className="truncate">{guest}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                {[["bg-green-500","Checked-in"],["bg-teal-500","Confirmed"],["bg-gray-400","Checked-out"],["bg-red-500","No-show"]].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-3 h-3 rounded-full ${c}`} />
                    <span className="text-gray-500">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-w-0">
            <div className="bg-[#1a365d] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-[#0f766e]" />
                <span className="text-white font-medium text-sm">Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white/60 text-xs">Live</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  ["Today","4","Check-ins","teal"],
                  ["Pending","2","Payments","orange"],
                  ["Revenue","€2.4k","This week","green"],
                ].map(([label, val, sub, color]) => (
                  <div key={label} className={`bg-${color}-50 rounded-xl p-3 border border-${color}-100`}>
                    <div className={`text-xs text-${color}-600 font-medium`}>{label}</div>
                    <div className={`text-xl font-bold text-${color}-700`}>{val}</div>
                    <div className={`text-[10px] text-${color}-600/70`}>{sub}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Today&apos;s Tasks</div>
                <div className="space-y-2">
                  {[
                    ["Check-in: John Smith","14:00","bg-blue-500","Apt 2B"],
                    ["Check-out: Maria Garcia","11:00","bg-green-500","Apt 1A"],
                    ["Cleaning: Unit 3C","12:30","bg-yellow-500",""],
                  ].map(([task, time, dot, unit]) => (
                    <div key={task} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{task}</div>
                        {unit && <div className="text-[10px] text-gray-500">{unit}</div>}
                      </div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Occupancy</span>
                  <span className="text-xs font-semibold text-gray-900">78%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-16">
          <PremiumFeatureCard
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            gradientFrom="from-blue-500 via-blue-600 to-indigo-600"
            stat="98%" statLabel="SATISFACTION" title="Guest Experience"
            items={[["Online guest registration",""],["Digital check-in/check-out","Fast"],["Automated communications","AI"],["Review management","Smart"]]}
          />
          <PremiumFeatureCard
            iconPath="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
            gradientFrom="from-teal-500 via-teal-600 to-cyan-600"
            stat="24/7" statLabel="MONITORING" title="Operations"
            items={[["Visual booking calendar","Live"],["Housekeeping management",""],["Resource & inventory",""],["Maintenance tracking","Auto"]]}
          />
          <PremiumFeatureCard
            iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            gradientFrom="from-green-500 via-emerald-600 to-teal-600"
            stat="+23%" statLabel="AVG. GROWTH" title="Revenue"
            items={[["AI dynamic pricing","AI"],["Professional invoices",""],["Payment processing","Secure"],["Financial reports","Real-time"]]}
          />
          <PremiumFeatureCard
            iconPath="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            gradientFrom="from-purple-500 via-purple-600 to-pink-600"
            stat="&#8734;" statLabel="TEAM MEMBERS" title="Team & Business"
            items={[["Staff management",""],["Salary & payroll","Auto"],["Role-based access","Secure"],["Shareholder portal","Pro"]]}
          />
        </div>

        {/* Also Included */}
        <div className="border-t border-gray-200 pt-8 sm:pt-12 mt-6 sm:mt-8">
          <p className="text-center text-gray-900 text-[10px] sm:text-xs uppercase tracking-widest sm:tracking-[0.2em] font-bold mb-5 sm:mb-8">
            Also Included
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
            {ALSO_INCLUDED.map((f) => (
              <div key={f} className="flex items-center gap-2 text-gray-900 hover:text-black transition-colors group">
                <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
