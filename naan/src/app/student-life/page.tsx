"use client";

import { Calendar, Trophy, Coffee, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const festivals = [
  {
    name: "Festember",
    description: "The annual cultural festival of NIT Trichy. A 4-day extravaganza of music, dance, and art.",
    date: "September",
    color: "bg-purple-600",
  },
  {
    name: "Pragyan",
    description: "The international techno-managerial organization of NITT. Celebrating technology and innovation.",
    date: "March",
    color: "bg-blue-600",
  },
  {
    name: "Nittfest",
    description: "The inter-departmental cultural competition. A battle of talents and creativity.",
    date: "April",
    color: "bg-amber-600",
  },
  {
    name: "Sportsfete",
    description: "The inter-departmental sports tournament. Where athleticism meets team spirit.",
    date: "February",
    color: "bg-emerald-600",
  },
];

const amenities = [
  { name: "Shopping Complex", icon: Coffee },
  { name: "Hospital", icon: MapPin },
  { name: "Sports Center", icon: Trophy },
  { name: "Guest House", icon: MapPin },
];

export default function StudentLifePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
            Campus <span className="text-emerald-600">Life</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            More than just academics. Experience the vibrant culture and community at NITT.
          </p>
        </div>

        {}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Festivals & Events</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {festivals.map((fest, index) => (
              <motion.div
                key={fest.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row"
              >
                <div className={`md:w-1/3 ${fest.color} p-6 flex flex-col justify-center items-center text-white`}>
                  <Calendar className="h-10 w-10 mb-2 opacity-80" />
                  <span className="font-bold text-lg">{fest.date}</span>
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{fest.name}</h3>
                  <p className="text-gray-600">{fest.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {}
        <div className="grid md:grid-cols-2 gap-12">
          {}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sports Facilities</h2>
            </div>
            <p className="text-gray-600 mb-6">
              NITT boasts world-class sports infrastructure including an Olympic-size swimming pool, cricket stadium, football grounds, tennis courts, and an indoor sports complex.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="h-2 w-2 bg-emerald-500 rounded-full mr-3"></span>
                Indoor Badminton Courts
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-emerald-500 rounded-full mr-3"></span>
                Basketball & Volleyball Courts
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-emerald-500 rounded-full mr-3"></span>
                Fitness Center & Gym
              </li>
            </ul>
          </div>

          {}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Coffee className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Campus Amenities</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((item) => (
                <div key={item.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <item.icon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              The campus is a self-sufficient township with all necessary facilities for students and staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
