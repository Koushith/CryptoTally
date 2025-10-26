import { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

export const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSystem, setCurrentSystem] = useState('none');
  const [softwareName, setSoftwareName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formElement = e.target as HTMLFormElement;
      const paymentVolume = formElement.paymentVolume?.value;
      const message = formElement.message?.value;

      // Map form data to backend API format
      const payload = {
        email: email.trim(),
        source: 'landing',
        useCase: message || undefined,
        // Map current system to team size/company context
        teamSize: paymentVolume === 'small' ? '1-5' : paymentVolume === 'medium' ? '6-20' : '21-50',
        // Add additional context in use case
        ...(currentSystem !== 'none' && {
          useCase: [
            message,
            `Current system: ${currentSystem === 'software' ? softwareName || 'accounting software' : currentSystem}`,
          ]
            .filter(Boolean)
            .join(' | '),
        }),
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
        setIsSuccess(true);
        setAlreadyExists(data.data?.alreadyExists || false);
        // Reset form
        setEmail('');
        setCurrentSystem('none');
        setSoftwareName('');
      } else {
        throw new Error(data.message || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to join waitlist. Please try again.');
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
      <DialogContent className="sm:max-w-lg">
        <div className="w-full rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Join the Waitlist</h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="email">Email address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
              <p className="text-sm text-gray-600">Optional questions to help us build better</p>

              <div className="mt-4 space-y-4">
                <div>
                  <Label>Current payment management system</Label>
                  <RadioGroup
                    name="currentSystem"
                    defaultValue="none"
                    value={currentSystem}
                    onValueChange={setCurrentSystem}
                    className="mt-1.5 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spreadsheet" id="spreadsheet" />
                      <Label htmlFor="spreadsheet">Spreadsheets (Excel, Google Sheets)</Label>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="software" id="software" />
                        <Label htmlFor="software">QuickBooks, Xero, or similar</Label>
                      </div>
                      {currentSystem === 'software' && (
                        <Input
                          name="softwareName"
                          placeholder="Which software?"
                          value={softwareName}
                          onChange={(e) => setSoftwareName(e.target.value)}
                          className="mt-2 max-w-md"
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">No system yet</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Monthly crypto payment volume</Label>
                  <RadioGroup name="paymentVolume" defaultValue="small" className="mt-1.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small">Less than $10k</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">$10k - $100k</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large">More than $100k</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="message">Additional requirements</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what you're looking for..."
                    className="mt-1.5 h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
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
