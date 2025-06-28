import asyncio
from playwright.async_api import async_playwright
import os

async def html_to_png():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1200, 'height': 900})
        
        # Get absolute path to HTML file
        html_path = os.path.abspath('gas_framework_html.html')
        
        # Load the HTML file
        await page.goto(f'file://{html_path}')
        
        # Wait for fonts to load
        await page.wait_for_timeout(2000)
        
        # Take screenshot with high quality settings
        await page.screenshot(
            path='gas_sales_automation_framework_html.png',
            type='png',
            full_page=False
        )
        
        await browser.close()
        print('✅ Professional HTML framework visual created: gas_sales_automation_framework_html.png')

if __name__ == "__main__":
    asyncio.run(html_to_png()) 