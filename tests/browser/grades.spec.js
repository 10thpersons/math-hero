import { expect } from '@playwright/test';
import { test } from './fixtures.js';

function solve(problem) {
  if(problem.ratio){
    const [a,b]=problem.ratio,groups=problem.target/(a+2*b);
    return [...Array(a*groups).fill(1),...Array(b*groups).fill(2)];
  }
  const values=[...(problem.lengths || problem.denominations || [1,5,10,20])].sort((a,b)=>b-a);
  let remaining=problem.target;const pieces=[];
  for(const value of values)while(remaining>=value){pieces.push(value);remaining-=value;}
  expect(remaining).toBe(0);expect(pieces.length).toBeLessThanOrEqual(20);return pieces;
}

for(const grade of [2,4,5,6])test(`Darjah ${grade} maths missions and all quizzes complete and persist`,async({page})=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{Math.random=()=>.25;});await page.goto('/');
  await page.locator('#nav-play').click();await page.locator(`[data-practice-grade="${grade}"]`).click();
  await expect(page.locator(`[data-practice-grade="${grade}"]`)).toHaveAttribute('aria-pressed','true');
  let coins=0;
  for(const type of ['bridge','market']){
    const problems=await page.evaluate(async({type,grade})=>(await import('/hero/missions.js')).createProblems(type,grade,()=>.25),{type,grade});
    await page.locator(`[data-mission="${type}"]`).click();
    for(const problem of problems){
      if(grade===4 && type==='bridge'){
        await expect(page.locator('.mh-mission-scene-label')).toHaveText(`${problem.targetCm} cm CROSSING`);
        await expect(page.locator('.mh-mission-track')).not.toHaveAttribute('aria-label',new RegExp(`target ${problem.target} mm`));
      }
      for(const value of solve(problem))await page.locator(`.mh-mission-pieces [data-value="${value}"]`).click();
      await page.locator('[data-action="check"]').click();await expect(page.locator('.mh-mission-feedback')).toContainText('You did it');
      await page.locator('[data-action="check"]').click();
    }
    coins+=30;await expect(page.locator('#coin-count')).toHaveText(String(coins));
    await page.getByRole('button',{name:'Back to exploring',exact:true}).click();await page.locator('#nav-play').click();
  }
  for(const subject of ['math','sains','bm','bi']){
    const questions=await page.evaluate(async({grade,subject})=>{
      const q=await import('/hero/quiz.js');
      return subject==='math'?q.createQuizQuestions(grade,()=>.25):subject==='sains'?q.createScienceQuestions(grade,()=>.25):q.createLanguageQuestions(grade,subject,()=>.25);
    },{grade,subject});
    await page.locator(`[data-quiz="${subject}"]`).click();
    for(const [i,q] of questions.entries()){
      await expect(page.locator('.mh-quiz-question')).toHaveText(q.text);
      await page.locator('.mh-quiz-choices').getByRole('button',{name:String(q.answer),exact:true}).click();
      await page.getByRole('button',{name:i===4?'Finish and collect coins':'Next question →',exact:true}).click();
    }
    coins+=25;await expect(page.locator('#coin-count')).toHaveText(String(coins));
    await page.getByRole('button',{name:'Back to exploring',exact:true}).click();await page.locator('#nav-play').click();
  }
  await expect(page.locator('.adventure-stamps .earned')).toHaveCount(2);
  await page.reload();const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hero-islands-v1')).profiles[0]);
  expect(p.grade).toBe(grade);expect(p.coins).toBe(160);expect(p.sessions).toHaveLength(6);expect(p.sessions.every(s=>s.grade===grade)).toBe(true);
  expect(errors).toEqual([]);
});

test('six-year selector is readable on phone and retains other explorers',async({page})=>{
  await page.setViewportSize({width:320,height:740});await page.goto('/');await page.locator('#nav-play').click();
  await expect(page.locator('[data-practice-grade]')).toHaveCount(6);
  await page.locator('[data-practice-grade="6"]').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Close',exact:true}).click();await page.locator('#profile-button').click();
  await expect(page.locator('#school-year')).toHaveValue('6');await page.locator('[data-profile="explorer-2"]').click();
  await expect(page.locator('#school-year')).toHaveValue('3');
});
