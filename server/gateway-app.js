import express from 'express';
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit';
import path from 'node:path';
import {idSchema,querySchema,contactSchema,publicArtisan} from './validation.js';
export function createGateway({readApi,sendMail,origin,from,dist=path.resolve('dist'),trustProxy=false}){
 const app=express();app.disable('x-powered-by');app.set('trust proxy',trustProxy);
 app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'"],imgSrc:["'self'","data:"],connectSrc:["'self'"],objectSrc:["'none'"],frameAncestors:["'none'"],upgradeInsecureRequests:origin.startsWith('https:')?[]:null}},strictTransportSecurity:origin.startsWith('https:')?undefined:false}));
 app.use('/api',rateLimit({windowMs:60_000,limit:120,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Trop de requêtes. Réessayez dans une minute.'}}));
 app.use(express.json({limit:'16kb'}));
 app.get('/api/categories',async(req,res)=>res.json(await readApi('/categories')));
 app.get('/api/artisans',async(req,res)=>{const v=querySchema.safeParse(req.query);if(!v.success)return res.status(400).json({error:'Recherche invalide.'});const data=await readApi('/artisans?'+new URLSearchParams(v.data));res.json({...data,items:data.items.map(publicArtisan)});});
 app.get('/api/artisans/:id',async(req,res)=>{const v=idSchema.safeParse(req.params.id);if(!v.success)return res.status(400).json({error:'Identifiant invalide.'});res.json(publicArtisan(await readApi('/artisans/'+v.data)));});
 const contactLimiter=rateLimit({windowMs:15*60_000,limit:5,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Trop de messages. Réessayez dans 15 minutes.'}});
 app.post('/api/artisans/:id/contact',contactLimiter,async(req,res)=>{
  if(req.get('origin')!==origin)return res.status(403).json({error:'Origine non autorisée.'});
  if(!req.is('application/json'))return res.status(415).json({error:'Format JSON attendu.'});
  const id=idSchema.safeParse(req.params.id),v=contactSchema.safeParse(req.body);
  if(!id.success || !v.success)return res.status(400).json({error:'Vérifiez les champs du formulaire.'});
  const artisan=await readApi('/artisans/'+id.data);
  const {name,email,subject,message}=v.data;
  // Destinataire fourni exclusivement par la base. Message texte, sans HTML utilisateur.
  await sendMail({from,to:artisan.email,replyTo:email,subject:'[Trouve ton artisan] '+subject,text:`Nom : ${name}\nE-mail : ${email}\n\n${message}`});
  res.json({message:'Votre message a été transmis. Une réponse sera apportée sous 48h.'});
 });
 app.use('/api',(req,res)=>res.status(404).json({error:'Route introuvable.'}));
 app.use(express.static(dist));
 // Routes SPA connues ; une URL inconnue renvoie aussi un vrai statut HTTP 404.
 app.get('/{*path}',(req,res)=>{const known=/^\/$|^\/artisans\/?$|^\/artisan\/\d+\/?$|^\/(mentions-legales|donnees-personnelles|accessibilite|cookies)\/?$/.test(req.path);res.status(known?200:404).sendFile(path.join(dist,'index.html'));});
 app.use((err,req,res,next)=>{const status=[400,404,413].includes(err.status)?err.status:503;console.error('Gateway error:',err.name);res.status(status).json({error:status===404?'Artisan introuvable.':status===400?'JSON invalide.':status===413?'Message trop volumineux.':'Service temporairement indisponible. Veuillez réessayer.'});});
 return app;
}
