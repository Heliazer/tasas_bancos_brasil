#!/usr/bin/env node
/**
 * Deploy Script - Script reutilizable para deploy a VPS
 * Uso: node deploy.ts [--config custom-config.json]
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { loadVPSConfigFromEnv, VPSConfig } from './vps.config.js';

const execAsync = promisify(exec);

interface DeployOptions {
  configFile?: string;
  buildDir?: string;
  verbose?: boolean;
}

async function runCommand(command: string, verbose: boolean = false): Promise<string> {
  if (verbose) {
    console.log(`Ejecutando: ${command}`);
  }
  const { stdout, stderr } = await execAsync(command);
  if (verbose && stderr) {
    console.error(`stderr: ${stderr}`);
  }
  return stdout;
}

async function buildApplication(config: VPSConfig, buildDir: string, verbose: boolean): Promise<void> {
  console.log('📦 Building application...');

  const buildPath = path.resolve(process.cwd(), buildDir);
  await runCommand(`cd ${buildPath} && ${config.buildCommand}`, verbose);

  console.log('✅ Build completado');
}

async function transferFiles(config: VPSConfig, buildDir: string, verbose: boolean): Promise<void> {
  console.log(`🚀 Deploying to ${config.user}@${config.host}...`);

  const sourcePath = path.resolve(process.cwd(), buildDir, config.buildOutputDir);
  const destination = `${config.user}@${config.host}:${config.deployPath}/`;

  const scpCommand = `scp -r ${sourcePath}/* ${destination}`;
  await runCommand(scpCommand, verbose);

  console.log('✅ Archivos transferidos');
}

async function deploy(options: DeployOptions = {}): Promise<void> {
  try {
    // Cargar configuración
    const config = options.configFile
      ? JSON.parse(await fs.readFile(options.configFile, 'utf-8'))
      : loadVPSConfigFromEnv();

    const buildDir = options.buildDir || '.';
    const verbose = options.verbose || false;

    if (verbose) {
      console.log('Configuración:', JSON.stringify(config, null, 2));
    }

    // Build
    await buildApplication(config, buildDir, verbose);

    // Deploy
    await transferFiles(config, buildDir, verbose);

    // Mensaje final
    console.log('\n✨ Deploy completado!');
    console.log(`🌐 Accede a: http://${config.host}`);

  } catch (error) {
    console.error('❌ Error durante el deploy:', error);
    process.exit(1);
  }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options: DeployOptions = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--config':
        options.configFile = args[++i];
        break;
      case '--build-dir':
        options.buildDir = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
    }
  }

  deploy(options);
}

export { deploy, DeployOptions };
