"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Particles } from '@/components/ui/particles';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

type ViewState = 'welcome' | 'signin' | 'signup' | 'verify' | 'forgot';

interface MinimalAuthPageProps {
  onClose?: () => void;
}

// --- Helper Components ---

const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: -5 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -5 }}
    className="flex items-center text-red-500 text-xs mt-1 space-x-1"
  >
    <AlertCircle className="w-3 h-3" />
    <span>{message}</span>
  </motion.div>
);

const SuccessMessage = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: -5 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -5 }}
    className="flex items-center text-[#00c685] text-xs mt-1 space-x-1"
  >
    <CheckCircle className="w-3 h-3" />
    <span>{message}</span>
  </motion.div>
);

// --- Main Component ---

export function MinimalAuthPage({ onClose }: MinimalAuthPageProps) {
  const [view, setView] = useState<ViewState>('welcome');
  const [email, setEmail] = useState('');
  
  // Transition variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    })
  };
  
  // We use direction to slide left or right depending on the flow
  const [[page, direction], setPage] = useState([0, 0]);

  const navigateTo = (newView: ViewState, newDirection: number = 1) => {
    setPage([page + newDirection, newDirection]);
    setView(newView);
  };

  return (
    <div className="relative md:h-screen md:overflow-hidden w-full bg-[#0a1a14] z-[9999] text-white">
      <Particles
        color="#00c685"
        quantity={120}
        ease={20}
        className="absolute inset-0"
      />
      <div aria-hidden className="absolute inset-0 isolate -z-10 contain-strict">
        <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.01)_50%,transparent_80%)] absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21rem] -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,198,133,0.04)_0,rgba(0,198,133,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-[80rem] w-[15rem] [translate:5%_-50%] -rotate-45 rounded-full" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        <Link href="/" className="absolute top-6 left-6 cursor-pointer z-50">
          <img src="/brand/logo-light.png" alt="Takaful Logo" className="h-6" />
        </Link>

        <div className="mx-auto w-full sm:w-[400px] relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={view}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full"
            >
              {view === 'welcome' && <WelcomeView onNavigate={navigateTo} />}
              {view === 'signin' && <SignInView onNavigate={navigateTo} email={email} setEmail={setEmail} />}
              {view === 'signup' && <SignUpView onNavigate={navigateTo} email={email} setEmail={setEmail} />}
              {view === 'verify' && <VerifyOTPView onNavigate={navigateTo} email={email} />}
              {view === 'forgot' && <ForgotPasswordView onNavigate={navigateTo} email={email} setEmail={setEmail} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Views ---

const InputBaseClasses = "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:border-[#00c685] focus-visible:ring-[#00c685]/20 focus-visible:ring-2 transition-all";

function WelcomeView({ onNavigate }: { onNavigate: (v: ViewState, d?: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1 text-center sm:text-left">
        <h1 className="font-heading font-normal text-3xl tracking-wide text-white">
          Sign In or Join Now!
        </h1>
        <p className="text-gray-400 text-base">
          Login or create your Takaful account.
        </p>
      </div>
      <div className="space-y-3">
        <Button type="button" size="lg" className="w-full bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold transition-colors cursor-pointer">
          <img src="/icons/google.svg" alt="Google Logo" className="me-2 size-4" />
          Continue with Google
        </Button>
        <Button type="button" size="lg" className="w-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer">
          <img src="/icons/apple.svg" alt="Apple Logo" className="me-2 size-4" />
          Continue with Apple
        </Button>
        
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a1a14] px-2 text-gray-500">Or</span>
          </div>
        </div>

        <Button 
          type="button" 
          size="lg" 
          onClick={() => onNavigate('signin')}
          className="w-full border border-white/10 bg-transparent hover:bg-white/5 text-white transition-colors cursor-pointer"
        >
          <Mail className="me-2 size-4" />
          Continue with Email
        </Button>
      </div>
      <p className="text-gray-500 mt-8 text-sm text-center sm:text-left">
        By clicking continue, you agree to our{' '}
        <a href="#" className="hover:text-[#00c685] underline underline-offset-4 text-gray-400">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="hover:text-[#00c685] underline underline-offset-4 text-gray-400">Privacy Policy</a>.
      </p>
    </div>
  );
}

function SignInView({ onNavigate, email, setEmail }: { onNavigate: (v: ViewState, d?: number) => void, email: string, setEmail: (e: string) => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    // Mock login failure for demo
    if (password !== 'password123') {
      setError('Incorrect email or password. Please try again.');
      return;
    }
    setError('');
    // Proceed to dashboard...
  };

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('welcome', -1)} className="text-gray-400 hover:text-white transition-colors flex items-center text-sm mb-4 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <div className="flex flex-col space-y-1">
        <h1 className="font-heading font-normal text-3xl tracking-wide text-white">
          Welcome back
        </h1>
        <p className="text-gray-400 text-base">
          Enter your details to sign in.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email" className="text-white/90">Email</Label>
          <Input 
            id="signin-email"
            type="email" 
            placeholder="you@example.com" 
            className={`${InputBaseClasses} ${error ? 'border-red-500' : ''}`}
            value={email}
            onChange={(e) => {setEmail(e.target.value); setError('');}}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password" className="text-white/90">Password</Label>
            <button 
              type="button" 
              onClick={() => onNavigate('forgot')}
              className="text-xs text-[#00c685] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Input 
              id="signin-password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`${InputBaseClasses} pr-10 ${error ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => {setPassword(e.target.value); setError('');}}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && <ErrorMessage message={error} />}
        </AnimatePresence>

        <Button type="submit" size="lg" className="w-full bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold mt-2 cursor-pointer">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account?{' '}
        <button onClick={() => onNavigate('signup')} className="text-[#00c685] hover:underline font-medium cursor-pointer">
          Sign up
        </button>
      </p>
    </div>
  );
}

