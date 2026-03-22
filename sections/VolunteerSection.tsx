"use client";

import { useState } from "react";
import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";

export function VolunteerSection() {
  const t = useTranslate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <SectionContainer id="volunteer" className="bg-sandal/70">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-heading text-center">
          {t("volunteer_title")}
        </h2>
        <p className="section-subtitle text-center mb-8">
          {t("volunteer_subtitle")}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-md border border-maroon/10 px-5 py-6 md:px-6 md:py-7 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-text-dark mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent bg-sandal/40"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-text-dark mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent bg-sandal/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-text-dark mb-1">
              Area of Interest
            </label>
            <select
              className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent bg-sandal/40"
            >
              <option value="annadanam">Annadanam service</option>
              <option value="maintenance">Satram maintenance</option>
              <option value="events">Festival / event seva</option>
              <option value="other">Other seva</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-text-dark mb-1">
              Message (optional)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent bg-sandal/40 resize-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full md:w-auto">
            Submit Interest (demo only)
          </button>

          {submitted && (
            <p className="text-xs md:text-sm text-green-700 mt-1">
              Thank you for your interest. This demo form does not send data – please contact us directly via phone or WhatsApp to volunteer.
            </p>
          )}
        </form>
      </div>
    </SectionContainer>
  );
}

