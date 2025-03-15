"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from "@emailjs/browser";
import {
  ArrowRight,
  ArrowLeft,
  Code,
  Leaf,
  BarChart3,
  Palette,
  TrendingUp,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Marquee } from "@/components/ui/marquee";

// Project type definition
type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  deploymentUrl: string;
  technologies: string[];
};

// Team member type definition
type TeamMember = {
  id: number;
  name: string;
  title: string;
  image: string;
  bio: string;
};

// Service Card component
const ServiceCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="relative overflow-hidden rounded-xl group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border border-gray-100 h-full">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-[100px] transform translate-x-10 -translate-y-10 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"></div>
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-tr-[70px] transform -translate-x-8 translate-y-8 group-hover:-translate-x-4 group-hover:translate-y-4 transition-transform duration-500"></div>

    <div className="p-8 flex flex-col items-start z-10 relative h-full">
      {/* Icon with enhanced styling */}
      <div className="mb-6 w-16 h-16 bg-gradient-to-br from-accent/10 to-primary/5 text-accent rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-accent/20">
        <div className="transform group-hover:rotate-[-10deg] transition-transform duration-300">
          {icon}
        </div>
      </div>

      {/* Title with enhanced styling */}
      <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
        {title}
      </h3>

      {/* Description with improved readability */}
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>

    {/* Bottom border animation */}
    <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-accent to-accent/70 group-hover:w-full transition-all duration-500 rounded-br-xl rounded-bl-xl"></div>
  </div>
);