function SignUpView({ onNavigate, email, setEmail }: { onNavigate: (v: ViewState, d?: number) => void, email: string, setEmail: (e: string) => void }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Password strength logic
  const getStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-white/10' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
      return { score: 3, label: 'Strong', color: 'bg-[#00c685]' };
    }
    return { score: 2, label: 'Good', color: 'bg-yellow-500' };
  };

  const strength = getStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (strength.score < 2) {
      setError('Please use a stronger password.');
      return;
    }
    setError('');
    // Proceed to OTP verification
    onNavigate('verify');
  };

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('welcome', -1)} className="text-gray-400 hover:text-white transition-colors flex items-center text-sm mb-4 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <div className="flex flex-col space-y-1">
        <h1 className="font-heading font-normal text-3xl tracking-wide text-white">
          Create an account
        </h1>
        <p className="text-gray-400 text-base">
          Join Takaful to get started.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name" className="text-white/90">Full Name</Label>
          <Input 
            id="signup-name"
            type="text" 
            placeholder="John Doe" 
            className={`${InputBaseClasses} ${error && !name ? 'border-red-500' : ''}`}
            value={name}
            onChange={(e) => {setName(e.target.value); setError('');}}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-white/90">Email</Label>
          <Input 
            id="signup-email"
            type="email" 
            placeholder="you@example.com" 
            className={`${InputBaseClasses} ${error && !email ? 'border-red-500' : ''}`}
            value={email}
            onChange={(e) => {setEmail(e.target.value); setError('');}}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-white/90">Password</Label>
          <div className="relative">
            <Input 
              id="signup-password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`${InputBaseClasses} pr-10 ${error && strength.score < 2 ? 'border-red-500' : (password && strength.score >= 2 ? 'border-[#00c685]' : '')}`}
              value={password}
              onChange={(e) => {setPassword(e.target.value); setError('');}}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex space-x-1 h-1">
                {[1, 2, 3].map((level) => (
                  <div 
                    key={level} 
                    className={`flex-1 rounded-full transition-colors duration-300 ${strength.score >= level ? strength.color : 'bg-white/10'}`}
                  />
                ))}
              </div>
              <p className={`text-xs text-right ${strength.color.replace('bg-', 'text-')}`}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {error && <ErrorMessage message={error} />}
        </AnimatePresence>

        <Button type="submit" size="lg" className="w-full bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold mt-2 cursor-pointer">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <button onClick={() => onNavigate('signin', -1)} className="text-[#00c685] hover:underline font-medium cursor-pointer">
          Sign in
        </button>
      </p>
    </div>
  );
}

