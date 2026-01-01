import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function probeDurationSeconds(params: {
  ffprobePath: string;
  timeoutMs: number;
  url: string;
}): Promise<number> {
  const baseArgs = [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    params.url
  ];

  const isCmdWrapper = /\.(cmd|bat)$/i.test(params.ffprobePath);
  const isJsWrapper = /\.js$/i.test(params.ffprobePath);
  const command = isCmdWrapper ? 'cmd.exe' : params.ffprobePath;

  const quoteForCmd = (value: string): string => {
    // cmd.exe parsing: wrap in quotes; double any embedded quotes.
    const safe = value.replace(/"/g, '""');
    return `"${safe}"`;
  };

  const args = isJsWrapper
    ? [params.ffprobePath, ...baseArgs]
    : isCmdWrapper
      ? [
          '/d',
          '/s',
          '/c',
          `${quoteForCmd(params.ffprobePath)} ${baseArgs.map(quoteForCmd).join(' ')}`
        ]
      : baseArgs;

  const finalCommand = isJsWrapper ? process.execPath : command;

  const { stdout } = await execFileAsync(finalCommand, args, {
    timeout: params.timeoutMs,
    windowsHide: true,
    maxBuffer: 1024 * 1024
  });

  const raw = String(stdout ?? '').trim();
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Unable to determine duration');
  }

  return Math.ceil(parsed);
}
