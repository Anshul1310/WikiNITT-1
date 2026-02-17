"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface FormattedDateProps {
  date: string | number | Date;
  className?: string;
}

export default function FormattedDate({ date, className }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      let dateObj: Date;

      if (typeof date === "string") {
        // Handle backend format "YYYY-MM-DD HH:MM:SS" which is UTC
        let dateStr = date;
        // If it looks like the backend format (has space, no T, no Z)
        if (date.includes(" ") && !date.includes("T") && !date.includes("Z")) {
          dateStr = date.replace(" ", "T") + "Z";
        }
        dateObj = new Date(dateStr);
      } else {
        dateObj = new Date(date);
      }

      // Check if date is valid
      if (!isNaN(dateObj.getTime())) {
        setFormattedDate(formatDistanceToNow(dateObj, { addSuffix: true }));
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }, [date]);

  // Render a stable empty span during SSR and initial hydration to prevent mismatches
  if (!mounted || !formattedDate) {
    return <span className={className}></span>;
  }

  return (
    <span
      className={className}
      title={typeof date === "string" ? date : undefined}
      suppressHydrationWarning
    >
      {formattedDate}
    </span>
  );
}