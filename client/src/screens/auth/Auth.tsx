import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Shield, FileText, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // TODO: Implement Google OAuth
    console.log('Google OAuth');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handlePasskeyAuth = () => {
    setIsLoading(true);
    // TODO: Implement Passkey authentication
    console.log('Passkey authentication');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement email/password authentication
    console.log('Email authentication');
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left side - Hero */}
      <div className="relative hidden bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 text-white lg:flex lg:flex-col lg:justify-between p-12 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-50" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white group cursor-pointer">
            <div className="relative h-12 w-12">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-xl bg-white opacity-20 blur-md group-hover:opacity-30 transition-opacity" />
              {/* Main logo container */}
              <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-105 transition-transform">
                <span className="text-xl font-bold">CT</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">CryptoTally</span>
              <p className="text-xs text-gray-400">Crypto Accounting Made Simple</p>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CheckCircle2 className="h-4 w-4" />
              Trusted by 10,000+ crypto users
            </div>
            <h1 className="text-4xl font-bold text-white lg:text-5xl leading-tight">
              Track your crypto
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                transactions effortlessly
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Multi-chain wallet tracking, automatic transaction sync, and
              tax-ready reports for your crypto accounting needs.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">5M+</div>
                <div className="text-sm text-gray-400">Transactions Tracked</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-sm text-gray-400">Chains Supported</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-4">
            {[
              {
                icon: Wallet,
                title: 'Multi-chain Support',
                description: 'Track Ethereum, Polygon, Arbitrum, BSC & more chains',
              },
              {
                icon: Shield,
                title: 'Read-Only & Secure',
                description: 'No private keys needed. Your funds stay safe.',
              },
              {
                icon: FileText,
                title: 'Tax-Ready Reports',
                description: 'Export CSV reports ready for your accountant',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="relative flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300 group cursor-pointer"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative mt-0.5 rounded-lg bg-white p-2.5 shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-white/10 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-gray-900" strokeWidth={2.5} />
                </div>
                <div className="relative flex-1">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-900 shadow-lg flex items-center justify-center text-xs font-semibold text-white"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="h-9 w-9 rounded-full bg-white/10 border-2 border-gray-900 shadow-lg flex items-center justify-center text-xs font-semibold text-white backdrop-blur-sm">
                +1K
              </div>
            </div>
            <p className="leading-relaxed">
              Trusted by startups, freelancers, and DAOs worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative z-10 mx-auto w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col items-center justify-center gap-4 lg:hidden">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-xl bg-gray-900 opacity-20 blur-md" />
              <div className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-300 shadow-xl">
                <span className="text-2xl font-bold text-white">CT</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900">CryptoTally</span>
              <p className="text-sm text-gray-600">Crypto Accounting Made Simple</p>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {activeTab === 'signin' ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'signin'
                ? 'Sign in to access your crypto accounting dashboard'
                : 'Create your account and start tracking transactions'}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-gray-200">
              <TabsTrigger value="signin" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-5 mt-6">
              <div className="space-y-3">
                {/* Google Auth */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm transition-all"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>

                {/* Passkey Auth */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm transition-all"
                  onClick={handlePasskeyAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  Sign in with Passkey
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-gray-50 to-gray-100 px-3 text-gray-600 font-medium">
                    Or with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-gray-900">
                    Email address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-gray-900">
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      className="h-11 bg-white border-gray-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showSignInPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-5 mt-6">
              <div className="space-y-3">
                {/* Google Auth */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm transition-all"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>

                {/* Passkey Auth */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm transition-all"
                  onClick={handlePasskeyAuth}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  Create account with Passkey
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-gray-50 to-gray-100 px-3 text-gray-600 font-medium">
                    Or with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium text-gray-900">
                    Full name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium text-gray-900">
                    Email address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium text-gray-900">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      className="h-11 bg-white border-gray-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with a number and special character
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-600 px-8">
                By signing up, you agree to our{' '}
                <a href="#" className="underline hover:text-gray-900 font-medium">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-gray-900 font-medium">
                  Privacy Policy
                </a>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
