import { db } from "@hashnomads/db";
import { getAuth } from "@/lib/auth";
import { isAdministrator } from "@/lib/admin";

// V2's original Supabase queries are translated here to scoped Prisma reads.
// Only explicitly permitted tables/operations exist; no arbitrary Prisma access.
export const dynamic = "force-dynamic";
type Filter={field:string;value:unknown};
type Query={table:string;operation:"read"|"insert"|"upsert"|"update"|"delete";filters:Filter[];columns?:string;sort?:{field:string;ascending:boolean}|null;limit?:number|null;single?:boolean;options?:{head?:boolean;count?:string};payload?:Record<string,unknown>};
const fail=(message:string,status=400)=>Response.json({error:{message}},{status,headers:{"Cache-Control":"no-store"}});
const date=(v:Date|null|undefined)=>v?.toISOString()??null;
const usd=(minor:bigint|null|undefined)=>minor==null?0:Number(minor)/100;
const bitcoin=(amount:bigint|null|undefined)=>amount==null?0:Number(amount);
function serializeModel(m:{id:string;manufacturer:string;model:string;nominalHashrateTHs:unknown;nominalPowerW:number;efficiencyJTH:unknown;algorithm:string;priceMinor:bigint|null}) {
  return {id:m.id,manufacturer:m.manufacturer,model:m.model,hashrate_th:Number(m.nominalHashrateTHs),power_w:m.nominalPowerW,
    efficiency_j_th:Number(m.efficiencyJTH),algorithm:m.algorithm,price_usd:usd(m.priceMinor),description:null,image_url:null,
    specs:{},is_active:m.priceMinor!==null,sort_order:0};
}
function serializeFacility(f:{id:string;name:string;country:string;region:string;status:string}) {
  // A referenced location is not confirmed hosting inventory.
  return {id:f.id,name:f.name,location:f.region+", "+f.country,country:f.country,
    latitude:null,longitude:null,total_capacity:0,available_capacity:0,energy_source:"unconfirmed",power_cost_kwh:0,
    climate:null,image_url:null,description:null,features:[],is_active:f.status==="contracted",sort_order:0};
}
function serializeUser(u:any) {
 const k=u.customer?.kycCases?.[0]?.status;
 return {id:u.id,email:u.email,full_name:u.name,company:u.customer?.company??null,phone:u.customer?.phone??null,
  country:u.customer?.country??null,role:u.role,kyc_status:k==="approved"||k==="verified"?"verified":k==="rejected"?"rejected":"pending",
  created_at:date(u.createdAt),updated_at:date(u.updatedAt)};
}
async function current(request:Request){
 const s=await getAuth().api.getSession({headers:request.headers});
 return s?.user??null;
}
async function dataFor(table:string,userId:string|null,admin:boolean):Promise<Record<string,any>[]>{
  switch(table) {
    case "asic_models": return (await db.asicModel.findMany({take:100})).map(serializeModel);
    case "facilities": return (await db.facility.findMany({take:100})).map(serializeFacility);
    case "hosting_plans": return (await db.hostingPlan.findMany({take:100})).map(p=>({
       id:p.id,facility_id:p.facilityId,name:p.name,setup_fee_usd:usd(p.setupMinor),
       monthly_fee_usd:usd(p.serviceMonthlyMinor),electricity_rate_kwh:Number(p.tariffUsdPerKwh),
       description:null,is_active:!!p.effectiveFrom && (!p.effectiveTo||p.effectiveTo>new Date())
    }));
  }
  if(!userId)throw new Error("SIGN_IN_REQUIRED");
  switch(table){
    case "profiles": {
      const rows=admin?await db.user.findMany({take:100,include:{customer:{include:{kycCases:{orderBy:{createdAt:"desc"},take:1}}}}}):
        await db.user.findMany({where:{id:userId},include:{customer:{include:{kycCases:{orderBy:{createdAt:"desc"},take:1}}}}});
      return rows.map(serializeUser);
    }
    case "orders": return (await db.order.findMany({where:admin?{}:{customer:{userId}},include:{lines:true},take:100})).map(o=>({
      id:o.id,user_id:o.customerId,order_number:o.id,status:o.status==="pending_payment"?"payment_pending":o.status,
      subtotal_usd:usd(o.totalMinor),hosting_setup_usd:0,total_usd:usd(o.totalMinor),payment_method:null,
      payment_provider:null,expires_at:date(o.quoteExpiresAt),paid_at:null,created_at:date(o.createdAt),updated_at:date(o.createdAt),
      order_lines:o.lines.map(l=>({id:l.id,order_id:l.orderId,quantity:l.quantity,unit_price_usd:usd(l.unitMinor),line_total_usd:usd(l.totalMinor),asic_model_id:l.sku,facility_id:o.facilityId,hosting_plan_id:null,hosting_setup_usd:0}))
    }));
    case "asic_units": {
      if(!admin)throw new Error("ADMIN_REQUIRED");
      const rows=await db.asicUnit.findMany({include:{asicModel:true,deployments:{include:{facility:true},take:1,orderBy:{scheduledAt:"desc"}}},take:100});
      return rows.map(u=>({id:u.id,model_id:u.asicModelId,serial_number:u.serialNumber,state:u.inventoryStatus,
        facility_id:u.deployments[0]?.facilityId??null,deployed_at:date(u.deployments[0]?.activatedAt),
        created_at:null,updated_at:null,asic_model:serializeModel(u.asicModel),
        facility:u.deployments[0]?.facility?serializeFacility(u.deployments[0].facility):null}));
    }
    case "ownership_assignments": return (await db.ownershipAssignment.findMany({
      where:admin?{}:{customer:{userId}},take:100,include:{order:true,asicUnit:{include:{asicModel:true,deployments:{include:{facility:true},take:1,orderBy:{scheduledAt:"desc"}}}}}
    })).map(x=>({id:x.id,user_id:x.customerId,asic_unit_id:x.asicUnitId,order_id:x.orderId,assigned_at:date(x.assignedAt),
       asic_unit:{id:x.asicUnit.id,serial_number:x.asicUnit.serialNumber,state:x.asicUnit.inventoryStatus,
          asic_model:serializeModel(x.asicUnit.asicModel),
          facility:x.asicUnit.deployments[0]?.facility?serializeFacility(x.asicUnit.deployments[0].facility):null}}));
    case "reward_entries": return (await db.rewardEntry.findMany({
      where:admin?{}:{customer:{userId}},take:100,include:{deployment:{include:{asicUnit:{include:{asicModel:true}}}}}
    })).map(r=>({id:r.id,user_id:r.customerId,asic_unit_id:r.deployment.asicUnitId,amount_sat:bitcoin(r.amountSats),
      pool_name:r.poolProvider,block_height:null,payout_tx_hash:r.paidTxRef,status:r.status,recorded_at:date(r.observedAt),
      asic_unit:{id:r.deployment.asicUnitId,asic_model:serializeModel(r.deployment.asicUnit.asicModel)}}));
    case "hosting_invoices": return (await db.hostingInvoice.findMany({
      where:admin?{}:{customer:{userId}},take:100,include:{lines:true}
    })).map(i=>({id:i.id,user_id:i.customerId,invoice_number:i.id,period_start:date(i.periodStart),period_end:date(i.periodEnd),
      subtotal_usd:usd(i.totalMinor),total_usd:usd(i.totalMinor),status:i.status,paid_at:null,due_at:date(i.dueAt),
      created_at:date(i.createdAt),invoice_lines:i.lines.map(l=>({id:l.id,hosting_invoice_id:l.invoiceId,
        description:l.description,quantity:1,unit_price_usd:usd(l.amountMinor),line_total_usd:usd(l.amountMinor)}))}));
    case "payment_intents": return (await db.paymentIntent.findMany({
      where:admin?{}:{customer:{userId}},take:100
    })).map(p=>({id:p.id,order_id:p.orderId,user_id:p.customerId,amount_usd:usd(p.accountingAmountMinor),
      currency:p.accountingCurrency,provider:p.provider,status:p.status,created_at:date(p.createdAt),updated_at:date(p.createdAt)}));
    case "crypto_invoices": return (await db.cryptoInvoice.findMany({
      where:admin?{}:{paymentIntent:{customer:{userId}}},take:100,include:{paymentIntent:true}
    })).map(c=>({id:c.id,payment_intent_id:c.paymentIntentId,invoice_id:c.paymentIntent.providerInvoiceRef,
      receiving_address:c.receivingReference,amount_crypto:bitcoin(c.paymentIntent.requestedAmountAtomic),
      crypto_currency:c.paymentIntent.paymentAsset,exchange_rate:0,network:c.paymentIntent.paymentNetwork,
      expires_at:date(c.expiresAt),status:c.paymentIntent.status,
      payment_intent:{id:c.paymentIntentId,user_id:c.paymentIntent.customerId,amount_usd:usd(c.paymentIntent.accountingAmountMinor),provider:c.paymentIntent.provider,status:c.paymentIntent.status}}));
    case "wallet_destinations": return (await db.walletDestination.findMany({
      where:admin?{}:{customer:{userId}},take:100
    })).map(w=>({id:w.id,user_id:w.customerId,label:w.label,btc_address:w.address,network:w.network,
      is_active:w.status==="active",is_verified:!!w.verifiedAt,activated_at:date(w.activatedAt),
      deactivated_at:date(w.deactivatedAt),created_at:date(w.createdAt)}));
    case "support_cases": return (await db.supportCase.findMany({
      where:admin?{}:{customer:{userId}},take:100
    })).map(c=>({id:c.id,user_id:c.customerId,subject:c.subject,message:c.body,category:"general",
      priority:"normal",status:c.status,created_at:date(c.createdAt),updated_at:date(c.createdAt)}));
    case "notifications": return (await db.notification.findMany({
      where:{customer:{userId}},take:100
    })).map(n=>({id:n.id,user_id:n.customerId,kind:n.kind,message:n.message,
      is_read:!!n.readAt,created_at:date(n.createdAt)}));
    default:throw new Error("UNSUPPORTED_TABLE");
  }
}
function pick(rows:Record<string,any>[],q:Query){
 const filtered=rows.filter(r=>(q.filters??[]).every(f=>
   f.field==="user_id" || f.field==="customer_id" ? true : String(r[f.field])===String(f.value)));
 if(q.sort)filtered.sort((a,b)=>{
  const aa=String(a[q.sort!.field]??""),bb=String(b[q.sort!.field]??"");
  return (aa.localeCompare(bb))*(q.sort!.ascending?1:-1);
 });
 const limit=Math.max(0,Math.min(100,q.limit??100));
 const selected=filtered.slice(0,limit);
 return {data:q.options?.head?null:q.single?(selected[0]??null):selected,count:q.options?.count?filtered.length:null};
}
export async function GET(request:Request){
 let q:Query;
 try{q=JSON.parse(new URL(request.url).searchParams.get("q")??"");}
 catch{return fail("Invalid query");}
 if(!q||q.operation!=="read"||typeof q.table!=="string")return fail("Invalid query");
 try{
  const user=await current(request);
  const admin=user?await isAdministrator(request.headers):false;
  const data=await dataFor(q.table,user?.id??null,admin);
  return Response.json(pick(data,q),{headers:{"Cache-Control":"no-store"}});
 }catch(e){
  const reason=e instanceof Error?e.message:"";
  return fail(reason==="SIGN_IN_REQUIRED"?"Sign in required":reason==="ADMIN_REQUIRED"?"Administrator authorization required":"Unable to read data",
    reason==="SIGN_IN_REQUIRED"?401:reason==="ADMIN_REQUIRED"?403:503);
 }
}
export async function POST(request:Request){
 if(request.headers.get("origin")!==new URL(request.url).origin)return fail("Cross-origin mutation blocked",403);
 const user=await current(request);
 if(!user)return fail("Sign in required",401);
 let q:Query;
 try{q=await request.json();}catch{return fail("Invalid JSON");}
 if(!q||!q.table||!q.operation||!q.payload||typeof q.payload!=="object")return fail("Invalid request");
 try{
  if(q.table==="profiles"&&q.operation==="update"){
    const fullName=String(q.payload.full_name??"").trim();
    const country=String(q.payload.country??"US").trim();
    const phone=String(q.payload.phone??"").trim();
    const company=String(q.payload.company??"").trim();
    if(fullName.length<2||fullName.length>150||!["US","CA"].includes(country)||phone.length>40||company.length>200)
      return fail("Invalid profile information");
    await db.$transaction(async(tx)=>{
      await tx.user.update({where:{id:user.id},data:{name:fullName}});
      await tx.customer.upsert({where:{userId:user.id},
        create:{userId:user.id,legalName:fullName,country,phone:phone||null,company:company||null},
        update:{legalName:fullName,country,phone:phone||null,company:company||null}});
    });
    return Response.json({data:{id:user.id}});
  }
  if(q.table==="support_cases"&&q.operation==="insert"){
    const subject=String(q.payload.subject??"").trim();
    const body=String(q.payload.message??"").trim();
    if(subject.length<3||subject.length>180||body.length<5||body.length>5000)return fail("Invalid support case");
    const existing=await db.user.findUnique({where:{id:user.id},select:{name:true}});
    const customer=await db.customer.upsert({where:{userId:user.id},
      create:{userId:user.id,legalName:existing?.name??"Customer",country:"US"},update:{}});
    const ticket=await db.supportCase.create({data:{customerId:customer.id,subject,body}});
    return Response.json({data:{id:ticket.id}},{status:201});
  }
  // Intentionally NEVER trust a client to mark payments paid, verify KYC,
  // generate invoice addresses, activate wallets or assign hardware.
  return fail("This operation requires a verified server-side provider integration",409);
 }catch{return fail("Unable to save changes",503)}
}
