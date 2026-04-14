import { execSync, spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import * as net from 'net';
import { join, resolve } from 'path';

const BACKEND_DIR = resolve(process.cwd(), '..', 'backend');
const PID_FILE = join(process.cwd(), 'e2e', '.hardhat-pid');

/**
 * Set `PW_SKIP_BALLOT_SETUP=1` to skip Hardhat reset + Ballot deploy (e.g. when
 * running only SSR route tests). Do not use for `ballot-flows.spec.ts`.
 */
function isBallotSetupSkipped() {
  return process.env.PW_SKIP_BALLOT_SETUP === '1';
}

function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolvePromise) => {
    const socket = net.connect({ port, host: '127.0.0.1' }, () => {
      socket.end();
      resolvePromise(true);
    });
    socket.on('error', () => resolvePromise(false));
  });
}

function waitForPort(port: number, timeoutMs: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolveFn, reject) => {
    const poll = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timeout waiting for port ${port}`));
        return;
      }
      const s = net.connect({ port, host: '127.0.0.1' }, () => {
        s.end();
        resolveFn();
      });
      s.on('error', () => {
        s.destroy();
        setTimeout(poll, 250);
      });
    };
    poll();
  });
}

async function hardhatResetRpc() {
  const res = await fetch('http://127.0.0.1:8545', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'hardhat_reset',
      params: [],
    }),
  });
  if (!res.ok) {
    throw new Error(`hardhat_reset failed: HTTP ${res.status}`);
  }
}

export default async function globalSetup() {
  mkdirSync(join(process.cwd(), 'e2e'), { recursive: true });

  if (isBallotSetupSkipped()) {
    writeFileSync(PID_FILE, 'skipped', 'utf8');
    return;
  }

  let hardhatPid: number | undefined;
  if (!(await isPortOpen(8545))) {
    const child = spawn('bun', ['x', 'hardhat', 'node'], {
      cwd: BACKEND_DIR,
      stdio: 'ignore',
      detached: false,
    });
    hardhatPid = child.pid;
    await waitForPort(8545, 60_000);
  }

  writeFileSync(
    PID_FILE,
    hardhatPid !== undefined ? String(hardhatPid) : 'reuse',
    'utf8',
  );

  await hardhatResetRpc();

  execSync(
    'bunx hardhat ignition deploy ignition/modules/Ballot.ts --network localhost',
    {
      cwd: BACKEND_DIR,
      stdio: 'inherit',
    },
  );
}
