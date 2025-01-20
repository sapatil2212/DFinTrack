import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BarChart3, PieChart, TrendingUp, Shield } from "lucide-react";
import ClientsCarousel from "./ClientsCarousel";
import Privacy from "../components/Privacy";
import Dashboard from "../assets/dashboard.png";
import Psk from "../components/Psk";

const Hero = () => {
  const navigate = useNavigate();

  const loginRedirect = () => {
    navigate("/login");
    window.scrollTo(0, 0);
  };
  const signupRedirect = () => {
    navigate("/signup");
    window.scrollTo(0, 0);
  };
  return (
    <div className="bg-white font-['Poppins']">
      <div className="relative isolate px-6 pt-32 lg:px-8">
        <div
          className="absolute inset-x-0 -top-4 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-4xl lg:max-w-8xl py-30 sm:py-48 lg:py-10">
          <div className="text-center">
            <h1 className="text-balance text-3xl tracking-tight text-gray-900 sm:text-6xl">
              <span className="block font-semibold">Your Personalize</span>
              <span className="block font-bold text-indigo-600">
                Expense & Revenue Tracker
              </span>
            </h1>

            <p className="mt-5 text-lg font-sm text-gray-500 sm:text-xl">
              Track expenses, monitor income, and achieve your financial goals
              with our comprehensive personal finance management solution.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {/* Button to navigate to /login */}
              <button
                onClick={loginRedirect}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in Now
              </button>

              {/* Link to navigate to /signup */}
              <button
                onClick={signupRedirect}
                className="text-sm font-semibold text-gray-900"
              >
                Get Started <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ClientsCarousel />
        </div>

        <div className="mt-10">
          <Privacy />
        </div>
        {/* About Section */}

        <div class="bg-gradient-to-r">
          <div class="max-w-5xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
            <div class="w-full mb-10 lg:mb-14 text-center">
              <h2 class=" text-black font-semibold text-2xl md:text-4xl md:leading-tight">
                How It Works ?
              </h2>
              <p class="mt-1 text-neutral-600">
                We believe in making financial tracking easy and accessible for
                everyone. Here's how you can get started with Expense and
                Revenue Tracker for free:
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
              <div class="aspect-w-16 aspect-h-9 lg:aspect-none">
                <img
                  class="w-full object-cover rounded-xl"
                  src={Dashboard}
                  alt="Features Image"
                />
              </div>

              <div>
                <div class="mb-4">
                  <h3 class="text-[#0000FF] text-xs font-medium uppercase">
                    Steps
                  </h3>
                </div>

                <div class="flex gap-x-5 ms-1">
                  <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#0000FF] font-semibold text-xs uppercase rounded-full">
                        1
                      </span>
                    </div>
                  </div>

                  <div class="grow pt-0.5 pb-8 sm:pb-12">
                    <p class="text-sm lg:text-base text-neutral-600">
                      <span class="text-black"> Create Your Free Account </span>{" "}
                      Sign up for free and get instant access to all our core
                      features. No hidden charges – just start tracking your
                      finances right away!
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5 ms-1">
                  <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#0000FF] font-semibold text-xs uppercase rounded-full">
                        2
                      </span>
                    </div>
                  </div>

                  <div class="grow pt-0.5 pb-8 sm:pb-12">
                    <p class="text-sm lg:text-base text-neutral-600">
                      <span class="text-black">
                        Log In Anytime, Anywhere from Any Device
                      </span>{" "}
                      Once you’re signed up, log in securely whenever you need
                      to manage your expenses and revenue. Access your data
                      anytime, anywhere.
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5 ms-1">
                  <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#0000FF] font-semibold text-xs uppercase rounded-full">
                        3
                      </span>
                    </div>
                  </div>

                  <div class="grow pt-0.5 pb-8 sm:pb-12">
                    <p class="text-sm md:text-base text-neutral-600">
                      <span class="text-black">Input Your Data</span> Easily
                      enter your expenses and revenue. Categorize them and add
                      notes for easy reference, all through a simple, intuitive
                      interface.
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5 ms-1">
                  <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
                    <div class="relative z-10 size-8 flex justify-center items-center">
                      <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-[#0000FF] font-semibold text-xs uppercase rounded-full">
                        4
                      </span>
                    </div>
                  </div>

                  <div class="grow pt-0.5 pb-8 sm:pb-12">
                    <p class="text-sm md:text-base text-neutral-600">
                      <span class="text-black">Monitor and Analyze</span> Track
                      your financial progress in real-time with our
                      user-friendly dashboard. Visualize your income, expenses,
                      and trends at a glance.
                    </p>
                  </div>
                </div>
                {/* Buttons */}

                <button
                  onClick={signupRedirect} // Call the handleRedirect function here
                  className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600 border border-transparent text-white text-sm font-medium rounded-full py-3 px-4"
                  href="#"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section ends */}
        <div className="mt-10">
          <Psk />
        </div>
        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your finances
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <BarChart3
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        Expense Tracking
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Easily track your daily expenses and income with our
                        intuitive interface.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <PieChart
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        Visual Analytics
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Understand your spending patterns with detailed charts
                        and reports.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <TrendingUp
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        Financial Goals
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Set and track your financial goals with personalized
                        insights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
