import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App";
import { LowDetailProvider } from "./contexts/LowDetailContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ChakraProvider>
        <LowDetailProvider>
          <App />
        </LowDetailProvider>
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>
);
