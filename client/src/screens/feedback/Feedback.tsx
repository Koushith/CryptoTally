import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bug, Lightbulb, MessageCircle, Send, CheckCircle2, ArrowUp, Clock } from 'lucide-react';

type FeedbackType = 'bug' | 'feature' | 'feedback';

type Issue = {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  author: string;
  date: string;
  votes: number;
  status: 'open' | 'in-progress' | 'planned' | 'closed';
};

export const FeedbackPage = () => {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | Issue['status']>('all');

  // Mock user-submitted issues
  const userIssues: Issue[] = [
    {
      id: '1',
      type: 'feature',
      title: 'Add export to QuickBooks format',
      description: 'It would be great to export transactions in QuickBooks compatible format for easier bookkeeping.',
      author: 'Sarah M.',
      date: '2 days ago',
      votes: 24,
      status: 'planned',
    },
    {
      id: '2',
      type: 'bug',
      title: 'Transaction sync stuck on Polygon',
      description: 'Transactions from Polygon network are not syncing for the past 3 hours. Other chains work fine.',
      author: 'Mike K.',
      date: '5 hours ago',
      votes: 12,
      status: 'in-progress',
    },
    {
      id: '3',
      type: 'feature',
      title: 'Support for Solana wallets',
      description: 'Would love to see support for Solana blockchain transactions and wallets.',
      author: 'Alex P.',
      date: '1 week ago',
      votes: 45,
      status: 'open',
    },
    {
      id: '4',
      type: 'feature',
      title: 'Dark mode support',
      description: 'A dark mode would be great for working late at night when tracking transactions.',
      author: 'Emma L.',
      date: '3 days ago',
      votes: 67,
      status: 'planned',
    },
    {
      id: '5',
      type: 'bug',
      title: 'CSV export missing gas fees column',
      description: 'When exporting to CSV, the gas fees column is not included in the export.',
      author: 'David R.',
      date: '1 day ago',
      votes: 8,
      status: 'open',
    },
    {
      id: '6',
      type: 'feedback',
      title: 'Love the new transaction tagging UI!',
      description: 'The recent update to the tagging interface is so much better. Much easier to categorize now.',
      author: 'Lisa T.',
      date: '4 days ago',
      votes: 31,
      status: 'closed',
    },
  ];

  const filteredIssues = filterStatus === 'all'
    ? userIssues
    : userIssues.filter(issue => issue.status === filterStatus);

  const feedbackTypes = [
    {
      type: 'bug' as const,
      icon: Bug,
      title: 'Bug Report',
      description: 'Report a bug or issue',
      color: 'bg-red-50 border-red-200 hover:bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      type: 'feature' as const,
      icon: Lightbulb,
      title: 'Feature Request',
      description: 'Suggest a new feature',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      type: 'feedback' as const,
      icon: MessageCircle,
      title: 'General Feedback',
      description: 'Share your thoughts',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ selectedType, title, description, email });
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedType(null);
      setTitle('');
      setDescription('');
      setEmail('');
    }, 3000);
  };

  const handleReset = () => {
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setEmail('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-sm text-gray-600">
            Your feedback has been submitted successfully. We'll review it and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Feedback & Support</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">
            Help us improve CryptoTally by reporting bugs or suggesting features
          </p>
        </div>

        {!selectedType ? (
          // Feedback Type Selection
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {feedbackTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`p-6 border-2 rounded-2xl md:rounded-xl transition-all text-left ${type.color} active:scale-[0.98]`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 ${type.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              );
            })}
          </div>
        ) : (
          // Feedback Form
          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-5 md:p-8">
            {/* Selected Type Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {(() => {
                  const selectedTypeData = feedbackTypes.find((t) => t.type === selectedType);
                  const Icon = selectedTypeData?.icon;
                  return (
                    <>
                      <div className={`w-10 h-10 rounded-lg ${selectedTypeData?.color} flex items-center justify-center`}>
                        {Icon && <Icon className={`h-5 w-5 ${selectedTypeData.iconColor}`} />}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{selectedTypeData?.title}</h2>
                        <p className="text-xs text-gray-500">{selectedTypeData?.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Change Type
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder={
                    selectedType === 'bug'
                      ? 'e.g., Transaction sync not working'
                      : selectedType === 'feature'
                      ? 'e.g., Add support for Optimism network'
                      : 'e.g., Love the new UI design'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder={
                    selectedType === 'bug'
                      ? 'Please describe the bug in detail. What were you doing when it occurred? What did you expect to happen?'
                      : selectedType === 'feature'
                      ? 'Describe the feature you would like to see. How would it help you?'
                      : 'Share your feedback or suggestions with us'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email (optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  We'll use this to follow up on your feedback if needed
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Community Issues Section */}
        {!selectedType && (
          <div className="mt-8 md:mt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Community Feedback</h2>
                <p className="text-xs text-gray-500 mt-1">See what other users are requesting and reporting</p>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'open', label: 'Open' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'planned', label: 'Planned' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value as typeof filterStatus)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      filterStatus === filter.value
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredIssues.map((issue) => {
                const getTypeIcon = (type: FeedbackType) => {
                  switch (type) {
                    case 'bug':
                      return <Bug className="h-4 w-4 text-red-600" />;
                    case 'feature':
                      return <Lightbulb className="h-4 w-4 text-blue-600" />;
                    case 'feedback':
                      return <MessageCircle className="h-4 w-4 text-green-600" />;
                  }
                };

                const getTypeColor = (type: FeedbackType) => {
                  switch (type) {
                    case 'bug':
                      return 'bg-red-50';
                    case 'feature':
                      return 'bg-blue-50';
                    case 'feedback':
                      return 'bg-green-50';
                  }
                };

                const getStatusBadge = (status: Issue['status']) => {
                  switch (status) {
                    case 'open':
                      return 'bg-gray-100 text-gray-700';
                    case 'in-progress':
                      return 'bg-yellow-100 text-yellow-700';
                    case 'planned':
                      return 'bg-blue-100 text-blue-700';
                    case 'closed':
                      return 'bg-green-100 text-green-700';
                  }
                };

                return (
                  <div
                    key={issue.id}
                    className="bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className={`w-10 h-10 rounded-lg ${getTypeColor(issue.type)} flex items-center justify-center flex-shrink-0`}>
                        {getTypeIcon(issue.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{issue.title}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${getStatusBadge(issue.status)}`}
                          >
                            {issue.status === 'in-progress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                          {issue.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {issue.date}
                          </span>
                          <span>by {issue.author}</span>
                          <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            <ArrowUp className="h-3.5 w-3.5" />
                            <span className="font-medium">{issue.votes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredIssues.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl md:rounded-xl">
                <p className="text-sm text-gray-500">No issues found for this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
