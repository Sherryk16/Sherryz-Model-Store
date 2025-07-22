'use client'

import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp } from 'react-icons/fa'

interface SocialIconProps {
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'whatsapp'
  url: string
  size?: number
}

const platformIcons: Record<string, (size: number) => JSX.Element> = {
  facebook: (size) => <FaFacebook size={size} color="#1877F3" />,
  instagram: (size) => <FaInstagram size={size} color="#E4405F" />,
  twitter: (size) => <FaTwitter size={size} color="#1DA1F2" />,
  youtube: (size) => <FaYoutube size={size} color="#FF0000" />,
  whatsapp: (size) => <FaWhatsapp size={size} color="#25D366" />,
}

const SocialIcon = ({ platform, url, size = 56 }: SocialIconProps) => {
  const Icon = platformIcons[platform]
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-110 hover:drop-shadow-lg transition-transform"
      aria-label={`Visit our ${platform} page`}
    >
      {Icon(size)}
    </a>
  )
}

export function SocialIcons({ size }: { size?: number }) {
  return (
    <div className="flex justify-center items-center gap-10 py-6">
      <SocialIcon platform="facebook" url="https://facebook.com/sherryz" size={size} />
      <SocialIcon platform="instagram" url="https://instagram.com/sherryz" size={size} />
      <SocialIcon platform="twitter" url="https://twitter.com/sherryz" size={size} />
      <SocialIcon platform="youtube" url="https://youtube.com/sherryz" size={size} />
      <SocialIcon platform="whatsapp" url="https://wa.me/923001234567" size={size} />
    </div>
  )
} 