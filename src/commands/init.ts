import { Command } from "commander"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import inquirer from "inquirer"
import ora from "ora"
import { execa } from "execa"

export const init = new Command()
    .name("init")
    .description("Initialize the project for Vedix UI")
    .action(async () => {
        const spinner = ora("Initializing Vedix UI...").start()

        try {
            const cwd = process.cwd()

            // 1. Detect React + TypeScript
            const packageJsonPath = path.join(cwd, "package.json")
            if (!fs.existsSync(packageJsonPath)) {
                spinner.fail("package.json not found. Please run this in a project root.")
                return
            }

            const packageJson = await fs.readJSON(packageJsonPath)
            const isReact = packageJson.dependencies?.react || packageJson.devDependencies?.react
            const isTS = fs.existsSync(path.join(cwd, "tsconfig.json"))

            if (!isReact) {
                spinner.warn("React not detected. This library is designed for React.")
            }
            if (!isTS) {
                spinner.warn("TypeScript not detected. This library is optimized for TypeScript.")
            }

            spinner.stop()
            console.log(chalk.blue("\nDetecting project structure..."))

            // 2. Smart Path Detection
            let defaultUiPath = "src/components/ui"
            if (fs.existsSync(path.join(cwd, "src/components"))) {
                defaultUiPath = "src/components/ui"
            } else if (fs.existsSync(path.join(cwd, "components"))) {
                defaultUiPath = "components/ui"
            } else if (fs.existsSync(path.join(cwd, "src"))) {
                defaultUiPath = "src/components/ui"
            } else {
                defaultUiPath = "components/ui"
            }

            // 3. Interactive Prompts
            const answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "uiPath",
                    message: "Where would you like to store your UI components?",
                    default: defaultUiPath,
                },
            ])

            spinner.start("Creating configuration...")

            // 3. Create config file
            const config = {
                uiPath: answers.uiPath,
                theme: "mine", // Custom theme as requested
            }
            await fs.writeJSON(path.join(cwd, "vedix.config.json"), config, { spaces: 2 })

            // 4. Create directory structure
            const uiDir = path.resolve(cwd, answers.uiPath)
            await fs.ensureDir(uiDir)

            // 5. Create utils.ts
            const utilsDir = path.resolve(cwd, "src/lib")
            await fs.ensureDir(utilsDir)
            const utilsTemplatePath = path.join(__dirname, "utils.ts")
            const utilsTargetPath = path.join(utilsDir, "utils.ts")

            if (fs.existsSync(utilsTemplatePath)) {
                await fs.copy(utilsTemplatePath, utilsTargetPath)
            } else {
                // Fallback if template copy fails
                await fs.writeFile(utilsTargetPath, `import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n    return twMerge(clsx(inputs))\n}\n`)
            }

            // 6. Create globals.css with Dark/Light variables
            const stylesDir = path.resolve(cwd, "src/styles")
            await fs.ensureDir(stylesDir)
            const cssPath = path.join(stylesDir, "globals.css")
            if (!fs.existsSync(cssPath)) {
                const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Premium Navy-Gold Light Theme ── */
    --background: 205 20% 98%;
    --foreground: 205 40% 12%;
    
    --card: 205 15% 99%;
    --card-foreground: 205 40% 12%;
    
    --popover: 205 15% 99%;
    --popover-foreground: 205 40% 12%;
    
    --primary: 205 40% 18%;
    --primary-foreground: 0 0% 98%;
    
    --secondary: 205 10% 93%;
    --secondary-foreground: 205 40% 15%;
    
    --muted: 205 10% 94%;
    --muted-foreground: 205 15% 45%;
    
    --accent: 205 10% 93%;
    --accent-foreground: 205 40% 15%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 205 20% 88%;
    --input: 205 20% 88%;
    --ring: 205 40% 15%;
    
    --radius: 0.75rem;
  }

  .dark {
    /* ── Premium Navy-Gold Dark Theme ── */
    --background: 205 34% 6%;
    --foreground: 0 0% 94%;
    
    --card: 205 30% 9%;
    --card-foreground: 0 0% 94%;
    
    --popover: 205 30% 9%;
    --popover-foreground: 0 0% 94%;
    
    --primary: 0 0% 91%;
    --primary-foreground: 240 6% 10%;
    
    --secondary: 205 20% 16%;
    --secondary-foreground: 0 0% 90%;
    
    --muted: 205 20% 14%;
    --muted-foreground: 240 4% 60%;
    
    --accent: 205 20% 16%;
    --accent-foreground: 0 0% 90%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 205 20% 18%;
    --input: 205 20% 18%;
    --ring: 0 0% 91%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}

/* ── Premium Vedix Utilities ── */
@layer utilities {
  .vedix-gradient-bg {
    background: linear-gradient(135deg, #25343F 0%, #A07020 40%, #C9963E 100%);
  }
  
  .vedix-gradient-text {
    background: linear-gradient(135deg, #25343F 0%, #A07020 35%, #C9963E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gold-glow {
    box-shadow: 0 0 20px rgba(160, 112, 32, 0.2);
  }

  .gold-border {
    border-color: rgba(160, 112, 32, 0.3) !important;
  }
}`
                await fs.writeFile(cssPath, cssContent)
            }

            // 7. Install base dependencies
            spinner.text = "Installing core dependencies (tailwind-merge, clsx, lucide-react, framer-motion)..."
            try {
                await execa("npm", ["install", "tailwind-merge", "clsx", "lucide-react", "framer-motion"], { cwd })
                spinner.succeed(chalk.green("Vedix UI initialized successfully!"))
                console.log(chalk.blue(`\nComponents folder: ${answers.uiPath}`))
                console.log(chalk.blue(`Utility file: src/lib/utils.ts`))
                console.log(chalk.blue(`Config file: vedix.config.json\n`))
            } catch (err) {
                spinner.fail("Failed to install base dependencies.")
                console.error(err)
            }
        } catch (error) {
            spinner.fail("An error occurred during initialization.")
            console.error(error)
        }
    })
