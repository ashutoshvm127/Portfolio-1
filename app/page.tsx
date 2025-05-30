"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Download,
  Eye,
  Code,
  Palette,
  Smartphone,
  Award,
  MapPin,
  Phone,
  Send,
  Menu,
  X,
  ExternalLink,
  Star,
  ArrowRight,
  ChevronDown,
  Briefcase,
  Users,
  Lightbulb,
} from "lucide-react"
import { submitContactForm } from "./actions"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setIsSuccess(false)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setIsSuccess(true)
        toast({
          title: "Message sent successfully!",
          description: result.message,
        })
        // Reset form
        event.currentTarget.reset()
      } else {
        if (result.errors) {
          setErrors(result.errors)
        }
        toast({
          title: "Error sending message",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
        <p className="text-gray-400 mb-6">Thank you for reaching out. I'll get back to you within 24 hours.</p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-600"
        >
          Send Another Message
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Input
            name="firstName"
            placeholder="First Name"
            required
            className={`bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 transition-all duration-300 ${
              errors.firstName ? "border-red-500 focus:border-red-500" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <motion.p
              className="text-red-400 text-sm mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.firstName}
            </motion.p>
          )}
        </div>
        <div>
          <Input
            name="lastName"
            placeholder="Last Name"
            required
            className={`bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 transition-all duration-300 ${
              errors.lastName ? "border-red-500 focus:border-red-500" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <motion.p
              className="text-red-400 text-sm mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.lastName}
            </motion.p>
          )}
        </div>
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className={`bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 transition-all duration-300 ${
            errors.email ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <motion.p
            className="text-red-400 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.email}
          </motion.p>
        )}
      </div>
      <div>
        <Input
          name="subject"
          placeholder="Subject"
          required
          className={`bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 transition-all duration-300 ${
            errors.subject ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <motion.p
            className="text-red-400 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.subject}
          </motion.p>
        )}
      </div>
      <div>
        <Textarea
          name="message"
          placeholder="Your Message"
          required
          rows={5}
          className={`bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-500 resize-none transition-all duration-300 ${
            errors.message ? "border-red-500 focus:border-red-500" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <motion.p
            className="text-red-400 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.message}
          </motion.p>
        )}
      </div>
      <motion.div whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }}>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </motion.div>
    </form>
  )
}

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const { toast } = useToast()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 700 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" },
  ]

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and MongoDB",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "/placeholder.svg?height=200&width=300",
      github: "#",
      live: "#",
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      tech: ["Next.js", "Socket.io", "PostgreSQL", "Tailwind"],
      image: "/placeholder.svg?height=200&width=300",
      github: "#",
      live: "#",
    },
    {
      title: "Weather Dashboard",
      description: "A responsive weather dashboard with location-based forecasts",
      tech: ["Vue.js", "OpenWeather API", "Chart.js"],
      image: "/placeholder.svg?height=200&width=300",
      github: "#",
      live: "#",
    },
  ]

  const certifications = [
    {
      title: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2024",
      icon: <Award className="w-6 h-6" />,
      image: "/certificates/aws-cert.png",
      pdf: "/certificates/aws-cert.pdf",
    },
    {
      title: "React Developer Certification",
      issuer: "Meta",
      date: "2023",
      icon: <Code className="w-6 h-6" />,
      image: "/certificates/react-cert.png",
      pdf: "/certificates/react-cert.pdf",
    },
    {
      title: "Google UX Design Certificate",
      issuer: "Google",
      date: "2023",
      icon: <Palette className="w-6 h-6" />,
      image: "/certificates/ux-cert.png",
      pdf: "/certificates/ux-cert.pdf",
    },
    // Additional certificates will be hidden initially
    {
      title: "Advanced JavaScript",
      issuer: "Udemy",
      date: "2023",
      icon: <Code className="w-6 h-6" />,
      image: "/certificates/js-cert.png",
      pdf: "/certificates/js-cert.pdf",
    },
    {
      title: "Python Data Science",
      issuer: "DataCamp",
      date: "2023",
      icon: <Code className="w-6 h-6" />,
      image: "/certificates/python-cert.png",
      pdf: "/certificates/python-cert.pdf",
    },
    {
      title: "UI/UX Foundation",
      issuer: "Coursera",
      date: "2023",
      icon: <Palette className="w-6 h-6" />,
      image: "/certificates/uiux-cert.png",
      pdf: "/certificates/uiux-cert.pdf",
    },
    {
      title: "Cloud Architecture",
      issuer: "Microsoft",
      date: "2023",
      icon: <Award className="w-6 h-6" />,
      image: "/certificates/cloud-cert.png",
      pdf: "/certificates/cloud-cert.pdf",
    },
    {
      title: "Docker Mastery",
      issuer: "Udemy",
      date: "2023",
      icon: <Code className="w-6 h-6" />,
      image: "/certificates/docker-cert.png",
      pdf: "/certificates/docker-cert.pdf",
    },
    {
      title: "Data Analysis with Python",
      issuer: "Coursera",
      date: "2023",
      icon: <Code className="w-6 h-6" />,
      image: "/certificates/data-analysis-cert.png",
      pdf: "/certificates/data-analysis-cert.pdf",
    },
    {
      title: "Machine Learning A-Z",
      issuer: "Udemy",
      date: "2023",
      icon: <Lightbulb className="w-6 h-6" />,
      image: "/certificates/machine-learning-cert.png",
      pdf: "/certificates/machine-learning-cert.pdf",
    },
  ]

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Node.js",
    "Python",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Git",
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPos = window.scrollY + 100

      sections.forEach((section) => {
        const element = section as HTMLElement
        if (scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
          setActiveSection(element.id)
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [mouseX, mouseY])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-800/20 to-gray-700/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-700/20 to-gray-600/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 50 }).map((_, i) => {
          const left = seededRandom(i) * 100;
          const top = seededRandom(i + 50) * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gray-400/30 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + seededRandom(i + 100) * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: seededRandom(i + 150) * 2,
              }}
            />
          );
        })}

        {/* Mouse Follower */}
        <motion.div
          className="absolute w-6 h-6 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-full filter blur-xl pointer-events-none"
          style={{
            x: mouseXSpring,
            y: mouseYSpring,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Amitha Aji
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-gray-300 hover:text-white transition-all duration-300 relative ${
                  activeSection === section.id ? "text-white" : ""
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400 to-white"
                    layoutId="activeSection"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block text-gray-300 hover:text-white transition-colors w-full text-left py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    {section.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {/* Status Badge */}
                <motion.div
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm rounded-full border border-gray-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full mr-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <span className="text-sm text-green-300 font-medium">Available for new opportunities</span>
                </motion.div>

                {/* Main Heading with Typing Effect */}
                <div className="space-y-6">
                  <motion.h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    Hello, I'm{" "}
                    <motion.span
                      className="bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent"
                      animate={{
                        backgroundPositionX: ["0%", "100%", "0%"]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        backgroundSize: "200% auto"
                      }}
                    >
                      Amitha Aji
                    </motion.span>
                  </motion.h1>

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <motion.p className="text-2xl sm:text-3xl text-gray-300 font-light" whileHover={{ scale: 1.02 }}>
                      Full Stack Developer & UI/UX Designer
                    </motion.p>
                    <motion.p
                      className="text-lg text-gray-400 leading-relaxed max-w-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      Passionate about creating exceptional digital experiences that combine beautiful design with
                      powerful functionality. I transform ideas into reality through code and creativity.
                    </motion.p>
                  </motion.div>
                </div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                >
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <Button
                      onClick={() => scrollToSection("projects")}
                      className="relative bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg border border-gray-600"
                      size="lg"
                    >
                      View My Work
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => scrollToSection("contact")}
                      className="relative bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg border border-gray-600"
                      size="lg"
                    >
                      Let's Connect
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="flex space-x-6 pt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  {[
                    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-300" },
                    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400" },
                    { icon: Mail, href: "mailto:amitha@example.com", label: "Email", color: "hover:text-red-400" },
                    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className={`p-4 rounded-xl bg-black/50 backdrop-blur-sm border border-gray-700/50 text-gray-400 ${social.color} transition-all duration-300 group`}
                      whileHover={{ scale: 1.1, y: -5, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.7 + index * 0.1 }}
                    >
                      <social.icon size={24} />
                      <span className="sr-only">{social.label}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - 3D Card */}
              <motion.div
                className="relative flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ rotateY: 10, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ perspective: 1000 }}
                >
                  {/* Main Card */}
                  <motion.div
                    className="w-80 h-96 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Profile Section */}
                    <div className="p-6 relative z-10">
                      <motion.div
                        className="w-full h-40 bg-gradient-to-br from-gray-800/20 to-gray-700/20 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden border border-gray-700"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-gray-800/10 to-gray-700/10"
                          animate={{
                            background: [
                              "linear-gradient(45deg, rgba(75, 85, 99, 0.1), rgba(55, 65, 81, 0.1))",
                              "linear-gradient(45deg, rgba(55, 65, 81, 0.1), rgba(31, 41, 55, 0.1))",
                              "linear-gradient(45deg, rgba(31, 41, 55, 0.1), rgba(75, 85, 99, 0.1))",
                            ]
                          }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        />
                        <img
                          src="/placeholder.svg?height=200&width=200"
                          alt="Amitha Aji"
                          className="w-28 h-28 rounded-full object-cover border-4 border-white/20 relative z-10"
                        />
                      </motion.div>

                      {/* Card Content */}
                      <div className="text-center space-y-4 relative z-20">
                        <motion.h3
                          className="text-xl font-bold text-white drop-shadow-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          Amitha Aji
                        </motion.h3>
                        <motion.p
                          className="text-gray-300 text-sm drop-shadow-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          Full Stack Developer
                        </motion.p>

                        {/* Animated Stats */}
                        <motion.div
                          className="grid grid-cols-3 gap-3 pt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 }}
                        >
                          {[
                            { value: "50+", label: "Projects" },
                            { value: "3+", label: "Years" },
                            { value: "100%", label: "Success" },
                          ].map((stat, index) => (
                            <motion.div
                              key={stat.label}
                              className="text-center"
                              whileHover={{ scale: 1.1 }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.6 + index * 0.1, type: "spring", stiffness: 200 }}
                            >
                              <motion.div
                                className="text-lg font-bold text-white"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                              >
                                {stat.value}
                              </motion.div>
                              <div className="text-xs text-gray-400">{stat.label}</div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Tech Icons */}
                  {[
                    { icon: Code, position: "top-4 right-4", delay: 0 },
                    { icon: Palette, position: "bottom-4 left-4", delay: 0.5 },
                    { icon: Smartphone, position: "top-1/2 left-8", delay: 1 },
                    { icon: Briefcase, position: "bottom-8 right-8", delay: 1.5 },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${item.position} w-12 h-12 bg-gradient-to-r from-gray-800/20 to-gray-700/20 backdrop-blur-sm rounded-xl border border-gray-600/50 flex items-center justify-center text-white`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                      }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{
                        delay: 2 + item.delay,
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        opacity: { delay: 2 + item.delay, duration: 0.3 },
                        scale: { type: "spring", stiffness: 200 }
                      }}
                    >
                      <item.icon className="w-6 h-6" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom Section - Animated Skills */}

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
            >
              <motion.div
                className="flex flex-col items-center text-gray-400 cursor-pointer"
                onClick={() => scrollToSection("about")}
                whileHover={{ scale: 1.1 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="text-sm mb-2">Scroll to explore</span>
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              whileInView={{ scale: [0.9, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              About Me
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-gray-400 to-white mx-auto mb-4"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-center -mt-4">
            {/* Photo Section - Moved up closer to heading */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-gray-700"
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-black to-gray-900">
                    <img
                      src="/placeholder.svg?height=320&width=320"
                      alt="Amitha Aji"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-gray-700/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Floating Elements */}
                {[
                  { icon: Code, position: "-top-4 -right-4", color: "from-gray-600 to-gray-800" },
                  { icon: Palette, position: "-bottom-4 -left-4", color: "from-gray-700 to-gray-900" },
                  { icon: Lightbulb, position: "top-1/2 -left-8", color: "from-gray-500 to-gray-700" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position} w-8 h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 180, 360],
                      transition: {
                        duration: 4 + index,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-xl text-gray-400 max-w-3xl mx-auto text-left mb-12">
                Passionate about creating innovative solutions and exceptional user experiences through modern
                technology.
              </p>
              <motion.p
                className="text-gray-300 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                With over 3 years of experience in web development, I specialize in creating responsive, user-friendly
                applications using modern technologies. My journey started with a curiosity about how websites work, and
                it has evolved into a passion for crafting digital experiences that make a difference.
              </motion.p>
              <motion.p
                className="text-gray-300 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                or sharing my knowledge through blog posts and community events.
              </motion.p>

              {/* Animated Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 py-8 border-t border-b border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {[
                  { number: "50+", label: "Projects Completed", icon: Briefcase },
                  { number: "3+", label: "Years Experience", icon: Award },
                  { number: "100%", label: "Client Satisfaction", icon: Users },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-r from-gray-800/20 to-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-gray-700/30 group-hover:to-gray-600/30 transition-all duration-300 border border-gray-700"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-6 h-6 text-gray-400" />
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-white"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Resume Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-600"
                    onClick={() => window.open("/resume.pdf", "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-600"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = "/resume.pdf"
                      link.download = "Amitha_Aji_Resume.pdf"
                      link.click()
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Skills Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Code, title: "Frontend", desc: "React, Vue, Angular", color: "from-gray-600 to-gray-800" },
              {
                icon: Smartphone,
                title: "Backend",
                desc: "Node.js, Python, PHP",
                color: "from-gray-700 to-gray-900",
              },
              { icon: Palette, title: "Design", desc: "Figma, Adobe XD", color: "from-gray-500 to-gray-700" },
              { icon: Award, title: "DevOps", desc: "AWS, Docker, CI/CD", color: "from-gray-800 to-black" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50 hover:bg-black/70 transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-white font-semibold mb-2 relative z-10">{item.title}</h3>
                <p className="text-gray-400 text-sm relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Skills Tags */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">Skills & Technologies</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-gray-300 border-gray-700 hover:bg-gradient-to-r hover:from-gray-800/20 hover:to-gray-700/20 hover:border-gray-600/30 transition-all duration-300 px-4 py-2"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Projects</h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-gray-400 to-white mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work demonstrating technical expertise and creative problem-solving.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border-gray-700 hover:bg-black/70 transition-all duration-300 group relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/5 to-gray-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />

                  <div className="relative overflow-hidden">
                    <motion.img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    <motion.div
                      className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button size="sm" variant="secondary" className="bg-black/80 hover:bg-gray-800" asChild>
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button size="sm" variant="secondary" className="bg-black/80 hover:bg-gray-800" asChild>
                          <a href={project.live} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white group-hover:text-gray-300 transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Badge
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-gray-500/50 hover:text-gray-200 transition-all duration-300"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Certifications & Achievements</h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-gray-400 to-white mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Continuous learning and professional development through industry-recognized certifications.
            </p>
          </motion.div>

          {/* Certifications Grid */}
          <AnimatePresence>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  <Card className="bg-black/50 backdrop-blur-sm border-gray-700 text-center hover:bg-black/70 transition-all duration-300 group relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />

                    {/* Add Image Preview */}
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={cert.image || "/placeholder.svg"}
                        alt={cert.title}
                        width={400}
                        height={160}
                        className="object-cover w-full h-full"
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    <CardHeader className="relative z-10">
                      <motion.div
                        className="mx-auto -mt-8 mb-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full w-fit group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-300 border border-gray-700"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {cert.icon}
                      </motion.div>
                      <CardTitle className="text-white group-hover:text-yellow-300 transition-colors duration-300">
                        {cert.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {cert.issuer} • {cert.date}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            </motion.div>
                          ))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(cert.pdf, '_blank')}
                          className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg text-white hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 border border-gray-700"
                        >
                          <Download className="w-4 h-4 inline-block mr-2" />
                          View Certificate
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-gray-400 to-white mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to collaborate? Let's discuss your next project and bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <motion.div
              className="space-y-6 md:space-y-8 order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Let's Connect</h3>
                <p className="text-gray-400 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                  Whether you have a project in mind, want to collaborate, or just want to say hello, I'd love to hear
                  from you. Let's create something amazing together.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "amithaaji24@gmail.com", href: "mailto:amithaaji24@gmail.com" },
                  { icon: Phone, label: "Phone", value: "+91 9074675477", href: "tel:+91 9074675477" },
                  { icon: MapPin, label: "Location", value: "Kuruppumpady, Kerala", href: "#" },
                ].map((contact, index) => (
                  <motion.a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-center space-x-3 md:space-x-4 text-gray-400 hover:text-white transition-colors group"
                    whileHover={{ x: 5, scale: 1.02 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="p-2.5 md:p-3 bg-gradient-to-r from-black/50 to-gray-800/50 rounded-lg group-hover:from-gray-800/20 group-hover:to-gray-700/20 transition-all duration-300 flex-shrink-0 border border-gray-700"
                      whileHover={{ rotate: 5 }}
                    >
                      <contact.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.div>
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm md:text-base">{contact.label}</p>
                      <p className="text-xs md:text-sm truncate">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-6 md:pt-8">
                <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Follow Me</h4>
                <div className="flex space-x-3 md:space-x-4">
                  {[
                    { icon: Github, href: "#", label: "GitHub", color: "hover:from-gray-600 hover:to-gray-500" },
                    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:from-blue-600 hover:to-blue-500" },
                    {
                      icon: Instagram,
                      href: "#",
                      label: "Instagram",
                      color: "hover:from-pink-600 hover:to-purple-500",
                    },
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className={`p-2.5 md:p-3 bg-gradient-to-r from-black/50 to-gray-800/50 rounded-lg text-gray-400 hover:text-white ${social.color} transition-all duration-300 border border-gray-700`}
                      whileHover={{ scale: 1.1, y: -2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="sr-only">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-black/50 backdrop-blur-sm border-gray-700 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gray-800/5 to-gray-700/5 opacity-0 hover:opacity-100 transition-opacity duration-300"
                />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="text-white text-lg md:text-xl">Send a Message</CardTitle>
                  <CardDescription className="text-gray-400 text-sm md:text-base">
                    Fill out the form below and I'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ContactForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.p className="text-gray-500" whileHover={{ scale: 1.02 }}>
              © {new Date().getFullYear()} Amitha Aji. All rights reserved. 
            </motion.p>

            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
          </motion.div>
        </div>
      </footer>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-600 to-white z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-full shadow-lg z-40 border border-gray-600"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: scrollYProgress.get() > 0.2 ? 1 : 0,
          scale: scrollYProgress.get() > 0.2 ? 1 : 0,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <ChevronDown className="w-6 h-6 rotate-180" />
        </motion.div>
      </motion.button>
    </div>
  )
}
