import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                {/* Placeholder for future sections */}
                <section className="bg-gaming-dark py-20 px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Trending on Kashaaf</h2>
                    <p className="text-gray-400">Join the community to see the latest highlights.</p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
