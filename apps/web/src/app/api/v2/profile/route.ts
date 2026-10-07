import { db } from "@hashnomads/db";
import { getAuth } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session?.user) return Response.json({error:{message:"Sign in required"}},{status:401});
  const user=await db.user.findUnique({where:{id:session.user.id},include:{customer:{include:{kycCases:{orderBy:{createdAt:"desc"},take:1}}}}});
  if (!user) return Response.json({error:{message:"Account unavailable"}},{status:404});
  const status=user.customer?.kycCases[0]?.status;
  const profile={
    id:user.id,email:user.email,full_name:user.name,company:user.customer?.company??null,
    country:user.customer?.country??null,phone:user.customer?.phone??null,
    role:user.role,kyc_status:status==="approved"||status==="verified"?"verified":status==="rejected"?"rejected":status==="submitted"?"submitted":"pending",
    created_at:user.createdAt.toISOString(),updated_at:user.updatedAt.toISOString()
  };
  return Response.json({profile},{headers:{"Cache-Control":"no-store"}});
}
