import { Metadata } from "next";
import HostelsClient from "@/components/hostels/HostelsClient";

export const metadata: Metadata = {
  title: "Hostels - Wikinitt",
  description:
    "Explore the hostels at NIT Trichy. Find information about facilities, capacity, and more.",
};

export default function HostelsPage() {
  return <HostelsClient />;
}
