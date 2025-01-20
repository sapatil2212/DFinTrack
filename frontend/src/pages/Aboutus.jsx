import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white font-['Poppins']">
      <div className="relative isolate px-6 pt-[4rem] pb-[4rem] lg:px-8">
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
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Grid */}
          <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center mt-10 ">
            <div className="lg:col-span-3">
              <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl ">
                About Us
              </h1>
              <p className="mt-3 text-lg text-gray-800 ">
                The ultimate solution for managing your finances with ease,
                precision, and confidence. Whether you're a small business
                owner, a freelancer, or an individual looking to take control of
                your financial health, we are here to help you track your
                expenses and revenue effortlessly, and make smarter financial
                decisions.
                <span>
                  {" "}
                  our mission is simple: to empower individuals and businesses
                  to understand, manage, and optimize their finances. We believe
                  that a clear and organized view of your financial data is
                  essential for making informed decisions, maximizing
                  profitability, and achieving financial goals.
                </span>
              </p>
            </div>
            {/* End Col */}

            <div className="lg:col-span-4 mt-10 lg:mt-0">
              <img
                className="w-full rounded-xl"
                src="https://images.unsplash.com/photo-1665686376173-ada7a0031a85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&h=700&q=80"
                alt="About Us Image"
              />
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
