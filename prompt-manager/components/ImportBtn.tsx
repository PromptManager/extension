import React from "react";
import { importPrompts } from "~utils/promptUtils";
import { usePrompts } from "~hooks/usePrompts";

export function ImportBtn() {
  const { setPrompts } = usePrompts();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newPrompts = await importPrompts(file);
      setPrompts(() => newPrompts);
    }
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
    <label style={buttonStyle}>
      Import
      <input
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleImport}
      />
    </label>
  );
}