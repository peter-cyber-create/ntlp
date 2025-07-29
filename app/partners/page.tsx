import React from 'react'
import { Award, Users, Target, Heart } from 'lucide-react'

export const metadata = {
  title: 'Partners - The Communicable and Non-Communicable Diseases Conference 2025',
  description: 'Meet our valued partners supporting The Communicable and Non-Communicable Diseases Conference. Join our partnership program.',
}

export default function PartnersPage() {
  const allPartners = [
    // International Organizations
    {
      name: 'The Global Fund',
      logo: '/placeholder-logo.jpg',
      description: 'Fighting AIDS, tuberculosis and malaria through international partnerships.',
      website: 'https://www.theglobalfund.org'
    },
    {
      name: 'World Health Organization (WHO)',
      logo: '/placeholder-logo.jpg',
      description: 'The UN health agency coordinating international health efforts worldwide.',
      website: 'https://www.who.int/uganda'
    },
    {
      name: 'Centers for Disease Control and Prevention (CDC)',
      logo: '/placeholder-logo.jpg',
      description: 'US health agency providing technical support and funding for disease prevention.',
      website: 'https://www.cdc.gov/globalhealth/countries/uganda'
    },
    {
      name: 'USAID Uganda',
      logo: '/placeholder-logo.jpg',
      description: 'US government agency working to reduce poverty and support development.',
      website: 'https://www.usaid.gov/uganda'
    },
    {
      name: 'PEPFAR Uganda',
      logo: '/placeholder-logo.jpg',
      description: 'Emergency plan providing antiretroviral treatment and prevention services.',
      website: 'https://www.pepfar.gov/countries/uganda'
    },
    {
      name: 'GAVI Alliance',
      logo: '/placeholder-logo.jpg',
      description: 'Public-private partnership increasing access to immunization in developing countries.',
      website: 'https://www.gavi.org'
    },
    {
      name: 'UNICEF Uganda',
      logo: '/placeholder-logo.jpg',
      description: 'UN agency advocating for children rights and providing humanitarian assistance.',
      website: 'https://www.unicef.org/uganda'
    },
    // National Institutions
    {
      name: 'Infectious Diseases Institute (IDI)',
      logo: '/placeholder-logo.jpg',
      description: 'Makerere University-based institute providing clinical care, research and training.',
      website: 'https://www.idi.mak.ac.ug'
    },
    {
      name: 'Uganda Cancer Institute',
      logo: '/placeholder-logo.jpg',
      description: 'Specialized facility providing comprehensive cancer care and research.',
      website: 'https://www.uci.or.ug'
    },
    {
      name: 'Joint Clinical Research Centre (JCRC)',
      logo: '/placeholder-logo.jpg',
      description: 'Non-profit organization conducting clinical research and providing treatment.',
      website: 'https://www.jcrc.org.ug'
    },
    {
      name: 'Mulago National Referral Hospital',
      logo: '/placeholder-logo.jpg',
      description: 'Teaching hospital serving as Uganda\'s premier medical institution.',
      website: 'https://www.mulago.go.ug'
    },
    {
      name: 'Butabika National Referral Hospital',
      logo: '/placeholder-logo.jpg',
      description: 'Specialized facility providing mental health services nationwide.',
      website: 'https://www.health.go.ug'
    },
    {
      name: 'Uganda National Institute for Public Health',
      logo: '/placeholder-logo.jpg',
      description: 'Government institute conducting surveillance and public health research.',
      website: 'https://www.health.go.ug'
    },
    // Technology Partners
    {
      name: 'MedNet Technologies',
      logo: '/placeholder-logo.jpg',
      description: 'Local company developing health information systems and digital solutions.',
      website: 'https://www.health.go.ug'
    },
    {
      name: 'Rocket Health',
      logo: '/placeholder-logo.jpg',
      description: 'Platform connecting patients with qualified doctors through technology.',
      website: 'https://rockethealth.africa'
    },
    {
      name: 'SafeBoda Health',
      logo: '/placeholder-logo.jpg',
      description: 'Service providing emergency transport and healthcare delivery.',
      website: 'https://safeboda.com/health'
    },
    {
      name: 'CarePay Uganda',
      logo: '/placeholder-logo.jpg',
      description: 'Financial technology company facilitating healthcare payments.',
      website: 'https://www.carepay.com'
    },
    {
      name: 'HealthTech Uganda',
      logo: '/placeholder-logo.jpg',
      description: 'Innovation hub supporting local health technology development.',
      website: 'https://www.health.go.ug'
    },
    {
      name: 'Uganda Digital Health Initiative',
      logo: '/placeholder-logo.jpg',
      description: 'Government program digitizing healthcare delivery systems.',
      website: 'https://www.health.go.ug'
    }
  ]

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
        'Panel participation opportunity',
        'Logo on conference materials',
        'Networking lunch sponsorship',
        'VIP dinner for 6 guests',
        '15 complimentary tickets',
        'Mobile app branding',
        'Social media mentions',
        'Newsletter inclusion'
      ]
    },
    {
      name: 'Platinum Sponsor',
      price: '$50,000',
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      benefits: [
        'Prime booth location in exhibition hall',
        'Speaking slot in main agenda',
        'Logo on all conference materials',
        'Welcome reception title sponsorship',
        'VIP dinner for 10 guests',
        'Dedicated breakout session',
        'Pre and post-event attendee list',
        '20 complimentary tickets',
        'Branding in mobile app',
        'Press release inclusion'
      ]
    },
    {
      name: 'Gold Sponsor',
      price: '$25,000',
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      benefits: [
        'Premium booth location',
        'Panel participation opportunity',
        'Logo on conference materials',
        'Networking lunch sponsorship',
        'VIP dinner for 6 guests',
        '15 complimentary tickets',
        'Mobile app branding',
        'Social media mentions',
        'Newsletter inclusion'
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
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Partners
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Together with our partners, we're building stronger health systems across Uganda and beyond. 
              These organizations share our commitment to improving healthcare delivery through innovation and collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Stats */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-primary-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Strategic Partners</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">Major Sponsors</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
              <div className="text-gray-600">Startup Partners</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Target className="text-primary-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">130+</div>
              <div className="text-gray-600">Health Districts</div>
            </div>
          </div>
        </div>
      </section>

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
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="h-20 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-sm font-semibold text-primary-700 text-center px-2">{partner.name}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{partner.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{partner.description}</p>
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
              <div key={index} className="bg-white rounded-2xl p-6 text-gray-900">
                <div className={`h-3 rounded-t-lg ${tier.color} mb-6`}></div>
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-6">{tier.price}</div>
                
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, benefitIndex) => (
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
