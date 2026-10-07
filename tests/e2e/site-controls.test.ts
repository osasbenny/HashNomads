import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("V2 visual navigation retains its accepted design tokens", async ({page}) => {
  const errors: string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto("/");
  const nav=page.locator("nav");
  await expect(nav.getByText("HashNomads", {exact:true})).toBeVisible();
  await expect(page.locator(".clay-gold").first()).toBeVisible();
  await expect(page.locator(".text-gradient-gold").first()).toBeVisible();
  await nav.getByRole("link",{name:"Miners"}).click();
  await expect(page).toHaveURL(/#miners$/);
  expect(errors).toEqual([]);
});
test("V2 auth screens remain responsive without altering the design", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const width of [360,390,768,1024,1440]){
    await page.setViewportSize({width,height:850});
    for(const route of ["/login","/signup"]){
      await page.goto(route);
      await expect(page.getByRole("heading",{level:1})).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
    }
  }
  await page.goto("/signup");
  const a11y=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
  expect(a11y.violations).toEqual([]);
});
