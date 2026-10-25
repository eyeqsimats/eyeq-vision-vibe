import { useState, useEffect } from "react";
import { Link, Element } from "react-scroll";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, Instagram, Linkedin, Phone } from "lucide-react";
import RotatingText from "@/components/RotatingText";
import StarBorder from "@/components/StarBorder";
import ScrollReveal from "@/components/ScrollReveal";
import BannerModal from "@/components/BannerModal";
import MagicBento from "@/components/MagicBento";
import Magnet from "@/components/Magnet";
import ClickSpark from "@/components/ClickSpark";
import { LiquidButton } from "@/components/ui/liquid-button";
import { ProjectParallax } from "@/components/ProjectParallax";
import { Spotlight } from "@/components/ui/spotlight";
import { LoaderOne } from "@/components/ui/loader";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { SparklesCore } from "@/components/ui/sparkles";
import GoogleGeminiEffectSection from "@/components/GoogleGeminiEffectSection";
import { cn } from "@/lib/utils";
import eyeqLogo from "@/assets/eyeq-logo.png";
import presidentImg from "@/assets/team/president.jpg";
import vicePresidentImg from "@/assets/team/vice-president.jpg";
import secretaryImg from "@/assets/team/secretary.jpg";
import treasurerImg from "@/assets/team/treasurer.jpg";
import Navbar from "@/components/Navbar";
import { motion, Variants } from "framer-motion";
import TeamMember from "@/components/TeamMember";
import { AnimatedSection } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Fixed path
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Fixed path
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AnimatedBeam } from "@/components/ui/animated-beam";

