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

            // 2. Interactive Prompts
            const answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "uiPath",
                    message: "Where would you like to store your UI components?",
                    default: "src/components/ui",
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
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
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
