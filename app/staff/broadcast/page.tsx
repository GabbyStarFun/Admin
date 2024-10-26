'use client'

import { useState, useEffect } from "react"
import { getStaffByID } from "@/functions/Supabase"
import { UserButton } from "@clerk/nextjs"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuthCheck } from "@/functions/Auth"
import { Eye, EyeOff, Copy, CheckCircle2, RefreshCw  } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface StaffInfo {
  id: number
  name: string
  userid: string
  broadcaster: boolean
  credentials: string
  managementPermission: boolean
  active: boolean
  azuracastUserID: number
}

export default function StaffPortal() {
  const { user } = useAuthCheck()
  const [connectionInfo, setConnectionInfo] = useState<StaffInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const fetchConnectionInfo = async () => {
    if (user) {
      const discordId = user.externalAccounts.find((account) => account.provider === "discord")?.providerUserId
      if (discordId) {
        try {
          const info = await getStaffByID(discordId)
          setConnectionInfo(info as StaffInfo)
          setIsLoading(false)
        } catch (err) {
          console.error(err)
          setError("Failed to load connection info.")
          setIsLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    fetchConnectionInfo()
  }, [user])

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedPassword(true)
        toast.success("Password copied to clipboard!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setTimeout(() => setCopiedPassword(false), 3000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast.error("Failed to copy password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Broadcast Information</h1>
          <div className="flex items-center space-x-4">
          <Button onClick={fetchConnectionInfo} size="icon" variant="ghost" className="text-lime-300 border-lime-300 hover:bg-lime-800">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh requests</span>
            </Button>
            <UserButton afterSignOutUrl="/staff/home" />
          </div>
        </header>

        <div className="mt-8">
          {isLoading ? (
            <p className="text-lime-200">Loading connection info...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Sharing your connection info will result in termination.</AlertDescription>
              </Alert>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Server</TableCell>
                      <TableCell>radio.limeradio.net</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Username</TableCell>
                      <TableCell>{connectionInfo?.name ?? "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Port</TableCell>
                      <TableCell>8005</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Type</TableCell>
                      <TableCell>Icecast</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Password</TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <span className="font-mono">
                          {passwordVisible ? connectionInfo?.credentials : '•'.repeat(connectionInfo?.credentials?.length ?? 8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePasswordVisibility}
                          aria-label={passwordVisible ? "Hide password" : "Show password"}
                        >
                          {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(connectionInfo?.credentials ?? "")}
                          aria-label="Copy password"
                          disabled={copiedPassword}
                        >
                          {copiedPassword ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Azuracast User ID</TableCell>
                      <TableCell>{connectionInfo?.azuracastUserID ?? "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}