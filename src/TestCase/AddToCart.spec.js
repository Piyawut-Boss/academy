const { test, expect } = require('@playwright/test');

test.describe('AddToCart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // นำทางไปหน้า login ก่อน
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle'); // รอให้หน้าเว็บโหลดเสร็จสมบูรณ์
  });

  test('should add course to cart after login', async ({ page }) => {
    try {
      // กรอก username และ password
      await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'usertest'); // กรอกชื่อผู้ใช้
      await page.fill('input[placeholder="รหัสผ่าน"]', '123456'); // กรอกรหัสผ่าน

      // คลิกปุ่ม "เข้าสู่ระบบ"
      await page.click('button:has-text("เข้าสู่ระบบ")');

      // รอให้ API call ล็อกอินเสร็จสิ้น
      await page.waitForResponse(response => response.url().includes('/api/auth/local') && response.status() === 200);

      // รอให้เปลี่ยนเส้นทางไปยังหน้า course
      await page.waitForURL('http://localhost:3000/course');

      // รอให้ API call เสร็จสิ้น 
      await page.waitForResponse(response => response.url().includes('/api/courses') && response.status() === 200);

      // รอให้ปุ่ม "เพิ่มลงตะกร้า" แสดงบนหน้าเว็บ
      await page.waitForSelector('.enroll-button', { state: 'visible', timeout: 60000 });

      // คลิกปุ่ม "เพิ่มลงตะกร้า" ของคอร์สแรก
      const addToCartButton = page.locator('.enroll-button').first();
      await addToCartButton.click();

      // รอให้ข้อมูลถูกบันทึกลงใน localStorage
      await page.waitForTimeout(1000);

      // ตรวจสอบว่าคอร์สถูกเพิ่มลงในตะกร้า
      const cartCourses = await page.evaluate(() => {
        const data = localStorage.getItem('cartCourses');
        console.log('cartCourses:', data); // ตรวจสอบค่าที่ได้
        return data ? JSON.parse(data) : [];
      });

      expect(cartCourses).toHaveLength(1);
      expect(cartCourses[0].Title).toBeTruthy();
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});