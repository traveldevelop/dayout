import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-800 dark:text-slate-100">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-2">404 - Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The cabana, villa, or staycation experience you are looking for cannot be found or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
        >
          <Home className="w-4 h-4" />
          Return to Explore
        </Link>
      </div>
    </div>
  );
}
