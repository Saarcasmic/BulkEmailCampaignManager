import React from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
// import Stats from '../components/home/Stats';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';
import CTA from '../components/home/CTA';
import Footer from '../components/home/Footer';




export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Hero />
            {/* <Stats /> */}
            <Features />
            <Testimonials />
            <Pricing />
            <CTA />
            <Footer />
        </div>
    )
}