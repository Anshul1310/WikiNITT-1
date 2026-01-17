"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              The Ultimate Guide to <span className="text-blue-900">NIT</span>{" "}
              <span className="text-amber-600">Trichy</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-gray-600"
            >
              Everything you need to know about student life, departments,
              hostels at National Institute of Technology, Tiruchirappalli.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-4"
            >
              <Link
                href="/articles"
                className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105 flex items-center"
              >
                Read Articles <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/departments"
                className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all hover:scale-105"
              >
                Explore Departments
              </Link>
            </motion.div>
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 rounded-2xl bg-gray-900 shadow-xl overflow-hidden aspect-4/3 lg:aspect-auto lg:h-full"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 to-amber-600/40 mix-blend-overlay z-10" />
              {}
              <Image
                src="/nitt.jpg"
                alt="NITT"
                fill
                className="object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center text-white p-8">
                  <div className="text-6xl font-bold mb-2">NITT</div>
                  <div className="text-xl font-light tracking-widest uppercase">
                    Est. 1964
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
