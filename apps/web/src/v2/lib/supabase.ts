// Prisma/PostgreSQL BFF compatibility for the original V2 component data calls.
// Never place a database credential, Supabase key or privileged mutation in the browser.
type Result = { data: any; error: { message: string } | null; count: number | null };
type Operation = "read" | "insert" | "update" | "upsert" | "delete";
class Query implements PromiseLike<Result> {
  private operation:Operation="read";
  private payload:unknown;
  private filters:Array<{field:string;value:unknown}>=[];
  private columns="*";
  private sort:{field:string;ascending:boolean}|null=null;
  private max:number|null=null;
  private one=false;
  private opts:{count?:string;head?:boolean}={};
  constructor(private table:string){}
  select(columns="*",opts:{count?:string;head?:boolean}={}){this.columns=columns;this.opts=opts;return this}
  eq(field:string,value:unknown){this.filters.push({field,value});return this}
  order(field:string,opts:{ascending?:boolean}={}){this.sort={field,ascending:opts.ascending??true};return this}
  limit(value:number){this.max=value;return this}
  single(){this.one=true;return this}
  maybeSingle(){this.one=true;return this}
  insert(payload:unknown){this.operation="insert";this.payload=payload;return this}
  upsert(payload:unknown){this.operation="upsert";this.payload=payload;return this}
  update(payload:unknown){this.operation="update";this.payload=payload;return this}
  delete(){this.operation="delete";return this}
  private async execute():Promise<Result>{
    try {
      const query={table:this.table,operation:this.operation,filters:this.filters,columns:this.columns,sort:this.sort,limit:this.max,single:this.one,options:this.opts,payload:this.payload};
      const read=this.operation==="read";
      const url="/api/v2/data"+(read?"?q="+encodeURIComponent(JSON.stringify(query)):"");
      const response=await fetch(url,{method:read?"GET":"POST",credentials:"same-origin",headers:read?{}:{"Content-Type":"application/json"},body:read?undefined:JSON.stringify(query),cache:"no-store"});
      const result=await response.json().catch(()=>({error:{message:"Service temporarily unavailable"}}));
      if(!response.ok)return{data:null,error:{message:result.error?.message||"Action unavailable"},count:null};
      return{data:result.data??null,error:null,count:result.count??null};
    }catch{return{data:null,error:{message:"Unable to connect to HashNomads"},count:null}}
  }
  then<TResult1=Result,TResult2=never>(resolve?:((value:Result)=>TResult1|PromiseLike<TResult1>)|null,reject?:((reason:any)=>TResult2|PromiseLike<TResult2>)|null):Promise<TResult1|TResult2>{return this.execute().then(resolve,reject)}
}
export const supabase={from:(table:string)=>new Query(table)};
