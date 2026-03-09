#!/usr/bin/env node
import { Command } from "commander"
import { init } from "./commands/init.js"
import { add } from "./commands/add.js"

const program = new Command()

program
    .name("vedix")
    .description("Build a production-ready vedix-style UI library system with your own theme - Vedix UI.")
    .version("1.0.0")

program.addCommand(init)
program.addCommand(add)

program.parse()
