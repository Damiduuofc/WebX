"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [riderId, setRiderId] = useState("");
  const [category, setCategory] = useState("delay");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketId(`NX-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsSubmitted(true);
  };

  const faqs = [
    {
      question: "How do I report an item left on a bus or train vehicle?",
      answer:
        "Select 'Lost & Found on Vehicle' in the contact form above, including the line number (e.g. Bus 138 or Metro Blue Line) and the approximate time of your journey. Our station dispatchers coordinate directly with the terminal depot to retrieve lost belongings.",
    },
    {
      question: "What does the Alert Amber indicator mean on a route?",
      answer:
        "Per the NEXA Design System, Alert Amber (#B8860B) signifies an active schedule disruption, track maintenance, or heavy traffic delay exceeding 5 minutes. The route preview will show revised arrival times automatically.",
    },
    {
      question: "Can I use my NEXA TapPass across all municipal buses and trains?",
      answer:
        "Yes. The NEXA TapPass is unified across Metropolitan Rail, City Express lines, and participating municipal feeder shuttles. Your NFC card or in-app QR code is scanned upon boarding.",
    },
    {
      question: "How does NEXA estimate walking transfer times between stops?",
      answer:
        "We calculate realistic pedestrian speeds (approx. 4.5 km/h) accounting for station stairs, turnstiles, and pedestrian concourses, ensuring you have enough buffer time to catch connecting vehicles comfortably.",
    },
  ];

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 space-y-12 sm:space-y-16">
      {/* 1. Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72222B]/10 border border-[#72222B]/20 text-[#72222B] text-xs font-semibold tracking-wide">
          <MessageSquare size={13} className="text-[#72222B]" />
          <span>24/7 Rider Support & Operations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          How can we help your journey?
        </h1>
        <p className="text-base text-[#5A6B85]">
          Whether you need route guidance, wish to report a transit delay, or have an inquiry regarding your TapPass, our dispatch operations team is ready to assist.
        </p>
      </div>

      {/* 2. Main Grid: Contact Form + Direct Channels Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Spans 7 columns */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D6DAE3] p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Send a Rider Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B85] mt-1">
              Fill out the details below and a dispatch operator will respond shortly.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-xl bg-[#F7F8FA] border border-[#2E7D5B]/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Inquiry Received by Central Dispatch
              </h3>
              <p className="text-sm text-[#5A6B85] max-w-md mx-auto">
                Thank you, <strong className="text-black">{name}</strong>. Your ticket has been logged with reference number <code className="bg-white px-2 py-0.5 rounded border border-[#D6DAE3] text-black font-mono text-xs">#{ticketId}</code>. We will reply to <strong className="text-black">{email}</strong> within 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setName("");
                  setEmail("");
                  setSubject("");
                  setMessage("");
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#72222B] hover:bg-[#5B1B22] text-white text-xs font-bold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D6DAE3] bg-white text-sm text-black placeholder:text-[#5A6B85] focus:outline-none focus:border-[#72222B] focus:ring-1 focus:ring-[#72222B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kasun@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D6DAE3] bg-white text-sm text-black placeholder:text-[#5A6B85] focus:outline-none focus:border-[#72222B] focus:ring-1 focus:ring-[#72222B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Inquiry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D6DAE3] bg-white text-sm text-black focus:outline-none focus:border-[#72222B] focus:ring-1 focus:ring-[#72222B]"
                  >
                    <option value="delay">Report Transit / Bus Delay</option>
                    <option value="lost_found">Lost & Found on Vehicle</option>
                    <option value="pass">NEXA TapPass / Payment Help</option>
                    <option value="schedule">Schedule Discrepancy</option>
                    <option value="general">General Commuter Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Rider Pass ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NX-9821-44"
                    value={riderId}
                    onChange={(e) => setRiderId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D6DAE3] bg-white text-sm text-black placeholder:text-[#5A6B85] focus:outline-none focus:border-[#72222B] focus:ring-1 focus:ring-[#72222B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue or route (e.g. Bus 138 delay at Pettah)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D6DAE3] bg-white text-sm text-black placeholder:text-[#5A6B85] focus:outline-none focus:border-[#72222B] focus:ring-1 focus:ring-[#72222B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe the station, time, vehicle number, or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D6DAE3] bg-white text-sm text-black placeholder:text-[#5A6B85] focus:outline-none focus:border-[#72222B] focus:ring-1 focus:ring-[#72222B]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#72222B] hover:bg-[#5B1B22] text-white text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Submit Inquiry</span>
                <Send size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Right Details: Spans 5 columns */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Operations Hotline Card */}
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              <ShieldAlert size={15} className="text-[#22C55E]" />
              <span>Immediate Rider Assistance</span>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                24/7 Operations Dispatch
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Need real-time station support or reporting an active safety concern on the transit network?
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/10 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#72222B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Toll-Free Dispatch Helpline</div>
                  <a href="tel:+94112003344" className="text-base font-bold text-white hover:underline">
                    +94 11 200 3344
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#72222B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Rider Support Desk</div>
                  <a href="mailto:rider-support@nexa.com" className="text-sm font-semibold text-white hover:underline">
                    rider-support@nexa.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#72222B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Operations Center</div>
                  <div className="text-sm font-semibold text-white">
                    Central Concourse, Platform Level 2, Fort Station
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#72222B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Passenger Service Hours</div>
                  <div className="text-sm font-semibold text-white">
                    24 Hours / 7 Days a Week
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* 3. Rider Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-[#D6DAE3] p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-bold text-[#5A6B85] uppercase tracking-wider">
            Common Inquiries
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            Frequently Asked Questions by Commuters
          </h2>
        </div>

        <div className="divide-y divide-[#D6DAE3]">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 py-2 cursor-pointer focus:outline-none"
                >
                  <span className="text-base font-bold text-[#000000]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#5A6B85] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#72222B]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs sm:text-sm text-[#5A6B85] leading-relaxed pr-8 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
