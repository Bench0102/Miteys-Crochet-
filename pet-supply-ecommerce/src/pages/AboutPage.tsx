import React from 'react';
import { Heart, Award, Users, Truck, Shield, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Happy Customers', value: '50,000+', icon: Users },
    { label: 'Products Sold', value: '200,000+', icon: Award },
    { label: 'Years of Service', value: '10+', icon: Star },
    { label: 'Pet Lives Improved', value: '100,000+', icon: Heart }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Pet-First Philosophy',
      description: 'Every decision we make is centered around what\'s best for your beloved pets. Their health, happiness, and well-being are our top priorities.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We carefully curate every product in our store, ensuring they meet the highest standards of safety, nutrition, and durability.'
    },
    {
      icon: Truck,
      title: 'Fast & Reliable',
      description: 'Quick delivery and excellent customer service because we know your pets can\'t wait for their favorite treats and toys.'
    },
    {
      icon: Award,
      title: 'Expert Knowledge',
      description: 'Our team consists of pet lovers and experts who understand the unique needs of different pets and their owners.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: '/api/placeholder/300/300',
      bio: 'A lifelong pet lover with 15+ years in the pet industry. Sarah started PetStore with a mission to make quality pet care accessible to everyone.'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Veterinary Advisor',
      image: '/api/placeholder/300/300',
      bio: 'Licensed veterinarian with expertise in pet nutrition and wellness. Dr. Chen helps us select the best products for pet health.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience Manager',
      image: '/api/placeholder/300/300',
      bio: 'Dedicated to ensuring every customer has an amazing experience. Emily and her team are here to help with any questions or concerns.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About PetStore
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're passionate about pets and dedicated to providing the best products and services 
              to help you care for your furry, feathered, and scaled family members.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PetStore was born from a simple observation: pet owners deserve better. 
                  Better products, better service, and better support for the journey of pet ownership.
                </p>
                <p>
                  Founded in 2014 by Sarah Johnson, a devoted pet parent and former veterinary technician, 
                  PetStore started as a small local shop with a big dream - to create a one-stop destination 
                  for everything pets need to live happy, healthy lives.
                </p>
                <p>
                  Today, we've grown into a trusted online retailer serving thousands of pet families 
                  across the country, but our core mission remains the same: putting pets first in everything we do.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Pet store founder with pets"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide every decision we make and every interaction we have with our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind PetStore who work every day to make pet ownership easier and more enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Give Your Pet the Best?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet parents who trust PetStore for all their pet care needs.
          </p>
          <a
            href="/"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Start Shopping
            <Heart className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;