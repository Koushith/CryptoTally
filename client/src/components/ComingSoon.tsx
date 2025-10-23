import { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  illustrationUrl?: string;
}

export const ComingSoon = ({ icon: Icon, title, description, illustrationUrl }: ComingSoonProps) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md">
        {illustrationUrl ? (
          <img
            src={illustrationUrl}
            alt={title}
            className="w-64 h-64 mb-8 object-contain"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-8">
            <Icon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
          {description}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
          </span>
          Coming Soon
        </div>
      </div>
    </div>
  );
};
