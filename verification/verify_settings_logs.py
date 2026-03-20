import os
import time
from playwright.sync_api import sync_playwright

def test_admin_settings_logs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Login
        page.goto("http://localhost:3000/admin")
        page.screenshot(path="/home/jules/verification/admin_login_start.png")
        page.wait_for_selector("input[type='email']")

        # We need to find the correct password or skip login via mock.
        page.fill("input[type='email']", "ygorchaves7@gmail.com")
        page.fill("input[type='password']", "mudar123456")
        page.click("button:has-text('Entrar')")

        # Wait for dashboard to load
        page.wait_for_url("**/admin**")

        # Wait until we see something indicating we are logged in
        time.sleep(2)
        print("URL after login:", page.url)

        page.goto("http://localhost:3000/admin/settings")
        time.sleep(3)
        print("URL on settings:", page.url)
        page.screenshot(path="/home/jules/verification/admin_settings_before_click.png")

        # Wait for the logs to load, click Ver Detalhes on the first System Log
        # First we need to find "Ver Detalhes" button in the System Logs table
        # We can look for the button inside the system logs container
        try:
            # Look for button inside div that has h3 with text "Logs do Sistema"
            system_logs_section = page.locator("div.rounded-lg", has_text="Logs do Sistema")
            detail_button = system_logs_section.locator("button:has-text('Ver Detalhes')").first
            detail_button.wait_for(state="visible", timeout=5000)
            detail_button.click()
            time.sleep(1)
            page.screenshot(path="/home/jules/verification/admin_settings_logs.png", full_page=True)
            print("Successfully clicked and screenshot the modal.")
        except Exception as e:
            print("Could not find/click the details button:", e)

if __name__ == "__main__":
    test_admin_settings_logs()
