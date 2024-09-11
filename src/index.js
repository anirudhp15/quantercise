import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App";
import { LowDetailProvider } from "./contexts/LowDetailContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <LowDetailProvider>
        <App />
      </LowDetailProvider>
    </ChakraProvider>
  </React.StrictMode>
);
