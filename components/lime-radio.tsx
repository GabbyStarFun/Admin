'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh, faVolumeMute, faPause, faPlay, faComment, faUser, faMusic, faBolt } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import RequestModal from './Request'

export function LimeRadio() {
  const [nowPlaying, setNowPlaying] = useState<{
    title: string;
    artist: string;
    albumArt: string;
  } | null>(null)
  const [liveDJ, setLiveDJ] = useState<{
    name: string; avatar: string;
  } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('limeRadioVolume') || '0.5')
    }
    return 0.5
  })
  const [isMuted, setIsMuted] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [requestName, setRequestName] = useState('')
  const [requestSong, setRequestSong] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch(`/api/stats?t=${new Date().toISOString()}`);
        const x = await response.json()
        const data = x.data
        setNowPlaying({
          title: data.now_playing.song.title,
          artist: data.now_playing.song.artist,
          albumArt: data.now_playing.song.art
        })
        if (data.live.is_live) {
          setLiveDJ({
            name: data.live.streamer_name,
            avatar: data.live.avatar_url
          })
        } else {
          setLiveDJ({name: "Lime DJ", avatar: "/favicon.ico"})
        }
      } catch (error) {
        setNowPlaying({
          title: "Lime Radio",
          artist: "Lime Radio",
          albumArt: "/favicon.ico"
        })
        setLiveDJ({name: "Lime DJ", avatar: "/favicon.ico"})
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
    localStorage.setItem('limeRadioVolume', volume.toString())
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300) 

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    } else {
      audioRef.current = new Audio('https://audio.limeradio.net/')
      audioRef.current.volume = isMuted ? 0 : volume
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
  }

  const handleRequest = () => {
    console.log(`Song request: ${requestSong} by ${requestName}`)
    setIsRequestOpen(false)
    setRequestName('')
    setRequestSong('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-900 to-lime-950 relative overflow-hidden">
      {nowPlaying && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${nowPlaying.albumArt})` }}
        />
      )}
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold text-lime-300 mb-8">Lime Radio</h1>
        <div className="mb-4 relative">
          {nowPlaying && (
            <img src={nowPlaying.albumArt} alt="Album Art" className="w-64 h-64 rounded-full mx-auto shadow-lg" />
          )}
          {liveDJ && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="bg-purple-900 rounded-full py-2 px-4 flex items-center space-x-2">
                <Image 
                  src={liveDJ.avatar} 
                  width={24} 
                  height={24} 
                  alt={`${liveDJ.name}'s avatar`}
                  className="rounded-full"
                />
                <span className="text-white font-semibold">{liveDJ.name}</span>
              </div>
            </div>
          )}
        </div>
        {nowPlaying && (
          <div className="mt-8">
            <div className="text-lime-100 font-bold text-2xl mb-2">{nowPlaying.title}</div>
            <div className="text-lime-300 text-xl">{nowPlaying.artist}</div>
          </div>
        )}
        <div className="mt-8 mb-8 flex items-center justify-center space-x-4">
          <button 
            className="text-lime-300 hover:text-lime-100"
            onClick={toggleMute}
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeHigh} size="lg" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-48 h-2 bg-lime-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-center items-center space-x-6">
          <RequestModal/>
          <button 
            onClick={togglePlay} 
            className={`bg-lime-500 hover:bg-lime-400 text-lime-900 rounded-full p-4 transition-transform duration-300 ${isAnimating ? 'scale-90' : ''}`}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
          </button>
          <a href="/redirect?r=https://discord.gg/yfbbs3u62Z" target="_blank" rel="noopener noreferrer" className="text-lime-300 hover:text-lime-100">
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </a>
        </div>
      </div>
    </div>
  )
}
