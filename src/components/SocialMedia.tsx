'use client'

import { Instagram, Youtube, Music } from 'lucide-react'

interface SocialMediaProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'text'
  showLabels?: boolean
}

export default function SocialMedia({ 
  size = 'md', 
  variant = 'default',
  showLabels = false 
}: SocialMediaProps) {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/ja.viajei/',
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@ja.viajei',
      icon: Music,
      color: 'text-black hover:text-gray-800',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/channel/UCfTIFw8Ic3ffUsyT7TO-EdA',
      icon: Youtube,
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'bg-red-50 hover:bg-red-100'
    }
  ]

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[size]} ${social.bgColor} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
              title={`Seguir no ${social.name}`}
            >
              <Icon className={`${iconSizes[size]} ${social.color}`} />
            </a>
          )
        })}
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className="flex items-center space-x-4">
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${social.color} hover:underline transition-colors`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{social.name}</span>
            </a>
          )
        })}
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex flex-col space-y-3">
      {showLabels && (
        <h4 className="text-sm font-semibold text-gray-700 text-center">
          Acompanhe nossa jornada
        </h4>
      )}
      <div className="flex items-center justify-center space-x-3">
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[size]} ${social.bgColor} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
              title={`Seguir no ${social.name}`}
            >
              <Icon className={`${iconSizes[size]} ${social.color} group-hover:scale-110 transition-transform`} />
            </a>
          )
        })}
      </div>
      {showLabels && (
        <p className="text-xs text-gray-500 text-center">
          @ja.viajei em todas as redes
        </p>
      )}
    </div>
  )
}