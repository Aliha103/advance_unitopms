"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle, Clock } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: "contract" | "receipt" | "invoice";
  date: string;
  status: "signed" | "pending" | "archived";
  size: string;
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc-001",
    title: "Master Service Agreement (v1.0)",
    type: "contract",
    date: "2026-02-12",
    status: "signed",
    size: "245 KB",
  },
  {
    id: "doc-002",
    title: "Data Processing Agreement (DPA)",
    type: "contract",
    date: "2026-02-12",
    status: "signed",
    size: "180 KB",
  },
  {
    id: "rec-001",
    title: "Alloggiati Receipt - Feb 2026",
    type: "receipt",
    date: "2026-02-13",
    status: "archived",
    size: "45 KB",
  },
];

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);

  const handleDownload = (doc: Document) => {
    // In a real app, this would trigger a file download from the API
    alert(`Downloading ${doc.title}...`);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Securely access your signed contracts and compliance records.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                Request Export
            </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center truncate">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="ml-4 truncate">
                      <div className="flex text-sm font-medium text-teal-600 truncate">
                        {doc.title}
                      </div>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500 truncate mr-3">
                            {doc.type.toUpperCase()} • {doc.size}
                        </p>
                        <p className="flex items-center text-xs text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                            {doc.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-2">
                    <div className="hidden sm:flex mr-6">
                        {doc.status === 'signed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" /> Signed
                            </span>
                        )}
                        {doc.status === 'archived' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Archived
                            </span>
                        )}
                    </div>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-blue-700">
                        Need an older invoice or receipt? Contact support if you need documents prior to 2026.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
