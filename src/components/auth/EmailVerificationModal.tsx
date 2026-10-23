import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';

interface EmailVerificationModalProps {
  user: UserProfile;
  initialToken?: string;
  onVerified: () => void;
  onSkipToDashboard?: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  user,
  initialToken,
  onVerified,
  onSkipToDashboard,
}) => {
  const { verifyEmail, resendVerification } = useAuth();
  const [tokenInput, setTokenInput] = useState(initialToken || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setError(null);
    setMessage(null);
    setIsVerifying(true);

    const res = await verifyEmail(tokenInput.trim() || undefined, user.email);
    setIsVerifying(false);

    if (!res.success) {
      setError(res.error || 'Failed to verify email. Please check the code.');
    } else {
      setMessage('Your email has been verified successfully!');
      setTimeout(() => {
        onVerified();
      }, 1200);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setMessage(null);

    const res = await resendVerification(user.email);
    setIsResending(false);

    if (res.success) {
      setMessage(res.message || 'Verification link has been resent to your email.');
    } else {
      setError(res.error || 'Failed to resend verification.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
          Verify Your Email Address
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          We sent a verification link to{' '}
          <span className="font-bold text-gray-900">{user.email}</span>.
        </p>

        {message && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full py-3 bg-[#0B462C] hover:bg-[#125838] text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Confirm & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="w-full py-2.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>

          {onSkipToDashboard && (
            <button
              type="button"
              onClick={onSkipToDashboard}
              className="text-xs text-gray-400 hover:text-gray-600 mt-2 block mx-auto underline"
            >
              Verify later & continue to dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
