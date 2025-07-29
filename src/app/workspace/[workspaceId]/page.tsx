'use client'

import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Loader, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

const WorkSpacesPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  })

  const channelId = useMemo(() => channels?.[0]?._id, [channels])
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

  useEffect(() => {
    if (
      !workspace ||
      !member ||
      memberLoading ||
      workspaceLoading ||
      channelsLoading
    )
      return

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!open && isAdmin) {
      setOpen(true)
    }
  }, [
    channelId,
    isAdmin,
    workspace,
    member,
    memberLoading,
    workspaceLoading,
    channelsLoading,
    open,
    setOpen,
    router,
    workspaceId,
  ])

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
        <Loader className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
        <TriangleAlert className="text-muted-foreground size-6" />
        <span className="text-muted-foreground text-sm">
          Workspace not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
      <TriangleAlert className="text-muted-foreground size-6" />
      <span className="text-muted-foreground text-sm">not channel found</span>
    </div>
  )
}

export default WorkSpacesPage
