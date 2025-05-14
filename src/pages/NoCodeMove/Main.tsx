import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useEffect, useState } from "react";
import Imports from "./_Imports";
import Structs from "./_Structs";
import Functions, { SuiMoveFunction } from "./_Functions";
import {
  Code2,
  Package,
  Layers,
  Webhook,
  GitBranch,
  ChevronRight,
  Download,
  Github,
} from "lucide-react";
import { downloadMoveCode, generateMoveCode } from "./utils/generateCode";

// Define type aliases to simplify complex generic types
type ImportType = Record<string, Record<string, SuiMoveNormalizedStruct>>;
type StructType = Record<string, SuiMoveNormalizedStruct>;
type FunctionType = Record<string, SuiMoveFunction>;

export default function Main() {
  // State declarations using simpler type references
  const [imports, setImports] = useState<ImportType>({});
  const [structs, setStructs] = useState<StructType>({});
  const [functions, setFunctions] = useState<FunctionType>({});
  const [activeTab, setActiveTab] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Confirmation on refresh to prevent accidental data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        Object.keys(imports).length > 0 ||
        Object.keys(structs).length > 0 ||
        Object.keys(functions).length > 0
      ) {
        e.preventDefault();
        e.returnValue = ""; // Required for some browsers
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [imports, structs, functions]);

  const tabs = ["Editor", "Preview", "Documentation"];

  // Handle download button click
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadMoveCode(imports, structs, functions);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center text-white">
                <Code2 size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                SuiMoveScratch
              </span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Home
              </a>
              <a
                href="#"
                className="font-medium text-purple-600 dark:text-purple-400 border-b-2 border-purple-500"
              >
                NoCodeMove
              </a>
              <a
                href="#"
                className="font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                PackageViewer1
              </a>
              <a
                href="#"
                className="font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                PackageViewer2
              </a>
            </nav>
            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center"
                onClick={handleDownload}
              >
                <Download size={18} className="mr-2" />
                Export Code
              </button>
              <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition">
                Get Started
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <a
                href="#"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Home
              </a>
              <a
                href="#"
                className="block py-2 text-purple-600 dark:text-purple-400 font-medium"
              >
                NoCodeMove
              </a>
              <a
                href="#"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                PackageViewer1
              </a>
              <a
                href="#"
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                PackageViewer2
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-3">
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center"
                  onClick={handleDownload}
                >
                  <Download size={18} className="mr-2" />
                  Export Code
                </button>
                <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-700 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-700 rounded-full filter blur-3xl"></div>
        </div>
        <div
          className={`container mx-auto px-4 py-16 relative z-10 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
              Web3 No-Code Development Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Build{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Move Smart Contracts
              </span>{" "}
              Without Coding
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              SuiMoveScratch empowers developers to create, test, and deploy
              Move smart contracts with an intuitive visual interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                Start Building
              </button>
              <button className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center space-x-2">
                <Github size={20} />
                <span>View on GitHub</span>
              </button>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>No Coding Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Testnet Compatible</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === index
                  ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(index);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className={`transition-opacity duration-300 ${
            activeTab === 0 ? "opacity-100" : "hidden opacity-0"
          }`}
        >
          <div
            className={`grid md:grid-cols-2 gap-6 transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Editor Panel */}
            <div className="flex flex-col space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Code2 size={18} className="text-purple-500" />
                    <h2 className="font-semibold text-lg">NoCode Editor</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-800 text-white p-4 rounded-xl">
                    <div className="text-purple-500 font-medium text-xl mb-2">
                      Imports
                    </div>
                    <Imports imports={imports} setImports={setImports} />
                  </div>
                  <div className="mt-6 bg-gray-800 text-white p-4 rounded-xl">
                    <div className="text-blue-500 font-medium text-xl mb-2">
                      Structs
                    </div>
                    <Structs
                      imports={imports}
                      structs={structs}
                      setStructs={setStructs}
                    />
                  </div>
                  <div className="mt-6 bg-gray-800 text-white p-4 rounded-xl">
                    <div className="text-green-500 font-medium text-xl mb-2">
                      Functions
                    </div>
                    <Functions
                      imports={imports}
                      structs={structs}
                      functions={functions}
                      setFunctions={setFunctions}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Webhook size={18} className="text-blue-500" />
                    <h2 className="font-semibold text-lg">Live Preview</h2>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center gap-1"
                      onClick={handleDownload}
                    >
                      <Download size={18} />
                      <span className="text-sm">Export</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-purple-600 dark:text-purple-400">
                      Imports
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-48">
                      {Object.entries(imports).length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                          No imports added yet
                        </div>
                      ) : (
                        Object.entries(imports).map(
                          ([pkgModuleName, module]) => (
                            <div key={pkgModuleName} className="mb-3">
                              <div className="text-lg font-semibold flex items-center space-x-2">
                                <Package size={16} />
                                <span>
                                  {pkgModuleName.split("::")[0].slice(0, 4)}...
                                  {pkgModuleName.split("::")[0].slice(-3)}::
                                  {pkgModuleName.split("::")[1]}
                                </span>
                              </div>
                              {Object.entries(module).map(
                                ([moduleName, moduleData]) => (
                                  <div
                                    key={moduleName}
                                    className="ml-6 mt-1 text-sm border-l-2 border-gray-300 dark:border-gray-600 pl-3"
                                  >
                                    <div className="font-medium">
                                      {moduleName}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400 text-xs font-mono whitespace-pre-wrap overflow-hidden text-ellipsis">
                                      {JSON.stringify(
                                        moduleData,
                                        null,
                                        2
                                      ).substring(0, 100)}
                                      ...
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400">
                      Structs
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-48">
                      {Object.entries(structs).length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                          No structs added yet
                        </div>
                      ) : (
                        Object.entries(structs).map(([key, value]) => (
                          <div key={key} className="mb-3">
                            <div className="text-lg font-semibold flex items-center space-x-2">
                              <Layers size={16} />
                              <span>{key}</span>
                            </div>
                            <div className="ml-6 mt-1 text-sm text-gray-500 dark:text-gray-400 font-mono whitespace-pre-wrap overflow-hidden text-ellipsis">
                              {JSON.stringify(value, null, 2).substring(0, 100)}
                              ...
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400">
                      Functions
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto max-h-48">
                      {Object.entries(functions).length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                          No functions added yet
                        </div>
                      ) : (
                        Object.entries(functions).map(([key, value]) => (
                          <div key={key} className="mb-3">
                            <div className="text-lg font-semibold flex items-center space-x-2">
                              <GitBranch size={16} />
                              <span>{key}</span>
                            </div>
                            <div className="ml-6 mt-1 text-sm text-gray-500 dark:text-gray-400 font-mono whitespace-pre-wrap overflow-hidden text-ellipsis">
                              {JSON.stringify(value, null, 2).substring(0, 100)}
                              ...
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Documentation Tab */}
        <div
          className={`transition-opacity duration-300 ${
            activeTab === 2 ? "opacity-100" : "hidden opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-4">
              NoCodeMove Documentation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Learn how to use the NoCodeMove editor to create Move smart
              contracts without writing a single line of code.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    1
                  </span>
                  <span>Adding Imports</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-10">
                  Start by importing existing modules from the Sui blockchain.
                  Click on "➕ Import 추가" button and enter the module address
                  and name.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    2
                  </span>
                  <span>Creating Structs</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-10">
                  Define your data structures by clicking "➕ Struct 추가". Add
                  fields and set abilities like Copy, Drop, Store, and Key. You
                  can also add type parameters with constraints and phantom
                  modifiers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    3
                  </span>
                  <span>Adding Functions</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-10">
                  Create functions to manipulate your structs. Click "➕
                  Function 추가", set visibility, add parameters and return
                  types. Configure type parameters with ability constraints.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    4
                  </span>
                  <span>Type Parameters</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-10">
                  Use type parameters to create generic structs and functions.
                  Click on the type parameter dropdown to select abilities, set
                  phantom modifiers for structs, and customize names.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    5
                  </span>
                  <span>Exporting Code</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-10">
                  Once your contract is ready, click the "Export Code" button to
                  download the generated Move source code for compilation and
                  deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Preview Tab */}
        <div
          className={`transition-opacity duration-300 ${
            activeTab === 1 ? "opacity-100" : "hidden opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-4">Generated Move Code</h2>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
                {generateMoveCode({
                  imports,
                  structs,
                  functions,
                  structTypeParameterNames,
                  functionTypeParameterNames,
                }) ||
                  "// No code generated yet. Add imports, structs, or functions to see the generated code."}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download size={18} />
                Download Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center text-white">
                  <Code2 size={20} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  SuiMoveScratch
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Building the future of Web3 development through intuitive
                no-code tools.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.057 10.057 0 01-3.127 1.184A4.92 4.92 0 0011.8 8.292a13.95 13.95 0 01-10.134-5.13 4.916 4.916 0 001.524 6.57 4.88 4.88 0 01-2.23-.618v.06a4.923 4.923 0 003.95 4.828 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.6 3.42 9.863 9.863 0 01-6.1 2.107A9.99 9.99 0 010 19.542a13.94 13.94 0 007.548 2.212c9.054 0 14.004-7.5 14.004-14.001 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59l-.047-.02z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Product
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Resources
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Company
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    Press Kit
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
              © 2023 SuiMoveScratch. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
