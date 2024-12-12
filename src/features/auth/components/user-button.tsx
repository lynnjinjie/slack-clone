'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useAuthActions } from '@convex-dev/auth/react'
import { Loader, LogOut } from 'lucide-react'

export const UserButton = () => {
  const { data, isLoading } = useCurrentUser()
  const { signOut } = useAuthActions()
  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />
  }

  if (!data) {
    return null
  }

  const { name, image } = data

  const avatorFallback = name?.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 transition hover:opacity-75">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{avatorFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()} className="h-10">
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
