"use client";

import Link from "next/link";
import {
  Building2,
  Tent,
  PartyPopper,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Departments",
    description:
      "Explore the various academic departments, faculty, and research opportunities at NITT.",
    icon: Building2,
    href: "/departments",
    color: "bg-blue-500",
  },
  {
    name: "Hostels",
    description:
      "Find information about student accommodation, mess facilities, and hostel life.",
    icon: Tent,
    href: "/hostels",
    color: "bg-amber-500",
  },

  {
    name: "Student Life",
    description:
      "Get a glimpse of campus life, festivals, sports, and student activities.",
    icon: GraduationCap,
    href: "/student-life",
    color: "bg-emerald-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Explore Campus
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to know
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Navigate through the essential aspects of life at NIT Trichy. From
            academics to extracurriculars, we've got you covered.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-lg ${feature.color} text-white shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 flex items-center group"
                    >
                      Learn more{" "}
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
