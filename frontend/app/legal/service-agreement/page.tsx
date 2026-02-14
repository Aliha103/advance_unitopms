import fs from 'fs';
import path from 'path';
import Markdown from 'markdown-to-jsx';
import { Navbar } from "@/components/navbar";

// Load the markdown file at build time
const agreementPath = path.join(process.cwd(), '../.gemini/antigravity/brain/6428976f-6ab6-43b0-afeb-c0fc95064809/host_service_agreement.md');

export default async function ServiceAgreementPage() {
  let content = "";
  try {
    // In a real deployment, this file would be moved to public/ or a cms.
    // For this local setup, we read from the artifacts folder if accessible,
    // or fallback to a hardcoded version if the path is restricted in production build.
    if (fs.existsSync(agreementPath)) {
      content = fs.readFileSync(agreementPath, 'utf8');
    } else {
        content = "# Service Agreement\n\n*(Agreement not found. Please contact support.)*";
    }
  } catch (e) {
    content = "# Service Agreement\n\n*(Error loading agreement.)*";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <article className="prose prose-teal max-w-none">
                <Markdown>{content}</Markdown>
            </article>
        </div>
      </div>
    </div>
  );
}
