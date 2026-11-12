import assert from 'node:assert/strict';
import {db,repository} from '../server/models.js';
try {
 await db.authenticate();
 assert.equal((await repository.categories()).length,4);
 const featured=await repository.list({featured:'true',page:1});assert.equal(featured.items.length,3);
 assert.deepEqual(featured.items.map(a=>a.name).sort(),['Au pain chaud','Chocolaterie Labbé','Orville Salmons']);
 assert.equal((await repository.list({page:1})).total,17);
 const list=await repository.list({category:1,page:1});assert.ok(list.items.length>0);assert.ok(list.items.every(a=>a.specialty.category_id===1));
 const found=await repository.list({q:"C'est sup'hair",page:1});assert.ok(found.items.some(a=>a.name==="C'est sup'hair"));
 assert.equal((await repository.list({q:'%',page:1})).total,0);
 assert.equal((await repository.list({q:"' OR 1=1 --",page:1})).total,0);
 assert.equal((await repository.one(1)).specialty.category.name,'Alimentation');
 console.log('Contrôles MySQL réussis.');
} finally { await db.close(); }
