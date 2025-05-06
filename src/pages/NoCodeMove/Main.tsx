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

  // Generate Move code for download
  const generateMoveCode = () => {
    let code = "";
    // Add imports
    Object.entries(imports).forEach(([path, modules]) => {
      const pkgName = path.split("::")[0];
      const moduleName = path.split("::")[1];
      const structNames = Object.keys(modules).join(", ");
      code += `use ${pkgName}::${moduleName}::{${structNames}};\n`;
    });
    code += "\n";
    // Add structs
    Object.entries(structs).forEach(([name, data]) => {
      const abilities =
        data.abilities.abilities.length > 0
          ? ` has ${data.abilities.abilities.join(", ")}`
          : "";
      code += `struct ${name}${abilities} {\n`;
      // Add fields
      data.fields.forEach((field) => {
        const typeStr =
          typeof field.type === "string"
            ? field.type
            : "Struct" in field.type
            ? field.type.Struct.name
            : "Unknown";
        code += `    ${field.name}: ${typeStr},\n`;
      });
      code += "}\n\n";
    });
    // Add functions
    Object.entries(functions).forEach(([name, data]) => {
      const visibility = data.function.visibility.toLowerCase();
      const entryStr = data.function.isEntry ? "entry " : "";
      code += `${visibility} ${entryStr}fun ${name}(`;
      // Add parameters
      const paramStrs = data.function.parameters.map((param, i) => {
        const typeStr =
          typeof param === "string"
            ? param
            : "Struct" in param
            ? param.Struct.name
            : "Unknown";
        return `param${i}: ${typeStr}`;
      });
      code += paramStrs.join(", ");
      code += ")";
      // Add return types
      if (data.function.return.length > 0) {
        const returnStrs = data.function.return.map((ret) => {
          return typeof ret === "string"
            ? ret
            : "Struct" in ret
            ? ret.Struct.name
            : "Unknown";
        });
        code += `: (${returnStrs.join(", ")})`;
      }
      code += " {\n    // Function implementation\n}\n\n";
    });
    return code;
  };

  // Handle download button click
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const code = generateMoveCode();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated_move_code.move";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                  fields and set abilities like Copy, Drop, Store, and Key.
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
                  types.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    4
                  </span>
                  <span>Deploying to Testnet</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 ml-10">
                  Once your contract is ready, click the "Deploy" button to
                  compile and deploy to the Sui testnet.
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
                {generateMoveCode() ||
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

      {/* Testnet Interaction Panel */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-gray-100">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-2 rounded-lg mr-3">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </span>
                  Deploy to Sui Testnet
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Testnet Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>2,456 Active Developers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Compilation Status
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          Ready
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Gas Estimation
                        </span>
                        <span className="font-medium">~0.0025 SUI</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>Low</span>
                        <span>Recommended</span>
                        <span>High</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                        <div className="absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-300 rounded-full border-2 border-blue-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Deploy Contract
                    </button>
                    <button className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Testnet Explorer
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 bg-gray-50 dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Connect Wallet
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          S
                        </span>
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Sui Wallet
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                          M
                        </span>
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        MetaMask
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          W
                        </span>
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        WalletConnect
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2">Need testnet tokens?</p>
                    <a
                      href="#"
                      className="text-purple-600 dark:text-purple-400 hover:underline font-medium flex items-center"
                    >
                      Visit Faucet
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-b from-purple-600 to-blue-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div
            className={`max-w-3xl mx-auto transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Build the Future of Web3?
            </h2>
            <p className="text-lg text-purple-100 mb-8">
              Join thousands of developers creating innovative applications on
              the Sui blockchain with SuiMoveScratch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                Register for Hackathon
              </button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div>
                <div className="text-2xl font-bold">3,500+</div>
                <div className="text-purple-200">Active Developers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">45+</div>
                <div className="text-purple-200">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$2.5M+</div>
                <div className="text-purple-200">Ecosystem Funding</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
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
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm-6 12c0-.341.03-.677.088-1h4.222v3H5.819A6.006 6.006 0 016 12zm11.293 5.707A6.001 6.001 0 0112 18c-3.308 0-6-2.692-6-6H2a10 10 0 0010 10 10 10 0 006.207-2.151l-3.039-3.039 1.414-1.414 3.128 3.129A6.002 6.002 0 0018 12h4V9h4.1c-.059-.329-.13-.649-.211-.962L16.5 9.5l-1.414-1.414 1.357-1.357A8.058 8.058 0 0012 2C6.477 2 2 6.477 2 12h4a6 6 0 016-6c1.1 0 2.128.299 3.01.82L13.6 8.232l-1.432-1.432A5.977 5.977 0 0012 6.812c2.86 0-5.188 2.328-5.188 5.188a5.18 5.18 0 00.093 1H12.5c.413 0 .75.337.75.75v4.5c0 .825.675 1.5 1.5 1.5a1.505 1.505 0 001.5-1.5V13h1.5c.563 0 1.059-.34 1.268-.853A5.968 5.968 0 0118 11.999h4A10.003 10.003 0 0017.293 17.707z" />
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
