'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Home, BookOpen, CheckSquare, BarChart2, ChevronRight, Play, Check, X } from 'lucide-react'
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useSession, signIn, signOut } from "next-auth/react"
import prisma from "@/lib/prisma"
import { Session } from 'next-auth';
import { SessionProvider } from "next-auth/react"

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const modules = [
  {
    title: 'Módulo 1: Fundamentos',
    courses: [
      { title: 'Aula #001 → Expectativas Módulo 1', duration: '03:46', image: '/thumb.jpg', video: 'https://player.vimeo.com/video/1016276753?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #002 → O que é a internet?', duration: '13:57', image: '/thumb.jpg', video: 'https://player.vimeo.com/video/1016265764?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #003 → Tecnologias por trás da internet', duration: '23:43', image: '/ferramentas.jpg', video: 'https://player.vimeo.com/video/1016265897?badge=0&amp;autopause=0&amp;player_id=0&amp' },
      { title: 'Aula #004 → Banda e Latência', duration: '05:13', image: '/vídeo.png', video: 'https://player.vimeo.com/video/1016266097?badge=0&amp;autopause=0&amp' },
    ],
    tasks: [
      { title: 'Escolha a ferramenta que você vai documentar seus aprendizados. (Coda, Notion, Trello, Asana são algumas possibilidades)', completed: false },
      { title: 'Defina quais ferramentas você vai utilizar repetidamente, aprofunde nelas (Framer, v0.dev, ChatGPT, Google Analytics, Google Search Console, Google Tag Manager, Clarity são algumas delas.', completed: false },
      { title: 'Reflita sobre "O que é um jogo pra você, e trabalho para os outros?"', completed: false },
      { title: 'É mais rápido para você colocar algo no ar, ou fazer todas as entrevistas antes?"', completed: false },
    ]
  },
  {
    title: 'Módulo 02: Em breve',
    courses: [
      { title: 'Em construção', duration: '10:15', image: '/soon.jpg', video: 'https://player.vimeo.com/video/336265026' },
      { title: 'Muito em breve, por aqui', duration: '15:30', image: '/soon.jpg', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { title: 'Esse será chocante', duration: '20:45', image: '/soon.jpg', video: 'https://player.vimeo.com/video/336265026' },
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
  {
    title: 'Módulo 03: Mais perto do que você imagina',
    courses: [
      { title: 'Por essa aula, estou ansioso', duration: '25:00', image: '/soon.jpg', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { title: 'Essa daqui, você nem imagina', duration: '18:20', image: '/soon.jpg', video: 'https://player.vimeo.com/video/336265026' },
      { title: 'Já essa aula, é muito diferente', duration: '22:10', image: '/soon.jpg', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
  {
    title: 'Módulo 04: Chegando',
    courses: [
      { title: 'Por essa aula, estou ansioso', duration: '25:00', image: '/soon.jpg', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { title: 'Essa daqui, você nem imagina', duration: '18:20', image: '/soon.jpg', video: 'https://player.vimeo.com/video/336265026' },
      { title: 'Já essa aula, é muito diferente', duration: '22:10', image: '/soon.jpg', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
    tasks: [
      { title: 'Sem tarefas, por enquanto', completed: false },
      { title: 'Sem tarefas, por enquanto', completed: false },
    ]
  },
]

const shorts = [
  { title: 'Validação de Ideias', duration: '1:00', video2: 'https://player.vimeo.com/video/1010369564?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1010369564?autoplay=1' },
  { title: 'Tipos de Criadores', duration: '0:45', video2: 'https://player.vimeo.com/video/1010369687?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1010369687?autoplay=1' },
  { title: 'Entender de Tech', duration: '1:30', video2: 'https://player.vimeo.com/video/1010369636?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1010369636?autoplay=1' },
  { title: '3 tipos de PMs', duration: '1:00', video2: 'https://player.vimeo.com/video/1010369598?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1010369598?autoplay=1' },
  { title: 'Progresso vs Movimento', duration: '1:15', video2: 'https://player.vimeo.com/video/1010369754?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1010369754?autoplay=1' },
  { title: 'Contexto Importa', duration: '0:50', video2: 'https://player.vimeo.com/video/1010369779?autoplay=1&loop=1&muted=1&autopause=0', video: 'https://player.vimeo.com/video/1010369779?autoplay=1' },
]

export function CoursePlatform() {
  return (
    <SessionProvider>
      <CoursePlatformContent />
    </SessionProvider>
  )
}

function CoursePlatformContent() {
  const { data: session } = useSession() as { data: CustomSession | null }
  const [currentModule, setCurrentModule] = useState(0)
  const [currentCourse, setCurrentCourse] = useState(0)
  const [completedCourses, setCompletedCourses] = useState<{[key: number]: number[]}>({})
  const [activeTab, setActiveTab] = useState('Home 🏠')
  const [showVideo, setShowVideo] = useState(false)
  const [currentShort, setCurrentShort] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showShortVideo, setShowShortVideo] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const shortsRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showCheckAnimation, setShowCheckAnimation] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [lastUncompletedCourse, setLastUncompletedCourse] = useState<{ moduleIndex: number, courseIndex: number } | null>(null)

  useEffect(() => {
    if (session?.user) {
      loadUserProgress()
    }
    setMounted(true)
  }, [session])

  const loadUserProgress = async () => {
    if (session?.user?.id) {
      const progress = await fetch(`/api/progress?userId=${session.user.id}`).then(res => res.json())
      setCompletedCourses(progress)
      findLastUncompletedCourse(progress)
    }
  }

  const findLastUncompletedCourse = (progress: {[key: number]: number[]}) => {
    for (let i = modules.length - 1; i >= 0; i--) {
      const moduleProgress = progress[i] || []
      for (let j = modules[i].courses.length - 1; j >= 0; j--) {
        if (!moduleProgress.includes(j)) {
          setLastUncompletedCourse({ moduleIndex: i, courseIndex: j })
          return
        }
      }
    }
    setLastUncompletedCourse(null)
  }

  const getModuleProgress = (moduleIndex: number) => {
    const moduleCompletedCourses = completedCourses[moduleIndex] || [];
    const totalCoursesInModule = modules[moduleIndex].courses.length;
    return (moduleCompletedCourses.length / totalCoursesInModule) * 100;
  };

  const handleComplete = async () => {
    setShowCheckAnimation(true)
    if (session?.user?.id) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule,
          courseId: currentCourse,
        }),
      })
    }

    setCompletedCourses(prev => ({
      ...prev,
      [currentModule]: [...(prev[currentModule] || []), currentCourse]
    }))

    setTimeout(() => {
      setShowCheckAnimation(false)
      moveToNextLesson()
    }, 1000)
  }

  const moveToNextLesson = () => {
    const currentModuleCourses = modules[currentModule].courses
    if (currentCourse < currentModuleCourses.length - 1) {
      setCurrentCourse(currentCourse + 1)
    } else if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1)
      setCurrentCourse(0)
    } else {
      setShowVideo(false)
      setActiveTab('My Progres ⏳')
    }
    findLastUncompletedCourse(completedCourses)
  }

  const progress = Object.values(completedCourses).flat().length / modules.reduce((acc, module) => acc + module.courses.length, 0) * 100

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'light')
  }

  const renderVideoPlayer = (videoUrl: string) => {
    if (videoUrl.includes('vimeo')) {
      return (
        <iframe
          src={videoUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    } else {
      return (
        <video
          className="w-full h-full"
          src={videoUrl}
          controls
        />
      )
    }
  }

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentShort < shorts.length - 1) {
      setIsSwiping(true)
      setTimeout(() => {
        setCurrentShort(currentShort + 1)
        setIsSwiping(false)
      }, 300)
    } else if (direction === 'down' && currentShort > 0) {
      setIsSwiping(true)
      setTimeout(() => {
        setCurrentShort(currentShort - 1)
        setIsSwiping(false)
      }, 300)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleSwipe('up')
    }

    if (touchStart - touchEnd < -50) {
      handleSwipe('down')
    }
  }

  const renderCourseVideos = () => {
    const currentModuleCourses = modules[currentModule].courses
    const previousVideos = currentModuleCourses.slice(0, currentCourse)
    const nextVideos = currentModuleCourses.slice(currentCourse + 1)
    
    return (
      <div className="mt-6 space-y-6">
        {previousVideos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200 font-sans">Previous in this module:</h3>
            <ul className="space-y-2">
              {previousVideos.map((course, index) => (
                <li key={index} className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300" onClick={() => {
                  setCurrentCourse(index)
                }}>
                  <Play className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-200 font-sans">{course.title}</span>
                  <span className="text-sm text-gray-400 ml-auto font-sans">{course.duration}</span>
                  {completedCourses[currentModule]?.includes(index) && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {nextVideos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200 font-sans">Next in this module:</h3>
            <ul className="space-y-2">
              {nextVideos.map((course, index) => (
                <li key={index} className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300" onClick={() => {
                  setCurrentCourse(currentCourse + index + 1)
                }}>
                  <Play className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-200 font-sans">{course.title}</span>
                  <span className="text-sm text-gray-400 ml-auto font-sans">{course.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderShorts = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-200 font-sans">Shorts</h2>
          <ChevronRight className="h-6 w-6 text-gray-400" />
        </div>
        <div 
          className="flex overflow-x-auto space-x-4 pb-4 cursor-grab"
          ref={shortsRef}
          onMouseDown={(e) => {
            setIsDragging(true)
            setStartX(e.pageX - shortsRef.current!.offsetLeft)
            setScrollLeft(shortsRef.current!.scrollLeft)
          }}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (!isDragging) return
            e.preventDefault()
            const x = e.pageX - shortsRef.current!.offsetLeft
            const walk = (x - startX) * 2
            shortsRef.current!.scrollLeft = scrollLeft - walk
          }}
        >
          {shorts.map((short, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => {
                setCurrentShort(index)
                setShowShortVideo(true)
              }}
            >
              <div className="relative aspect-[9/16]">
                <iframe
                src={short.video2}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded font-sans">
                  {short.duration}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-xs truncate text-gray-200 font-sans">{short.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderAllShorts = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shorts.map((short, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setCurrentShort(index)
              setShowShortVideo(true)
            }}
          >
            <div className="relative aspect-[9/16]">
              <iframe
                src={short.video2}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded font-sans">
                {short.duration}
              </div>
            </div>
            <div className="p-2">
              <h3 className="font-semibold text-sm text-gray-200 font-sans">{short.title}</h3>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderLastUncompletedCourse = () => {
    if (lastUncompletedCourse) {
      const { moduleIndex, courseIndex } = lastUncompletedCourse
      const chapter = modules[moduleIndex]
      const course = chapter.courses[courseIndex]
      return (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200 font-sans">Continue de onde parou</h2>
          <div
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setCurrentModule(moduleIndex)
              setCurrentCourse(courseIndex)
              setShowVideo(true)
            }}
          >
            <div className="relative aspect-video">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-200 font-sans">{course.title}</h3>
              <p className="text-sm text-gray-400 font-sans">{chapter.title}</p>
              <p className="text-sm mt-2 text-gray-400 font-sans">{course.duration}</p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (!mounted) {
    return null
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <h1 className="text-4xl font-bold mb-8">SBC</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
          <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between transform hover:scale-105">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Technical Product Manager Training</h2>
              <p className="text-gray-400 mb-4">Access your personalized course content and track your progress.</p>
            </div>
            <Button 
              onClick={() => signIn('google')} 
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded self-end transition-colors duration-300"
            >
              Acessar curso
            </Button>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between transform hover:scale-105">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Como criar um produto do zero, sem sorte</h2>
              <p className="text-gray-400 mb-4">Explore our course offerings and get a sneak peek of what's inside.</p>
            </div>
            <Button 
              onClick={() => window.location.href = 'https://sbc-v6.vercel.app'}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded self-end transition-colors duration-300"
            >
              Acessar curso
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-bold text-indigo-400 font-sans">SBC</h1>
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input className="pl-8 w-full bg-gray-700 text-gray-200 border-gray-600" placeholder="Search" />
            </div>
          </div>
          {session ? (
            <Avatar onClick={() => signOut()} className="cursor-pointer">
              <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? 'User'} />
              <AvatarFallback>{session.user.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
          ) : (
            <Button onClick={() => signIn('google')} className="bg-indigo-600 hover:bg-indigo-700">Sign In</Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-200">
        {showVideo ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 font-sans tracking-tight sm:text-2xl">{modules[currentModule].courses[currentCourse].title}</h2>
            <div className="aspect-video bg-black mb-6 rounded-lg overflow-hidden">
              {renderVideoPlayer(modules[currentModule].courses[currentCourse].video)}
            </div>
            <div className="relative">
              <Button onClick={handleComplete} className="w-full bg-indigo-600 hover:bg-indigo-700">
                Mark as Completed
              </Button>
              {showCheckAnimation && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 rounded"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Check className="h-12 w-12 text-white" />
                </motion.div>
              )}
            </div>
            {renderCourseVideos()}
          </div>
        ) : showShortVideo ? (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full object-cover"
                src={shorts[currentShort].video}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
              <div 
                className="absolute inset-0"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ zIndex: 10 }}
              >
              </div>
              <div className="absolute top-4 right-4" style={{ zIndex: 11 }}>
                <Button variant="ghost" onClick={() => setShowShortVideo(false)}>
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
              <div className="absolute left-4 bottom-20 text-white">
                <h3 className="text-xl font-bold">{shorts[currentShort].title}</h3>
                <p>{shorts[currentShort].duration}</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'Home 🏠' ? (
          <>
            {renderLastUncompletedCourse()}
            {modules.map((moduleItem, moduleIndex) => (
              <div key={moduleIndex} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-400 font-sans tracking-tight">{moduleItem.title}</h2>
                  <Button 
                    onClick={() => {
                      setCurrentModule(moduleIndex)
                      setShowVideo(false)
                    }} 
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Module
                  </Button>
                </div>
                {currentModule === moduleIndex && (
                  <div className="space-y-4">
                    <motion.div
                      className="bg-gray-800 rounded-lg p-4"
                      initial={{ width: 0 }}
                      animate={{ width: `${getModuleProgress(moduleIndex)}%` }}
                      transition={{ duration: 1 }}
                    >
                      <span className="text-white font-bold">{Math.round(getModuleProgress(moduleIndex))}% Complete</span>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {moduleItem.courses.map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                          onClick={() => {
                            setCurrentCourse(courseIndex)
                            setShowVideo(true)
                          }}
                        >
                          <div className="relative aspect-video">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            {completedCourses[moduleIndex]?.includes(courseIndex) && (
                              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h3 className="font-semibold text-sm text-gray-300 font-sans">{course.title}</h3>
                            <p className="text-xs text-gray-400">{course.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {renderShorts()}
          </>
        ) : activeTab === 'Shorts 🔥' ? (
          renderAllShorts()
        ) : activeTab === 'Tasks ☑️' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400 font-sans tracking-tight sm:text-xl">Tasks</h2>
            {modules.map((moduleItem, moduleIndex) => (
              <div key={moduleIndex} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-indigo-300 font-sans tracking-tight sm:text-lg">{moduleItem.title}</h3>
                <ul className="space-y-2">
                  {moduleItem.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center space-x-2">
                      <Checkbox id={`task-${moduleIndex}-${taskIndex}`} />
                      <label htmlFor={`task-${moduleIndex}-${taskIndex}`} className="text-sm text-gray-300">
                        {task.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : activeTab === 'My Progress ⏳' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400 font-sans tracking-tight sm:text-xl">My Progress</h2>
            <Progress value={progress} className="w-full bg-gray-700" />
            <p className="text-center text-lg font-semibold text-indigo-300">{Math.round(progress)}% Complete</p>
            {modules.map((moduleItem, moduleIndex) => (
              <div key={moduleIndex} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-indigo-300 font-sans tracking-tight sm:text-lg">{moduleItem.title}</h3>
                <motion.div
                  className="bg-indigo-600 h-2 rounded-full mb-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${getModuleProgress(moduleIndex)}%` }}
                  transition={{ duration: 1 }}
                />
                <p className="text-sm text-gray-400 mb-2">{Math.round(getModuleProgress(moduleIndex))}% Complete</p>
                <ul className="space-y-2">
                  {moduleItem.courses.map((course, courseIndex) => (
                    <li key={courseIndex} className="flex items-center space-x-2">
                      {completedCourses[moduleIndex]?.includes(courseIndex) ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 border border-gray-600 rounded-full" />
                      )}
                      <span className="text-gray-300">{course.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-2">
          {[
            { icon: Home, label: 'Home 🏠' },
            { icon: BookOpen, label: 'Shorts 🔥' },
            { icon: CheckSquare, label: 'Tasks ☑️' },
            { icon: BarChart2, label: 'My Progress ⏳' },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center text-gray-400 hover:text-indigo-400"
              onClick={() => {
                setActiveTab(item.label)
                setShowVideo(false)
                setShowShortVideo(false)
              }}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
