'use client'

import { useEffect, useState } from "react"
import { getAll, deleteById } from "@/functions/Supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, RefreshCw } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faClock, faUser } from '@fortawesome/free-solid-svg-icons'
import { UserButton } from '@clerk/nextjs'
import { useAuthCheck } from "@/functions/Auth"
import { Sidebar } from "@/components/sidebar"

interface Request {
  id: number
  by: string
  song: string
  created_at: string
}

export default function StaffPortal() {
  const { user } = useAuthCheck();
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAll("rdb")
      setRequests(data as Request[])
    } catch (err) {
      setError("Failed to fetch requests. Please try again.")
      console.error("Error fetching requests:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteById("rdb", id)
      setRequests(requests.filter(request => request.id !== id))
      toast.success("Request deleted successfully")
    } catch (err) {
      toast.error("Failed to delete request. Please try again.")
      console.error("Error deleting request:", err)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const requestTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - requestTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes === 1) return '1 min ago'
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Requests</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={fetchRequests} size="icon" variant="ghost" className="text-lime-300 border-lime-300 hover:bg-lime-800">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh requests</span>
            </Button>
            <UserButton afterSignOutUrl="/staff/home" />
          </div>
        </header>

        <Card className="bg-lime-950 border-lime-700">
          <CardHeader>
            <CardTitle className="text-lime-300">Song Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-lime-300">Loading requests...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : requests.length === 0 ? (
              <div className="text-center text-lime-300">No requests found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lime-300">ID</TableHead>
                    <TableHead className="text-lime-300">Requester</TableHead>
                    <TableHead className="text-lime-300">Song</TableHead>
                    <TableHead className="text-lime-300">Time</TableHead>
                    <TableHead className="text-lime-300">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="text-lime-100">{request.id}</TableCell>
                      <TableCell className="text-lime-100">
                        <FontAwesomeIcon icon={faUser} className="text-lime-400 mr-2" />
                        {request.by}
                      </TableCell>
                      <TableCell className="text-lime-100">
                        <FontAwesomeIcon icon={faMusic} className="text-lime-400 mr-2" />
                        {request.song}
                      </TableCell>
                      <TableCell className="text-lime-100">
                        <FontAwesomeIcon icon={faClock} className="text-lime-400 mr-2" />
                        {formatTimeAgo(request.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(request.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete request</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <ToastContainer 
          position="bottom-right" 
          theme="dark"
          toastClassName="bg-lime-950 text-lime-100"
        />
      </div>
    </div>
  )
}