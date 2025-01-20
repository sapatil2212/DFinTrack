import React from "react";
import {
  Globe,
  Code,
  Server,
  Layers,
  Shield,
  CloudLightning,
  Search,
  BarChart,
  Youtube,
  Target,
  PenTool,
  DatabaseZap,
  Palette,
  Film,
  Layout,
  Database,
  Monitor,
} from "lucide-react";

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
    <div className="p-5 md:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <Icon className="size-6 sm:size-8 md:size-10 lg:size-10 marker: text-blue-600 mx-auto" />
        </div>
        <h3 className="text-sm sm:text-2xl md:text-xl lg:text-xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-xs sm:text-base md:text-lg text-gray-400 ">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const Services = () => {
  const services = [
    // Digital Marketing & SEO Services
    {
      category: "Digital Marketing & SEO",
      items: [
        {
          icon: Search,
          title: "Local SEO Services",
          description:
            "Boost local online presence by optimizing website, Google My Business, and directory listings.",
        },
        {
          icon: Target,
          title: "Google Ads Management",
          description:
            "Expert-managed campaigns with comprehensive keyword research and performance tracking.",
        },
        {
          icon: Youtube,
          title: "YouTube Ads & Optimization",
          description:
            "Create engaging video ads and optimize YouTube channels for maximum visibility.",
        },
        {
          icon: PenTool,
          title: "Social Media Advertising",
          description:
            "Strategic ad campaigns across Facebook, Instagram, Twitter, and LinkedIn.",
        },
        {
          icon: Palette,
          title: "Graphic Designing",
          description:
            "Creative design solutions for branding, marketing materials, and visual communication.",
        },
        {
          icon: Film,
          title: "Video Editing",
          description:
            "Professional video editing services to create compelling and engaging content.",
        },
      ],
    },
    // Development Solutions
    {
      category: "Development Solutions",
      items: [
        {
          icon: Layout,
          title: "Static Websites",
          description:
            "Fast, lightweight websites with clean design and optimal performance.",
        },
        {
          icon: Monitor,
          title: "Dynamic Websites",
          description:
            "Interactive and feature-rich websites with advanced functionality.",
        },
        {
          icon: Code,
          title: "Web Applications",
          description:
            "Custom web applications tailored to your specific business needs and workflows.",
        },
        {
          icon: Database,
          title: "Database Solutions",
          description:
            "Comprehensive database design, management, and optimization services.",
        },
      ],
    },
    // Core Digital Services
    {
      category: "Core Digital Services",
      items: [
        {
          icon: Server,
          title: "Cloud Solutions",
          description:
            "Cloud migration, infrastructure design, and managed cloud services.",
        },
        {
          icon: Layers,
          title: "UI/UX Design",
          description:
            "User-centric design combining aesthetics with intuitive experiences.",
        },
        {
          icon: Shield,
          title: "Cybersecurity",
          description:
            "Comprehensive security audits, threat detection, and protection strategies.",
        },
        {
          icon: CloudLightning,
          title: "Digital Transformation",
          description:
            "Strategic consulting to modernize and digitalize business processes.",
        },
      ],
    },
    // Website Analysis & SEO
    {
      category: "Website Analysis & SEO",
      items: [
        {
          icon: BarChart,
          title: "Website Analysis",
          description:
            "In-depth performance insights and improvement recommendations.",
        },
        {
          icon: Search,
          title: "SEO Services",
          description:
            "Optimize for higher search rankings, increased organic traffic, and visibility.",
        },
        {
          icon: Shield,
          title: "SEO Audit Services",
          description:
            "Comprehensive audits identifying technical issues and content optimization opportunities.",
        },
        {
          icon: Globe,
          title: "Comprehensive SEO Strategy",
          description:
            "End-to-end SEO solutions to elevate your online presence and digital performance.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto font-poppins">
      <div className="max-w-2xl mx-auto text-center mb-10  pt-[4rem] ">
        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl md:leading-tight">
          Our Comprehensive Digital Services
        </h2>
        <p className="mt-3 text-gray-600">
          Innovative solutions tailored to transform your digital presence
        </p>
      </div>

      {services.map((serviceGroup, groupIndex) => (
        <div key={groupIndex} className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {serviceGroup.category}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceGroup.items.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;
