#!/usr/bin/env node

const transport = process.argv[2] ?? 'http';

if (transport === 'stdio') {
  await import('./handlers/stdio.js');
} else {
  const { app, port } = await import('./app.js');
  app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
  });
}
