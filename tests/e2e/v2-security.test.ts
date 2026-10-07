import { test, expect } from "@playwright/test";
test("V2 Prisma API denies unauthenticated customer and admin data",async({page})=>{
  await page.goto("/");
  const query=encodeURIComponent(JSON.stringify({table:"profiles",operation:"read",filters:[]}));
  expect((await page.request.get("/api/v2/data?q="+query)).status()).toBe(401);
  const admin=encodeURIComponent(JSON.stringify({table:"asic_units",operation:"read",filters:[]}));
  expect((await page.request.get("/api/v2/data?q="+admin)).status()).toBe(401);
});
test("V2 browser payment confirmation cannot bypass server authorization",async({page})=>{
  await page.goto("/");
  const origin=new URL(page.url()).origin;
  const response=await page.request.post("/api/v2/data",{
    headers:{Origin:origin},
    data:{table:"orders",operation:"update",filters:[],payload:{status:"paid",paid_at:new Date().toISOString()}}
  });
  expect(response.status()).toBe(401);
});
test("V2 financial operations deny malicious cross-origin mutations",async({page})=>{
  await page.goto("/");
  const response=await page.request.post("/api/v2/data",{
    headers:{Origin:"https://attacker.example"},
    data:{table:"wallet_destinations",operation:"update",filters:[],payload:{status:"active"}}
  });
  expect(response.status()).toBe(403);
});
