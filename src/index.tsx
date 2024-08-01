import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/inter";
import AuthProvider from "./hooks/auth";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import BankHolidayProvider from "./hooks/bank-holidays";
import HolidaysProvider from "./hooks/holidays";
import ProjectsProvider from "./hooks/projects";
import ResourceManagersProvider from "./hooks/resource-managers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <CssVarsProvider>
      <CssBaseline />
      <BankHolidayProvider>
        <AuthProvider>
          <HolidaysProvider>
            <ProjectsProvider>
              <ResourceManagersProvider>
                <App />
              </ResourceManagersProvider>
            </ProjectsProvider>
          </HolidaysProvider>
        </AuthProvider>
      </BankHolidayProvider>
    </CssVarsProvider>
  </React.StrictMode>,
);
