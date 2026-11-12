import {createApi} from './api-app.js';
import {db,repository} from './models.js';
await db.authenticate();
const server=createApi({repository,key:process.env.INTERNAL_API_KEY}).listen(Number(process.env.API_PORT||3001),process.env.API_HOST||'127.0.0.1',()=>console.log('API prête.'));
process.on('SIGTERM',()=>server.close(async()=>{await db.close();process.exit(0);}));
