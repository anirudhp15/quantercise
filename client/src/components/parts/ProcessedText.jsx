import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { FaCheck, FaCopy } from "react-icons/fa";

/**
 * ProcessedText component - processes and renders text with LaTeX expressions
 * @param {Object} props - Component props
 * @param {string} props.text - The text content to process and render
 * @param {boolean} props.isStreaming - Whether the content is currently streaming in
 * @returns {React.ReactElement} - Rendered component
 */

// Styles for markdown content
const markdownStyles = `
  /* Modern ChatGPT-like styling for AI responses */
  .markdown-content {
    color: #ffffff;
    font-family: "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.01em;
    padding: 0.5rem 0;
  }

  .markdown-content h1, .markdown-content h2, .markdown-content h3 {
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }
  .markdown-content h1 { font-size: 1.5rem; }
  .markdown-content h2 { font-size: 1.25rem; }
  .markdown-content h3 { font-size: 1.125rem; }
  
  .markdown-content p {
    margin-bottom: 0.75rem;
    line-height: 1.6;
    color: #ffffff;
  }
  
  .markdown-content ul, .markdown-content ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }
  
  .markdown-content ul { list-style-type: disc; }
  .markdown-content ol { list-style-type: decimal; }
  
  .markdown-content table {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;
    color: #ffffff;
  }
  
  .markdown-content th, .markdown-content td {
    border: 1px solid #4b5563;
    padding: 0.5rem;
    color: #ffffff;
  }
  
  .markdown-content blockquote {
    border-left: 3px solid #4b5563;
    padding-left: 1rem;
    color: #ffffff;
    font-style: italic;
    margin: 1rem 0;
  }
  
  /* Regular strong text styling - no more special section headings */
  .markdown-content strong {
    font-weight: 600;
    color: #ffffff;
  }
  
  /* Center LaTeX math expressions */
  .katex-display {
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 1rem 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
  }
  
  /* Ensure inline math is properly aligned */
  .katex {
    display: inline-block;
    text-align: center;
    min-width: min-content;
    font-size: 1.1em;
  }
  
  /* Add spacing between math elements and ensure proper width */
  .math-block {
    display: block;
    margin: 1em 0;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 0;
  }
  
  /* Ensure fractions and other math elements render properly */
  .katex-html {
    min-width: min-content;
  }
  
  /* Fix LaTeX delimiters for double dollar signs */
  .katex-display > .katex {
    text-align: center;
    display: block;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
  }
  
  /* Blinking cursor animation */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .animate-blink {
    animation: blink 1s step-end infinite;
  }
  
  /* Pulse animation for new text */
  @keyframes pulse-opacity {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
  
  .animate-pulse-opacity {
    animation: pulse-opacity 0.5s ease-in-out;
  }
  
  /* Highlight category assessment in brackets */
  .category-assessment {
    color: #10b981;
    font-weight: 600;
  }
`;

// Add this new component for the copy button functionality
const CodeBlock = ({ children, className, inline }) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, "");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className={`bg-gray-700 px-1 py-0.5 rounded text-sm ${className || ""}`}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <pre className="overflow-x-auto p-3 my-2 bg-gray-700 rounded-md">
        <code className={className}>{children}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 focus:outline-none transition-opacity opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <FaCheck size={14} className="text-green-400" />
        ) : (
          <FaCopy size={14} />
        )}
      </button>
    </div>
  );
};

// Component for math expressions
const MathComponent = ({ value, inline }) => {
  // Ensure the value is properly processed and doesn't get truncated
  const processedValue = value ? value.trim() : "";

  return (
    <div
      className={inline ? "math-inline" : "math-block"}
      style={{
        overflowX: "auto",
        maxWidth: "100%",
        padding: inline ? "0 0.25rem" : "0.5rem 0",
        backgroundColor: inline ? "rgba(0, 0, 0, 0.1)" : "transparent",
        borderRadius: inline ? "64px" : "0",
      }}
    >
      <div
        style={{
          display: "inline-block",
          minWidth: "min-content",
          color: "#ffffff",
        }}
      >
        {processedValue}
      </div>
    </div>
  );
};

