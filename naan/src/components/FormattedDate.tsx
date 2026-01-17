"use client";

import { useEffect, useState } from "react";

export default function FormattedDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString());
  }, [date]);

  if (!formattedDate) {
    return null; 
  }

  return <>{formattedDate}</>;
}
