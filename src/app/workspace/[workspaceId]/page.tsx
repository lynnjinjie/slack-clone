interface WorkSpacesPageProps {
  params: {
    workspaceId: string
  }
}

const WorkSpacesPage = ({ params }: WorkSpacesPageProps) => {
  return <div>Id:{params.workspaceId}</div>
}

export default WorkSpacesPage
