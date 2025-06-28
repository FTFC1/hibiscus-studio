import asyncio
from playwright.async_api import async_playwright
import os

async def svg_to_png():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1200, 'height': 900})
        
        # Get absolute path to SVG HTML file
        svg_path = os.path.abspath('gas_framework_svg.html')
        
        # Load the SVG file
        await page.goto(f'file://{svg_path}')
        
        # Wait for fonts to load
        await page.wait_for_timeout(3000)
        
        # Take screenshot with high quality settings
        await page.screenshot(
            path='gas_sales_automation_framework_svg.png',
            type='png',
            full_page=False
        )
        
        await browser.close()
        print('✅ Pixel-perfect SVG framework visual created: gas_sales_automation_framework_svg.png')

if __name__ == "__main__":
    asyncio.run(svg_to_png()) 