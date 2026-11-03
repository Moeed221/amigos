// Standard Next.js development locally; production-static preview on managed hosts.
import {spawn} from 'node:child_process';
const raw=process.argv.slice(2);
const managed=raw.includes('--strictPort');
const port=raw.includes('--port')?raw[raw.indexOf('--port')+1]:'4173';
const args=raw.filter(arg=>arg!=='--strictPort').map(arg=>arg==='--host'?'--hostname':arg);
const child=spawn(process.execPath,managed?['node_modules/serve/build/main.js','out','--listen',`tcp://0.0.0.0:${port}`]:['node_modules/next/dist/bin/next','dev',...args],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
