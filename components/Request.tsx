"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Loader2, CheckCircle, XCircle } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function RequestModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", isError: false })

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ name, message }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      setIsLoading(false)
      setIsOpen(false)
      setNotification({ show: true, message: "Request sent successfully!", isError: false })
      setName("")
      setMessage("")
    } catch (error) {
      console.error("Error submitting request:", error)
      setIsLoading(false)
      setNotification({ show: true, message: "Your on cooldown! Please try send requests later!", isError: true })
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-4 w-4 outline-none text-lime-300 hover:text-lime-100" />
            <span className="sr-only">Open request dialog</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Send a Request</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Send in a message to the DJ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-100">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="Your name..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-zinc-100">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="Your message..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmit} 
              className="bg-pink-600 hover:bg-pink-700 text-white"
              disabled={isLoading || !name || !message}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 ${
              notification.isError ? 'bg-red-500' : 'bg-green-500'
            } text-white p-4 rounded-md shadow-lg flex items-center`}
          >
            {notification.isError ? (
              <XCircle className="mr-2 h-5 w-5" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}