"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const leftNavLinks = [
    { href: "https://oliv.com/candidates", label: "Candidate" },
    { href: "https://oliv.com/employers", label: "Employer" },
  ];

  const rightNavLinks = [
    { href: "https://oliv.com/perks", label: "Perks" },
    { href: "https://oliv.com/jobs", label: "Jobs" },
    { href: "https://oliv.com/career-pro", label: "CareerPro", isNew: true },
  ];

  const resourcesLinks = [
    {
      href: "https://oliv.com/contact",
      icon: "📧",
      title: "Contact",
      description: "Everything you need to get started and master Oliv.",
    },
    {
      href: "https://oliv.podia.com/",
      icon: "📚",
      title: "Academy",
      description: "Free online courses to supercharge your applications.",
    },
    {
      href: "https://oliv.com/blog",
      icon: "📝",
      title: "Blog",
      description: "Guides, templates and advice to help launch your career.",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="flex items-center w-full h-20 px-6 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 mr-auto lg:mr-0"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            priority
            className="h-[29px] w-[64px]"
          />
        </Link>

        {/* Desktop Navigation - Left Menu */}
        <nav className="items-center flex-1 hidden ml-12 lg:flex">
          <ul className="flex items-center gap-6">
            {leftNavLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center h-20 px-3 py-2 text-sm font-medium text-gray-700 transition-colors border-b-4 hover:text-[#1447E6] border-b-transparent hover:border-b-[#1447E6]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Navigation - Right Menu */}
        <nav className="items-center justify-end flex-1 hidden lg:flex">
          <ul className="flex items-center justify-between gap-8">
            {rightNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center h-20 gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors border-b-4 hover:text-[#1447E6] border-b-transparent hover:border-b-[#1447E6]"
                >
                  {link.label}
                  {link.isNew && (
                    <span className="inline-block px-2 py-1 text-xs font-bold rounded text-emerald-600 bg-emerald-50">
                      New
                    </span>
                  )}
                </Link>
              </li>
            ))}

            {/* Resources Dropdown */}
            <li className="relative group">
              <button className="flex items-center h-20 gap-8 px-3 py-2 text-sm font-medium text-gray-700 transition-colors border-b-4 hover:text-[#1447E6] border-b-transparent group-hover:border-b-[#1447E6]">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Desktop Dropdown Menu */}
              <div className="absolute right-0 invisible pt-2 mt-0 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 w-96 group-hover:opacity-100 group-hover:visible top-full">
                <div className="p-4 space-y-3">
                  {resourcesLinks.map((resource) => (
                    <Link
                      key={resource.href}
                      href={resource.href}
                      target="_blank"
                      className="block p-3 transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 text-2xl rounded-full w-14 h-14 bg-orange-50">
                          {resource.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {resource.title}
                          </h4>
                          <p className="mt-1 text-xs text-gray-600">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </nav>

        {/* Desktop Auth Section */}
        <div className="items-center flex-shrink-0 hidden gap-3 ml-8 lg:flex">
          {/* <Link
            href="/login"
            className="px-[32px] h-[48px] leading-[47px] text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Log in
          </Link> */}
          <Link
            href="/manage"
            className="px-[32px] h-[48px] leading-[47px] text-sm font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            Manage
          </Link>

          {/* Language Selector */}
          {/* <button className="flex items-center gap-1 px-[32px] h-[48px] leading-[47px]  text-xs font-medium text-gray-700 transition-colors bg-white border border-gray-400 rounded hover:bg-gray-50">
            ENG
            <ChevronDown className="w-3 h-3" />
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center flex-shrink-0 p-2 text-gray-700 transition-colors lg:hidden hover:text-gray-900"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="bg-white border-t border-gray-200 lg:hidden">
          <div className="px-4 py-4 space-y-1">
            {/* Left Menu Links */}
            {leftNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Right Menu Links */}
            {rightNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.isNew && (
                    <span className="inline-block px-2 py-1 text-xs font-bold rounded text-emerald-600 bg-emerald-50">
                      New
                    </span>
                  )}
                </span>
              </Link>
            ))}

            {/* Resources Dropdown Mobile */}
            <div className="px-4 py-2">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium text-left text-gray-700 hover:text-gray-900"
              >
                Resources
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isResourcesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isResourcesOpen && (
                <div className="pl-4 mt-2 space-y-3 border-l border-gray-200">
                  {resourcesLinks.map((resource) => (
                    <Link
                      key={resource.href}
                      href={resource.href}
                      target="_blank"
                      className="block py-1 text-sm hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-700 mb-0.5">
                        {resource.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {resource.description}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 px-4 py-4 mt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="w-full px-4 py-2 text-sm font-medium text-center text-blue-600 transition-colors border border-blue-600 rounded hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="w-full px-4 py-2 text-sm font-medium text-center text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Get started
              </Link>
              <button className="flex items-center justify-center w-full gap-1 px-4 py-2 text-xs font-medium text-gray-700 transition-colors bg-white border border-gray-400 rounded hover:bg-gray-50">
                ENG
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
