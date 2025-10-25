import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

interface PromotionalCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const PromotionalCard: React.FC<PromotionalCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative">
        <div className="mb-3">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg mb-2">
            {icon || (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
        </div>
        <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold" asChild>
          <NavLink to={buttonLink}>{buttonText}</NavLink>
        </Button>
      </div>
    </div>
  );
};
