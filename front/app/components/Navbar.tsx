// components/Navbar.tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <Link href='/' className="text-2xl font-bold text-gray-800">FraudDetect AI</Link>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-indigo-600 font-medium">Accueil</Link>
                            <Link href="/login" className="text-gray-600 hover:text-indigo-600">Connexion</Link>
                            <Link href="/register" className="text-gray-600 hover:text-indigo-600">Register</Link>
                            <Link href="/register" className="text-gray-600 hover:text-indigo-600">Solution</Link>
                            <Link href="#" className="text-gray-600 hover:text-indigo-600">Contact</Link>
                            <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-blue-500">
                                Dashboard
                            </Link>

                        </nav>
                        <button className="md:hidden text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        </nav>
    );
};

export default Navbar;
