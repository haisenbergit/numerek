interface WorkspaceIdPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceIdPage({
  params,
}: WorkspaceIdPageProps) {
  const { workspaceId } = await params;
  return (
    <div className="justify-top flex h-screen w-screen flex-col items-center gap-4 p-5">
      <div>Welcome to Workspace: {workspaceId}</div>
    </div>
  );
}
