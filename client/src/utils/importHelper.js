/**
 * Import Helper Utility
 *
 * This utility provides functions to help with managing imports in the codebase,
 * making it easier to reference different parts of the application with consistent paths.
 *
 * Using this helper can reduce errors when refactoring directory structures.
 */

// Base paths
export const PATHS = {
  // Components
  COMPONENTS: {
    COMMON: "./components/common",
    AUTH: "./components/auth",
    DASHBOARD: "./components/dashboard",
    PROBLEMS: "./components/problems",
    ANALYTICS: "./components/analytics",
    LANDING: "./components/landing",
    LAYOUT: "./components/layout",
  },

  // Core app elements
  CONTEXTS: "./contexts",
  HOOKS: "./hooks",
  UTILS: "./utils",
  ASSETS: "./assets",

  // Specific hooks
  HOOKS_FETCH: "./hooks/useFetch",
  HOOKS_UI: "./hooks/useUI",
  HOOKS_PROBLEMS: "./hooks/useProblems",

  // Assets
  IMAGES: "./assets/images",
  VIDEOS: "./assets/videos",
};

/**
 * Creates an import path relative to the src directory
 * @param {string} basePath - The base path from PATHS object
 * @param {string} specificPath - Additional path segments
 * @returns {string} The complete relative import path
 */
export const getImportPath = (basePath, specificPath = "") => {
  if (!specificPath) return basePath;
  return `${basePath}/${specificPath}`;
};

/**
 * Creates an import path relative to the current file's directory
 * @param {number} levelsUp - How many directory levels to go up
 * @param {string} basePath - The base path from PATHS object
 * @param {string} specificPath - Additional path segments
 * @returns {string} The complete relative import path
 */
export const getRelativeImportPath = (
  levelsUp,
  basePath,
  specificPath = ""
) => {
  const prefix = "../".repeat(levelsUp);
  const path = basePath.startsWith("./") ? basePath.substring(2) : basePath;
  if (!specificPath) return `${prefix}${path}`;
  return `${prefix}${path}/${specificPath}`;
};

export default {
  PATHS,
  getImportPath,
  getRelativeImportPath,
};
