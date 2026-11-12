import nodemailer from 'nodemailer';
import {createGateway} from './gateway-app.js';
const key=process.env.INTERNAL_API_KEY,origin=process.env.PUBLIC_ORIGIN;
if(!key || key.length<32 || !origin || new URL(origin).origin!==origin)throw new Error('Configuration API/origine manquante ou invalide.');
const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',requireTLS:process.env.NODE_ENV==='production' && process.env.SMTP_SECURE!=='true',auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined,disableFileAccess:true,disableUrlAccess:true,connectionTimeout:10000,socketTimeout:15000});
const readApi=async(route)=>{const r=await fetch((process.env.API_URL||'http://127.0.0.1:3001')+route,{headers:{'x-api-key':key},signal:AbortSignal.timeout(5000)});if(!r.ok){const e=new Error('API request failed');e.status=r.status;throw e;}return r.json();};
const app=createGateway({readApi,sendMail:mail=>transport.sendMail(mail),origin,from:process.env.SMTP_FROM,trustProxy:process.env.TRUST_PROXY==='1'?1:false});
const server=app.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Application prête.'));
process.on('SIGTERM',()=>server.close(()=>{transport.close();process.exit(0);}));
