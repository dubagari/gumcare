import React, { useEffect, useMemo, useState } from "react";

const formatTime = (value) => String(value).padStart(2, "0");

const getTimeLeft = (endTime) => {
  const total = Math.max(endTime - Date.now(), 0);

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
};

const Timerpage = ({ targetDate, discount }) => {
  const deadline = useMemo(() => {
    if (targetDate) {
      return new Date(targetDate).getTime();
    }

    // Default: 8 hours, 24 minutes, 56 seconds
    return Date.now() + 5 * 24 * 60 * 60 * 1000;
  }, []);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeLeft(deadline);

      setTimeLeft(remaining);

      // Stop timer when expired
      if (remaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const timerUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <section className="py-18 bg-white">
      <div className="relative h-[250px] overflow-hidden group shadow-2xl rounded-[2rem]">
        <img
          src="/assets/image/Rectangle 21.jpg"
          alt="Deal of the Day"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />

        <div className="max-w-7xl mx-auto absolute inset-0 flex items-center p-12 md:p-24">
          <div className="max-w-xl space-y-2">
            <div className="inline-block px-2 py-1 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-widest">
              Limited Time Offer
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Deal of the Day: <br />
              <span className="text-primary italic">{discount}% Discount</span>
            </h2>

            <p className="text-lg text-gray-200">
              On all premium skincare sets. High-quality products designed for
              your ultimate glow.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6">
              <button className="px-5 py-2 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg">
                Claim Offer
              </button>

              {timeLeft.total > 0 ? (
                <div className="flex gap-4">
                  {timerUnits.map((unit) => (
                    <div key={unit.label} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        {formatTime(unit.value)}
                      </div>

                      <div className="text-[10px] uppercase text-gray-400 font-bold mt-1">
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-400 font-bold text-xl">
                  Offer Expired
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timerpage;
