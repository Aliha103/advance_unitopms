"use client";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-32 bg-[#0B1120] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center min-w-0">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8 mx-auto">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-sm text-white/80 font-medium">Get started in minutes</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
          Ready to Simplify Your
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Property Management?
          </span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 mb-8 sm:mb-12 max-w-xl mx-auto px-2 sm:px-0">
          Join hundreds of property managers who trust UnitoPMS to run their operations smoothly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 px-2 sm:px-0">
          <button className="group bg-white text-[#0B1120] min-h-[44px] px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-teal-400/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation">
            Start 14-Day Free Trial
            <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
          <button className="group border border-white/20 text-white min-h-[44px] px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-medium hover:bg-white/10 hover:border-white/30 active:bg-white/15 transition-all duration-300 w-full sm:w-auto touch-manipulation">
            Schedule a Demo
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-white/40">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Setup in 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
