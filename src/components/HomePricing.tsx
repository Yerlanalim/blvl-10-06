"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Check, Crown, BookOpen, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { trackPricingViewed, trackUpgradeClicked } from '@/lib/analytics';

const HomePricing = () => {
    useEffect(() => {
        trackPricingViewed('direct', 'free');
    }, []);

    const handleUpgradeClick = (tierName: string) => {
        if (tierName === 'Premium') {
            trackUpgradeClicked('pricing_page');
        }
    };

    const tiers = [
        {
            name: 'Free',
            price: 0,
            description: 'Perfect for getting started with business fundamentals',
            features: [
                'Access to first 3 business levels',
                '30 AI assistant messages total',
                'Basic learning materials',
                'Community support'
            ]
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
            popular: true
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-600 text-lg" suppressHydrationWarning>
                        Choose the plan that fits your learning journey
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative flex flex-col ${
                                tier.popular ? 'border-green-500 shadow-lg' : 'border-gray-200'
                            }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className={`h-5 w-5 ${tier.name === 'Premium' ? 'text-yellow-500' : 'text-gray-400'}`} />
                                    <span>{tier.name}</span>
                                </CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow flex-col">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">${tier.price}</span>
                                    <span className="text-gray-600 ml-2">/month</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/auth/register"
                                    onClick={() => handleUpgradeClick(tier.name)}
                                    className={`w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                                        tier.popular
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    Start Learning
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center gap-6 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                            <span>10 Business Levels</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-green-500" />
                            <span>AI Assistant &ldquo;Leo&rdquo;</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        <span className="mr-1" aria-label="rocket">🚀</span>
                        Start with Free plan, upgrade anytime to unlock all levels
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HomePricing;
