import React from "react";
import { exportPrompts } from "~utils/promptUtils";
import { usePrompts } from "~hooks/usePrompts";

export function ExportBtn() {
  const { prompts } = usePrompts();

  const handleExport = () => {
    exportPrompts(prompts, "prompts.json");
  };

  const buttonStyle: React.CSSProperties = {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <button onClick={handleExport} style={buttonStyle}>
      Export
    </button>
  );
}