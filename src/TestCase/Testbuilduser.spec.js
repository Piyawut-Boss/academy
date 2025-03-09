const { test, expect } = require('@playwright/test');

test('สมัครสมาชิกและล็อกอิน', async ({ page }) => {
  // 1. ไปที่หน้า Login
  await page.goto('https://w01.pupasoft.com/login');
  console.log('✅ ไปที่หน้า Login');

  // 2. กดปุ่ม "สมัคร" เพื่อไปหน้าสมัครสมาชิก
  await page.click('text=สมัคร');
  console.log('✅ คลิกปุ่ม "สมัคร" เพื่อไปหน้าสมัครสมาชิก');

  // 3. รอให้หน้าสมัครสมาชิกโหลด
  await page.waitForSelector('input[placeholder="ชื่อผู้ใช้"]');
  console.log("✅ อยู่ที่หน้าสมัครสมาชิกแล้ว");

  // 4. กรอกข้อมูลสมัครสมาชิก (รวมยืนยันรหัสผ่าน)
  const username = 'usernew4';
  const email = 'usernew24@example.com';
  const password = 'passwordtest343';

  await page.fill('input[placeholder="ชื่อผู้ใช้"]', username);
  await page.fill('input[placeholder="อีเมล"]', email); // ใช้ placeholder ของอีเมล
  await page.fill('input[placeholder="รหัสผ่าน"]', password); // ใช้ placeholder ของรหัสผ่าน
  await page.fill('input[placeholder="ยืนยันรหัสผ่าน"]', password); // ✅ ยืนยันรหัสผ่าน
  console.log('📌 กรอกข้อมูลสมัครสมาชิก + ยืนยันรหัสผ่านเสร็จแล้ว');

  // 5. กดปุ่มสมัครสมาชิก
  await page.click('button[type="submit"]');
  console.log('✅ คลิกปุ่มสมัครสมาชิก');

  // 6. รอให้สมัครสำเร็จ
  await page.waitForSelector('div.success-message', { timeout: 5000 });
  console.log('🎉 สมัครสมาชิกสำเร็จ!');

});

