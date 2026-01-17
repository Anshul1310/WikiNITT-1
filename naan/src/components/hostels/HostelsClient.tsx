"use client";

import {
  Wifi,
  Utensils,
  Shirt,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const hostels = [
  {
    name: "Agate",
    type: "Boys",
    capacity: 600,
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Coral",
    type: "Boys",
    capacity: 550,
    color: "from-blue-600 to-indigo-500",
  },
  {
    name: "Diamond",
    type: "Boys",
    capacity: 700,
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Emerald",
    type: "Boys",
    capacity: 450,
    color: "from-cyan-500 to-teal-400",
  },
  {
    name: "Garnet",
    type: "Boys",
    capacity: 800,
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Opal",
    type: "Girls",
    capacity: 600,
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Beryl",
    type: "Girls",
    capacity: 400,
    color: "from-pink-500 to-rose-600",
  },
];

const facilities = [
  {
    name: "High-Speed Wi-Fi",
    icon: Wifi,
    description: "Seamless connectivity across all hostels",
  },
  {
    name: "Hygienic Mess",
    icon: Utensils,
    description: "Nutritious and varied meal options",
  },
  {
    name: "Laundry Service",
    icon: Shirt,
    description: "Convenient laundry facilities on campus",
  },
  {
    name: "24/7 Security",
    icon: ShieldCheck,
    description: "Round-the-clock safety and surveillance",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HostelsClient() {
  return (
    <div className="min-h-screen bg-white selection:bg-amber-100 selection:text-amber-900">
      {}
      <div className="relative overflow-hidden bg-slate-900 text-white py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-400 h-400 rounded-full bg-linear-to-b from-amber-500/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-400 h-400 rounded-full bg-linear-to-t from-blue-500/10 to-transparent blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-400">
              Student Living
              <br />
              <span className="text-amber-400">Redefined.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed">
              Experience a vibrant community life with world-class amenities.
              Your home away from home at NIT Trichy.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="https://www.nitt.edu/home/students/facilitiesnservices/hostelsnmess/hostels/"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-slate-900 rounded-full font-bold text-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                Official Hostel Details
                <ExternalLink className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Premium Facilities
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {facilities.map((facility) => (
              <motion.div
                key={facility.name}
                variants={item}
                className="group p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ring-1 ring-gray-100">
                  <facility.icon className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {facility.name}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {facility.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our Hostels
              </h2>
              <div className="w-20 h-1 bg-amber-500 rounded-full" />
            </div>
            <p className="text-gray-500 max-w-md text-right hidden md:block">
              Discover our diverse range of accommodation options designed for
              comfort and community.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {hostels.map((hostel) => (
              <motion.div
                key={hostel.name}
                variants={item}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className={`h-2 bg-linear-to-r ${hostel.color}`} />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-linear-to-br ${hostel.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        hostel.type === "Boys"
                          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                          : "bg-pink-50 text-pink-700 ring-1 ring-pink-100"
                      }`}
                    >
                      {hostel.type}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {hostel.name}
                  </h3>

                  <div className="flex items-center gap-4 text-gray-500 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {hostel.capacity} Residents
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
