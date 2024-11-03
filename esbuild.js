const esbuild = require('esbuild');

const baseConfig = {
  entryPoints: ['./src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: ['node16'],
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
};

async function build() {
  const isWatchMode = process.argv.includes('--watch');

  if (isWatchMode) {
    // Watch mode
    const context = await esbuild.context(baseConfig);
    await context.watch();
    console.log('Watching for changes...');
  } else {
    // Single build
    esbuild.build(baseConfig).catch(() => {
      process.exit(1);
    });
  }
}

build().catch(console.error);
