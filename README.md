
# SuiMoveScratch

**Visualize and Explore Move Smart Contracts Without Writing Code**

SuiMoveScratch is a no-code developer tool that transforms Move smart contracts into intuitive, visual building blocks. Designed for developers, learners, and blockchain enthusiasts, this tool helps you explore the structure of Move modules deployed on the Sui blockchain without having to read the raw code.

---

## Features

-  Generates structured Move code 
-  Renders structs, functions, imports, and constants as block-style cards
-  Helps beginners understand Move smart contracts visually
-  Extensible architecture for future versions (drag-and-drop, composable code generation, etc.)

---

## Installation & Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/BlockBlockYonsei/SuiMoveScratch.git
cd SuiMoveScratch

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How It Works

1. You provide a `move_source_code.json` file in the `public/` directory  
   (It should contain parsed Move code as structured JSON)
2. The app parses the file and identifies:
   - Modules
   - Structs and their fields
   - Functions and their parameters
   - Type parameters and return values
3. Each element is rendered as a UI "block" similar to Scratch cards
4. You can visually browse the contract logic without looking at raw code

---

## License

MIT License  
Feel free to fork, remix, or contribute under the terms of the license.

---

## Authors

Made by **BlockBlock Yonsei**  
- 🧑‍🎓 Blockchain club at Yonsei University
- 🌐 [BlokBlock Website](https://blockblock-website.onrender.com/)
- 🔗 [BlockBlock Twitter](https://x.com/ysblockblock)

---

## Useful Links

- 🔗 [SuiMoveScratch GitHub](https://github.com/BlockBlockYonsei/SuiMoveScratch)
- 🔗 [SuiMoveScratch Twitter](https://x.com/suimovescratch)
- 🧠 Learn more about Move language: [https://move-language.github.io](https://move-language.github.io)
- 🌐 [Sui Official Docs](https://docs.sui.io)
