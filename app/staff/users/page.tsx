'use client'

import { useEffect, useState } from "react"
import { getAll, deleteById, getStaffByID } from "@/functions/Supabase"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faUser, faHome, faBroadcastTower, faChartLine, faUsers, faCog } from '@fortawesome/free-solid-svg-icons'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'
import { useAuthCheck } from "@/functions/Auth"
import { Sidebar } from "@/components/sidebar"

interface User {
  id: number
  name: string
  song: string
  created_at: string
  active: boolean
  azuracastUserID: number
}

export default function StaffPortal() {
  const AuthorisedIDS = ["1137093225576935485"]
  const { user } = useAuthCheck()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAll("staff")
      setUsers(data as User[])
    } catch (err) {
      setError("Failed to fetch users. Please try again.")
      console.error("Error fetching users:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const discordId = user.externalAccounts.find(account => account.provider === 'discord')?.providerUserId
        if (discordId) {
          const dbUser = await getStaffByID(discordId)
          if (!dbUser || !dbUser.managementPermission || !AuthorisedIDS.includes(discordId)) {
            redirect("/staff/unauthorised")
            return
          }
          await fetchUsers()
        }
      }
    }

    fetchData().catch((err) => console.error("Error in fetchData:", err))
  }, [user])

  const handleDelete = async (id: number) => {
    try {
      await deleteById("staff", id)
      setUsers(users.filter(u => u.id !== id))
      toast.success("User deleted successfully")
    } catch (err) {
      toast.error("Failed to delete user. Please try again.")
      console.error("Error deleting user:", err)
    }
  }

  const toggleUserStatus = async (id: number, isActive: boolean): Promise<void> => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    if (!apiKey) {
      throw new Error("API key is not defined")
    }

    try {
      const response = await fetch(`/api/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ id, isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      const result = await response.json()
      await fetchUsers()
      toast.success(result.message)
    } catch (err) {
      toast.error("Failed to update user status. Please try again.")
      console.error("Error updating user status:", err)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Users</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={fetchUsers} size="icon" variant="ghost" className="text-lime-300 border-lime-300 hover:bg-lime-800">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh users</span>
            </Button>
            <UserButton afterSignOutUrl="/staff/home" />
          </div>
        </header>

        {isLoading ? (
          <div className="text-center text-lime-300">Loading users...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-lime-300">No users found.</div>
        ) : (
          <div className="flex flex-col space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center bg-lime-950 border border-lime-700 p-4 rounded">
                <div className="flex-1">
                  <span className="text-lime-100">{user.name}</span>
                  <span className={`ml-4 text-lime-100 ${user.active ? 'bg-green-600' : 'bg-red-600'} px-2 rounded`}>
                    {user.active ? 'Active' : 'Deactivated'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => toggleUserStatus(user.azuracastUserID, user.active)}
                    className={`bg-${user.active ? 'red' : 'green'}-600 hover:bg-${user.active ? 'red' : 'green'}-700`}
                  >
                    {user.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastContainer 
          position="bottom-right" 
          theme="dark"
          toastClassName="bg-lime-950 text-lime-100"
        />
      </div>
    </div>
  )
}