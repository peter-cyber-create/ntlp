import React from 'react'
import { Award, Users, Target, Heart } from 'lucide-react'

export const metadata = {
  title: 'Partners - NACNDC & JASHConference 2025',
  description: 'Our partners supporting NACNDC & JASHConference 2025',
}

export default function PartnersPage() {
  const allPartners = [
    {
      name: 'Makerere University College of Health Sciences (MakCHS)',
      logo: '/images/makCHS-logo-1.png',
      description: 'Uganda\'s premier health sciences college, leading research, training, and innovation in health.',
      website: 'https://chs.mak.ac.ug/'
    },
  ];

  const sponsorshipTiers = [
    {
      name: 'Platinum Sponsor/Exhibitor',
      price: '$10,000',
      color: 'bg-gradient-to-r from-purple-400 to-purple-600',
      ideal: 'Major healthcare firms, pharmaceutical companies, diagnostic labs, beverage firms & banking institutions',
      benefits: [
        'Prime booth location (largest size)',
        'Speaking slot (plenary or breakout)',
        'Logo on all promotional materials',
        '6 complimentary conference passes',
        'Feature in post-conference report',
        'Social media spotlight'
      ]
    },
    {
      name: 'Gold Sponsor/Exhibitor',
      price: '$7,000',
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      ideal: 'Medical tech companies, NGOs, research institutions',
      benefits: [
        'Premium booth location',
        'Panel participation opportunity',
        'Logo on website & program booklet',
        '4 complimentary passes',
        'Branded banner at venue'
      ]
    },
    {
      name: 'Silver Exhibitor',
      price: '$5,000',
      color: 'bg-gradient-to-r from-gray-300 to-gray-500',
      ideal: 'Health startups, regional health agencies, universities',
      benefits: [
        'Standard booth',
        'Logo in program booklet',
        '2 complimentary passes',
        'Mention during opening/closing remarks'
      ]
    },
    {
      name: 'Bronze Exhibitor',
      price: '$4,000',
      color: 'bg-gradient-to-r from-orange-400 to-orange-600',
      ideal: 'Small businesses, advocacy groups, student-led health initiatives',
      benefits: [
        'Basic booth',
        '1 complimentary pass',
        'Name listed in program booklet'
      ]
    },
    {
      name: 'Non-Profit/Academic Table',
      price: '$2,500',
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      ideal: 'Non-profits, student groups, academic researchers',
      benefits: [
        'Table display space only (shared zone)',
        'No promotional branding',
        '1 access badge',
        'Listing in non-profit section of booklet'
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
                <div className="h-32 w-full flex items-center justify-center mb-6">
                  <img src={partner.logo} alt={partner.name + ' logo'} className="max-h-28 max-w-full w-auto object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{partner.name}</h3>
                <p className="text-gray-600 text-center mb-4">{partner.description}</p>
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Visit Website →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-gray-600">Join us in advancing health innovation and research in Uganda</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className={`${tier.color} p-6 text-white`}>
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold">{tier.price}</div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4 italic">Ideal for: {tier.ideal}</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    Choose This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600">Unlock unique opportunities to make a lasting impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Network Access</h3>
              <p className="text-gray-600">Connect with 500+ health professionals, researchers, and policymakers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Targeted Audience</h3>
              <p className="text-gray-600">Reach decision-makers in healthcare, government, and academia</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Recognition</h3>
              <p className="text-gray-600">Enhance your brand visibility among key stakeholders</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Impact</h3>
              <p className="text-gray-600">Support initiatives that improve health outcomes in Uganda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner With Us?</h2>
          <p className="text-xl mb-8 text-primary-100">Join our mission to advance health innovation and research in Uganda</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </a>
            <a href="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Register as Sponsor
            </a>
          </div>
        </div>
      </section>
      {/* Manual Payment Instructions Section */}
      <section className="section-padding bg-yellow-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-yellow-300">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <span className="mr-2">💳</span> Payment Instructions
              </h2>
              <p className="mb-4 text-gray-700">For payment details, please contact us directly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
