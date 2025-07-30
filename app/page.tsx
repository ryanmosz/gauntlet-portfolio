"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Github, Monitor, Smartphone, Home, Code, Sparkles, X, Mail, Check, Play, Pause } from "lucide-react"
import Image from "next/image"

// Interactive background component - Universe with fluid dynamics stars
const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      color: { r: number; g: number; b: number }
      trail: Array<{ x: number; y: number; alpha: number }>
    }>
  >([])
  const planetsRef = useRef<
    Array<{
      x: number
      y: number
      orbitRadius: number
      orbitSpeed: number
      orbitAngle: number
      orbitCenter: { x: number; y: number }
      size: number
      color: { r: number; g: number; b: number }
    }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize stars (particles) across the screen
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 200; i++) {
        // Mostly white/pale stars with occasional colored ones
        const isColoredStar = Math.random() < 0.15
        const colors = isColoredStar ? [
          { r: 255, g: 200, b: 150 }, // warm white
          { r: 150, g: 180, b: 255 }, // cool blue
          { r: 255, g: 180, b: 180 }, // reddish
          { r: 200, g: 255, b: 200 }, // greenish
        ] : [
          { r: 255, g: 255, b: 255 }, // pure white
          { r: 240, g: 240, b: 255 }, // bluish white
          { r: 255, g: 250, b: 240 }, // warm white
        ]

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 200 + 100,
          maxLife: Math.random() * 200 + 100,
          size: Math.random() * 1.5 + 0.3, // Smaller star sizes
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
        })
      }
    }

    // Initialize planets
    const initPlanets = () => {
      planetsRef.current = []
      
      // Planet in top-right corner area
      planetsRef.current.push({
        x: canvas.width * 0.85,
        y: canvas.height * 0.15,
        orbitRadius: 80,
        orbitSpeed: 0.003,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitCenter: { x: canvas.width * 0.85, y: canvas.height * 0.15 },
        size: 12,
        color: { r: 100, g: 150, b: 255 }, // Earth-like blue
      })

      // Planet in bottom-left corner area
      planetsRef.current.push({
        x: canvas.width * 0.15,
        y: canvas.height * 0.85,
        orbitRadius: 100,
        orbitSpeed: -0.002,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitCenter: { x: canvas.width * 0.15, y: canvas.height * 0.85 },
        size: 8,
        color: { r: 255, g: 150, b: 100 }, // Mars-like red
      })
    }

    initParticles()
    initPlanets()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // Create space background with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 5, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current

      particlesRef.current.forEach((particle) => {
        // Calculate distance to mouse
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 300 // Increased from 200

        // Mouse influence (attraction/repulsion) - SUBTLE EFFECT
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)

          // Subtle flowing effect - particles gently flow around mouse
          const flowAngle = angle + Math.PI / 2
          particle.vx += Math.cos(flowAngle) * force * 0.02 // Reduced for subtlety
          particle.vy += Math.sin(flowAngle) * force * 0.02 // Reduced for subtlety

          // Gentle attraction for slight swirling
          particle.vx += Math.cos(angle) * force * 0.008 // Reduced for subtlety
          particle.vy += Math.sin(angle) * force * 0.008 // Reduced for subtlety

          // Soft repulsion when very close
          if (distance < 50) {
            const repulsionForce = (50 - distance) / 50
            particle.vx -= Math.cos(angle) * repulsionForce * 0.03 // Reduced for subtlety
            particle.vy -= Math.sin(angle) * repulsionForce * 0.03 // Reduced for subtlety
          }
        }

        // Add some random drift for organic movement
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01

        // Apply velocity with damping
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.96 // Increased damping for quicker settling
        particle.vy *= 0.96 // Increased damping for quicker settling

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw star with twinkling effect
        const lifeRatio = particle.life / particle.maxLife
        const twinkle = Math.sin(lifeRatio * Math.PI * 4) * 0.3 + 0.7
        const alpha = twinkle

        // Star glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3,
        )
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.3})`)
        gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`)

        ctx.globalAlpha = alpha * 0.8
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Star core
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fill()

        // Age the particle
        particle.life--
        if (particle.life <= 0) {
          // Respawn particle
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.vx = (Math.random() - 0.5) * 0.5
          particle.vy = (Math.random() - 0.5) * 0.5
          particle.life = Math.random() * 200 + 100
          particle.maxLife = particle.life
          particle.trail = []
        }
      })

      // Draw connections between nearby particles (constellation effect)
      ctx.globalAlpha = 0.05
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            const alpha = ((80 - distance) / 80) * 0.1
            ctx.globalAlpha = alpha
            ctx.strokeStyle = `rgba(200, 200, 255, ${alpha})`
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw planets
      planetsRef.current.forEach((planet) => {
        // Update planet position
        planet.orbitAngle += planet.orbitSpeed
        planet.x = planet.orbitCenter.x + Math.cos(planet.orbitAngle) * planet.orbitRadius
        planet.y = planet.orbitCenter.y + Math.sin(planet.orbitAngle) * planet.orbitRadius

        // Draw faint orbital path
        ctx.globalAlpha = 0.05
        ctx.strokeStyle = `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, 0.1)`
        ctx.lineWidth = 1
        ctx.setLineDash([5, 10])
        ctx.beginPath()
        ctx.arc(planet.orbitCenter.x, planet.orbitCenter.y, planet.orbitRadius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        // Draw planet glow
        const gradient = ctx.createRadialGradient(
          planet.x,
          planet.y,
          0,
          planet.x,
          planet.y,
          planet.size * 2
        )
        gradient.addColorStop(0, `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, 0.8)`)
        gradient.addColorStop(0.7, `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, 0.3)`)
        gradient.addColorStop(1, `rgba(${planet.color.r}, ${planet.color.g}, ${planet.color.b}, 0)`)

        ctx.globalAlpha = 0.9
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.size * 2, 0, Math.PI * 2)
        ctx.fill()

        // Draw planet body
        ctx.globalAlpha = 1
        ctx.fillStyle = `rgb(${planet.color.r}, ${planet.color.g}, ${planet.color.b})`
        ctx.beginPath()
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2)
        ctx.fill()

        // Add subtle surface detail
        ctx.globalAlpha = 0.3
        ctx.fillStyle = `rgba(${planet.color.r * 0.7}, ${planet.color.g * 0.7}, ${planet.color.b * 0.7}, 0.5)`
        ctx.beginPath()
        ctx.arc(planet.x - planet.size * 0.3, planet.y - planet.size * 0.3, planet.size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "#000005" }} />
}

