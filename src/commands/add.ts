import { Command } from "commander"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import ora from "ora"
import { execa } from "execa"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Registry of available components and their dependencies
const REGISTRY: Record<string, { dependencies: string[] }> = {
    button: {
        dependencies: ["lucide-react", "@radix-ui/react-slot"],
    },
    badge: {
        dependencies: [],
    },
    card: {
        dependencies: [],
    },
    input: {
        dependencies: [],
    },
    textarea: {
        dependencies: [],
    },
    checkbox: {
        dependencies: ["@radix-ui/react-checkbox", "lucide-react"],
    },
    accordion: {
        dependencies: ["@radix-ui/react-accordion", "lucide-react"],
    },
    dialog: {
        dependencies: ["@radix-ui/react-dialog", "lucide-react"],
    },
    tabs: {
        dependencies: ["@radix-ui/react-tabs"],
    },
    select: {
        dependencies: ["@radix-ui/react-select", "lucide-react"],
    },
    switch: {
        dependencies: ["@radix-ui/react-switch"],
    },
    avatar: {
        dependencies: ["@radix-ui/react-avatar"],
    },
    alert: {
        dependencies: ["lucide-react"],
    },
    label: {
        dependencies: ["@radix-ui/react-label"],
    },
    separator: {
        dependencies: ["@radix-ui/react-separator"],
    },
    skeleton: {
        dependencies: [],
    },
    sheet: {
        dependencies: ["@radix-ui/react-dialog", "lucide-react"],
    },
    progress: {
        dependencies: ["@radix-ui/react-progress"],
    },
    slider: {
        dependencies: ["@radix-ui/react-slider"],
    },
    "radio-group": {
        dependencies: ["@radix-ui/react-radio-group", "lucide-react"],
    },
    popover: {
        dependencies: ["@radix-ui/react-popover"],
    },
    "alert-dialog": {
        dependencies: ["@radix-ui/react-alert-dialog"],
    },
    "dropdown-menu": {
        dependencies: ["@radix-ui/react-dropdown-menu", "lucide-react"],
    },
    "hover-card": {
        dependencies: ["@radix-ui/react-hover-card"],
    },
    "scroll-area": {
        dependencies: ["@radix-ui/react-scroll-area"],
    },
    tooltip: {
        dependencies: ["@radix-ui/react-tooltip"],
    },
    command: {
        dependencies: ["cmdk", "lucide-react"],
    },
    calendar: {
        dependencies: ["react-day-picker", "date-fns", "lucide-react"],
    },
    "context-menu": {
        dependencies: ["@radix-ui/react-context-menu", "lucide-react"],
    },
    table: {
        dependencies: [],
    },
    form: {
        dependencies: ["@radix-ui/react-slot", "react-hook-form", "@hookform/resolvers", "zod"],
    },
    breadcrumb: {
        dependencies: ["lucide-react"],
    },
    pagination: {
        dependencies: ["lucide-react"],
    },
    "prompt-input": {
        dependencies: ["lucide-react", "framer-motion", "@radix-ui/react-dropdown-menu"],
    },
    sidebar: {
        dependencies: ["lucide-react", "@radix-ui/react-slot", "class-variance-authority", "@radix-ui/react-dialog"],
    },
    carousel: {
        dependencies: ["embla-carousel-react", "lucide-react"],
    },
    drawer: {
        dependencies: ["vaul", "lucide-react"],
    },
    "navigation-menu": {
        dependencies: ["@radix-ui/react-navigation-menu", "lucide-react", "class-variance-authority"],
    },
    resizable: {
        dependencies: ["react-resizable-panels", "lucide-react"],
    },
    sonner: {
        dependencies: ["sonner", "next-themes", "lucide-react"],
    },
    "toggle-group": {
        dependencies: ["@radix-ui/react-toggle-group", "lucide-react"],
    },
    menubar: {
        dependencies: ["@radix-ui/react-menubar", "lucide-react"],
    },
    "input-otp": {
        dependencies: ["input-otp", "lucide-react"],
    },
    "aspect-ratio": {
        dependencies: ["@radix-ui/react-aspect-ratio"],
    },
    collapsible: {
        dependencies: ["@radix-ui/react-collapsible"],
    },
    toggle: {
        dependencies: ["@radix-ui/react-toggle", "class-variance-authority"],
    },
}

export const add = new Command()
    .name("add")
    .description("Add a component to your project")
    .argument("<component>", "Component name to add")
    .action(async (componentName: string) => {
        const component = REGISTRY[componentName.toLowerCase()]
        if (!component) {
            console.log(chalk.red(`Component "${componentName}" not found in registry.`))
            return
        }

        const spinner = ora(`Adding ${componentName}...`).start()

        try {
            const cwd = process.cwd()
            const configPath = path.join(cwd, "vedix.config.json")
            if (!fs.existsSync(configPath)) {
                spinner.fail(chalk.red("vedix.config.json not found. Please run 'npx vedix init' first."))
                return
            }

            const config = await fs.readJSON(configPath)
            const targetDir = path.resolve(cwd, config.uiPath)
            await fs.ensureDir(targetDir)

            // Copy template
            const templateName = `${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.tsx`
            const templatePath = path.join(__dirname, templateName)
            const targetPath = path.join(targetDir, templateName)

            if (fs.existsSync(targetPath)) {
                spinner.info(chalk.yellow(`${templateName} already exists. Skipping copy.`))
            } else {
                if (!fs.existsSync(templatePath)) {
                    spinner.fail(chalk.red(`Template for "${componentName}" not found at ${templatePath}`))
                    return
                }
                await fs.copy(templatePath, targetPath)
            }

            // Install dependencies
            if (component.dependencies.length > 0) {
                spinner.text = `Installing dependencies: ${component.dependencies.join(", ")}...`
                await execa("npm", ["install", ...component.dependencies], { cwd })
            }

            spinner.succeed(chalk.green(`Added ${componentName} to ${config.uiPath}`))
        } catch (error) {
            spinner.fail(chalk.red(`An error occurred while adding the component.`))
            console.error(error)
        }
    })