function VerifyOTPView({ onNavigate, email }: { onNavigate: (v: ViewState, d?: number) => void, email: string }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    // Mock failure for specific code
    if (code === '000000') {
      setError('Invalid or expired verification code.');
      return;
    }
    setError('');
    // Proceed to dashboard (mock success)
    alert("Verification successful! Redirecting to dashboard...");
  };

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('signup', -1)} className="text-gray-400 hover:text-white transition-colors flex items-center text-sm mb-4 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <div className="flex flex-col space-y-1">
        <h1 className="font-heading font-normal text-3xl tracking-wide text-white">
          Verify your email
        </h1>
        <p className="text-gray-400 text-base">
          We sent a 6-digit code to <span className="text-white font-medium">{email || 'your email'}</span>.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-xl font-bold ${InputBaseClasses} ${error ? 'border-red-500' : ''}`}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && <ErrorMessage message={error} />}
        </AnimatePresence>

        <Button type="submit" size="lg" className="w-full bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold cursor-pointer">
          Verify Email
        </Button>
      </form>

      <div className="text-center text-sm text-gray-400 mt-6">
        {timeLeft > 0 ? (
          <p>Resend code in 0:{timeLeft.toString().padStart(2, '0')}</p>
        ) : (
          <button 
            onClick={() => setTimeLeft(59)}
            className="text-[#00c685] hover:underline font-medium cursor-pointer"
          >
            Resend Code
          </button>
        )}
      </div>
    </div>
  );
}

function ForgotPasswordView({ onNavigate, email, setEmail }: { onNavigate: (v: ViewState, d?: number) => void, email: string, setEmail: (e: string) => void }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('signin', -1)} className="text-gray-400 hover:text-white transition-colors flex items-center text-sm mb-4 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
      </button>
      <div className="flex flex-col space-y-1">
        <h1 className="font-heading font-normal text-3xl tracking-wide text-white">
          Reset password
        </h1>
        <p className="text-gray-400 text-base">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      
      {success ? (
        <div className="space-y-6">
          <div className="bg-[#00c685]/10 border border-[#00c685]/30 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
            <div className="bg-[#00c685]/20 p-2 rounded-full">
              <Mail className="w-6 h-6 text-[#00c685]" />
            </div>
            <h3 className="font-medium text-white">Check your email</h3>
            <p className="text-sm text-gray-400">
              We sent a password reset link to <br/>
              <span className="text-white">{email}</span>
            </p>
          </div>
          <Button 
            onClick={() => onNavigate('signin', -1)}
            variant="outline"
            size="lg" 
            className="w-full border-white/10 hover:bg-white/5 text-white bg-transparent cursor-pointer"
          >
            Return to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-white/90">Email</Label>
            <Input 
              id="reset-email"
              type="email" 
              placeholder="you@example.com" 
              className={`${InputBaseClasses} ${error ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => {setEmail(e.target.value); setError('');}}
            />
          </div>

          <AnimatePresence>
            {error && <ErrorMessage message={error} />}
          </AnimatePresence>

          <Button type="submit" size="lg" className="w-full bg-[#00c685] hover:bg-[#00a871] text-[#0a1a14] font-bold mt-2 cursor-pointer">
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}
