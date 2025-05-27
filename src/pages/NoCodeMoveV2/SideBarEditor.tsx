import JSZip from "jszip";
import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function SideBarEditor({
  menu,
  setMenu,
  moduleCodes,
}: {
  menu: "Imports" | "Structs" | "Functions" | "CodePreview";
  setMenu: (menu: "Imports" | "Structs" | "Functions" | "CodePreview") => void;
  moduleCodes: Record<string, string>;
}) {
  const handleDownload = () => {
    const zip = new JSZip();

    Object.entries(moduleCodes).forEach(([moduleName, moduleCode]) => {
      zip.file(`sui_move/sources/${moduleName}.move`, moduleCode);
    });

    zip.file(
      `sui_move/tests/sui_move_tests.move`,
      `/*
#[test_only]
module simple_nft::simple_nft_tests;
// uncomment this line to import the module
// use simple_nft::simple_nft;

const ENotImplemented: u64 = 0;

#[test]
fun test_simple_nft() {
    // pass
}

#[test, expected_failure(abort_code = ::simple_nft::simple_nft_tests::ENotImplemented)]
fun test_simple_nft_fail() {
    abort ENotImplemented
}
*/`
    );

    const moveTomlContent = `[package]
name = "new"
edition = "2024.beta" # edition = "legacy" to use legacy (pre-2024) Move
# license = ""           # e.g., "MIT", "GPL", "Apache 2.0"
# authors = ["..."]      # e.g., ["Joe Smith (joesmith@noemail.com)", "John Snow (johnsnow@noemail.com)"]

[dependencies]

# For remote import, use the \`{ git = "...", subdir = "...", rev = "..." }\`.
# Revision can be a branch, a tag, and a commit hash.
# MyRemotePackage = { git = "https://some.remote/host.git", subdir = "remote/path", rev = "main" }

# For local dependencies use \`local = path\`. Path is relative to the package root
# Local = { local = "../path/to" }

# To resolve a version conflict and force a specific version for dependency
# override use \`override = true\`
# Override = { local = "../conflicting/version", override = true }

[addresses]
new = "0x0"

# Named addresses will be accessible in Move as \`@name\`. They're also exported:
# for example, \`std = "0x1"\` is exported by the Standard Library.
# alice = "0xA11CE"

[dev-dependencies]
# The dev-dependencies section allows overriding dependencies for \`--test\` and
# \`--dev\` modes. You can introduce test-only dependencies here.
# Local = { local = "../path/to/dev-build" }

[dev-addresses]
# The dev-addresses section allows overwriting named addresses for the \`--test\`
# and \`--dev\` modes.
# alice = "0xB0B"
`;

    zip.file(`sui_move/Move.toml`, moveTomlContent);

    // Object.entries(moduleCodes).map(([moduleName, moduleCode]) => {
    //   const blob = new Blob([moduleCode], { type: "text/plain" });
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `${moduleName}.move`;
    //   a.click();
    // });
    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "move_package.zip");
    });
  };
  return (
    <Sidebar className="bg-blue-50 min-h-screen ">
      <SidebarHeader>
        <SidebarHeader className="text-2xl font-bold">
          SuiMoveScratch
        </SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="space-y-1">
          <hr />
          <Button
            variant={menu === "Imports" ? "default" : "ghost"}
            className={`${
              menu === "Imports"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold
              `}
            onClick={() => setMenu("Imports")}
          >
            Imports
          </Button>
          <Button
            variant={menu === "Structs" ? "default" : "ghost"}
            className={`${
              menu === "Structs"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("Structs")}
          >
            Structs
          </Button>
          <Button
            variant={menu === "Functions" ? "default" : "ghost"}
            className={`${
              menu === "Functions"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("Functions")}
          >
            Functions
          </Button>
          <Button
            variant={menu === "CodePreview" ? "default" : "ghost"}
            className={`${
              menu === "CodePreview"
                ? "bg-black text-white hover:bg-black/90"
                : "text-gray-800 hover:bg-gray-100"
            } cursor-pointer py-6 text-lg font-semibold`}
            onClick={() => setMenu("CodePreview")}
          >
            CodePreview Preview
          </Button>

          <hr />

          <Button
            // variant={menu === "CodePreview" ? "default" : "ghost"}
            variant={"ghost"}
            className={`active:bg-black active:text-white hover:bg-gray-100
            cursor-pointer py-6 text-lg font-semibold`}
            // onClick={() => setMenu("CodePreview")}
          >
            Save Code
          </Button>
          <Button
            // variant={menu === "CodePreview" ? "default" : "ghost"}
            variant={"ghost"}
            className={`active:bg-black active:text-white hover:bg-gray-100
            cursor-pointer py-6 text-lg font-semibold`}
            onClick={handleDownload}
          >
            Download Code
          </Button>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
