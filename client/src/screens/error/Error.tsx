import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorScreenProps {
  error?: Error;
  message?: string;
}

export const ErrorScreen = ({ error, message = "We couldn't find the page you're looking for." }: ErrorScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-5">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Notioly Illustration */}
        <img
          src="https://notioly.com/wp-content/uploads/2024/06/407.Analytics.png"
          alt="404 Not Found"
          className="w-64 h-64 mb-8 object-contain"
        />

        {/* Main Message */}
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Page not found</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {message}
            {error?.message && <span className="block mt-2 text-sm">{error.message}</span>}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="default" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <HomeIcon className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};
