import { SidebarItem } from '@/app/workspace/[workspaceId]/sidebar-item'
import { UserItem } from '@/app/workspace/[workspaceId]/user-item'
import { WorkspaceSection } from '@/app/workspace/[workspaceId]/workspace-section'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from 'lucide-react'
import { WorkspaceHeader } from './workspace-header'

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  })

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  })

  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!member || !workspace) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col bg-[#5E2c5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />
      <div className="mt-3 flex flex-col px-2">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Draft & Sent" icon={SendHorizonal} id="Draft" />
      </div>
      <WorkspaceSection label="Channels" hint="New channel" onNew={() => {}}>
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New Direct Messages"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
}
