import React from 'react'
import { Award, Users, Target, Heart } from 'lucide-react'

export const metadata = {
  title: 'Partners - The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'Meet our valued partners supporting The Communicable and Non-Communicable Diseases Conference. Join our partnership program.',
}

export default function PartnersPage() {
  const allPartners = [
    {
      name: 'Makerere University College of Health Sciences (MakCHS)',
      logo: '/images/uganda-coat-of-arms.png',
      description: 'Uganda’s premier health sciences college, leading research, training, and innovation in health.',
      website: 'https://chs.mak.ac.ug/'
    },
    {
      name: 'World Health Organization (WHO)',
      logo: '/images/who-logo.png',
      description: 'The UN health agency coordinating international health efforts worldwide.',
      website: 'https://www.who.int/uganda'
    },
    {
      name: 'Infectious Diseases Institute (IDI)',
      logo: '/images/idi-logo.png',
      description: 'Makerere University-based institute providing clinical care, research and training.',
      website: 'https://www.idi.mak.ac.ug'
    }
  ];

  const sponsorshipTiers = [
    {
      name: 'Startup Partner',
      price: '$5,000',
      color: 'bg-gradient-to-r from-primary-400 to-primary-600',
      benefits: [
        'Startup exhibition space',
        'Pitch competition entry',
        'Logo on startup materials',
        '5 complimentary tickets',
        'Mobile app listing',
        'Networking access',
        'Mentorship opportunities'
      ]
    },
    {
      name: 'Silver Sponsor',
      price: '$15,000',
      color: 'bg-gradient-to-r from-gray-300 to-gray-500',
      benefits: [
        'Standard booth location',
        'Logo on select materials',
        'Coffee break sponsorship',
        '10 complimentary tickets',
        'Mobile app listing',
        'Social media mentions',
        'Newsletter inclusion'
      ]
    },
    {
      name: 'Gold Sponsor',
      price: '$25,000',
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      benefits: [
        'Premium booth location',
        'Logo on all materials',
        'Keynote speaking slot',
        '20 complimentary tickets',
        'Mobile app feature',
        'VIP networking',
        'Press release mention'
      ]
    }
  ];

  return (
    <div>
      {/* All Partners */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Partners
            </h2>
            <p className="text-xl text-gray-600">Organizations working with us to strengthen health systems in Uganda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPartners.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center">
                <div className="h-20 w-20 flex items-center justify-center mb-4">
                  <img src={partner.logo} alt={partner.name + ' logo'} className="h-16 w-auto object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{partner.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed text-center">{partner.description}</p>
                {partner.website && (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                  >
                    Learn More →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sponsorship Opportunities
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Join us as a sponsor and connect with health professionals, researchers, and leaders 
              who are shaping the future of healthcare in Uganda and across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-gray-900 shadow-md hover:shadow-lg transition-shadow transition-all duration-200 hover:scale-[1.01] focus-within:scale-[1.01] focus-within:ring-2 focus-within:ring-primary-400">
                <div className={`h-3 rounded-t-lg ${tier.color} mb-6`}></div>
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-6">{tier.price}</div>
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit: string, benefitIndex: number) => (
                    <li key={benefitIndex} className="flex items-start space-x-3 text-sm">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className="w-full btn-primary bg-primary-600 text-white hover:bg-primary-700"
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Become a Partner
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our mission to advance African healthcare through technology. 
              Let's create impact together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary">
                Contact Partnership Team
              </a>
              <a href="/register" className="btn-secondary">
                Attend as Delegate
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
