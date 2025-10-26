import { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [paymentVolume, setPaymentVolume] = useState('');
  const [currentSystem, setCurrentSystem] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email required', {
        description: 'Please enter your email address',
      });
      return;
    }

    if (!userType) {
      toast.error('Profile type required', {
        description: 'Please select what best describes you',
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: email.trim(),
        name: name.trim() || undefined,
        source: 'landing',
        userType: userType || undefined,
        companyName: companyName.trim() || undefined,
        teamSize: teamSize || undefined,
        paymentVolume: paymentVolume || undefined,
        useCase: [
          useCase.trim(),
          currentSystem && currentSystem !== 'none'
            ? `Current system: ${currentSystem === 'software' ? softwareName || 'accounting software' : currentSystem}`
            : null,
        ]
          .filter(Boolean)
          .join(' | ') || undefined,
        referralSource: referralSource || undefined,
      };

      const response = await fetch('https://cryptotally.up.railway.app/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const alreadyExistsValue = data.data?.alreadyExists || false;
        setIsSuccess(true);
        setAlreadyExists(alreadyExistsValue);

        // Show success toast
        toast.success(
          alreadyExistsValue ? "You're already on the list!" : "Welcome to the waitlist!",
          {
            description: data.message,
          }
        );

        // Reset form
        setEmail('');
        setName('');
        setUserType('');
        setCompanyName('');
        setTeamSize('');
        setPaymentVolume('');
        setCurrentSystem('');
        setSoftwareName('');
        setUseCase('');
        setReferralSource('');
      } else {
        throw new Error(data.message || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Submission failed', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay />
        <DialogContent className="sm:max-w-lg">
          <div className="w-full rounded-2xl bg-white p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {alreadyExists ? "You're already on the list!" : "You're on the list!"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {alreadyExists
                  ? "We've got you covered! You're already signed up for early access. Keep an eye on your inbox!"
                  : "Thanks for joining our waitlist. We'll keep you updated on our progress and let you know when we launch. Keep an eye on your inbox!"}
              </p>
              <Button onClick={onClose} className="mt-6" size="sm">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="sm:max-w-2xl">
        <div className="w-full rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Join the Waitlist</h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Email & Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* User Type */}
            <div>
              <Label htmlFor="userType" className="text-sm font-medium">
                I am a... <span className="text-red-500">*</span>
              </Label>
              <Select value={userType} onValueChange={setUserType} disabled={loading} required>
                <SelectTrigger className="mt-1.5 w-full">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company / Project Name
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Optional"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="teamSize" className="text-sm font-medium">
                  Team Size
                </Label>
                <Select value={teamSize} onValueChange={setTeamSize} disabled={loading}>
                  <SelectTrigger className="mt-1.5 w-full">
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

            {/* Monthly Payment Volume */}
            <div>
              <Label htmlFor="paymentVolume" className="text-sm font-medium">
                Monthly Crypto Payment Volume
              </Label>
              <Select value={paymentVolume} onValueChange={setPaymentVolume} disabled={loading}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<10k">Less than $10k</SelectItem>
                  <SelectItem value="10k-100k">$10k - $100k</SelectItem>
                  <SelectItem value=">100k">More than $100k</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current System */}
            <div>
              <Label htmlFor="currentSystem" className="text-sm font-medium">
                Current Payment Management System
              </Label>
              <Select value={currentSystem} onValueChange={setCurrentSystem} disabled={loading}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select your current system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spreadsheet">Spreadsheets (Excel, Google Sheets)</SelectItem>
                  <SelectItem value="software">Accounting Software (QuickBooks, Xero, etc.)</SelectItem>
                  <SelectItem value="none">No system yet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Software Name (conditional) */}
            {currentSystem === 'software' && (
              <div>
                <Label htmlFor="softwareName" className="text-sm font-medium">
                  Which software do you use?
                </Label>
                <Input
                  id="softwareName"
                  type="text"
                  placeholder="E.g., QuickBooks, Xero, FreshBooks..."
                  value={softwareName}
                  onChange={(e) => setSoftwareName(e.target.value)}
                  disabled={loading}
                  className="mt-1.5"
                />
              </div>
            )}

            {/* Use Case */}
            <div>
              <Label htmlFor="useCase" className="text-sm font-medium">
                What do you plan to use CryptoTally for?
              </Label>
              <Textarea
                id="useCase"
                placeholder="E.g., tracking freelance income, startup treasury management, tax preparation..."
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                disabled={loading}
                className="mt-1.5 min-h-[80px] resize-none"
              />
            </div>

            {/* Referral Source */}
            <div>
              <Label htmlFor="referralSource" className="text-sm font-medium">
                How did you hear about us?
              </Label>
              <Select value={referralSource} onValueChange={setReferralSource} disabled={loading}>
                <SelectTrigger className="mt-1.5 w-full">
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

            <div className="flex items-center justify-end gap-3 pt-2 border-t mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} size="sm">
                {loading ? 'Submitting...' : 'Join Waitlist'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
