'use client';

import { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface WaitlistModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function WaitlistModal({ onClose, onSuccess }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([{ email, bonus_points: 1000 }]);

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          // Already registered — still treat as success
          setIsSuccess(true);
          localStorage.setItem('taeam_waitlisted', 'true');
          localStorage.setItem('taeam_waitlist_email', email);
          setTimeout(() => onSuccess(), 1800);
        } else {
          throw supabaseError;
        }
      } else {
        setIsSuccess(true);
        localStorage.setItem('taeam_waitlisted', 'true');
        localStorage.setItem('taeam_waitlist_email', email);
        setTimeout(() => onSuccess(), 1800);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md animate-pop-in">
        <div className="bg-[#111111] border border-[#EAB308]/30 rounded-3xl p-8 shadow-[0_0_80px_rgba(234,179,8,0.15)]">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#EAB308] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                  Join the Waitlist
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Get <span className="text-[#EAB308] font-bold">1,000 Founding Points</span> + <span className="text-[#EAB308] font-bold">15% off</span> your first order when we launch.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={isSubmitting}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 focus:border-[#EAB308]/50 text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-sm focus:shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                />

                {error && (
                  <p className="text-red-400 text-xs px-1">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full bg-[#EAB308] text-black font-black py-3.5 rounded-xl hover:bg-yellow-400 transition-all duration-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Joining...</span>
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-gray-600 text-xs">
                  No spam. Just a heads-up when we launch.
                </p>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#EAB308] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(234,179,8,0.5)] animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                You&apos;re In!
              </h2>
              <p className="text-gray-400 text-sm">
                Welcome to Taeam. Your 1,000 founding points are waiting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
