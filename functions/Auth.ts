import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { redirect } from "next/navigation"

export function useAuthCheck() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const AuthorisedIDs = ["1137093225576935485"]

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/staff/auth")
    } else {
      const discordId = user?.externalAccounts.find((account) => account.provider === "discord")?.providerUserId
      
      if (!discordId || !AuthorisedIDs.includes(discordId)) {
        redirect("/staff/unauthorised")
      }
    }
  }, [isSignedIn, user])

  return { isSignedIn, user }
}