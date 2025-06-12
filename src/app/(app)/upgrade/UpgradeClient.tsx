"use client";

import React, { useState } from 'react';
import { Check, Crown, MessageCircle, BookOpen, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { paymentProvider } from '@/lib/payments/stub';
import { useRouter } from 'next/navigation';

interface UpgradeClientProps {
  userId: string;
  currentTier: 'free' | 'paid';
  currentLevel: number;
  aiMessagesUsed: number;
}

const UpgradeClient: React.FC<UpgradeClientProps> = ({
  userId,
  currentTier,
  currentLevel,
  aiMessagesUsed
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const tiers = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'Access to first 3 business levels',
        '30 AI assistant messages total',
        'Basic learning materials',
        'Community support'
      ],
      limitations: [
        'Limited to 3 levels only',
        'Total of 30 AI messages',
        'No certificates',
        'No priority support'
      ],
      current: currentTier === 'free'
    },
    {
      name: 'Premium',
      price: 29,
      description: 'Unlock your full business potential',
      features: [
        'Access to all 10 business levels',
        '30 AI assistant messages per day',
        'Premium learning materials & templates',
        'Completion certificates',
        'Priority support',
        'Advanced progress tracking'
      ],
      popular: true,
      current: currentTier === 'paid'
    }
  ];

  const handleUpgrade = async () => {
    if (currentTier === 'paid') {
      setMessage('You are already on the Premium plan!');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const checkout = await paymentProvider.createCheckout(userId, 'paid');
      
      if (checkout.status === 'completed') {
        setMessage('🎉 Successfully upgraded to Premium! Redirecting...');
        setTimeout(() => {
          router.push('/levels');
          router.refresh();
        }, 2000);
      } else {
        setMessage('Payment system coming soon! This is a development preview.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setMessage('An error occurred during upgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (currentTier === 'free') {
      setMessage('You are already on the Free plan!');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await paymentProvider.cancelSubscription(userId);
      setMessage('Successfully downgraded to Free plan. Redirecting...');
      setTimeout(() => {
        router.push('/levels');
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Downgrade error:', error);
      setMessage('An error occurred during downgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Learning Journey</h1>
          <p className="text-xl text-gray-600 mb-6">
            Unlock all 10 business levels and accelerate your growth
          </p>
          
          {/* Current Status */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Crown className={`h-5 w-5 ${currentTier === 'paid' ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span className="font-medium">
              Current Plan: {currentTier === 'paid' ? 'Premium' : 'Free'}
            </span>
            <span className="text-gray-500">•</span>
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Level {currentLevel}</span>
            <span className="text-gray-500">•</span>
            <MessageCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{aiMessagesUsed} AI messages used</span>
          </div>
        </div>

        {message && (
          <Alert className="mb-8 max-w-2xl mx-auto">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${
                tier.current 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : tier.popular 
                    ? 'border-green-500 shadow-lg' 
                    : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              {tier.current && (
                <div className="absolute top-0 left-0 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                  Current Plan
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className={`h-5 w-5 ${tier.name === 'Premium' ? 'text-yellow-500' : 'text-gray-400'}`} />
                  {tier.name}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  
                  {tier.limitations && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium text-gray-500 mb-2">Limitations:</p>
                        {tier.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-start gap-2 opacity-60">
                            <span className="text-red-400 mt-0.5">×</span>
                            <span className="text-gray-600 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </div>
                    </>
                  )}
                </ul>

                {tier.name === 'Premium' && currentTier === 'free' && (
                  <Button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? 'Processing...' : 'Upgrade to Premium'}
                  </Button>
                )}

                {tier.name === 'Premium' && currentTier === 'paid' && (
                  <Button
                    onClick={handleDowngrade}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {isLoading ? 'Processing...' : 'Downgrade to Free'}
                  </Button>
                )}

                {tier.name === 'Free' && (
                  <Button
                    disabled
                    variant={tier.current ? "default" : "outline"}
                    className="w-full"
                  >
                    {tier.current ? 'Current Plan' : 'Free Forever'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-gray-600">
          <p className="mb-2">
            <strong>Note:</strong> This is a development preview. 
            Real payment processing will be added in future updates.
          </p>
          <p className="text-sm">
            Questions? Contact support at support@bizlevel.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeClient; 