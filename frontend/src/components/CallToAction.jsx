import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "../assets/dashboard.png";
const CallToAction = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-12 sm:rounded-3xl sm:px-16 md:pt-16 lg:flex lg:gap-x-16 lg:px-20 lg:pt-0">
          {/* Gradient Background SVG */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 size-[48rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle
              cx="512"
              cy="512"
              r="512"
              fill="url(#gradient-background)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="gradient-background">
                <stop stopColor="#7775D6" />
                <stop offset="1" stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>

          {/* Content Section */}
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Still Have Questions?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Let’s Clear Them Up! Contact Us Today!
            </p>

            {/* Call to Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                to="/contactus"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-md hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get Started <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative mt-8 h-64 lg:mt-0">
            <img
              src={Dashboard}
              alt="Digital Strategy Visualization"
              className="absolute left-0 top-0 w-[50rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
