"use client";

import { useState } from "react";
import { Folder, FileText, ChevronRight, ArrowLeft, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResourceItem } from "@/data/department-resources";

interface FileSystemProps {
  rootItems: ResourceItem[];
  departmentName: string;
}

export default function FileSystem({ rootItems, departmentName }: FileSystemProps) {
  const [currentPath, setCurrentPath] = useState<ResourceItem[]>([]);
  
  
  const currentItems = currentPath.length > 0 
    ? currentPath[currentPath.length - 1].children || [] 
    : rootItems;

  const navigateTo = (item: ResourceItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
    } else {
      
      
      window.open(item.url || '#', '_blank');
    }
  };

  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const navigateRoot = () => {
    setCurrentPath([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
      {}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center space-x-2 overflow-x-auto">
        <button 
          onClick={navigateRoot}
          className={`flex items-center text-sm font-medium hover:text-blue-600 transition-colors ${currentPath.length === 0 ? 'text-gray-900' : 'text-gray-500'}`}
        >
          Root
        </button>
        
        {currentPath.map((item, index) => (
          <div key={item.id} className="flex items-center shrink-0">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            <button
              onClick={() => navigateToBreadcrumb(index)}
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${index === currentPath.length - 1 ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>

      {}
      <div className="p-6 flex-1">
        {currentPath.length > 0 && (
          <button 
            onClick={navigateUp}
            className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPath.length > 0 ? currentPath[currentPath.length - 1].id : 'root'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo(item)}
                className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${item.type === 'folder' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                  {item.type === 'folder' ? (
                    <Folder className="w-8 h-8" />
                  ) : (
                    <FileText className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-700 line-clamp-2">
                  {item.name}
                </h3>
                {item.type === 'file' && (
                  <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                )}
              </div>
            ))}

            {currentItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>This folder is empty</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
