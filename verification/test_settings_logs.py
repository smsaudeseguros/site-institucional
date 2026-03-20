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
        page.wait_for_selector("input[type='email']")
        page.fill("input[type='email']", "ygorchaves7@gmail.com")
        page.fill("input[type='password']", "mudar123456")
        page.click("button:has-text('Entrar')")

        page.wait_for_url("**/admin", timeout=10000)

        page.goto("http://localhost:3000/admin/settings")
        time.sleep(2)

        # Scroll down
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1)

        # Look for the System Logs section and click Visualizar Logs do Sistema
        try:
            page.click("button:has-text('Visualizar Logs do Sistema')")
            time.sleep(1)

            # The modal should have the title "Histórico de Logs" or we just screenshot it right here
            page.screenshot(path="/home/jules/verification/admin_system_logs_panel.png", full_page=True)
            print("Successfully opened System Logs panel")

            # Now we should see the table, click the first Ver Detalhes
            # It might take a moment to fetch the logs, let's wait up to 3000ms
            if page.locator("button:has-text('Ver Detalhes')").count() > 0:
                page.click("button:has-text('Ver Detalhes')", timeout=3000)
                time.sleep(1)
                page.screenshot(path="/home/jules/verification/admin_system_logs_modal.png", full_page=True)
                print("Successfully opened System Logs detail modal")

                # Close the modal
                page.keyboard.press("Escape")
                time.sleep(1)
            else:
                 print("No System Logs details button found.")

            # Close the panel
            page.keyboard.press("Escape")
            time.sleep(1)
        except Exception as e:
            print("Could not process System Logs:", e)

if __name__ == "__main__":
    test_admin_settings_logs()
