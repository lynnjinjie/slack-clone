import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { CopyIcon, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

interface InviteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This will deactivate the current invite code and generate a new one',
  )

  const { mutate, isPending } = useNewJoinCode()

  const handleNewCode = async () => {
    const ok = await confirm()

    if (!ok) return

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success('Invite code regenerated')
        },
        onError: () => {
          toast.error('Failed to regenerate invite code')
        },
      },
    )
  }

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard'))
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 p-10">
            <p className="text-4xl font-bold uppercase tracking-widest">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant="ghost" size="sm">
              Copy Link <CopyIcon className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant="outline"
            >
              New Code
              <RefreshCcw className="ml-2 size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
