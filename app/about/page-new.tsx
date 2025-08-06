import React from 'react'
import { Target, Globe, Users, Lightbulb, Calendar, MapPin, GraduationCap, Heart, Shield, Laptop, Leaf, Zap } from 'lucide-react'

export const metadata = {
  title: 'About - NATIONAL ANNUAL COMMUNICABLE AND NON COMMUNICABLE DISEASES (NACNDC) AND 19TH JOINT SCIENTIFIC HEALTH(JASH) CONFERENCE 2025',
  description: 'Learn about NACNDC AND JASH CONFERENCE 2025, Uganda premier health conference organized by Ministry of Health Uganda and Makerere University School of Public Health. UNIFIED ACTION AGAINST COMMUNICABLE AND NON COMMUNICABLE DISEASES.',
}

export default function AboutPage() {
  return (
    <div className="bg-primary-50 min-h-screen pb-10">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-14 px-2 sm:px-0">
        <div className="flex justify-center mb-10">
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-70" />
        </div>
        <div className="max-w-5xl mx-auto text-center rounded-2xl shadow-2xl bg-primary-900/95 p-7 sm:p-12 border border-primary-800 flex flex-col gap-7 transition-transform duration-200 hover:scale-[1.01]">
          {/* Uganda Coat of Arms */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full p-3">
              <img 
                src="/images/uganda-coat-of-arms.png" 
                alt="Uganda Coat of Arms" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-primary-100 drop-shadow">About the Conference</h1>
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 border border-primary-300/30 rounded-full text-primary-100 text-sm font-medium">
              Organized by Ministry of Health & Makerere University School of Public Health
            </div>
          </div>
          <p className="text-xl text-primary-100 max-w-4xl mx-auto leading-relaxed mb-6">
            Welcome to the National Annual Communicable and Non-Communicable Diseases (NACNDC) Conference and the 19th Joint Annual Scientific Health (JASH) Conference 2025. 
            This is a joint national event organized by Ministry of Health and Makerere University School of Public Health to bring together healthcare leaders, researchers, policymakers, and innovators under one roof to tackle the country's major health challenges.
          </p>
          <div className="mt-6 p-6 bg-primary-800/50 rounded-lg max-w-4xl mx-auto">
            <p className="text-primary-100 font-medium text-center mb-4">
              The conference will take place from <span className="font-bold text-white">3rd to 7th November 2025</span> at <span className="font-bold text-white">Speke Resort Munyonyo</span>, and will be held alongside the <span className="font-bold text-white">100-year celebration of Makerere University College of Health Sciences</span>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-primary-700/50 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Nov 3-7, 2025</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-700/50 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Speke Resort Munyonyo</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-700/50 px-3 py-2 rounded-lg">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">100 Years MakCHS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="relative w-full py-14 px-2 sm:px-0 bg-white">
        <div className="flex justify-center mb-10">
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-70" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-primary-900">Conference Theme</h2>
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">"Unified Action against Communicable and Non-Communicable Diseases"</h3>
            <p className="text-lg text-primary-100 leading-relaxed">
              This year's gathering will shine a light on the power of collaboration in improving health services for all Ugandans. 
              Whether it's stopping the spread of infections or dealing with long-term illnesses, the aim is simple: joining hands to build a better and fairer health system for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Key Focus Areas */}
      <section className="relative w-full py-14 px-2 sm:px-0 bg-gray-50">
        <div className="flex justify-center mb-10">
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-70" />
        </div>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-primary-900 text-center">Key Focus Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Diagnostics, AMR & Epidemic Readiness */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Diagnostics, AMR & Epidemic Readiness</h3>
              </div>
              <p className="text-gray-600">
                Strengthening our ability to detect and respond to diseases early.
              </p>
            </div>

            {/* Digital Health & Data Use */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <Laptop className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Digital Health & Data Use</h3>
              </div>
              <p className="text-gray-600">
                Using technology and health data to improve care and planning.
              </p>
            </div>

            {/* Health Systems & Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Health Systems & Policy</h3>
              </div>
              <p className="text-gray-600">
                Ensuring all Ugandans have fair access to quality healthcare.
              </p>
            </div>

            {/* Environmental Health & Climate Change */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <Leaf className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Environmental Health & Climate Change</h3>
              </div>
              <p className="text-gray-600">
                Tackling health risks linked to our environment and changing climate.
              </p>
            </div>

            {/* Health Innovations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200 hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Health Innovations</h3>
              </div>
              <p className="text-gray-600">
                Showcasing new ideas and tools that make healthcare delivery better and faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose & Audience */}
      <section className="relative w-full py-14 px-2 sm:px-0 bg-white">
        <div className="flex justify-center mb-10">
          <div className="h-1 w-24 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-700 rounded-full opacity-70" />
        </div>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-primary-900 text-center">Conference Purpose</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl shadow-xl bg-primary-50 p-8 border border-primary-200">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-2xl font-bold text-primary-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                This conference will offer space for learning, sharing research, and building partnerships across sectors. 
                We aspire to take meaningful steps toward a healthier Uganda, through shared effort, shared knowledge, and shared action.
              </p>
              <div className="bg-white p-4 rounded-lg border border-primary-200">
                <p className="text-primary-800 font-medium text-center">
                  "Your voice and contribution matters"
                </p>
              </div>
            </div>

            <div className="rounded-2xl shadow-xl bg-white p-8 border border-primary-200">
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-2xl font-bold text-primary-900">Who Should Attend</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Policymakers and Government Officials
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Healthcare Practitioners and Clinicians
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Researchers and Academics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Students and Early Career Professionals
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Health Innovators and Entrepreneurs
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  Development Partners and NGOs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative w-full py-14 px-2 sm:px-0 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Join Us in Making a Difference</h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Be part of this historic gathering as we work together toward unified action against communicable and non-communicable diseases. 
            Together, we can build a healthier, more resilient Uganda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg">
              Register Now
            </a>
            <a href="/abstracts" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary-600 transition-colors">
              Submit Abstract
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
