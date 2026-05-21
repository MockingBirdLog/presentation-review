import { Suspense } from "react";
import DeleteConfirmationContent from "./content";

export default function DeleteConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DeleteConfirmationContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md w-full text-center animate-fadeInScale">
        <p className="text-slate-400">読み込み中...</p>
      </div>
    </div>
  );
}
