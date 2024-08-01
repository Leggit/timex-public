import { createContext, useContext, useEffect, useState } from "react";
import { IResourceManager } from "../types/resource-manager.interface";
import { supabase } from "../utils/supabase";

const ResourceManagersContext = createContext<IResourceManager[]>([]);

export const useResourceManagers = () => useContext(ResourceManagersContext);

export default function ResourceManagersProvider({ children }: any) {
  const [resourceManagers, setResourceManagers] = useState<IResourceManager[]>(
    [],
  );

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from("resource_managers")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setResourceManagers(data);
      }
    };

    getData();
  }, []);

  return (
    <ResourceManagersContext.Provider value={resourceManagers}>
      {children}
    </ResourceManagersContext.Provider>
  );
}
