import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SignInFlow } from '@/features/auth/types'
import { useAuthActions } from '@convex-dev/auth/react'
import { Separator } from '@radix-ui/react-separator'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

interface SignUpCardProps {
  setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuthActions()

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Password do not match')
      return
    }

    setPending(true)
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch(() => {
        setError('Something went wrong')
      })
      .finally(() => {
        setPending(false)
      })
  }

  const onProviderSignUp = (value: 'github' | 'google') => {
    setPending(true)
    signIn(value).finally(() => {
      setPending(false)
    })
  }

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
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
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
            onClick={() => onProviderSignUp('google')}
            size="lg"
            className="relative w-full"
          >
            <FcGoogle className="absolute left-2.5 top-3 size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            variant="outline"
            onClick={() => onProviderSignUp('github')}
            size="lg"
            className="relative w-full"
          >
            <FaGithub className="absolute left-2.5 top-3 size-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <span
            onClick={() => setState('signIn')}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
