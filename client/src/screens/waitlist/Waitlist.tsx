import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2, Rocket, Users, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WaitlistPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [useCase, setUseCase] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    if (!userType) {
      toast({
        title: 'Profile type required',
        description: 'Please select what best describes you',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          source: 'app',
          userType: userType || undefined,
          companyName: companyName.trim() || undefined,
          teamSize: teamSize || undefined,
          useCase: useCase.trim() || undefined,
          referralSource: referralSource || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join waitlist');
      }

      setIsSuccess(true);
      toast({
        title: data.data.alreadyExists ? "You're already on the list!" : 'Welcome to the waitlist!',
        description: data.message,
      });

      setTimeout(() => {
        setEmail('');
        setName('');
        setUserType('');
        setCompanyName('');
        setTeamSize('');
        setUseCase('');
        setReferralSource('');
        setIsSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">You're on the list!</h2>
          <p className="text-lg text-gray-600 mb-2">We'll notify you when CryptoTally launches.</p>
          <p className="text-sm text-gray-500">Keep an eye on your inbox!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Coming Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join the Waitlist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Be among the first to experience CryptoTally - the easiest way to track and manage your crypto transactions for tax filing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Zap,
              title: 'Early Access',
              description: 'Get exclusive early access before public launch',
            },
            {
              icon: Users,
              title: 'Priority Support',
              description: 'Direct line to our team for feedback and support',
            },
            {
              icon: Rocket,
              title: 'Special Perks',
              description: 'Exclusive benefits for early adopters',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Signup Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="space-y-5">
              {/* Email & Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
              </div>

              {/* User Type */}
              <div>
                <Label htmlFor="userType" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  I am a... <span className="text-red-500">*</span>
                </Label>
                <Select value={userType} onValueChange={setUserType} disabled={isSubmitting} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual / Solo</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="startup">Startup Founder / Employee</SelectItem>
                    <SelectItem value="enterprise">Enterprise / Large Company</SelectItem>
                    <SelectItem value="accountant">Accountant / Tax Professional</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Name & Team Size Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Company / Project Name
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Optional"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="teamSize" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Team Size
                  </Label>
                  <Select value={teamSize} onValueChange={setTeamSize} disabled={isSubmitting}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me</SelectItem>
                      <SelectItem value="2-10">2-10 people</SelectItem>
                      <SelectItem value="11-50">11-50 people</SelectItem>
                      <SelectItem value="51-200">51-200 people</SelectItem>
                      <SelectItem value="200+">200+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Use Case */}
              <div>
                <Label htmlFor="useCase" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  What do you plan to use CryptoTally for?
                </Label>
                <Textarea
                  id="useCase"
                  placeholder="E.g., tracking freelance income, startup treasury management, tax preparation..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  disabled={isSubmitting}
                  className="min-h-[90px] resize-none"
                />
              </div>

              {/* Referral Source */}
              <div>
                <Label htmlFor="referralSource" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  How did you hear about us?
                </Label>
                <Select value={referralSource} onValueChange={setReferralSource} disabled={isSubmitting}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter / X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="friend">Friend / Colleague</SelectItem>
                    <SelectItem value="search">Google / Search Engine</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="newsletter">Newsletter / Blog</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-semibold mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 leading-relaxed">
                We'll only use your email to notify you about CryptoTally launch updates. Your information helps us build features you need.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
