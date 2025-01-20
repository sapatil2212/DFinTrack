import React from "react";
import { FcPrivacy } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/signup");
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="flex justify-center text-8xl">
          <FcPrivacy />
        </div>

        {/* Title */}
        <div className="mt-5 max-w-xl text-center mx-auto">
          <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl">
            Your privacy is our responsibility
          </h1>
        </div>
        {/* End Title */}

        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-lg text-gray-600">
            We believe that trust is paramount in a relationship. We do not own
            or sell your data, and we most certainly do not bank on
            advertising-based business models.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 gap-3 flex justify-center">
          <button
            onClick={handleRedirect} // Call the handleRedirect function here
            className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600 border border-transparent text-white text-sm font-medium rounded-full py-3 px-4"
            href="#"
          >
            Get Started Now
          </button>
        </div>
        {/* End Buttons */}
      </div>
    </div>
  );
};

export default Privacy;