interface ModalContent {
  title: string;
  description: string;
}

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    description: "",
  });
  const [showContent, setShowContent] = useState(false);

  const { user } = useAuth();

  // Show loader for 2 seconds, then show content
  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(loaderTimer);
  }, []);

  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Files for Marquee animation
  const files = [
    {
      name: "Project Showcase",
      body: "Real-world computer vision projects built by our members.",
    },
    {
      name: "Learning Resources",
      body: "Curated tutorials, documentation, and research papers.",
    },
    {
      name: "Community Events",
      body: "Hackathons, workshops, and collaborative coding sessions.",
    },
    {
      name: "Mentorship Program",
      body: "One-on-one guidance from experienced developers.",
    },
    {
      name: "Portfolio Building",
      body: "Create impressive projects for your career.",
    },
  ];

  // Features for BentoGrid
  const bentoFeatures = [
    {
      Icon: FileTextIcon,
      name: "Project-Based Learning",
      description: "Learn by building real computer vision projects with hands-on experience.",
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Project-Based Learning",
        "At EyeQ, we believe in learning by doing. Our project-based approach allows you to build real-world computer vision applications from day one. You'll work on projects like object detection systems, facial recognition software, and autonomous vehicle simulations. Each project is carefully designed to teach you both theoretical concepts and practical implementation skills. By the end of your journey with us, you'll have a portfolio of impressive projects to showcase to potential employers or for your academic requirements."
      ),
      className: "col-span-3 md:col-span-1", // Full width on mobile, 1/3 on desktop
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-6 [--duration:20s]"
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className="relative w-36 cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-neutral-900/90 p-3.5 shadow-lg transition-all duration-300 hover:border-primary/50 hover:scale-105"
            >
              <div className="flex flex-row items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                <figcaption className="text-sm font-semibold text-white truncate">
                  {f.name}
                </figcaption>
              </div>
              <blockquote className="mt-1.5 text-xs text-neutral-300 leading-snug">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Community Events",
      description: "Join hackathons, workshops, and collaborative coding sessions.",
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Community Events",
        "Our community events are designed to foster collaboration and learning in a fun environment. Participate in our weekly coding sessions where you can work on projects with peers, attend monthly hackathons with exciting challenges, and join our guest lectures featuring industry experts. We also host project showcase events where members present their work and receive feedback. These events not only enhance your technical skills but also help you build valuable connections in the computer vision field."
      ),
      className: "col-span-3 md:col-span-2", // Full width on mobile, 2/3 on desktop
      background: (
        <div className="absolute top-4 right-4 left-4 md:left-auto md:w-[480px] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Community Rhythm & Events</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">Weekly • Monthly</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-neutral-900/90 border border-white/10 p-2.5 rounded-xl shadow-md hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Weekly</span>
                <span className="text-[10px] text-neutral-400 font-medium">Sat 6 PM</span>
              </div>
              <h4 className="font-semibold text-white text-xs truncate">Vibe Coding Session</h4>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">Hands-on peer coding</p>
            </div>

            <div className="bg-neutral-900/90 border border-white/10 p-2.5 rounded-xl shadow-md hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Demo Day</span>
                <span className="text-[10px] text-neutral-400 font-medium">Monthly</span>
              </div>
              <h4 className="font-semibold text-white text-xs truncate">Project Showcase</h4>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">Present to peers & mentors</p>
            </div>

            <div className="bg-neutral-900/90 border border-white/10 p-2.5 rounded-xl shadow-md hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Talk</span>
                <span className="text-[10px] text-neutral-400 font-medium">Guest AMA</span>
              </div>
              <h4 className="font-semibold text-white text-xs truncate">Expert Masterclass</h4>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">Industry CV engineers</p>
            </div>

            <div className="bg-neutral-900/90 border border-white/10 p-2.5 rounded-xl shadow-md hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Upcoming</span>
                <span className="text-[10px] text-neutral-400 font-medium">36h Sprint</span>
              </div>
              <h4 className="font-semibold text-white text-xs truncate">Vision Hackathon</h4>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">Build models & win awards</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      Icon: Share2Icon,
      name: "Collaborative Network",
      description: "Connect with peers and mentors in our vibrant community.",
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Collaborative Network",
        "EyeQ provides a vibrant collaborative network where you can connect with like-minded peers and experienced mentors. Our community includes students from various backgrounds, industry professionals, and academic experts. Through our mentorship program, you'll be paired with senior members or industry professionals who can guide you through your learning journey. Collaborate on projects, share knowledge, and participate in peer code reviews. Our Discord server and regular meetups ensure you're always connected with the community, making learning a social and collaborative experience."
      ),
      className: "col-span-3 md:col-span-2", // Full width on mobile, 2/3 on desktop
      background: (
        <div className="absolute top-4 right-4 h-[240px] w-[calc(100%-2rem)] md:w-[420px] transition-all duration-300 ease-out">
          <AnimatedBeam className="w-full h-full">
            <div className="flex justify-between items-center h-full px-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(132,0,255,0.4)]">
                You
              </div>
              <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center text-white font-semibold shadow-md">
                Mentor
              </div>
              <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center text-neutral-200 font-semibold shadow-md">
                Peer 1
              </div>
              <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center text-neutral-300 font-semibold shadow-md">
                Peer 2
              </div>
            </div>
          </AnimatedBeam>
        </div>
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Learning Path",
      description: "Structured curriculum from basics to advanced computer vision.",
      className: "col-span-3 md:col-span-1", // Full width on mobile, 1/3 on desktop
      href: "",
      cta: "Learn more",
      onCTAClick: () => openModal(
        "Structured Learning Path",
        "Our structured learning path takes you from foundational concepts to advanced computer vision techniques. We start with basics like image processing and gradually progress to complex topics such as deep learning for computer vision, neural networks, and cutting-edge research areas. Each module includes theoretical learning, hands-on coding exercises, and project implementation. Our curriculum is regularly updated to reflect the latest industry trends and research developments. Whether you're a complete beginner or looking to advance your skills, our learning path provides a clear roadmap to achieve your goals in computer vision."
      ),
      background: (
        <div className="absolute top-6 right-6 transition-all duration-300 ease-out">
          <div className="rounded-xl border border-white/10 bg-neutral-900/90 p-4 shadow-xl w-32 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Today</div>
            <div className="text-4xl font-extrabold text-white mb-1">{new Date().getDate()}</div>
            <div className="text-xs font-medium text-neutral-400">
              {new Date().toLocaleString('default', { month: 'long' })}
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-neutral-300 font-medium">CV Track Active</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const teamMembers = [
    {
      name: "Aswath S",
      role: "President",
      quote:
        "My vision is to shape this club into a creative space where innovation meets collaboration... where every member learns, grows, and contributes to the ever-evolving world of AI and technology.",
      imageUrl: presidentImg,
      linkedinUrl: "https://www.linkedin.com/in/aswath-s-a37475336/",
    },
    {
      name: "Sasvanthu G",
      role: "Vice President",
      quote:
        "Leading with passion and purpose, I strive to create an environment where every idea is valued and every member feels empowered to push boundaries.",
      imageUrl: vicePresidentImg,
      linkedinUrl: "http://www.linkedin.com/in/sasvanthu-g",
    },
    {
      name: "Sudharsan R",
      role: "Secretary",
      quote:
        "Organization meets inspiration. My goal is to ensure our community runs smoothly while fostering meaningful connections and collaborative learning.",
      imageUrl: secretaryImg,
      linkedinUrl: "https://www.linkedin.com/company/eyeq-simats/",
      imageClassName: "object-[center_20%]",
    },
    {
      name: "Dhanushya R B",
      role: "Treasurer",
      quote:
        "Dedicated to managing our resources with transparency and strategic foresight, empowering the club to reach new heights and achieve its full potential.",
      imageUrl: treasurerImg,
      linkedinUrl: "https://www.linkedin.com/company/eyeq-simats/",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // This creates the stagger effect
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  return (
    <>
      {showLoader ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoaderOne />
        </div>
      ) : (
        <ClickSpark
          sparkColor='#8400ff'
          sparkSize={10}
          sparkRadius={20}
          sparkCount={8}
          duration={500}
        >
          {/* This is your main content wrapper */}
          <motion.div
            className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative"
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation Bar */}
            <Navbar />

            {/* Old Background Image - REMOVED
            <div
              className="fixed inset-0 z-0 opacity-5 bg-center bg-no-repeat bg-cover parallax"
              style={{ backgroundImage: 'url(/bg-logo.png)' }}
            />
            */}

            {/* Hero Section */}
            <Element name="home">
              <section id="home" className="relative h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
                {/* Spotlight Effect */}
                <Spotlight
                  className="-top-40 left-0 md:-top-20 md:left-60"
                  fill="white"
                />

                <div className="text-center relative z-20">
                  <ScrollReveal animation="fade" delay={100} duration={900}>
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <h1 className="text-6xl md:text-8xl font-bold text-foreground">
                        EyeQ
                      </h1>
                      <RotatingText
                        texts={["See", "Code", "Create"]}
                        mainClassName="px-3 sm:px-4 md:px-6 bg-primary text-primary-foreground overflow-hidden py-2 sm:py-2 md:py-3 justify-center rounded-lg text-5xl md:text-7xl font-bold"
                        staggerFrom="last"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-1 md:pb-2"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={1500}
                      />
                    </div>
                  </ScrollReveal>

                  <ScrollReveal animation="slide-up" delay={300} duration={900}>
                    <div className="relative w-fit mx-auto overflow-hidden">
                      {/* Sparkles Background */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Gradients */}
                        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-[2px] w-3/4 blur-sm" />
                        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
                        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-[5px] w-1/4 blur-sm" />
                        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px w-1/4" />

                        {/* Core Sparkles */}
                        <SparklesCore
                          background="transparent"
                          minSize={0.4}
                          maxSize={1}
                          particleDensity={1200}
                          className="w-full h-full"
                          particleColor="#a958f5"
                        />

                        {/* Radial Gradient */}
                        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                      </div>

                      {/* TypewriterEffectSmooth */}
                      <div className="relative z-10 animate-[pulseOpenClose_4.5s_ease-in-out_infinite]">
                        <TypewriterEffectSmooth
                          words={[
                            {
                              text: "Riding",
                            },
                            {
                              text: "the",
                            },
                            {
                              text: "Vibe",
                            },
                            {
                              text: "Wave",
                            },
                            {
                              text: "in",
                            },
                            {
                              text: "Computer",
                              className: "text-[#a958f5]",
                            },
                            {
                              text: "Vision!",
                              className: "text-[#a958f5]",
                            },
                          ]}
                          className="text-2xl md:text-3xl font-medium text-white mt-6"
                        />
                      </div>
                    </div>
                  </ScrollReveal>

                </div>
              </section>
            </Element>

            {/* Our Purpose Section */}
            {showContent && (
              <>
                <Element name="about">
                  <section id="about" className="relative py-12 md:py-16 px-4 z-10">
                    <div className="max-w-7xl mx-auto relative">
                      <ScrollReveal animation="fade" duration={800}>
                        <div className="text-center">
                          {/* Logo */}
                          <div className="flex justify-center mb-8">
                            <div className="relative">
                              <ScrollReveal animation="scale" duration={1000} delay={200}>
                                <img
                                  src={eyeqLogo}
                                  alt="EyeQ Club Logo"
                                  className="w-56 h-56 md:w-64 md:h-64 object-contain hover:scale-105 transition-all duration-500 mx-auto hover-lift"
                                />
                              </ScrollReveal>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="max-w-4xl mx-auto">
                            {/* Heading with Gradient Underline */}
                            <div className="mb-6">
                              <h2 className="text-4xl md:text-5xl font-bold mb-3 text-primary leading-tight">
                                Empowering Visionaries in Computer Vision
                              </h2>
                              <ScrollReveal animation="scale" delay={800} duration={600}>
                                <div className="h-1 w-28 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto"></div>
                              </ScrollReveal>
                            </div>

                            {/* Mission Statement */}
                            <ScrollReveal animation="slide-up" delay={300} duration={900}>
                              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 md:mb-10 max-w-3xl mx-auto">
                                EyeQ bridges the gap between learning and innovation through{" "}
                                <span className="text-primary font-semibold">real-world projects</span>,{" "}
                                <span className="text-primary font-semibold">mentorship</span>, and{" "}
                                <span className="text-primary font-semibold">community</span>.
                              </p>
                            </ScrollReveal>

                            {/* Animated Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto">
                              <AnimatedSection delay={100}>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-1">
                                    <CountUp
                                      from={0}
                                      to={50}
                                      separator=","
                                      direction="up"
                                      duration={2}
                                      suffix="+"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">Active Members</div>
                                </div>
                              </AnimatedSection>
                              <AnimatedSection delay={300}>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-1">
                                    <CountUp
                                      from={0}
                                      to={150}
                                      separator=","
                                      direction="up"
                                      duration={2}
                                      suffix="+"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">Real-World Projects</div>
                                </div>
                              </AnimatedSection>
                              <AnimatedSection delay={500}>
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-primary mb-1">
                                    <CountUp
                                      from={0}
                                      to={10}
                                      separator=","
                                      direction="up"
                                      duration={2}
                                      suffix="+"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">Expert Mentors</div>
                                </div>
                              </AnimatedSection>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>
                  </section>
                </Element>

                {/* What Makes EyeQ Different */}
                <Element name="features">
                  <section className="relative py-12 md:py-16 px-4 z-10">
                    <div className="max-w-6xl mx-auto">
                      <ScrollReveal animation="fade" duration={800}>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 text-center text-primary">
                          What Makes EyeQ Different?
                        </h2>
                      </ScrollReveal>

                      <div>
                        <BentoGrid>
                          {bentoFeatures.map((feature, idx) => (
                            <BentoCard key={idx} {...feature} />
                          ))}
                        </BentoGrid>
                      </div>
                    </div>
                  </section>
                </Element>

                {/* Project Parallax */}
                <section className="relative py-6 md:py-10 z-10 overflow-hidden">
                  <ProjectParallax />
                </section>

                {/* Student Benefits */}
                <section className="relative py-12 md:py-16 px-4 z-10">
                  <div className="max-w-6xl mx-auto">
                    <ScrollReveal>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 text-center text-primary">
                        Student Benefits
                      </h2>
                    </ScrollReveal>

                    <Carousel
                      opts={{
                        slidesToScroll: 1,
                        loop: true,
                      }}
                      className="w-full max-w-5xl mx-auto"
                    >
                      <CarouselContent>
                        {[
                          {
                            title: "Start from Zero, Grow Together",
                            description: "Safe, beginner-friendly peer learning environment",
                          },
                          {
                            title: "Vibe Coding Sessions",
                            description: "Chill, fun coding with a community focus",
                          },
                          {
                            title: "Idea to Innovations",
                            description: "Guiding curiosity into real projects",
                          },
                          {
                            title: "Mini-Projects & Hackathons",
                            description: "Quick skill-building through small challenges",
                          },
                          {
                            title: "Building Portfolio",
                            description: "Create projects that showcase your skills",
                          },
                          {
                            title: "24/7 Community Support",
                            description: "Always-on support from mentors and peers",
                          },
                        ].map((benefit, index) => (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <ScrollReveal animation="scale" delay={index * 50} duration={600}>
                              <div className="p-1">
                                <MagicBento
                                  textAutoHide={true}
                                  enableStars={true}
                                  enableSpotlight={true}
                                  enableBorderGlow={true}
                                  enableTilt={true}
                                  enableMagnetism={true}
                                  clickEffect={true}
                                  spotlightRadius={300}
                                  particleCount={12}
                                  glowColor="132, 0, 255"
                                  className="w-full h-[200px] bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20 hover:shadow-2xl"
                                >
                                  <div className="w-full h-full flex flex-col justify-center items-center text-center p-6">
                                    <h3 className="text-lg font-bold mb-3 text-primary leading-tight">
                                      {benefit.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {benefit.description}
                                    </p>
                                  </div>
                                </MagicBento>
                              </div>
                            </ScrollReveal>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex" />
                      <CarouselNext className="hidden md:flex" />
                    </Carousel>
                  </div>
                </section>

                {/* Meet the Core Team */}
                <section className="relative pt-12 md:pt-16 pb-6 md:pb-8 px-4 z-10">
                  <div className="max-w-6xl mx-auto">
                    <ScrollReveal animation="fade" duration={800}>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 text-center text-primary">
                        Meet the Core Team
                      </h2>
                    </ScrollReveal>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                      {teamMembers.map((member, index) => (
                        <ScrollReveal key={index} delay={index * 100} animation="slide-up" duration={800}>
                          <TeamMember
                            name={member.name}
                            role={member.role}
                            imageUrl={member.imageUrl}
                            linkedinUrl={member.linkedinUrl}
                            imageClassName={member.imageClassName}
                          />
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Team Member Quotes */}
                <section className="relative pt-6 md:pt-8 pb-12 md:pb-16 px-4 z-10 bg-muted">
                  <div className="max-w-6xl mx-auto">
                    <motion.div
                      className="grid grid-cols-1 gap-6 md:gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      {teamMembers.map((member, index) => (
                        <ScrollReveal key={index} animation="slide-up" delay={index * 150} duration={700}>
                          <motion.div variants={itemVariants} className="bg-card border border-border rounded-lg shadow-lg p-6 md:p-8 hover:border-primary/50 hover:shadow-primary/20 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                              <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-xl font-semibold text-primary mb-1 md:mb-2">
                                  {member.name}
                                </h3>
                                <p className="text-muted-foreground text-sm font-medium mb-3 md:mb-4">
                                  {member.role}
                                </p>

                                {/* Member Quote */}
                                <p className="text-sm text-muted-foreground italic leading-relaxed">
                                  "{member.quote}"
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      ))}
                    </motion.div>
                  </div>
                </section>

                {/* Google Gemini Effect Section */}
                <GoogleGeminiEffectSection />

                {/* Footer */}
                <Element name="contact">
                  <footer id="contact" className="relative py-12 md:py-16 px-4 border-t border-border z-10">
                    <div className="max-w-6xl mx-auto">
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Column 1: Logo & Slogan */}
                        <ScrollReveal animation="fade" duration={800}>
                          <div className="flex flex-col items-center md:items-start">
                            <img
                              src={eyeqLogo}
                              alt="EyeQ Club Logo"
                              className="w-24 h-24 object-contain mb-4"
                            />
                            <p className="text-primary font-bold text-lg">See. Code. Create.</p>
                          </div>
                        </ScrollReveal>

                        {/* Column 2: Address */}
                        <ScrollReveal animation="slide-up" duration={800} delay={200}>
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-primary">Address</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              Saveetha Institute of Medical and Technical Sciences
                              <br />
                              Saveetha Nagar, Thandalam
                              <br />
                              Chennai - 602 105
                            </p>
                          </div>
                        </ScrollReveal>

                        {/* Column 3: Contact */}
                        <ScrollReveal animation="slide-up" duration={800} delay={400}>
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-primary">Get in Touch</h3>
                            <div className="space-y-2 text-muted-foreground mb-6">
                              <p className="font-semibold text-foreground">Aswath S</p>
                              <p>+91 70949 25601</p>
                              <p>eyeq.simats@gmail.com</p>
                            </div>
                            <div className="flex gap-4">
                              <motion.a
                                href="https://www.instagram.com/eyeq.simats/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                whileHover={{ scale: 1.1, y: -3, color: "hsl(var(--primary))" }}
                                className="text-muted-foreground"
                              >
                                <Instagram size={28} />
                              </motion.a>
                              <motion.a
                                href="https://www.linkedin.com/company/eyeq-simats/eyeqclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                whileHover={{ scale: 1.1, y: -3, color: "hsl(var(--primary))" }}
                                className="text-muted-foreground"
                              >
                                <Linkedin size={28} />
                              </motion.a>
                              <motion.a
                                href="https://wa.me/917094925601"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                whileHover={{ scale: 1.1, y: -3, color: "hsl(var(--primary))" }}
                                className="text-muted-foreground"
                              >
                                <Phone size={28} />
                              </motion.a>
                            </div>
                          </div>
                        </ScrollReveal>
                      </div>

                      <ScrollReveal animation="fade" duration={800} delay={600}>
                        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
                          <p>© 2025 EyeQ Club. All rights reserved.</p>
                        </div>
                      </ScrollReveal>
                    </div>
                  </footer>
                </Element>
                <BannerModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title={modalContent.title}
                  description={modalContent.description}
                />
              </>
            )}
          </motion.div>
        </ClickSpark>
      )}
    </>
  );
};

export default Index;