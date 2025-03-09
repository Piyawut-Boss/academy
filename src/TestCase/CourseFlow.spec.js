const { test, expect } = require('@playwright/test');

test.describe('Course to Study Page Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and authenticate
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // Login process
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'testuser');
    await page.fill('input[placeholder="รหัสผ่าน"]', 'password123');
    await page.click('button:has-text("เข้าสู่ระบบ")');

    // Wait for successful login and redirection
    await page.waitForURL('http://localhost:3000/course');
  });

  test('should navigate to study page and play video', async ({ page }) => {
    try {
      // Verify we're on the course page
      await expect(page).toHaveURL('http://localhost:3000/course');

      // Wait for course cards to load
      await page.waitForSelector('.ant-card', { state: 'visible' });

      // Find and click "ไปที่คอร์สของฉัน" button on the first course
      const courseButton = await page.locator('.enroll-button:has-text("ไปที่คอร์สของฉัน")').first();
      await courseButton.click();

      // Wait for study page to load
      await page.waitForSelector('.study-container');

      // Verify study page components
      await expect(page.locator('.study-nav-bar')).toBeVisible();
      await expect(page.locator('.study-sidebar')).toBeVisible();
      await expect(page.locator('.study-video-container')).toBeVisible();

      // Wait for video element to be present
      const videoElement = await page.locator('video');
      await expect(videoElement).toBeVisible();

      // Test video playback
      await test.step('Video Playback Test', async () => {
        // Click play button
        await videoElement.evaluate((video) => {
          video.play();
        });

        // Wait for video to start playing
        await page.waitForFunction(() => {
          const video = document.querySelector('video');
          return video && !video.paused && video.currentTime > 0;
        });

        // Get current time after 3 seconds of playback
        await page.waitForTimeout(3000);
        const isPlaying = await videoElement.evaluate((video) => {
          return !video.paused && video.currentTime > 0;
        });

        expect(isPlaying).toBeTruthy();
      });

      // Test unit navigation
      await test.step('Unit Navigation Test', async () => {
        // Click next unit button if available
        const nextButton = page.locator('.study-nav-button:has-text("Next")');
        if (await nextButton.isEnabled()) {
          await nextButton.click();
          // Wait for new video to load
          await page.waitForSelector('video');
        }

        // Verify unit title changed
        const unitTitle = await page.locator('.study-current-unit').textContent();
        expect(unitTitle).toBeTruthy();
      });

      // Test PDF download if available
      await test.step('PDF Download Test', async () => {
        const downloadButton = page.locator('.study-download-button');
        if (await downloadButton.isVisible()) {
          // Start waiting for download before clicking
          const downloadPromise = page.waitForEvent('download');
          await downloadButton.click();
          const download = await downloadPromise;
          expect(download.suggestedFilename()).toContain('.pdf');
        }
      });

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('should save and restore video progress', async ({ page }) => {
    // Navigate to study page
    await page.goto('http://localhost:3000/course');
    const courseButton = await page.locator('.enroll-button:has-text("ไปที่คอร์สของฉัน")').first();
    await courseButton.click();

    // Play video for 5 seconds
    const videoElement = await page.locator('video');
    await videoElement.evaluate((video) => {
      video.currentTime = 5;
      video.play();
    });
    await page.waitForTimeout(1000);

    // Refresh page
    await page.reload();

    // Verify video time is restored
    const restoredTime = await videoElement.evaluate((video) => video.currentTime);
    expect(restoredTime).toBeGreaterThanOrEqual(5);
  });
});

//6710110257
//ปัณฑิตา ประภัสสรวัฒนา