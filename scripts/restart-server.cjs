const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const PORT = 3000;
const LOG = path.join(__dirname, '..', 'server.log');

function getPidByPort(port) {
  const isWin = process.platform === 'win32';
  try {
    const out = isWin
      ? execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
      : execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' });
    const lines = out.split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      if (isWin) {
        const cols = line.trim().split(/\s+/);
        if (cols[0] === 'TCP' && cols[1].endsWith(`:${port}`) && cols[3] === 'LISTENING') {
          return cols[cols.length - 1];
        }
      } else {
        return line.trim();
      }
    }
  } catch (e) {
    // no listener
  }
  return null;
}

function killPid(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
    }
    console.log(`Ancien serveur (PID ${pid}) arrêté.`);
  } catch (e) {
    console.log(`Impossible d'arrêter PID ${pid} (probablement déjà fermé).`);
  }
}

function waitForPort(port, timeoutMs) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const tryConnect = () => {
      const sock = net.connect({ port, host: '127.0.0.1' });
      sock.on('connect', () => { sock.destroy(); resolve(true); });
      sock.on('error', () => {
        sock.destroy();
        if (Date.now() > deadline) resolve(false);
        else setTimeout(tryConnect, 500);
      });
    };
    tryConnect();
  });
}

(async () => {
  const root = path.join(__dirname, '..');
  process.chdir(root);

  console.log('1/3 Build en cours…');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: root });
  } catch (e) {
    console.error('Build échoué, rien n\'a été redémarré.');
    process.exit(1);
  }

  const pid = getPidByPort(PORT);
  if (pid) killPid(pid);

  // court délai pour libérer le port
  await new Promise((r) => setTimeout(r, 1500));

  console.log('2/3 Démarrage du serveur production…');
  const child = spawn('node', ['dist/server.cjs'], {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'production' },
    detached: true,
    stdio: ['ignore', fs.openSync(LOG, 'a'), fs.openSync(LOG, 'a')],
  });
  child.unref();

  const ok = await waitForPort(PORT, 20000);
  console.log(ok
    ? `3/3 Serveur démarré sur http://localhost:${PORT} (log: server.log)`
    : 'Serveur non détecté sur le port 3000, vérifiez server.log');
})();
