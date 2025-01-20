import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProjectsTable({ projects = [] }) {
  // Default to an empty array
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Projects</CardTitle>
        <span className="text-sm text-muted-foreground">
          30 done this month
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="h-10 w-10 rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {project.members.map((member, i) => (
                      <Avatar key={i} className="border-2 border-background">
                        <AvatarImage src={member.avatar} />
                      </Avatar>
                    ))}
                  </div>
                  <div className="w-24 text-right">
                    <p className="text-sm font-medium">{project.budget}</p>
                  </div>
                  <div className="w-32">
                    <Progress value={project.completion} className="h-2" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No projects available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
