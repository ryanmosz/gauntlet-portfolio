"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, FileText, ExternalLink, Play, Pause } from "lucide-react"

// Interactive background component inspired by The Fountain's fluid dynamics
const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
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

    // Initialize particles across the screen
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 150; i++) {
        const colors = [
          { r: 59, g: 130, b: 246 }, // blue
          { r: 139, g: 92, b: 246 }, // purple
          { r: 6, g: 182, b: 212 }, // cyan
          { r: 16, g: 185, b: 129 }, // emerald
          { r: 245, g: 158, b: 11 }, // amber
          { r: 236, g: 72, b: 153 }, // pink
        ]

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 200 + 100,
          maxLife: Math.random() * 200 + 100,
          size: Math.random() * 1 + 0.5, // Changed from * 3 + 1 to much smaller
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
        })
      }
    }

    initParticles()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // Create trailing effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current

      particlesRef.current.forEach((particle, index) => {
        // Calculate distance to mouse
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 300 // Increased from 200

        // Mouse influence (attraction/repulsion) - ENHANCED REACTIVITY
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)

          // Increased force multipliers for more dramatic response
          // Create flowing effect - particles flow around mouse
          const flowAngle = angle + Math.PI / 2
          particle.vx += Math.cos(flowAngle) * force * 0.08 // Increased from 0.02
          particle.vy += Math.sin(flowAngle) * force * 0.08 // Increased from 0.02

          // Add stronger attraction to create more pronounced swirling
          particle.vx += Math.cos(angle) * force * 0.03 // Increased from 0.005
          particle.vy += Math.sin(angle) * force * 0.03 // Increased from 0.005

          // Add repulsion effect when very close to mouse
          if (distance < 50) {
            const repulsionForce = (50 - distance) / 50
            particle.vx -= Math.cos(angle) * repulsionForce * 0.1
            particle.vy -= Math.sin(angle) * repulsionForce * 0.1
          }
        }

        // Add some random drift for organic movement
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01

        // Apply velocity with damping
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.99 // Changed from 0.995 for less damping
        particle.vy *= 0.99 // Changed from 0.995 for less damping

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw main particle with glow effect
        const lifeRatio = particle.life / particle.maxLife
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.8

        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2.0,
        ) // Changed from * 3 to * 1.5
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`)
        gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`)

        ctx.globalAlpha = 1
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2.0, 0, Math.PI * 2) // Changed from * 3 to * 1.5
        ctx.fill()

        // Inner bright core
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgba(${particle.color.r + 50}, ${particle.color.g + 50}, ${particle.color.b + 50}, ${alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
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

      // Draw connections between nearby particles (nebula effect)
      ctx.globalAlpha = 0.1
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const alpha = ((100 - distance) / 100) * 0.2
            ctx.globalAlpha = alpha
            ctx.strokeStyle = `rgba(${(p1.color.r + p2.color.r) / 2}, ${(p1.color.g + p2.color.g) / 2}, ${(p1.color.b + p2.color.b) / 2}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "#000000" }} />
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
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with user authentication, payment processing, and admin dashboard. Features include product catalog, shopping cart, order management, and real-time inventory tracking.",
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
      videoSrc: "/placeholder-video.mp4",
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Task Management App",
      description:
        "A collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration features. Includes Kanban boards, time tracking, and progress analytics.",
      techStack: ["Next.js", "TypeScript", "Prisma", "Socket.io", "Tailwind"],
      videoSrc: "/placeholder-video.mp4",
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Weather Dashboard",
      description:
        "An interactive weather application with location-based forecasts, historical data visualization, and severe weather alerts. Features beautiful charts and responsive design.",
      techStack: ["Vue.js", "D3.js", "Express", "MongoDB", "OpenWeather API"],
      videoSrc: "/placeholder-video.mp4",
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Social Media Analytics",
      description:
        "A comprehensive analytics platform for social media performance tracking. Includes engagement metrics, audience insights, and automated reporting with beautiful data visualizations.",
      techStack: ["Python", "Django", "React", "PostgreSQL", "Celery"],
      videoSrc: "/placeholder-video.mp4",
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "AI Chat Assistant",
      description:
        "An intelligent chatbot with natural language processing capabilities. Features context awareness, multi-language support, and integration with various APIs for enhanced functionality.",
      techStack: ["Python", "FastAPI", "OpenAI", "React", "WebSocket"],
      videoSrc: "/placeholder-video.mp4",
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Fitness Tracker",
      description:
        "A mobile-first fitness application with workout planning, progress tracking, and social features. Includes exercise library, custom routines, and achievement system.",
      techStack: ["React Native", "Firebase", "Node.js", "Chart.js", "Expo"],
      videoSrc: "/placeholder-video.mp4",
      githubUrl: "#",
      liveUrl: "#",
    },
  ]

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Your Name
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">Full Stack Developer & Creative Problem Solver</p>
            <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
              Passionate about building innovative web applications that solve real-world problems. Click anywhere on
              the background to see some magic! ✨
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-4 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/80 border-gray-700 hover:bg-gray-900/90 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <VideoPlayer src={project.videoSrc} title={project.title} />
                    <CardDescription className="text-gray-300 text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="bg-blue-600/20 text-blue-300 border-blue-600/30"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Let's Connect</h2>
            <p className="text-xl text-gray-300 mb-12">
              Ready to collaborate on your next project? Let's build something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800 cursor-not-allowed opacity-50 bg-transparent"
                disabled
              >
                <FileText className="w-5 h-5 mr-2" />
                Resume (Coming Soon)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800 cursor-not-allowed opacity-50 bg-transparent"
                disabled
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn (Coming Soon)
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get In Touch
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-800 bg-black/30">
          <div className="max-w-4xl mx-auto text-center text-gray-400">
            <p>&copy; 2024 Your Name. Built with Next.js and lots of ☕</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
