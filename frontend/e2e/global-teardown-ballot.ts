import { existsSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const PID_FILE = join(process.cwd(), 'e2e', '.hardhat-pid');

export default async function globalTeardown() {
  if (!existsSync(PID_FILE)) return;
  const raw = readFileSync(PID_FILE, 'utf8').trim();
  try {
    unlinkSync(PID_FILE);
  } catch {
    /* ignore */
  }
  if (!raw || raw === 'reuse' || raw === 'skipped') return;
  const pid = Number.parseInt(raw, 10);
  if (Number.isNaN(pid)) return;
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    /* process may already have exited */
  }
}
