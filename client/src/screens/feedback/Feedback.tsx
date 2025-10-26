import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bug, Lightbulb, MessageCircle, Send, CheckCircle2, ArrowUp, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getBaseUrl } from '@/lib/config';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | Issue['status']>('all');
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const { toast } = useToast();

  // Fetch feedback from backend
  const fetchFeedback = async () => {
    try {
      setIsLoadingIssues(true);
      const response = await fetch(`${getBaseUrl('backend')}/api/feedback`);
      const result = await response.json();

      if (response.ok && result.success) {
        setUserIssues(result.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoadingIssues(false);
    }
  };

  // Fetch feedback on mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const filteredIssues =
    filterStatus === 'all' ? userIssues : userIssues.filter((issue) => issue.status === filterStatus);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: After auth integration, include user name from auth context
      // const { user } = useAuth();
      // name: user?.name || undefined,

      const response = await fetch(`${getBaseUrl('backend')}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          message: `${title}\n\n${description}`,
          email: email.trim() || undefined,
          // name: user?.name || undefined, // TODO: Add after auth
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      // Success!
      setIsSubmitted(true);
      toast({
        title: 'Feedback submitted!',
        description: 'Thank you for helping us improve CryptoTally.',
      });

      // Refresh feedback list to show new submission
      fetchFeedback();

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedType(null);
        setTitle('');
        setDescription('');
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  <div
                    className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 ${type.iconColor}`}
                  >
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
                      <div
                        className={`w-10 h-10 rounded-lg ${selectedTypeData?.color} flex items-center justify-center`}
                      >
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
                <p className="text-xs text-gray-500 mt-1.5">We'll use this to follow up on your feedback if needed</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
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
              {isLoadingIssues
                ? // Loading skeleton
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm p-4 md:p-5 animate-pulse"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))
                : filteredIssues.map((issue) => {
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
                          <div
                            className={`w-10 h-10 rounded-lg ${getTypeColor(
                              issue.type
                            )} flex items-center justify-center flex-shrink-0`}
                          >
                            {getTypeIcon(issue.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-sm font-semibold text-gray-900 leading-snug">{issue.title}</h3>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${getStatusBadge(
                                  issue.status
                                )}`}
                              >
                                {issue.status === 'in-progress'
                                  ? 'In Progress'
                                  : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
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

            {!isLoadingIssues && filteredIssues.length === 0 && (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl md:rounded-xl">
                {/* Illustration */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/src/assets/feedback-illustration.png"
                    alt="No feedback yet"
                    className="w-48 h-48 object-contain"
                  />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {filterStatus === 'all'
                    ? 'No Feedback Yet'
                    : `No ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1).replace('-', ' ')} Feedback`}
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  {filterStatus === 'all'
                    ? 'Be the first to share your thoughts and help us improve CryptoTally!'
                    : `No feedback items match the "${filterStatus}" filter. Try selecting a different filter.`}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                  {filterStatus !== 'all' ? (
                    <Button variant="outline" onClick={() => setFilterStatus('all')} className="flex-1">
                      View All Feedback
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setSelectedType('feature')}
                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Request Feature
                      </Button>
                      <Button onClick={() => setSelectedType('bug')} variant="outline" className="flex-1">
                        <Bug className="h-4 w-4 mr-2" />
                        Report Bug
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