// Video player component
const VideoPlayer = ({ src, title }: { src: string; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full h-48 object-cover rounded-lg"
        poster={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(title + " Demo")}`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
      >
        {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white" />}
      </button>
    </div>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("welcome")
  const [viewMode, setViewMode] = useState<"landscape" | "portrait">("landscape")
  const [modalContent, setModalContent] = useState<{ type: string; content: string; title: string } | null>(null)
  const [showContactOptions, setShowContactOptions] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  const projects = useMemo(() => [
    {
      id: "eduhub",
      title: "EduHub Admin",
      description:
        "A modern gateway that bridges OAuth2 authentication with legacy Plone CMS, enabling secure, high-performance access to educational content without disrupting existing workflows.",
      techStack: ["Python", "Plone", "React", "PostgreSQL", "Docker"],
      videoSrc: "https://www.loom.com/embed/d5f7ab35e4554f4f99650c52f84a0a23",
      githubUrl: "https://github.com/ryanmosz/eduhub",
      techDetails: `Core Technologies

Backend Framework
• Python 3.13.4 - Latest performance optimizations
• FastAPI 0.115.6 - Modern async web framework with auto-documentation
• ASGI/Uvicorn 0.32.1 - High-performance async server interface
• Pydantic 2.10.3 - Type-safe data validation and serialization

Frontend Stack
• React 19.1.0 with TypeScript 5.8.3 - Modern component-based UI
• Vite 7.0.4 - Lightning-fast build tool and dev server
• Tailwind CSS 4.0.0 - Utility-first styling framework
• React Router 7.7.1 - Client-side routing
• TanStack Query 5.83.0 - Server state management
• Lucide React 0.526.0 - Modern icon library

Authentication & Security
• Auth0 - Enterprise OAuth2/OIDC provider
• JWT with RS256 - Secure token validation with key rotation
• python-jose 3.3.0 - JWT processing and cryptographic operations
• Rate Limiting - Token bucket algorithm for API protection

Infrastructure & Caching
• Docker - Multi-service containerization (Postgres, Redis, Plone, API)
• PostgreSQL 15 - Database service (Docker container, ready for future features)
• Redis 7 - Caching and message broker (actively used)

Legacy Integration
• Plone CMS 6.0 - Existing content management system (running in Docker)
• Plone REST API - Native API for content operations
• Custom PloneClient - Async bridge between modern and legacy systems

Async & Performance
• httpx 0.28.1 - Async HTTP client with connection pooling
• asyncio - Native Python async runtime (used throughout)

Data Processing
• pandas 2.2.3 - CSV schedule import (used in schedule_importer/parser.py)
• bleach 6.1.0 - HTML sanitization for security (used in oembed module)

Real-time Features
• FastAPI WebSockets - Live alert broadcasting (not external websockets library)
• Slack SDK 3.27.0 - Team notification integration
• Redis Pub/Sub - Message distribution for scaling

Monitoring & Testing
• Prometheus Client 0.20.0 - Performance metrics and monitoring
• pytest 8.3.4 - Comprehensive testing framework (48+ test files)`,
      keyFeatures: `Performance Gateway
• Load Testing - 50 concurrent users through FastAPI → Plone
• Connection Pooling - Efficient HTTP client management with httpx.AsyncClient
• Async Performance - Comprehensive async/await implementation protecting legacy Plone from traffic spikes

OAuth2 Integration
• Single Sign-On - Auth0 → FastAPI → Plone user mapping
• Automatic User Creation - Seamless onboarding via Plone REST API
• Role Preservation - Existing Plone permissions maintained through intelligent role mapping

CSV Schedule Import
• Bulk Data Processing - Pandas-powered CSV validation and parsing
• Plone Content Creation - Direct Event object creation via REST API
• Transaction Safety - All-or-nothing imports with rollback on failure

Rich Media Embeds
• oEmbed Protocol - YouTube, Vimeo, Twitter integration
• Security - HTML sanitization and XSS prevention with bleach
• Caching - Redis-backed performance optimization with memory fallback

Open Data API
• Public Endpoints - No-auth content access with pagination
• Rate Limiting - 60 requests/minute protection per IP
• Real-time Sync - Direct Plone content queries (no data duplication)

Workflow Templates
• Template Management - Pre-configured approval workflows
• Role-based Assignment - Automatic task routing by user roles
• Integration Ready - Structured for Plone workflow engine integration

Real-time Alerts
• WebSocket Broadcasting - Instant notifications with connection management
• Multi-channel Delivery - Web and Slack integration (email configured for future)
• Production Features - Rate limiting, monitoring, and error handling`,
    },
    {
      id: "casethread",
      title: "CaseThread",
      description:
        "CaseThread is an AI-powered legal document generation system that creates professional intellectual property documents featuring multi-agent AI workflows, PDF generation, real-time preview, and vector database context retrieval.",
      techStack: ["Node.js", "TypeScript", "React", "Electron", "AI"],
      videoSrc: "",
      githubUrl: "https://github.com/ryanmosz/CaseThread",
      techDetails: `Backend Technologies
• Node.js ^20.0.0 - Runtime environment
• TypeScript ^5.7.3 - Type-safe development
• Commander.js ^13.0.0 - CLI argument parsing
• Winston 3.17.0 - Structured logging
• dotenv ^16.4.7 - Environment variable management
• js-yaml ^4.1.0 - YAML parsing for templates

Frontend Technologies
• Electron ^37.2.0 - Desktop application framework
• React ^19.1.0 - UI library
• React DOM ^19.1.0 - React rendering
• TypeScript ^5.7.3 - Type-safe frontend development
• Tailwind CSS ^3.4.17 - Utility-first CSS framework
• HeroUI React ^2.7.11 - Component library
• Vite ^7.0.3 - Build tool and dev server

Database & Storage
• ChromaDB ^3.0.6 - Vector database for document context retrieval

Infrastructure & DevOps
• Docker - Containerized development environment
• Electron Forge ^7.8.1 - Electron packaging and distribution

Authentication & Security
• Content Security Policy - Secure rendering in Electron
• IPC Security Validation - Custom security layer for inter-process communication

Third-party Services/APIs
• OpenAI API ^4.78.1 - GPT-4 integration for document generation
• LangChain Core ^0.3.62 - AI workflow orchestration
• LangGraph ^0.3.7 - Multi-agent workflow framework

Testing & Monitoring
• Jest ^29.7.0 - Testing framework
• ts-jest ^29.2.5 - TypeScript integration for Jest
• ESLint ^9.17.0 - Code linting
• Prettier ^3.4.2 - Code formatting`,
      keyFeatures: `Core Features
• 8 Legal Document Templates - Complete template system with conditional fields
• CLI Document Generation - Full CLI with generate, learn, and export commands
• Electron Desktop GUI - Modern desktop application with document browser and editing
• AI-Powered Document Generation - OpenAI GPT-4 integration with context-aware generation
• Multi-Agent AI System - LangGraph-based workflow with context builder, drafting, and overseer agents
• PDF Generation & Export - Professional PDF creation with legal formatting
• Real-time PDF Preview - Integrated PDF viewer with zoom, navigation, and export controls

Technical Achievements
• Vector Database Integration - ChromaDB for context retrieval and document similarity
• Progressive PDF Generation - Streaming PDF creation with real-time progress updates
• IPC Security Layer - Secure inter-process communication between Electron main and renderer
• Responsive Layout System - Adaptive UI that works across different screen sizes
• Window Dragging Support - Native window manipulation for better desktop UX
• Dark/Light Theme System - Complete theme switching with system preference detection

Integration Points
• Document Browser Integration - File system browsing with real-time document loading
• AI Assistant Integration - In-app document rewriting with grammar and content suggestions
• Template Validation System - Dynamic form validation with conditional field logic
• Background PDF Generation - Non-blocking PDF creation with status tracking
• Blob URL Management - Efficient memory management for PDF preview`,
    },
    {
      id: "studybara",
      title: "StudyBara",
      description:
        "StudyBara is a socially powered, collaborative study app that combines collective knowledge and group intelligence with AI-powered analysis to help students learn more effectively by sharing documents, generating study guides, and providing conversational Q&A.",
      techStack: ["React Native", "Supabase", "OpenAI", "Pinecone", "TypeScript"],
      videoSrc: "https://www.loom.com/embed/ab46a51bd4c645b291f6bd2b3d845e6d",
      githubUrl: "https://github.com/ryanmosz/Studybara",
      techDetails: `Backend Technologies
• Supabase v2.50.1 - Full backend-as-a-service (authentication, PostgreSQL database, real-time subscriptions, file storage)
• OpenAI API v4.104.0 - AI embeddings and chat completions (using o3-mini model)
• Pinecone Vector Database - Vector storage for RAG implementation (accessed via Edge Functions)

Frontend Technologies
• React Native 0.79.4 - Core mobile framework with new architecture enabled
• Expo SDK 53.0.13 - Development platform and build tools
• TypeScript 5.8.3 - Type safety and development experience
• React Navigation v7.1.14 - Native stack navigation
• GluestackUI v1.1.73 - UI component library (partially implemented)
• Expo Camera v16.1.9 - Camera functionality for photo capture
• Expo Image Picker v16.1.4 - Image selection from device
• React Native Gesture Handler v2.26.0 - Touch and gesture handling
• React Native Reanimated v3.17.4 - Performance-optimized animations

Database & Storage
• PostgreSQL - Via Supabase (profiles, groups, group_members, documents, messages tables)
• Supabase Storage - File storage with two buckets: 'media' (photos) and 'documents' (text files)
• Async Storage v2.2.0 - Local storage for app state persistence

Infrastructure & DevOps
• EAS Build - Expo Application Services for iOS builds
• Supabase Edge Functions - Serverless functions for Pinecone API proxy

Authentication & Security
• Supabase Auth - Email/password authentication with RLS (Row Level Security) policies
• JWT Tokens - Session management via Supabase

Third-party Services/APIs
• LangChain v0.3.29 - RAG (Retrieval Augmented Generation) implementation
• OpenAI Embeddings - text-embedding-ada-002 model for document vectorization
• Pinecone - Vector similarity search (1536 dimensions, cosine metric)
• LangSmith - Optional AI debugging and tracing (configured but optional)

Testing & Monitoring
• Console Logging - Comprehensive error tracking and debugging
• TypeScript Strict Mode - Static type checking`,
      keyFeatures: `Core Features
• User Authentication System - Complete email/password signup/login with Supabase Auth
• Study Group Management - Create groups, join with invite codes, group member management
• Document Upload & Management - .txt file upload to Supabase storage with automatic message generation
• Real-time Group Messaging - Photo sharing with captions, automatic document upload notifications
• Camera Integration - Full camera capture, photo preview, and upload functionality
• AI-Powered Q&A Assistant - Conversational interface using RAG to answer questions based on uploaded group documents
• Study Guide Generation - AI creates comprehensive study guides from all group documents
• Theme System - Complete day/night mode implementation with persistent storage

Technical Achievements
• RAG Implementation - Full retrieval-augmented generation using LangChain, OpenAI embeddings, and Pinecone vector search
• Document Processing Pipeline - Automatic text chunking, embedding generation, and vector storage on upload
• Real-time Features - Live message updates using Supabase real-time subscriptions
• Secure Vector Search - Pinecone API proxy via Supabase Edge Functions for secure key management
• Practice Question Generation - AI creates multiple choice, fill-in-blank, and open-ended questions from documents
• Cross-platform UI - React Native implementation optimized for iOS with proper SafeArea handling

Integration Points
• Supabase + OpenAI Integration - Documents trigger automatic RAG processing for AI features
• Camera + Storage Integration - Photo capture flows directly to Supabase storage and group messages
• LangChain + Pinecone Integration - Seamless document embedding and retrieval pipeline
• Real-time Database + UI - Live message updates with optimistic UI updates`,
    },
    {
      id: "ideaforge",
      title: "IdeaForge",
      description:
        "IdeaForge is a command-line tool that transforms project ideas into actionable plans using AI-powered MoSCoW prioritization and Kano model analysis, helping developers plan thoroughly before writing code.",
      techStack: ["Node.js", "TypeScript", "LangGraph", "OpenAI", "n8n"],
      videoSrc: "https://www.loom.com/embed/5b386e65a3424b0da72e5680505b043d",
      githubUrl: "https://github.com/ryanmosz/ideaforge",
      techDetails: `Backend Technologies
• Node.js v16.0.0+ - Core runtime environment for CLI tool
• OpenAI API v5.8.2 - AI analysis using GPT-4 and o3-mini models for MoSCoW/Kano evaluation
• LangGraph v0.3.6 - AI agent orchestration and state management for planning dialogue
• n8n - External workflow orchestration for HackerNews and Reddit API integrations

CLI Framework & Dependencies
• TypeScript v5.3.3 - Type safety with CommonJS modules and ES2022 target
• Commander.js v11.1.0 - Command-line interface framework and argument parsing
• Chalk v5.3.0 - Terminal text styling and colored output
• Ora v7.0.1 - Progress indicators and loading spinners
• Axios v1.10.0 - HTTP client for API requests and n8n webhook communication

AI & Analysis Framework
• @langchain/core v0.3.61 - Core LangChain functionality for AI workflows
• @langchain/langgraph v0.3.6 - State graph management for complex AI agent flows
• @langchain/langgraph-checkpoint v0.0.18 - State persistence across sessions
• @langchain/openai v0.5.16 - OpenAI API integration for LangChain

File Processing & Parsing
• Org-mode Parser - Custom parser for org-mode template files
• File System Operations - Local file storage for templates and results
• Data Extraction - Structured extraction of requirements, user stories, and brainstorming ideas

Development & Testing Tools
• Jest v29.7.0 - Testing framework with comprehensive test coverage
• ts-jest v29.1.1 - TypeScript support for Jest testing
• ESLint v8.54.0 - Code linting and quality enforcement
• ts-node v10.9.1 - TypeScript execution for development
• Dotenv v16.3.1 - Environment variable management

External API Integrations
• HackerNews API - Research integration via n8n workflows for technology insights
• Reddit API - Community research via n8n workflows with OAuth authentication
• Subreddit-specific Research - Targeted searches in programming, webdev, and technology subreddits`,
      keyFeatures: `Core CLI Commands
• analyze command - Full org-mode template analysis with AI-powered MoSCoW/Kano evaluation
• refine command - Iterative refinement processing with :RESPONSE: tag handling
• export command - Multi-format export (Cursor markdown, org-mode)
• visualize command - Architecture flow diagram generation
• troubleshoot command - Built-in troubleshooting guide with common solutions

AI-Powered Analysis System
• MoSCoW Categorization - Complete Must/Should/Could/Won't analysis with AI evaluation questions
• Kano Model Analysis - User satisfaction evaluation using Basic/Performance/Excitement categories
• Requirements Analysis - Structured parsing and understanding of project requirements
• Dependency Analysis - Feature relationship mapping and ordering recommendations

Document Processing Pipeline
• Org-mode Template System - Complete parser for structured org-mode input files
• Data Extraction - Automated extraction of user stories, requirements, brainstorming ideas
• Template Validation - Input validation and error handling for malformed templates
• Response Processing - :RESPONSE: tag parsing for iterative feedback loops

External Research Integration
• Technology Extraction - Automatic identification of technologies from project requirements
• HackerNews Research - Automated search and analysis of relevant developer discussions
• Reddit Research - Targeted searches across programming subreddits with quality filtering
• Research Synthesis - Integration of external findings with project context

LangGraph Agent System
• State Management - Complete project state tracking across analysis phases
• Agent Orchestration - Multi-node workflow with conditional routing
• Session Persistence - State preservation across CLI sessions
• Progress Tracking - Real-time progress updates throughout analysis pipeline

n8n Workflow Integration
• Webhook Endpoints - Production-ready webhooks for external API calls
• Rate Limiting - Built-in rate limiting for API requests to prevent throttling
• Content Filtering - Sophisticated quality scoring and content filtering for research results
• Authentication Handling - API key management and OAuth token refresh for Reddit

Export & Output System
• Multi-format Export - Support for Cursor-compatible markdown and org-mode formats
• Structured Tables - MoSCoW/Kano analysis results in organized table format
• Changelog Generation - Automatic version tracking and decision history
• Progress Feedback - Detailed progress messages with emoji indicators and time estimates`,
    },
    {
      id: "wordwise",
      title: "WordWise AI",
      description:
        "WordWise AI is an intelligent marketing copy assistant that provides real-time AI-powered suggestions to improve writing, analyzing text as users type and offering contextual improvements for grammar, vocabulary, clarity, and tone with visual feedback and interactive accept/reject functionality.",
      techStack: ["React", "TypeScript", "Supabase", "OpenAI", "TipTap"],
      videoSrc: "https://www.loom.com/embed/ee355454ff5f4677b9f611d409bd8cc2",
      githubUrl: "https://github.com/ryanmosz/wordwise-ai",
      techDetails: `Backend Technologies
• Supabase v2.50.0 - Full backend-as-a-service (authentication, PostgreSQL database, edge functions)
• OpenAI API - AI text analysis via GPT-4o-mini model (accessed through Supabase Edge Functions)
• Deno Runtime - Edge function execution environment for AI analysis

Frontend Technologies
• React v19.1.0 - Core UI framework with functional components and hooks
• TypeScript v5.8.3 - Type safety and development experience
• TipTap v2.14.0 - Rich text editor with extension system (React, StarterKit, Highlight, Underline, Placeholder)
• Vite v6.3.5 - Build tool and development server
• Tailwind CSS v4.1.10 - Utility-first CSS framework for styling
• React Router DOM v7.6.2 - Client-side routing and navigation
• Zustand v5.0.5 - Lightweight state management
• Date-fns v4.1.0 - Date formatting and manipulation

Database & Storage
• PostgreSQL - Via Supabase (users, documents tables with proper foreign key relationships)
• Supabase Auth - User authentication and session management

Infrastructure & DevOps
• Vercel v43.3.0 - Frontend deployment and hosting
• Docker - Local development environment with docker-compose
• Supabase Edge Functions - Serverless functions for AI analysis

Authentication & Security
• Supabase Auth - Email/password authentication with user session management
• JWT Tokens - Session persistence via Supabase authentication

Third-party Services/APIs
• OpenAI GPT-4o-mini - Text analysis and writing suggestions via Edge Function proxy
• Supabase Database - User data, document storage, and user settings persistence

Testing & Monitoring
• ESLint v9.25.0 - Code linting and style enforcement
• TypeScript Strict Mode - Static type checking and error prevention
• Console Logging - Comprehensive debugging and error tracking`,
      keyFeatures: `Core Features
• Rich Text Editor - Full TipTap-based editor with toolbar controls (bold, italic, underline, lists) and placeholder text
• Real-time AI Analysis - Automatic text analysis with 2-second debounce, calling OpenAI via Edge Function
• Visual Suggestion System - Color-coded underlines for different suggestion types (grammar=blue, vocabulary=purple, clarity=yellow, tone=green)
• Interactive Suggestion Cards - Hover tooltips showing suggestion details with accept/reject buttons
• Document Management - Create, edit, save, and delete documents with auto-save functionality
• User Authentication - Complete email/password signup/login system with Supabase Auth
• Auto-save System - Debounced saving with visual indicators (saving/saved/error states)
• User Settings Management - Brand tone, reading level, and banned words configuration

Technical Achievements
• AI-Powered Text Analysis - OpenAI GPT-4o-mini integration for grammar, tone, vocabulary, and clarity suggestions
• Real-time Suggestion Rendering - Custom TipTap marks for highlighting text with metadata
• Debounced API Calls - Smart request cancellation and retry logic to prevent API spam
• Optimistic UI Updates - Immediate visual feedback while API calls process in background
• State Management - Zustand stores for authentication and document state with persistence
• Responsive Design - Mobile-first Tailwind CSS implementation with proper layouts

Integration Points
• Supabase + OpenAI Integration - Secure API key management via Edge Functions with CORS handling
• TipTap + AI Integration - Custom editor extensions for suggestion visualization and interaction
• Authentication + Database Integration - User-scoped document access with RLS (Row Level Security)
• Frontend + Backend Integration - Type-safe API communication with proper error handling`,
    },
  ], [])

  // Auto-detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["welcome", ...projects.map(p => p.id)]
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [projects])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Get header height offset for better positioning
      const yOffset = -20 // Small offset from top
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      
      window.scrollTo({ 
        top: y,
        behavior: 'smooth'
      })
    }
  }

  const openModal = (type: string, content: string, title: string) => {
    // Save current scroll position
    const scrollY = window.scrollY
    
    // Lock body scroll
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    setModalContent({ type, content, title })
  }

  const closeModal = () => {
    // Get the scroll position we saved
    const scrollY = document.body.style.top
    
    // Unlock body scroll
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    
    // Restore scroll position
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
    
    setModalContent(null)
  }

  // Add Escape key listener for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalContent) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modalContent])

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Full-screen Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] mx-8 bg-gray-900/95 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {modalContent.type === 'tech' ? <Code className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                {modalContent.title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={closeModal}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {modalContent.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Right-side Navigation Menu */}
      {viewMode === "landscape" && (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Projects</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("welcome")}
                  className={`block w-full text-left px-3 py-2 rounded transition-all ${
                    activeSection === "welcome"
                      ? "text-white bg-blue-600/20 border-l-2 border-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Welcome
                </button>
              </li>
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => scrollToSection(project.id)}
                    className={`block w-full text-left px-3 py-2 rounded transition-all ${
                      activeSection === project.id
                        ? "text-white bg-blue-600/20 border-l-2 border-blue-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* View Mode Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex gap-2">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-blue-600/20 border border-blue-400 text-white"
                  onClick={() => setViewMode("landscape")}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400"
                  onClick={() => setViewMode("portrait")}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Floating Menu Button for Portrait Mode */}
      {viewMode === "portrait" && (
        <button
          className="fixed bottom-8 right-8 z-20 rounded-full w-14 h-14 inline-flex items-center justify-center bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-2 active:border-blue-400 transition-all shadow-lg"
          onClick={() => setViewMode("landscape")}
        >
          <Monitor className="w-6 h-6" />
        </button>
      )}

      {/* Main Content */}
      <div className={`relative z-10 ${viewMode === "landscape" ? "pr-64" : ""}`}>
        {/* Welcome Section */}
        <section id="welcome" className={`min-h-screen flex items-start justify-center px-8 ${viewMode === "portrait" ? "pt-20" : "pt-[calc(50vh-230px)]"}`}>
          <div className={`max-w-5xl w-full ${viewMode === "portrait" ? "flex flex-col items-center text-center" : "flex items-start gap-12"}`}>
            {viewMode === "portrait" ? (
              <>
                {/* Portrait Mode: Vertical Layout */}
                <h1 className="text-7xl font-light mb-8 text-white">Welcome.</h1>
                <div className="mb-8">
                  <Image
                    src="/headshot-rmm-lj-rt2.png"
                    alt="Ryan Moszynski"
                    width={250}
                    height={250}
                    className="rounded-lg border-4 border-gray-700 shadow-2xl"
                  />
                </div>
                <div className="border-t-4 border-yellow-500 pt-6 max-w-2xl">
                  <p className="text-gray-300 text-lg mb-4">
                    My name is Ryan Moszynski. I&apos;m an A.I. first developer based in Tuscaloosa, AL.
                  </p>
                  <p className="text-gray-300 text-lg mb-4">
                    With the help of AI, I can build anything we can imagine.
                  </p>                
                  <p className="text-gray-300 text-lg">
                    I value effort, honesty, and good decision-making.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Landscape Mode: Horizontal Layout */}
                <div className="flex-1">
                  <h1 className="text-7xl font-light mb-8 text-white">Welcome.</h1>
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <p className="text-gray-300 text-lg mb-4">
                      My name is Ryan Moszynski. I&apos;m an A.I. first developer based in Tuscaloosa, AL.
                    </p>
                    <p className="text-gray-300 text-lg mb-4">
                      With the help of AI, I can build anything we can imagine.
                    </p>                
                    <p className="text-gray-300 text-lg">
                      I value effort, honesty, and good decision-making.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/headshot-rmm-lj-rt2.png"
                    alt="Ryan Moszynski"
                    width={300}
                    height={300}
                    className="rounded-lg border-4 border-gray-700 shadow-2xl"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Project Sections */}
        {projects.map((project) => (
          <section key={project.id} id={project.id} className="min-h-screen px-8 py-12">
            <div className="max-w-7xl w-full mx-auto">
              {/* Video Container - With proper aspect ratio */}
              <div className="mb-8">
                <div className="mx-auto" style={{ maxWidth: '900px' }}>
                  <div className="rounded-lg overflow-hidden bg-gray-900/50 border border-gray-700">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                      {project.videoSrc.includes("loom.com") ? (
                        <iframe
                          src={project.videoSrc}
                          frameBorder="0"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      ) : project.videoSrc === "" ? (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900">
                          <div className="text-center">
                            <div className="mb-4">
                              <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Video Coming Soon</h3>
                            <p className="text-gray-400">This demo is currently under construction</p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-0 left-0 w-full h-full">
                          <VideoPlayer src={project.videoSrc} title={project.title} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info - Below Video */}
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Title and Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                  
                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {/* Tech Stack Button - Only for projects with techDetails */}
                    {(project as { techDetails?: string }).techDetails && (
                      <button
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400 transition-all"
                        onClick={() => openModal('tech', (project as { techDetails: string }).techDetails, `${project.title} - Tech Stack`)}
                      >
                        <Code className="w-4 h-4" />
                        Tech Stack
                      </button>
                    )}
                    
                    {/* Key Features Button - Only for projects with keyFeatures */}
                    {(project as { keyFeatures?: string }).keyFeatures && (
                      <button
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400 transition-all"
                        onClick={() => openModal('features', (project as { keyFeatures: string }).keyFeatures, `${project.title} - Key Features Implemented`)}
                      >
                        <Sparkles className="w-4 h-4" />
                        Key Features
                      </button>
                    )}
                    
                    {/* GitHub Button */}
                    <button
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400 transition-all"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </button>
                  </div>
                </div>
                
                {/* Description - Full Width */}
                <p className="text-gray-400 leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* Contact Section */}
        <section className={`py-20 px-8 border-t border-gray-800 ${viewMode === "portrait" ? "pb-40" : ""}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">Let&apos;s Connect</h2>
            <p className="text-xl text-gray-300 mb-12">
              Ready to collaborate on your next project? Let&apos;s build something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-base font-medium bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400 transition-all"
                onClick={() => window.open('https://github.com/ryanmosz', '_blank')}
              >
                <Github className="w-5 h-5" />
                GitHub
              </button>
              <div className="relative">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setShowContactOptions(!showContactOptions)}
                >
                  Get In Touch
                </Button>
                {showContactOptions && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-base font-medium transition-all bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400"
                      style={{ minWidth: '280px' }}
                      onClick={() => {
                        navigator.clipboard.writeText('ryan.moszynski@gmail.com')
                        setEmailCopied(true)
                        setTimeout(() => setEmailCopied(false), 4000)
                      }}
                    >
                      {emailCopied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                      {emailCopied ? 'Copied!' : 'ryan.moszynski@gmail.com'}
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-base font-medium bg-gray-900/90 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white active:bg-blue-600/20 active:text-white active:border-l-2 active:border-l-blue-400 transition-all"
                      onClick={() => window.open('https://x.com/Ryan26295', '_blank')}
                    >
                      <span className="font-bold text-xl">𝕏</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
