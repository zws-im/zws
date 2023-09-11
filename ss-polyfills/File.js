// Required for swagger-ui https://github.com/char0n/swagger-ui-nextjs/pull/2
// Can be removed once upgraded to Node.js v20
const { File } = require('next/dist/compiled/undici');

globalThis.File = globalThis.File ?? File;
