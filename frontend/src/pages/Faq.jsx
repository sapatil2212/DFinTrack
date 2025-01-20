import React from "react";
import Cta from "../components/CallToAction";
const FAQ = () => {
  const faqs = [
    {
      question: "What is the Expense and Revenue Tracker?",
      answer:
        "The Expense and Revenue Tracker is a comprehensive financial management solution that helps individuals and businesses monitor their expenses, track revenue, generate detailed reports, and gain insights into their financial performance in real time.",
    },
    {
      question: "Is the Expense and Revenue Tracker suitable for personal use?",
      answer:
        "Yes! Our solution is designed for both businesses and individuals. Whether you need to manage personal expenses, household budgets, or business finances, the tracker provides the tools to help you stay organized and in control.",
    },
    {
      question: "Is my financial data secure?",
      answer:
        "Absolutely. We prioritize your data security by using advanced encryption and secure servers. Additionally, our Permanent Security Key (PSK) provides an extra layer of protection, ensuring that your data is safe from unauthorized access.",
    },
    {
      question: "Can I access my data from multiple devices?",
      answer:
        "Yes, the Expense and Revenue Tracker is cloud-based, allowing you to access your account and financial data from any device with an internet connection, including desktops, tablets, and smartphones.",
    },
    {
      question: "Can I generate financial reports?",
      answer:
        "Yes, you can generate detailed reports on a monthly, quarterly, or yearly basis. These reports provide insights into your expenses, revenue, and profit margins, helping you analyze your financial performance and make informed decisions.",
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto font-poppins">
      <div className="grid md:grid-cols-5 gap-10 pt-[4rem]">
        {/* FAQ Title */}
        <div className="md:col-span-2 pt-[4rem]">
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
              Frequently
              <br />
              asked questions
            </h2>
            <p className="mt-1 hidden md:block text-gray-600">
              Answers to the most frequently asked questions.
            </p>
          </div>
        </div>
        {/* FAQ List */}
        <div className="md:col-span-3">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div className="py-6" key={index}>
                <button
                  className="group inline-flex items-center justify-between w-full text-left md:text-lg font-semibold text-gray-800 transition hover:text-gray-500 focus:outline-none"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`faq-answer-${index}`)
                      .classList.toggle("hidden")
                  }
                >
                  {faq.question}
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`mt-2 text-gray-600 ${
                    index !== 0 ? "hidden" : ""
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Cta />
      </div>
    </div>
  );
};

export default FAQ;
