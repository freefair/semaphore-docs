#!/usr/bin/env node
// Compare complete locale builds in one isolated, committed-source checkout.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawn, execFileSync} = require('node:child_process');
const {pipeline} = require('node:stream/promises');

const args = process.argv.slice(2);
if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  console.log('Usage: node scripts/benchmark-builds.cjs --output NEW_DIRECTORY\nRequires installed docs dependencies, Git, tar, and ps (macOS/Linux).\nRuns serial then two-worker builds twice; retains logs, HTML, source SHA and sampled process-tree RSS.');
  process.exit(0);
}
if (args.length !== 2 || args[0] !== '--output') {
  console.error('Use --help; --output NEW_DIRECTORY is required.');
  process.exit(1);
}
const docs = path.resolve(__dirname, '..');
const output = path.resolve(args[1]);
let active;
function stop() {
  if (active && Number.isInteger(active.pid) && active.exitCode === null) {
    try { process.kill(-active.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  }
}
process.on('SIGINT', () => { stop(); process.exit(130); });
process.on('SIGTERM', () => { stop(); process.exit(143); });
const exited = child => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code, signal) => resolve({code, signal}));
});

function processTreeRSS(rootPID) {
  const rows = execFileSync('ps', ['-axo', 'pid=,ppid=,rss='], {encoding: 'utf8'})
    .trim().split('\n').map(line => line.trim().split(/\s+/).map(Number));
  const family = new Set([rootPID]);
  let count;
  do {
    count = family.size;
    for (const [pid, parent] of rows) if (family.has(parent)) family.add(pid);
  } while (family.size !== count);
  return rows.reduce((sum, [pid, , rss]) => sum + (family.has(pid) ? rss : 0), 0);
}

async function measure(site, mode, command, extraEnvironment) {
  const log = fs.openSync(path.join(output, `${mode}.log`), 'wx');
  const started = performance.now();
  let peak = 0, samples = 0, failure;
  active = spawn('npm', ['run', command], {
    cwd: site, detached: true, env: {...process.env, ...extraEnvironment}, stdio: ['ignore', log, log],
  });
  const sampler = setInterval(() => {
    try { peak = Math.max(peak, processTreeRSS(active.pid)); samples += 1; }
    catch (error) { failure = error; stop(); }
  }, 200);
  let result;
  try { result = await exited(active); }
  finally { clearInterval(sampler); fs.closeSync(log); active = undefined; }
  if (failure) throw failure;
  const seconds = ((performance.now() - started) / 1000).toFixed(2);
  fs.appendFileSync(path.join(output, 'results.tsv'), `${mode}\t${result.code ?? result.signal}\t${seconds}\t${peak}\t${samples}\n`);
  if (result.code !== 0) throw new Error(`${mode} failed; retained ${mode}.log`);
  fs.renameSync(path.join(site, 'build'), path.join(output, `${mode}-build`));
  console.log(`${mode}: ${seconds}s, sampled peak tree RSS ${peak} KiB`);
}

async function main() {
  if (!['darwin', 'linux'].includes(process.platform)) throw new Error('This sampler requires macOS or Linux ps.');
  fs.mkdirSync(output); // Existing evidence is never overwritten.
  const site = path.join(output, 'site');
  fs.mkdirSync(site);
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: docs, encoding: 'utf8'}).trim();
  fs.writeFileSync(path.join(output, 'environment.txt'), `source_commit=${sha}\nnode=${process.version}\nplatform=${process.platform}\narch=${process.arch}\nlogical_cpus=${os.cpus().length}\nmemory_bytes=${os.totalmem()}\nSampling: summed descendant RSS every 200ms; shared pages may be counted more than once. Warm-cache runs are separate from the first pass.\n`);
  const archive = spawn('git', ['archive', sha], {cwd: docs, stdio: ['ignore', 'pipe', 'inherit']});
  const extract = spawn('tar', ['-x', '-C', site], {stdio: ['pipe', 'ignore', 'inherit']});
  const results = await Promise.all([exited(archive), exited(extract), pipeline(archive.stdout, extract.stdin)]);
  if (results[0].code !== 0 || results[1].code !== 0) throw new Error('Isolated source extraction failed.');
  fs.symlinkSync(path.join(docs, 'node_modules'), path.join(site, 'node_modules'), 'dir');
  fs.writeFileSync(path.join(output, 'results.tsv'), 'mode\texit_code\telapsed_seconds\tsampled_peak_tree_rss_kib\tsamples\n');
  for (const [mode, command, env] of [
    ['serial-first', 'build', {}], ['parallel-2-first', 'build:parallel', {JOBS: '2'}],
    ['serial-warm', 'build', {}], ['parallel-2-warm', 'build:parallel', {JOBS: '2'}],
  ]) await measure(site, mode, command, env);
}
main().catch(error => { stop(); console.error(error.message); process.exitCode = 1; });
