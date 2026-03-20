import os
import time
from playwright.sync_api import sync_playwright

def test_admin_settings_logs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Login directly with playwright bypassing UI if possible, or try UI again carefully
        page.goto("http://localhost:3000/admin")
        page.wait_for_selector("input[type='email']")
        page.fill("input[type='email']", "ygorchaves7@gmail.com")
        page.fill("input[type='password']", "mudar123456")
        page.click("button:has-text('Entrar')")

        # We need to wait for navigation. The button turns to a spinner, then router.push is called.
        try:
            page.wait_for_url("**/admin", timeout=10000)
            print("Successfully navigated to /admin")
        except Exception as e:
            print("Did not navigate to /admin in time. Current URL:", page.url)
            page.screenshot(path="/home/jules/verification/admin_login_error.png")

        page.goto("http://localhost:3000/admin/settings")
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/admin_settings_final.png")
        print("URL on settings:", page.url)

if __name__ == "__main__":
    test_admin_settings_logs()
