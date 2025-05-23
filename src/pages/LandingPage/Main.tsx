import { useEffect, useState } from "react";

import { Code2, Download, Menu, Check, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Feature {
  text: string;
  icon: LucideIcon;
}

// interface Stat {
//   value: string;
//   label: string;
// }

// interface FooterLink {
//   text: string;
//   href: string;
// }

// interface FooterSectionProps {
//   title: string;
//   links: FooterLink[];
// }

const features: Feature[] = [
  { text: "No Coding Required", icon: Check },
  { text: "Testnet Compatible", icon: Check },
  { text: "Production Ready", icon: Check },
];

// const stats: Stat[] = [
//   { value: "3,500+", label: "Active Sui Developers" },
//   { value: "45+", label: "Countries" },
//   { value: "$2.5M+", label: "Ecosystem Funding" },
// ];

// const footerLinks = {
//   product: [
//     { text: "Features", href: "#" },
//     { text: "Roadmap", href: "#" },
//     { text: "Pricing", href: "#" },
//     { text: "Documentation", href: "#" },
//   ],
//   resources: [
//     { text: "Tutorials", href: "#" },
//     { text: "API Reference", href: "#" },
//     { text: "Community", href: "#" },
//     { text: "Blog", href: "#" },
//   ],
//   company: [
//     { text: "About Us", href: "#" },
//     { text: "Careers", href: "#" },
//     { text: "Contact", href: "#" },
//     { text: "Press Kit", href: "#" },
//   ],
// };

const socialLinks = {
  git: {
    icon: (
      <img
        className="w-5"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdpdGh1Yi1pY29uIGx1Y2lkZS1naXRodWIiPjxwYXRoIGQ9Ik0xNSAyMnYtNGE0LjggNC44IDAgMCAwLTEtMy41YzMgMCA2LTIgNi01LjUuMDgtMS4yNS0uMjctMi40OC0xLTMuNS4yOC0xLjE1LjI4LTIuMzUgMC0zLjUgMCAwLTEgMC0zIDEuNS0yLjY0LS41LTUuMzYtLjUtOCAwQzYgMiA1IDIgNSAyYy0uMyAxLjE1LS4zIDIuMzUgMCAzLjVBNS40MDMgNS40MDMgMCAwIDAgNCA5YzAgMy41IDMgNS41IDYgNS41LS4zOS40OS0uNjggMS4wNS0uODUgMS42NS0uMTcuNi0uMjIgMS4yMy0uMTUgMS44NXY0Ii8+PHBhdGggZD0iTTkgMThjLTQuNTEgMi01LTItNy0yIi8+PC9zdmc+"
      />
    ),
    href: "https://github.com/BlockBlockYonsei/SuiMoveScratch",
  },
  twitter: {
    icon: (
      <img
        className="w-5"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXR3aXR0ZXItaWNvbiBsdWNpZGUtdHdpdHRlciI+PHBhdGggZD0iTTIyIDRzLS43IDIuMS0yIDMuNGMxLjYgMTAtOS40IDE3LjMtMTggMTEuNiAyLjIuMSA0LjQtLjYgNi0yQzMgMTUuNS41IDkuNiAzIDVjMi4yIDIuNiA1LjYgNC4xIDkgNC0uOS00LjIgNC02LjYgNy0zLjggMS4xIDAgMy0xLjIgMy0xLjJ6Ii8+PC9zdmc+"
      />
    ),
    href: "https://x.com/suimovescratch",
  },
  presentaion: {
    icon: (
      <img
        className="w-5"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXByZXNlbnRhdGlvbi1pY29uIGx1Y2lkZS1wcmVzZW50YXRpb24iPjxwYXRoIGQ9Ik0yIDNoMjAiLz48cGF0aCBkPSJNMjEgM3YxMWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlYzIi8+PHBhdGggZD0ibTcgMjEgNS01IDUgNSIvPjwvc3ZnPg=="
      />
    ),

    href: "#",
  },
};

// const FooterSection = ({ title, links }: FooterSectionProps) => (
//   <div>
//     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
//       {title}
//     </h3>
//     <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//       {links.map((link) => (
//         <li key={link.text}>
//           <a
//             href={link.href}
//             className="hover:text-purple-600 dark:hover:text-purple-400 transition"
//           >
//             {link.text}
//           </a>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) => (
  <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <a href="/" className="cursor-pointer flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center text-white">
            <Code2 size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            SuiMoveScratch
          </span>
        </a>

        <button
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
    {isMobileMenuOpen && (
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="px-4 py-3 space-y-3">
          <a
            href="#"
            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            Home
          </a>
          <a
            href="#"
            className="block py-2 text-purple-600 dark:text-purple-400 font-medium"
          >
            NoCodeMove
          </a>
          <a
            href="#"
            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            PackageViewer1
          </a>
          <a
            href="#"
            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            PackageViewer2
          </a>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-3">
            <button className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center">
              <Download size={18} className="mr-2" />
              Export Code
            </button>
            <button className="px-4 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    )}
  </header>
);

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection = ({ isVisible }: HeroSectionProps) => (
  <section className="relative overflow-hidden bg-white dark:bg-gray-800">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-700 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-700 rounded-full filter blur-3xl"></div>
    </div>
    <div
      className={`container mx-auto px-4 py-16 relative z-10 transition-all duration-1000 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-6 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
          Web3 No-Code Development Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Build{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 whitespace-nowrap">
            Move Smart Contracts
          </span>{" "}
          Without Coding
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          SuiMoveScratch empowers developers to create, test, and deploy Move
          smart contracts with an intuitive visual interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/nocodemove"
            className="px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
          >
            Start Building
          </Link>
          <a
            href="https://github.com/BlockBlockYonsei/SuiMoveScratch"
            target="_blank"
            className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {socialLinks.git.icon}
            View on GitHub
          </a>
        </div>
        <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <feature.icon className="h-5 w-5 text-green-500" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

interface CTASectionProps {
  isVisible: boolean;
}

const CTASection = ({ isVisible }: CTASectionProps) => (
  <section className="bg-gradient-to-b from-purple-600 to-blue-700 py-16 text-white">
    <div className="container mx-auto px-4 text-center">
      <div
        className={`max-w-3xl mx-auto transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Build the Future of Web3?
        </h2>
        <p className="text-lg text-purple-100 mb-8">
          Join thousands of developers creating innovative applications on the
          Sui blockchain with SuiMoveScratch.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* <button className="px-8 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Get Started
          </button> */}
          <Link
            to="/nocodemove"
            className="px-8 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Building
          </Link>
          {/* <button className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
            Register for Hackathon
          </button> */}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {/* {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-purple-200">{stat.label}</div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center text-white">
              <Code2 size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              SuiMoveScratch
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Building the future of Web3 development through intuitive no-code
            tools.
          </p>
          <div className="flex space-x-4">
            {Object.entries(socialLinks).map(([service, info]) => (
              <a
                key={service}
                href={info.href}
                target="_blank"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {/* <link.icon className="h-6 w-6" /> */}
                {info.icon}
              </a>
            ))}
          </div>
        </div>
        {/* <FooterSection title="Product" links={footerLinks.product} />
        <FooterSection title="Resources" links={footerLinks.resources} /> */}
        {/* <FooterSection title="Company" links={footerLinks.company} /> */}
      </div>
      {/* <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
          © 2023 SuiMoveScratch. All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-300">
          <a
            href="#"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            Cookie Policy
          </a>
        </div>
      </div> */}
    </div>
  </footer>
);

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-500">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <HeroSection isVisible={isVisible} />
      <CTASection isVisible={isVisible} />
      <Footer />
    </div>
  );
}