// Process Card component
const ProcessCard = ({
  number,
  title,
  description,
  image,
}: {
  number: string;
  title: string;
  description: string;
  image: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="relative mb-6">
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        width={280}
        height={200}
        className="mx-auto"
      />
    </div>
    <div className="flex flex-col items-center text-center">
      <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4">
        {number}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
        {title}
      </h3>
      <p className="text-gray-600 max-w-sm">{description}</p>
    </div>
  </div>
);

// Project Card component
const ProjectCard = ({
  title,
  category,
  image,
  onClick,
}: {
  title: string;
  category: string;
  image: string;
  onClick: () => void;
}) => (
  <Card
    className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 group"
    onClick={onClick}
  >
    <Image
      src={image || "/placeholder.svg"}
      alt={title}
      width={800}
      height={600}
      className="rounded-md mb-4"
    />
    <h3 className="text-lg md:text-xl font-semibold text-primary mb-1 group-hover:text-primary/90 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-600 group-hover:text-accent transition-colors">
      {category}
    </p>
  </Card>
);

// Project Detail Modal component
const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Always use hooks at the top level
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Return null if modal should not be shown
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-100 pointer-events-auto transition-all duration-500">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal container with animation */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] relative z-10 flex flex-col translate-y-0 scale-100 transition-all duration-500">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-md z-20 hover:scale-110 transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-primary" />
        </button>

        {/* Project image with overlay gradient - Fixed header */}
        <div className="relative w-full h-72 md:h-96 flex-shrink-0">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          {/* Project title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="inline-block px-3 py-1 bg-accent/90 text-primary rounded-full text-sm font-medium mb-3">
              {project.category}
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          {/* Project description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Project Overview
            </h3>
            <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project details in grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-accent/10 text-gray-800 rounded-full text-sm transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project details */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">
                Project Details
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="text-accent mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Optimized for minimal energy consumption
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="text-accent mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Reduced carbon footprint
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="text-accent mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Efficient code practices
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={project.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent/80 text-primary font-medium px-6 py-3 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              View Live Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Testimonial Card component
const TestimonialCard = ({
  quote,
  name,
  title,
  image,
}: {
  quote: string;
  name: string;
  title: string;
  image: string;
}) => (
  <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <div className="flex items-center space-x-4">
      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent/20">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="text-lg font-medium text-primary">{name}</h4>
        <p className="text-sm text-accent">{title}</p>
      </div>
    </div>
  </Card>
);

// Team Card component
const TeamCard = ({
  name,
  title,
  image,
  bio,
}: {
  name: string;
  title: string;
  image: string;
  bio: string;
}) => (
  <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100 group">
    <div className="relative w-full h-48 md:h-56 mb-4 rounded-md overflow-hidden">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <h3 className="text-lg md:text-xl font-semibold text-primary mb-1">
      {name}
    </h3>
    <p className="text-sm text-accent mb-2">{title}</p>
    <p className="text-gray-600 text-sm">{bio}</p>
  </Card>
);

// CountUp component for animated statistics
const CountUp = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Set up intersection observer to detect when element is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation effect that runs when the element becomes visible
  useEffect(() => {
    if (!isVisible) return;

    // Reset when animation starts
    countRef.current = 0;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const progressPercent = Math.min(progress / duration, 1);

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progressPercent);

      countRef.current = Math.floor(easedProgress * end);
      setCount(countRef.current);

      if (progressPercent < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at the exact target
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
};

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [teamIndex, setTeamIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const [hasScrolled, setHasScrolled] = useState(false);

  // References to sections for smooth scrolling
  const homeRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Mock projects data
  const projects: Project[] = [
    {
      id: 1,
      title: "Eco-Friendly E-commerce Platform",
      category: "Web Development",
      description:
        "A sustainable e-commerce platform built with Next.js and optimized for minimal energy consumption. The site uses efficient code practices, lazy loading, and optimized images to reduce server load and carbon footprint.",
      image: "/placeholder.svg?height=600&width=800",
      deploymentUrl: "https://eco-commerce.example.com",
      technologies: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    },
    {
      id: 2,
      title: "Green Energy Dashboard",
      category: "Data Visualization",
      description:
        "An interactive dashboard for monitoring renewable energy usage across different regions. Features real-time data visualization and predictive analytics to help businesses track and optimize their energy consumption.",
      image: "/placeholder.svg?height=600&width=800",
      deploymentUrl: "https://energy-dashboard.example.com",
      technologies: ["React", "D3.js", "Node.js", "MongoDB"],
    },
    {
      id: 3,
      title: "Sustainable Travel App",
      category: "Mobile App",
      description:
        "A mobile application that helps users find eco-friendly travel options and calculate their carbon footprint. The app provides suggestions for reducing environmental impact while traveling.",
      image: "/placeholder.svg?height=600&width=800",
      deploymentUrl: "https://travel-green.example.com",
      technologies: ["React Native", "Firebase", "Google Maps API"],
    },
    {
      id: 4,
      title: "Carbon Footprint Calculator",
      category: "Web Application",
      description:
        "An intuitive web application that allows businesses to calculate and track their carbon emissions. Includes detailed reporting features and suggestions for reducing environmental impact.",
      image: "/placeholder.svg?height=600&width=800",
      deploymentUrl: "https://carbon-calc.example.com",
      technologies: ["Vue.js", "Express", "PostgreSQL", "Chart.js"],
    },
    {
      id: 5,
      title: "Smart Waste Management System",
      category: "IoT Solution",
      description:
        "An IoT-based solution for optimizing waste collection and recycling processes. The system uses sensors to monitor waste levels and optimize collection routes for maximum efficiency.",
      image: "/placeholder.svg?height=600&width=800",
      deploymentUrl: "https://smart-waste.example.com",
      technologies: ["IoT", "Python", "TensorFlow", "AWS"],
    },
    {
      id: 6,
      title: "Green Office Analytics Platform",
      category: "Business Intelligence",
      description:
        "A comprehensive platform that helps businesses analyze and reduce their environmental impact in office settings. Features include energy usage tracking, paper consumption analytics, and sustainability recommendations.",
      image: "/placeholder.svg?height=600&width=800",
      deploymentUrl: "https://green-office.example.com",
      technologies: ["Angular", "Django", "PostgreSQL", "Docker"],
    },
  ];

  // Mock team members data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alexander Cameron",
      title: "CEO & Founder",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Alex founded Evergreen with a vision to combine cutting-edge technology with environmental sustainability. With 15+ years in the tech industry, he leads our mission to create a greener digital future.",
    },
    {
      id: 2,
      name: "Sophia Rodriguez",
      title: "Creative Director",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Sophia oversees all creative aspects of our projects, ensuring they're not only visually appealing but also optimized for minimal environmental impact. Her background in sustainable design makes her a perfect fit for our mission.",
    },
    {
      id: 3,
      name: "David Chen",
      title: "Lead Developer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "David specializes in efficient coding practices that reduce computational load and energy consumption. He leads our development team in creating streamlined, sustainable digital solutions.",
    },
    {
      id: 4,
      name: "Maya Patel",
      title: "Sustainability Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Maya ensures all our projects and operations adhere to the highest sustainability standards. She constantly researches new ways to reduce our carbon footprint and educates clients on sustainable practices.",
    },
    {
      id: 5,
      name: "Jackson Williams",
      title: "Technical Architect",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Jackson designs the technical infrastructure for our projects, focusing on efficiency and sustainability. His innovative approaches have helped numerous clients reduce their digital carbon footprint.",
    },
    {
      id: 6,
      name: "Olivia Kim",
      title: "UX Research Lead",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Olivia conducts user research to ensure our solutions are not only eco-friendly but also highly usable. She specializes in creating intuitive interfaces that encourage sustainable user behaviors.",
    },
    {
      id: 7,
      name: "Marcus Johnson",
      title: "Project Manager",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Marcus oversees project execution, ensuring they're delivered on time and according to our sustainability standards. His background in environmental science adds valuable perspective to our technical teams.",
    },
  ];

  // Services data
  const services = [
    {
      id: 1,
      icon: <TrendingUp className="h-6 w-6" />,
      title: "IT Management",
      description:
        "Optimize your IT infrastructure with eco-friendly solutions that reduce costs and environmental impact.",
    },
    {
      id: 2,
      icon: <Code className="h-6 w-6" />,
      title: "Web Development",
      description:
        "Energy-efficient websites and applications built with sustainable coding practices and green hosting.",
    },
    {
      id: 3,
      icon: <Palette className="h-6 w-6" />,
      title: "UI/UX Design",
      description:
        "Beautiful, intuitive interfaces designed with sustainability in mind, optimized for minimal resource usage.",
    },
    {
      id: 4,
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Digital Marketing",
      description:
        "Digital marketing strategies that maximize impact while minimizing carbon footprint and resource consumption.",
    },
    {
      id: 5,
      icon: <Leaf className="h-6 w-6" />,
      title: "Sustainable Consulting",
      description:
        "Expert guidance on implementing eco-friendly practices across your organization's digital infrastructure.",
    },
    {
      id: 6,
      icon: <ArrowRight className="h-6 w-6" />,
      title: "Green Hosting",
      description:
        "Environmentally responsible hosting solutions powered by renewable energy sources.",
    },
  ];

  // Get visible team members based on current index (show 4 on desktop, 2 on mobile)
  const visibleTeamMembers = () => {
    const itemsPerView = isMobile ? 2 : 4;
    return teamMembers.slice(teamIndex, teamIndex + itemsPerView);
  };

  // Handle team carousel navigation
  const handlePrevTeam = () => {
    setTeamIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextTeam = () => {
    const itemsPerView = isMobile ? 2 : 4;
    setTeamIndex((prev) =>
      Math.min(teamMembers.length - itemsPerView, prev + 1)
    );
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await emailjs.send(
        "service_qt51mld",
        "template_qfq07qd",
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          message: data.message,
          to_email: "mahfouzteyib57@gmail.com",
        },
        "B5A8OqaqMTvxWvrue"
      );

      // Clear the form first
      reset({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Show success toast
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Check scroll position immediately on mount and add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setHasScrolled(window.scrollY > 10);

      // Determine active section
      const scrollPosition = window.scrollY + 100;
      const sections = [
        { id: "home", ref: homeRef },
        { id: "services", ref: servicesRef },
        { id: "process", ref: processRef },
        { id: "projects", ref: projectsRef },
        { id: "testimonials", ref: testimonialsRef },
        { id: "team", ref: teamRef },
        { id: "contact", ref: contactRef },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (
          section.ref.current &&
          section.ref.current.offsetTop <= scrollPosition
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    // Check scroll position immediately
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle project click
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
    // Add a class to prevent scrolling when modal is open
    document.body.classList.add("overflow-hidden");
  };

  // Close project modal
  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    // Remove the class to allow scrolling again
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          hasScrolled ? "bg-primary shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4">
          <button
            onClick={() => scrollToSection(homeRef)}
            className="flex items-center space-x-3 group"
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src="/logo.png"
                alt="Evergreen Logo"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-white">
              Evergreen
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", ref: homeRef },
              { name: "Services", ref: servicesRef },
              { name: "Process", ref: processRef },
              { name: "Projects", ref: projectsRef },
              { name: "Team", ref: teamRef },
              { name: "Contact", ref: contactRef },
            ].map((item) => (
              <button
                key={item.name}
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.name.toLowerCase()
                    ? "text-accent"
                    : "text-white/80 hover:text-white"
                }`}
                onClick={() => scrollToSection(item.ref)}
              >
                {item.name}
                {activeSection === item.name.toLowerCase() && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-primary border-l border-white/10 p-0"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-8 h-8">
                        <Image
                          src="/logo.png"
                          alt="Evergreen Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-lg font-bold text-white">
                        Evergreen
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {[
                      { name: "Home", ref: homeRef },
                      { name: "Services", ref: servicesRef },
                      { name: "Process", ref: processRef },
                      { name: "Projects", ref: projectsRef },
                      { name: "Team", ref: teamRef },
                      { name: "Contact", ref: contactRef },
                    ].map((item) => (
                      <button
                        key={item.name}
                        className={`relative px-4 py-3 text-left text-lg font-medium transition-colors ${
                          activeSection === item.name.toLowerCase()
                            ? "text-accent bg-white/5"
                            : "text-white/80 hover:bg-white/5"
                        }`}
                        onClick={() => scrollToSection(item.ref)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                  <div className="mt-auto pt-8">
                    <Button
                      className="w-full bg-accent hover:bg-accent/80 text-primary font-medium py-6 text-lg transition-colors rounded-md"
                      onClick={() => {
                        scrollToSection(contactRef);
                        setIsOpen(false);
                      }}
                    >
                      Get in Touch
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Button
            className="hidden md:flex bg-accent hover:bg-accent/80 text-primary font-medium px-6 py-2.5 text-base transition-colors rounded-md"
            onClick={() => scrollToSection(contactRef)}
          >
            Get in Touch
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={homeRef}
          className="relative bg-primary min-h-screen flex items-center"
        >
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(9,184,128,0.2),transparent_60%)]" />
          <div className="container relative mx-auto px-4 py-20 md:py-32 text-center">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-6 md:mb-8 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                Sustainable tech solutions for a{" "}
                <span className="text-accent">greener</span> future
              </h1>
              <p className="mb-8 md:mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
                We combine innovation with sustainability to deliver
                cutting-edge technology solutions that help your business grow
                while reducing environmental impact.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/80 text-primary font-medium px-8 py-3 text-base md:text-lg rounded-md transition-all duration-300 shadow-lg hover:shadow-accent/30 hover:-translate-y-1"
                  onClick={() => scrollToSection(contactRef)}
                >
                  Work With Us
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white border-0 text-primary hover:bg-white/90 px-8 py-3 text-base md:text-lg rounded-md transition-all duration-300 shadow-lg hover:shadow-white/30 hover:-translate-y-1 group"
                  onClick={() => scrollToSection(servicesRef)}
                >
                  View Services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 md:py-28 bg-white">
          <div className="container px-4">
            <div className="text-center mb-14">
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                OUR SERVICES
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Our services to help your business grow
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide cutting-edge solutions tailored to your business
                needs, helping you achieve sustainable growth and success.
              </p>
            </div>

            {/* Services Grid - With improved spacing and layout */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section ref={processRef} className="py-16 md:py-28 bg-gray-50">
          <div className="container px-4">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                OUR PROCESS
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-6">
                Our working process on
                <br />
                how to grow your business
              </h2>
            </div>

            <div className="grid gap-8 md:gap-12 md:grid-cols-3">
              {/* Process Step 1 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Image
                    src="/illustration1.svg?text=Planning&width=280&height=200"
                    alt="Initiation & Planning"
                    width={220}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  01
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
                    Initiation & Planning
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    We are architects innovation trailblazers of technological
                    advancement
                  </p>
                </div>
              </div>

              {/* Process Step 2 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Image
                    src="/illustration2.svg?text=Planning&width=280&height=200"
                    alt="Execution & Development"
                    width={240}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  02
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
                    Execution & Development
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    We are architects innovation trailblazers of technological
                    advancement
                  </p>
                </div>
              </div>

              {/* Process Step 3 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Image
                    src="/illustration3.svg?text=Planning&width=280&height=200"
                    alt="Testing & Maintenance"
                    width={240}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  03
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
                    Testing & Maintenance
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    We are architects innovation trailblazers of technological
                    advancement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={projectsRef} className="py-16 md:py-24 bg-white">
          <div className="container px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                OUR PROJECTS
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
                Sustainable solutions we've built
              </h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
            </div>

            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  category={project.category}
                  image={project.image}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section ref={testimonialsRef} className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                OUR PARTNERS
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
                Trusted by leading companies
              </h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
            </div>

            <div className="relative">
              <Marquee
                className="py-8 [--duration:40s] [--gap:2rem]"
                pauseOnHover={true}
              >
                {[1, 2, 3, 4, 5, 6, 8].map((index) => (
                  <div key={index} className="mx-8">
                    <div className="relative w-[180px] h-[80px] grayscale hover:grayscale-0 transition-all duration-300">
                      <Image
                        src={`/partners/partner${index}.png`}
                        alt={`Partner ${index}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Team Section with Marquee */}
        <section
          ref={teamRef}
          className="py-16 md:py-24 bg-primary overflow-hidden"
        >
          <div className="container px-4">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                OUR TEAM
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Meet our eco-tech experts
              </h2>
              <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
            </div>

            <div className="relative">
              <Marquee
                className="py-4 [--duration:60s] [--gap:2rem]"
                pauseOnHover={true}
              >
                {teamMembers.map((member) => (
                  <div key={member.id} className="relative group mx-4">
                    <div className="relative w-[280px] bg-white rounded-2xl p-4">
                      {/* Social Media Icon */}
                      <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href="#"
                          className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-300 group/icon"
                        >
                          <Linkedin className="w-5 h-5 text-gray-600 group-hover/icon:text-primary" />
                        </a>
                      </div>

                      {/* Profile Image */}
                      <div className="relative w-full h-[320px] mb-4 rounded-xl overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold text-primary mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {member.title}
                      </p>
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Left Column - Heading and Text */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-6">
                  Let's build an awesome
                  <br />
                  project together
                </h2>
                <p className="text-gray-600 mb-8 text-base md:text-lg max-w-md">
                  Each project built with Evergreen will be customized to your
                  needs. We focus on sustainability and efficiency in everything
                  we create.
                </p>

                {/* Contact Info */}
                <div className="space-y-8 mt-12">
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="bg-accent/20 p-2 rounded-md text-accent mr-3">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary">
                        Address
                      </h3>
                    </div>
                    <p className="text-gray-600 ml-10">
                      1791 Yorkshire Circle Kitty Hawk, NC 279499
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center mb-3">
                      <div className="bg-accent/20 p-2 rounded-md text-accent mr-3">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary">
                        Contact
                      </h3>
                    </div>
                    <div className="text-gray-600 ml-10">
                      <p>info@evergreen-tech.com</p>
                      <p>518-564-3200</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-3">
                      <div className="bg-accent/20 p-2 rounded-md text-accent mr-3">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary">
                        Office Hours
                      </h3>
                    </div>
                    <p className="text-gray-600 ml-10">
                      Mon - Sat: 8:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 border border-gray-100">
                <h3 className="text-2xl font-semibold text-primary mb-6">
                  Fill The Contact Form
                </h3>
                <p className="text-gray-600 mb-8">
                  Feel free to contact with us, we don't spam your email
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        {...register("name")}
                        placeholder="Your name"
                        className={`w-full border-gray-200 focus:border-accent focus:ring-accent h-12 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register("phone")}
                        type="tel"
                        placeholder="Phone number (optional)"
                        className="w-full border-gray-200 focus:border-accent focus:ring-accent h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email address"
                      className={`w-full border-gray-200 focus:border-accent focus:ring-accent h-12 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      {...register("message")}
                      placeholder="Write your message"
                      className={`w-full min-h-[150px] border-gray-200 focus:border-accent focus:ring-accent ${
                        errors.message ? "border-red-500" : ""
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/80 text-primary font-medium py-3 text-base transition-colors h-12 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
      />

      {/* Footer Section */}
      <footer className="bg-primary text-white pt-16 pb-8">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo.png"
                    alt="Evergreen Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">
                    Evergreen
                  </span>
                  <span className="text-xs text-accent">Technologies</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                We combine innovation with sustainability to deliver
                cutting-edge technology solutions that help your business grow
                while reducing environmental impact.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection(homeRef)}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(servicesRef)}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(projectsRef)}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(teamRef)}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Our Team
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">
                Services
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Sustainable IT Management
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Green Web Development
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Eco-Conscious Design
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Sustainable Marketing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    Carbon Footprint Analysis
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="text-accent mr-3 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    2774 Oak Drive, Plattsburgh, New York
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="text-accent mr-3 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">info@evergreen-tech.com</span>
                </li>
                <li className="flex items-start">
                  <div className="text-accent mr-3 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">518-564-3200</span>
                </li>
                <li className="flex items-start">
                  <div className="text-accent mr-3 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Mon - Sat: 8:00 AM - 10:00 PM
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 my-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Evergreen Technologies. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-accent text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-2 rounded-full bg-accent text-primary hover:bg-accent/80 transition-colors shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
