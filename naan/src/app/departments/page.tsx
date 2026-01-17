"use client";

import { motion } from "framer-motion";
import { departments } from "@/data/departments";
import { ArrowUpRight } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl mb-6 tracking-tight"
          >
            Academic{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Departments
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
          >
            Explore the centers of excellence and innovation at NIT Trichy.
            Discover the diverse disciplines shaping the future of technology
            and science.
          </motion.p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map((dept, index) => (
            <motion.a
              href={dept.url}
              target="_blank"
              rel="noopener noreferrer"
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              >
                <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
              </div>

              <div
                className={`h-14 w-14 rounded-2xl ${dept.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <dept.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {dept.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {dept.code}
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-600 transition-colors">
                {dept.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
