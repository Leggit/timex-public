import { createContext, useContext, useEffect, useState } from "react";
import { IProject } from "../types/project.interface";
import { useAuth } from "./auth";
import { supabase } from "../utils/supabase";

const ProjectsContext = createContext<{
  projects: IProject[];
  setProjectToRecentlyUsed: (projectCode: string) => void;
}>(null!);
export const useProjects = () => useContext(ProjectsContext);

export default function ProjectsProvider({ children }: any) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const setProjectToRecentlyUsed = (projectCode: string) => {
    const project = projects.find((p) => p.projectCode === projectCode);
    if (project) {
      project.recentlyUsed = true;
    }
  };

  const value = {
    projects,
    setProjectToRecentlyUsed,
  };

  useEffect(() => {
    if (user) {
      const getData = async () => {
        const { data, error } = await supabase.rpc("get_projects", {
          user_id: user.id,
        });

        if (error) {
          console.log(error);
        } else {
          setProjects(data);
        }
      };

      getData();
    }
  }, [user]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}
