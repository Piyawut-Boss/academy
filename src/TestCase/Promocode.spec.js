const { test, expect } = require('@playwright/test');

test.describe('Promotion Code Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Login as admin
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'admin');
    await page.fill('input[placeholder="รหัสผ่าน"]', 'admin123');
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Wait for admin dashboard to load
    await page.waitForURL('http://localhost:3000/admin/EditPromotion');
  });

  test('should add new promotion code successfully', async ({ page }) => {
    // Test data
    const testPromotion = {
      name: 'Test Promo 2024',
      description: 'Test Description',
      discount: '15',
      code: 'TEST15',
      startDate: '2024-03-01',
      endDate: '2024-12-31'
    };

    try {
      // Click add promotion button
      await page.click('button:has-text("เพิ่มโปรโมชั่น")');

      // Fill promotion details
      await page.fill('input[name="promotionName"]', testPromotion.name);
      await page.fill('textarea[name="description"]', testPromotion.description);
      await page.fill('input[name="discount"]', testPromotion.discount);
      await page.fill('input[name="code"]', testPromotion.code);
      
      // Set dates if date fields exist
      if (await page.$('input[name="startDate"]') !== null) {
        await page.fill('input[name="startDate"]', testPromotion.startDate);
        await page.fill('input[name="endDate"]', testPromotion.endDate);
      }

      // Upload promotion image if upload field exists
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.setInputFiles('path/to/test-image.jpg');
      }

      // Submit form
      await page.click('button:has-text("บันทึก")');

      // Wait for success message
      await page.waitForSelector('.ant-message-success', {
        timeout: 5000
      });

      // Verify promotion was added
      await expect(page.getByText(testPromotion.name)).toBeVisible();
      await expect(page.getByText(testPromotion.code)).toBeVisible();
      
      // Verify promotion works in cart
      await page.goto('http://localhost:3000/course');
      await page.click('.enroll-button');
      await page.goto('http://localhost:3000/shopping');
      
      // Apply promotion code
      await page.fill('input[placeholder="กรอกรหัสส่วนลด"]', testPromotion.code);
      await page.click('button:has-text("ใช้โค้ด")');

      // Verify discount was applied
      const discountElement = page.locator('.discount-amount');
      await expect(discountElement).toContainText(`${testPromotion.discount}%`);

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('should show error for invalid promotion code', async ({ page }) => {
    await page.goto('http://localhost:3000/shopping');

    // Try invalid code
    await page.fill('input[placeholder="กรอกรหัสส่วนลด"]', 'INVALID123');
    await page.click('button:has-text("ใช้โค้ด")');

    // Verify error message
    await expect(page.locator('.ant-message-error')).toBeVisible();
    await expect(page.locator('.ant-message-error')).toContainText('รหัสส่วนลดไม่ถูกต้อง');
  });

  test('should prevent adding duplicate promotion code', async ({ page }) => {
    // Try to add promotion with existing code
    await page.click('button:has-text("เพิ่มโปรโมชั่น")');
    
    await page.fill('input[name="promotionName"]', 'Duplicate Promo');
    await page.fill('input[name="code"]', 'TEST15'); // Using same code as previous test

    await page.click('button:has-text("บันทึก")');

    // Verify error message
    await expect(page.locator('.ant-message-error')).toBeVisible();
    await expect(page.locator('.ant-message-error')).toContainText('รหัสโปรโมชั่นนี้มีอยู่แล้ว');
  });
});

test.describe('Promotion Code - SUMMER Campaign', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Login as admin
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'admin');
    await page.fill('input[placeholder="รหัสผ่าน"]', 'admin123');
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Navigate to promotion management
    await page.waitForURL('http://localhost:3000/admin/EditPromotion');
  });

  test('should add SUMMER promotion code successfully', async ({ page }) => {
    // Test data for SUMMER promotion
    const summerPromotion = {
      name: 'Summer Sale 2024',
      description: 'รับส่วนลดพิเศษ 25% สำหรับคอร์สเรียนออนไลน์ในช่วงซัมเมอร์',
      discount: '25',
      code: 'SUMMER2024',
      startDate: '2024-03-01',
      endDate: '2024-05-31'
    };

    try {
      // Add new promotion
      await page.click('button:has-text("เพิ่มโปรโมชั่น")');

      // Fill in summer promotion details
      await page.fill('input[name="PromitionName"]', summerPromotion.name);
      await page.fill('textarea[name="Discription"]', summerPromotion.description);
      await page.fill('input[name="Discount"]', summerPromotion.discount);
      await page.fill('input[name="CodeName"]', summerPromotion.code);

      // Upload summer campaign image
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.setInputFiles('src/assets/summer-promo.jpg');
      }

      // Save promotion
      await page.click('button:has-text("บันทึก")');

      // Verify promotion was added successfully
      await page.waitForSelector('.ant-message-success');

      // Verify promotion appears in list
      await expect(page.getByText(summerPromotion.name)).toBeVisible();
      await expect(page.getByText(summerPromotion.code)).toBeVisible();
      await expect(page.getByText('25%')).toBeVisible();

      // Test promotion code in shopping cart
      await page.goto('http://localhost:3000/course');
      await page.click('.enroll-button:first-child');
      await page.goto('http://localhost:3000/shopping');
      
      // Apply SUMMER promotion code
      await page.fill('input[placeholder="กรอกรหัสส่วนลด"]', summerPromotion.code);
      await page.click('button:has-text("ใช้โค้ด")');

      // Verify 25% discount was applied
      const discountText = await page.locator('.discount-amount').textContent();
      expect(discountText).toContain('25%');

      // Verify final price calculation
      const originalPrice = await page.locator('.original-price').textContent();
      const finalPrice = await page.locator('.final-price').textContent();
      const originalAmount = parseFloat(originalPrice.replace(/[^0-9.-]+/g, ''));
      const finalAmount = parseFloat(finalPrice.replace(/[^0-9.-]+/g, ''));
      expect(finalAmount).toBe(originalAmount * 0.75); // 25% off

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('should validate SUMMER promotion code requirements', async ({ page }) => {
    await page.click('button:has-text("เพิ่มโปรโมชั่น")');

    // Test required fields
    await page.click('button:has-text("บันทึก")');
    await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();

    // Test invalid discount value
    await page.fill('input[name="Discount"]', '101');
    await expect(page.locator('.ant-form-item-explain-error')).toContainText('ส่วนลดต้องอยู่ระหว่าง 1-100');
    
    // Test code format
    await page.fill('input[name="CodeName"]', 'summer@123');
    await expect(page.locator('.ant-form-item-explain-error')).toContainText('รหัสโปรโมชั่นต้องเป็นตัวอักษรและตัวเลขเท่านั้น');
  });
});
