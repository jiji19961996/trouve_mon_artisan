import {Sequelize,DataTypes,Op} from 'sequelize';
export const db=new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),dialect:'mysql',logging:false,pool:{max:5,min:0},define:{timestamps:false,freezeTableName:true}});
const Category=db.define('categories',{id:{type:DataTypes.INTEGER,primaryKey:true},name:DataTypes.STRING});
const Specialty=db.define('specialties',{id:{type:DataTypes.INTEGER,primaryKey:true},name:DataTypes.STRING,category_id:DataTypes.INTEGER});
const Artisan=db.define('artisans',{id:{type:DataTypes.INTEGER,primaryKey:true},name:DataTypes.STRING,rating:DataTypes.DECIMAL(2,1),city:DataTypes.STRING,about:DataTypes.TEXT,email:DataTypes.STRING,website:DataTypes.STRING,image:DataTypes.STRING,featured:DataTypes.BOOLEAN,specialty_id:DataTypes.INTEGER});
Specialty.belongsTo(Category,{as:'category',foreignKey:'category_id'});
Artisan.belongsTo(Specialty,{as:'specialty',foreignKey:'specialty_id'});
const include=[{model:Specialty,as:'specialty',include:[{model:Category,as:'category'}]}];
export const repository={
 categories:()=>Category.findAll({order:[['id','ASC']],raw:true}),
 async list({category,q,featured,page}){
  const where={};
  if(category) where['$specialty.category_id$']=category;
  // LOCATE effectue une recherche littérale : % et _ ne deviennent pas des jokers.
  if(q) where[Op.and]=Sequelize.where(Sequelize.fn('LOCATE',q,Sequelize.col('artisans.name')),{[Op.gt]:0});
  if(featured) where.featured=true;
  const limit=featured?3:12;
  const result=await Artisan.findAndCountAll({where,include,limit,offset:featured?0:(page-1)*limit,subQuery:false,order:[['name','ASC']],distinct:true});
  return {items:result.rows.map(a=>a.toJSON()),total:result.count,page,pageSize:limit};
 },
 async one(id){const a=await Artisan.findByPk(id,{include});return a?.toJSON()??null;}
};
