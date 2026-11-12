import express from 'express';
import helmet from 'helmet';
import {idSchema,querySchema,validKey} from './validation.js';
export function createApi({repository,key}){
 if(!key || key.length<32) throw new Error('INTERNAL_API_KEY doit contenir au moins 32 caractères.');
 const app=express();app.disable('x-powered-by');app.use(helmet());
 app.use((req,res,next)=>validKey(req.get('x-api-key'),key)?next():res.status(401).json({error:'Accès refusé.'}));
 app.get('/categories',async(req,res)=>res.json(await repository.categories()));
 app.get('/artisans',async(req,res)=>{const v=querySchema.safeParse(req.query);if(!v.success)return res.status(400).json({error:'Recherche invalide.'});res.json(await repository.list(v.data));});
 app.get('/artisans/:id',async(req,res)=>{const v=idSchema.safeParse(req.params.id);if(!v.success)return res.status(400).json({error:'Identifiant invalide.'});const a=await repository.one(v.data);if(!a)return res.status(404).json({error:'Artisan introuvable.'});res.json(a);});
 app.use((req,res)=>res.status(404).json({error:'Route introuvable.'}));
 app.use((err,req,res,next)=>{console.error('API error:',err.name);res.status(503).json({error:'Service temporairement indisponible.'});});
 return app;
}