const ProcessedText = ({ text, isStreaming }) => {
  const [renderedText, setRenderedText] = useState("");
  const updateTimeoutRef = useRef(null);
  const prevTextLengthRef = useRef(0);

  // Add styling to head
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = markdownStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update rendered text when input text changes
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const processContent = () => {
      if (!text) {
        setRenderedText("");
        return;
      }

      // Optimize LaTeX processing for streaming
      let processedText = text;

      // Only perform intensive LaTeX processing when needed
      if (text.includes("$")) {
        // Fix common LaTeX issues that might be coming from the API
        processedText = text
          // Replace any "\\" with "\"
          .replace(/\\\\/g, "\\")
          // Handle escaped dollar signs properly
          .replace(/\\\$/g, "\\\\$")
          // Fix any instances where backslashes might be double-escaped
          .replace(/\\\\([^\\])/g, "\\$1");

        // Now properly format LaTeX delimiters
        processedText = processedText
          // Process LaTeX blocks ($$...$$) - capture content more carefully
          .replace(/(?<!\\\$)\$\$(.*?)\$\$(?!\$)/gs, function (match, p1) {
            // Remove any truncation that might be occurring (like if formula ends with just "1")
            return `$$${p1}$$`;
          })
          // Process inline LaTeX ($...$) - more robust matching
          .replace(/(?<!\\\$)\$(.*?)\$(?!\$)/g, function (match, p1) {
            // Remove any truncation that might be occurring
            return `$${p1}$`;
          });
      }

      setRenderedText(processedText);
    };

    // If streaming, process immediately for faster updates
    if (isStreaming) {
      // Use a shorter debounce time (25ms) for streaming to feel responsive
      // but still batch updates to prevent too many re-renders
      updateTimeoutRef.current = setTimeout(processContent, 25);
    } else {
      // For non-streaming content, process immediately
      processContent();
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [text, isStreaming]);

  // Custom renderer for strong elements - simplified without section headings
  const StrongRenderer = ({ children }) => {
    const content = String(children);

    // Check if this is a category assessment in brackets
    if (
      content.match(
        /\[(strongly wrong|weakly wrong|undefined|weakly right|strongly right)\]/i
      )
    ) {
      return <strong className="category-assessment">{children}</strong>;
    }

    // Default case - regular strong text
    return <strong>{children}</strong>;
  };

  return (
    <div className="relative">
      <div className="overflow-x-hidden markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[
            [
              rehypeKatex,
              {
                throwOnError: false,
                strict: false,
                trust: true,
                macros: {
                  // Common macros used in financial formulas
                  "\\N": "\\mathbb{N}",
                  "\\Z": "\\mathbb{Z}",
                  "\\Q": "\\mathbb{Q}",
                  "\\R": "\\mathbb{R}",
                  "\\C": "\\mathbb{C}",
                  // Financial notation
                  "\\FRA": "\\text{FRA}",
                  "\\PV": "\\text{PV}",
                  "\\FV": "\\text{FV}",
                  "\\NPV": "\\text{NPV}",
                  "\\IRR": "\\text{IRR}",
                  "\\Rc": "R_\\text{c}",
                  "\\Rs": "R_\\text{s}",
                  "\\frac": "\\frac",
                },
              },
            ],
            rehypeHighlight,
          ]}
          components={{
            code: CodeBlock,
            // Custom handling for inline and block math
            math: ({ value }) => <MathComponent value={value} inline={false} />,
            inlineMath: ({ value }) => (
              <MathComponent value={value} inline={true} />
            ),
            strong: StrongRenderer,
          }}
        >
          {renderedText}
        </ReactMarkdown>
      </div>

      {isStreaming && !renderedText.trim() && (
        <span className="inline-block ml-1 w-2 h-4 bg-blue-500 animate-blink" />
      )}
    </div>
  );
};

export default ProcessedText;
