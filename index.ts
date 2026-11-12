import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

const processes: ChildProcess[] = [];

function runProcess(name: string, command: string, args: string[], cwd: string): ChildProcess {
    const proc = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'inherit',
    });

    proc.on('error', (err: any) => {
        console.error(`Process ${name} encountered an error:`, err);
    });

    proc.on('exit', (code: number | null) => {
        if (code !== 0 && code !== null) {
            console.error(`Process ${name} exited with code ${code}`);
        }
    });

    processes.push(proc);
    return proc;
}

function launchPlatform(): void {
    const rootDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
    const backendDir = path.join(rootDir, 'pharma-trace-backend');
    const frontendDir = path.join(rootDir, 'pharma-trace-frontend');

    console.log('Starting PharmaTrace Platform Services...');

    runProcess('Hardhat Node', 'npx', ['hardhat', 'node'], backendDir);

    setTimeout(() => {
        runProcess('Backend API', 'npm', ['run', 'start:dev'], backendDir);
    }, 3000);

    setTimeout(() => {
        runProcess('Frontend Web', 'npm', ['run', 'dev', '--', '-p', '3001'], frontendDir);
    }, 6000);
}

function shutdown(): void {
    console.log('Shutting down PharmaTrace services...');
    for (const proc of processes) {
        if (proc && !proc.killed) {
            proc.kill('SIGTERM');
        }
    }
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

launchPlatform();
