"use client";

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardContent, CardFooter, Badge } from './index';
import { Mail, Download, Star, X } from 'lucide-react';

export function TestComponents() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Form submitted successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-secondary-light-gray p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="heading-xl text-primary-dark text-center mb-12">
          UI Components Test
        </h1>

        {/* Button Variants */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <h2 className="heading-md text-primary-dark">Button Components</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" size="lg">
                Primary Button
              </Button>
              <Button variant="secondary" size="md" icon={<Download size={16} />}>
                Download App
              </Button>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
              <Button variant="ghost" loading={loading} onClick={handleSubmit}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Components */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <h2 className="heading-md text-primary-dark">Input Components</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                icon={<Mail size={16} />}
                iconPosition="left"
              />
              <Input
                label="Search"
                placeholder="Search for features..."
                variant="filled"
                helperText="Type to search through our features"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="feature" hover padding="lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center mb-4">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="heading-sm text-primary-dark">Feature Card</h3>
            </CardHeader>
            <CardContent>
              <p className="body-md text-secondary-gray">
                This is a feature card with hover effects and animations.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card variant="pricing" hover padding="lg">
            <CardHeader>
              <div className="text-center">
                <h3 className="heading-sm text-primary-dark">Pro Plan</h3>
                <div className="mt-2">
                  <span className="heading-lg text-primary-blue">$8</span>
                  <span className="body-md text-secondary-gray">/month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="body-sm text-primary-dark flex items-center">
                  <span className="w-2 h-2 bg-accent-green rounded-full mr-3"></span>
                  Unlimited tasks
                </li>
                <li className="body-sm text-primary-dark flex items-center">
                  <span className="w-2 h-2 bg-accent-green rounded-full mr-3"></span>
                  AI insights
                </li>
                <li className="body-sm text-primary-dark flex items-center">
                  <span className="w-2 h-2 bg-accent-green rounded-full mr-3"></span>
                  Priority support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full">
                Choose Plan
              </Button>
            </CardFooter>
          </Card>

          <Card variant="outlined" padding="lg">
            <CardHeader>
              <h3 className="heading-sm text-primary-dark">Outlined Card</h3>
            </CardHeader>
            <CardContent>
              <p className="body-md text-secondary-gray">
                This card has an outlined border style.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Badge Components */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <h2 className="heading-md text-primary-dark">Badge Components</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary" size="lg">
                Primary Badge
              </Badge>
              <Badge variant="secondary" icon={<Star size={14} />}>
                4.8 Rating
              </Badge>
              <Badge variant="success" size="sm">
                Active
              </Badge>
              <Badge variant="warning">
                Beta
              </Badge>
              <Badge variant="error">
                Error
              </Badge>
              <Badge variant="outline" removable onRemove={() => alert('Badge removed!')}>
                Removable
              </Badge>
              <Badge animate variant="primary">
                Animated
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Typography Showcase */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <h2 className="heading-md text-primary-dark">Typography System</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h1 className="heading-xl text-primary-dark">Heading XL - 50px</h1>
                <h2 className="heading-lg text-primary-dark">Heading LG - 40px</h2>
                <h3 className="heading-md text-primary-dark">Heading MD - 32px</h3>
                <h4 className="heading-sm text-primary-dark">Heading SM - 24px</h4>
              </div>
              <div>
                <p className="body-lg text-primary-dark">Body Large - 24px</p>
                <p className="body-md text-secondary-gray">Body Medium - 18px</p>
                <p className="body-sm text-secondary-gray">Body Small - 16px</p>
                <p className="caption text-secondary-gray">Caption - 14px</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}