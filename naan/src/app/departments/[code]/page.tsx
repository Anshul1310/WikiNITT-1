"use client";

import { useParams } from "next/navigation";
import { departments } from "@/data/departments";
import { getDepartmentResources } from "@/data/department-resources";
import FileSystem from "@/components/FileSystem";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DepartmentDetailsPage() {
  const params = useParams();
  const code = params.code as string;

  const department = departments.find((d) => d.code === code);
  const resources = getDepartmentResources(code);

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Department not found</h1>
          <Link href="/departments" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/departments"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Departments
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className={`h-16 w-16 rounded-2xl ${department.color} text-white flex items-center justify-center shadow-lg`}>
              <department.icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
              <p className="text-gray-500">{department.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
          <FileSystem rootItems={resources} departmentName={department.name} />
        </div>
      </div>
    </div>
  );
}
