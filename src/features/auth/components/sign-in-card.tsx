import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SignInFlow } from '@/features/auth/types'
import { useAuthActions } from '@convex-dev/auth/react'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

interface SignInCardProps {
  setState: (state: SignInFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuthActions()

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPending(true)
    signIn('password', { email, password, flow: 'signIn' })
      .catch(() => {
        setError('Invalid email or password')
      })
      .finally(() => {
        setPending(false)
      })
  }

  const handleSignInProvider = (value: 'github' | 'google') => {
    setPending(true)
    signIn(value).finally(() => {
      setPending(false)
    })
  }

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login in continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignIn} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            variant="outline"
            onClick={() => handleSignInProvider('google')}
            size="lg"
            className="relative w-full"
          >
            <FcGoogle className="absolute left-2.5 top-3 size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            variant="outline"
            onClick={() => handleSignInProvider('github')}
            size="lg"
            className="relative w-full"
          >
            <FaGithub className="absolute left-2.5 top-3 size-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <span
            onClick={() => setState('signUp')}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
