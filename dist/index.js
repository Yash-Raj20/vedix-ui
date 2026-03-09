#!/usr/bin/env node
import C from"path";import{fileURLToPath as S}from"url";var I=()=>S(import.meta.url),T=()=>C.dirname(I()),y=T();import{Command as M}from"commander";import{Command as U}from"commander";import f from"chalk";import i from"fs-extra";import t from"path";import $ from"inquirer";import z from"ora";import{execa as R}from"execa";var k=new U().name("init").description("Initialize the project for Vedix UI").action(async()=>{let e=z("Initializing Vedix UI...").start();try{let r=process.cwd(),n=t.join(r,"package.json");if(!i.existsSync(n)){e.fail("package.json not found. Please run this in a project root.");return}let a=await i.readJSON(n),m=a.dependencies?.react||a.devDependencies?.react,g=i.existsSync(t.join(r,"tsconfig.json"));m||e.warn("React not detected. This library is designed for React."),g||e.warn("TypeScript not detected. This library is optimized for TypeScript."),e.stop();let o=await $.prompt([{type:"input",name:"uiPath",message:"Where would you like to store your UI components?",default:"src/components/ui"}]);e.start("Creating configuration...");let s={uiPath:o.uiPath,theme:"mine"};await i.writeJSON(t.join(r,"vedix.config.json"),s,{spaces:2});let l=t.resolve(r,o.uiPath);await i.ensureDir(l);let p=t.resolve(r,"src/lib");await i.ensureDir(p);let h=t.join(y,"utils.ts"),w=t.join(p,"utils.ts");i.existsSync(h)?await i.copy(h,w):await i.writeFile(w,`import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
`);let b=t.resolve(r,"src/styles");await i.ensureDir(b);let v=t.join(b,"globals.css");i.existsSync(v)||await i.writeFile(v,`@tailwind base;
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
}`),e.text="Installing core dependencies (tailwind-merge, clsx, lucide-react, framer-motion)...";try{await R("npm",["install","tailwind-merge","clsx","lucide-react","framer-motion"],{cwd:r}),e.succeed(f.green("Vedix UI initialized successfully!")),console.log(f.blue(`
Components folder: ${o.uiPath}`)),console.log(f.blue("Utility file: src/lib/utils.ts")),console.log(f.blue(`Config file: vedix.config.json
`))}catch(j){e.fail("Failed to install base dependencies."),console.error(j)}}catch(r){e.fail("An error occurred during initialization."),console.error(r)}});import{Command as _}from"commander";import c from"chalk";import d from"fs-extra";import u from"path";import A from"ora";import{execa as V}from"execa";import{fileURLToPath as J}from"url";var F=J(import.meta.url),L=u.dirname(F),O={button:{dependencies:["lucide-react","@radix-ui/react-slot"]},badge:{dependencies:[]},card:{dependencies:[]},input:{dependencies:[]},textarea:{dependencies:[]},checkbox:{dependencies:["@radix-ui/react-checkbox","lucide-react"]},accordion:{dependencies:["@radix-ui/react-accordion","lucide-react"]},dialog:{dependencies:["@radix-ui/react-dialog","lucide-react"]},tabs:{dependencies:["@radix-ui/react-tabs"]},select:{dependencies:["@radix-ui/react-select","lucide-react"]},switch:{dependencies:["@radix-ui/react-switch"]},avatar:{dependencies:["@radix-ui/react-avatar"]},alert:{dependencies:["lucide-react"]},label:{dependencies:["@radix-ui/react-label"]},separator:{dependencies:["@radix-ui/react-separator"]},skeleton:{dependencies:[]},sheet:{dependencies:["@radix-ui/react-dialog","lucide-react"]},progress:{dependencies:["@radix-ui/react-progress"]},slider:{dependencies:["@radix-ui/react-slider"]},"radio-group":{dependencies:["@radix-ui/react-radio-group","lucide-react"]},popover:{dependencies:["@radix-ui/react-popover"]},"alert-dialog":{dependencies:["@radix-ui/react-alert-dialog"]},"dropdown-menu":{dependencies:["@radix-ui/react-dropdown-menu","lucide-react"]},"hover-card":{dependencies:["@radix-ui/react-hover-card"]},"scroll-area":{dependencies:["@radix-ui/react-scroll-area"]},tooltip:{dependencies:["@radix-ui/react-tooltip"]},command:{dependencies:["cmdk","lucide-react"]},calendar:{dependencies:["react-day-picker","date-fns","lucide-react"]},"context-menu":{dependencies:["@radix-ui/react-context-menu","lucide-react"]},table:{dependencies:[]},form:{dependencies:["@radix-ui/react-slot","react-hook-form","@hookform/resolvers","zod"]},breadcrumb:{dependencies:["lucide-react"]},pagination:{dependencies:["lucide-react"]},"prompt-input":{dependencies:["lucide-react","framer-motion","@radix-ui/react-dropdown-menu"]},sidebar:{dependencies:["lucide-react","@radix-ui/react-slot","class-variance-authority","@radix-ui/react-dialog"]},carousel:{dependencies:["embla-carousel-react","lucide-react"]},drawer:{dependencies:["vaul","lucide-react"]},"navigation-menu":{dependencies:["@radix-ui/react-navigation-menu","lucide-react","class-variance-authority"]},resizable:{dependencies:["react-resizable-panels","lucide-react"]},sonner:{dependencies:["sonner","next-themes","lucide-react"]},"toggle-group":{dependencies:["@radix-ui/react-toggle-group","lucide-react"]},menubar:{dependencies:["@radix-ui/react-menubar","lucide-react"]},"input-otp":{dependencies:["input-otp","lucide-react"]},"aspect-ratio":{dependencies:["@radix-ui/react-aspect-ratio"]},collapsible:{dependencies:["@radix-ui/react-collapsible"]},toggle:{dependencies:["@radix-ui/react-toggle","class-variance-authority"]}},P=new _().name("add").description("Add a component to your project").argument("<component>","Component name to add").action(async e=>{let r=O[e.toLowerCase()];if(!r){console.log(c.red(`Component "${e}" not found in registry.`));return}let n=A(`Adding ${e}...`).start();try{let a=process.cwd(),m=u.join(a,"vedix.config.json");if(!d.existsSync(m)){n.fail(c.red("vedix.config.json not found. Please run 'npx vedix init' first."));return}let g=await d.readJSON(m),o=u.resolve(a,g.uiPath);await d.ensureDir(o);let s=`${e.charAt(0).toUpperCase()+e.slice(1)}.tsx`,l=u.join(L,s),p=u.join(o,s);if(d.existsSync(p))n.info(c.yellow(`${s} already exists. Skipping copy.`));else{if(!d.existsSync(l)){n.fail(c.red(`Template for "${e}" not found at ${l}`));return}await d.copy(l,p)}r.dependencies.length>0&&(n.text=`Installing dependencies: ${r.dependencies.join(", ")}...`,await V("npm",["install",...r.dependencies],{cwd:a})),n.succeed(c.green(`Added ${e} to ${g.uiPath}`))}catch(a){n.fail(c.red("An error occurred while adding the component.")),console.error(a)}});var x=new M;x.name("vedix").description("Build a production-ready vedix-style UI library system with your own theme - Vedix UI.").version("1.0.0");x.addCommand(k);x.addCommand(P);x.parse();
