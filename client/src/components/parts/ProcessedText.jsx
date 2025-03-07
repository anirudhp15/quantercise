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
  .markdown-content h1, .markdown-content h2, .markdown-content h3 {
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  .markdown-content h1 { font-size: 1.5rem; }
  .markdown-content h2 { font-size: 1.25rem; }
  .markdown-content h3 { font-size: 1.125rem; }
  
  .markdown-content p {
    margin-bottom: 1rem;
  }
  
  .markdown-content ul, .markdown-content ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .markdown-content ul { list-style-type: disc; }
  .markdown-content ol { list-style-type: decimal; }
  
  .markdown-content table {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;
  }
  
  .markdown-content th, .markdown-content td {
    border: 1px solid #4b5563;
    padding: 0.5rem;
  }
  
  .markdown-content blockquote {
    border-left: 3px solid #4b5563;
    padding-left: 1rem;
    color: #9ca3af;
    margin: 1rem 0;
  }
  
  /* Center LaTeX math expressions */
  .katex-display {
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 1rem 0;
  }
  
  /* Ensure inline math is properly aligned */
  .katex {
    display: inline-block;
    text-align: center;
  }
  
  /* Add spacing between math elements */
  .math-block {
    display: block;
    margin: 1em 0;
  }
  
  /* Fix LaTeX delimiters for double dollar signs */
  .katex-display > .katex {
    text-align: center;
    display: block;
  }
  
  /* Blinking cursor animation */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .animate-blink {
    animation: blink 1s step-end infinite;
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
  return (
    <div className={inline ? "math-inline" : "math-block"}>
      {/* Placeholder for the math content that will be rendered by KaTeX */}
      {value}
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

  // Enhanced buffered rendering approach
  useEffect(() => {
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // If not streaming or text hasn't been set yet, update immediately
    if (!isStreaming || !renderedText) {
      setRenderedText(text);
      prevTextLengthRef.current = text.length;
      return;
    }

    // During streaming, only update when:
    // 1. Text changes significantly (30+ characters)
    // 2. Text contains completed LaTeX expressions
    // 3. Text appears to have completed a sentence or paragraph
    const shouldUpdateImmediately =
      text.length - prevTextLengthRef.current > 30 ||
      (text.includes("$$") && text.split("$$").length % 2 === 1) || // Complete block LaTeX
      text.match(/\.\s*$/) || // Ends with a period and space
      text.match(/\n\s*$/) || // Ends with a newline
      text.length === 0; // Empty text

    if (shouldUpdateImmediately) {
      setRenderedText(text);
      prevTextLengthRef.current = text.length;
    } else {
      // Schedule a delayed update to prevent too many re-renders
      updateTimeoutRef.current = setTimeout(() => {
        setRenderedText(text);
        prevTextLengthRef.current = text.length;
      }, 500); // Buffer for 500ms
    }

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [text, isStreaming]);

  // Split the text to properly handle LaTeX blocks with $$ delimiters
  const processText = (text) => {
    if (!text) return "";

    // Insert a space after each bracket to prevent formatting issues
    return text.replace(/(\[|\])/g, "$1 ");
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              throwOnError: false,
              strict: false,
              trust: true, // Trust the LaTeX input
              macros: {
                // Common LaTeX macros used in math
                "\\N": "\\mathbb{N}",
                "\\Z": "\\mathbb{Z}",
                "\\Q": "\\mathbb{Q}",
                "\\R": "\\mathbb{R}",
                "\\C": "\\mathbb{C}",
              },
            },
          ],
          [rehypeHighlight, { ignoreMissing: true }],
        ]}
        components={{
          code: CodeBlock,
          pre({ node, children, ...props }) {
            return (
              <pre className="relative rounded-md" {...props}>
                {children}
              </pre>
            );
          },
          // Add specific handling for math elements
          math: ({ value }) => <MathComponent value={value} inline={false} />,
          inlineMath: ({ value }) => (
            <MathComponent value={value} inline={true} />
          ),
        }}
      >
        {processText(renderedText)}
      </ReactMarkdown>

      {/* Add a blinking cursor during streaming */}
      {isStreaming && (
        <span className="inline-block ml-1 w-2 h-4 bg-white animate-blink"></span>
      )}
    </div>
  );
};

export default ProcessedText;
