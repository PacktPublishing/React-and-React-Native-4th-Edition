import * as React from "react";

export const StatusContext = React.createContext();

export function StatusProvider({ children }) {
  const value = React.useState("set a status");

  return (
    <StatusContext.Provider value={value}>
      {children}
    </StatusContext.Provider>
  );
}
