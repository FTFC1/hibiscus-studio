// crop-mobile.js
// Auto-crop screenshots to mobile dimensions (390px width)

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;

async function cropScreenshot(inputPath, outputPath) {
  const metadata = await sharp(inputPath).metadata();
  const cropX = Math.floor((metadata.width - MOBILE_WIDTH) / 2);

  await sharp(inputPath)
    .extract({
      left: Math.max(0, cropX),
      top: 0,
      width: MOBILE_WIDTH,
      height: Math.min(metadata.height, MOBILE_HEIGHT)
    })
    .toFile(outputPath);

  console.log(`✓ ${path.basename(inputPath)}`);

  // Show dimensions for verification
  const croppedMeta = await sharp(outputPath).metadata();
  console.log(`  ${croppedMeta.width}x${croppedMeta.height}`);
}

// Process all themes + emails
const themes = [
  { input: 'screenshots/dark', output: 'screenshots/mobile/dark' },
  { input: 'screenshots/light', output: 'screenshots/mobile/light' },
  { input: 'screenshots/Admin Dash', output: 'screenshots/mobile/admin' },
  { input: 'emails', output: 'emails/mobile' }
];

async function main() {
  const testMode = process.argv.includes('--test');

  if (testMode) {
    // Test mode: crop just one screenshot
    console.log('🧪 TEST MODE: Cropping one screenshot...\n');

    const inputDir = 'screenshots/dark';
    const outputDir = 'screenshots/mobile/dark';
    fs.mkdirSync(outputDir, { recursive: true });

    const testFile = 'funnel-dark-step-1-event-type.png';
    await cropScreenshot(
      path.join(inputDir, testFile),
      path.join(outputDir, testFile)
    );

    console.log('\n✅ Test crop complete!');
    console.log(`📂 Check: screenshots/mobile/dark/${testFile}`);
    console.log('\nIf it looks good, run: node crop-mobile.js --all');

  } else {
    // Full mode: crop all screenshots
    for (const { input, output } of themes) {
      fs.mkdirSync(output, { recursive: true });

      const files = fs.readdirSync(input).filter(f => f.endsWith('.png'));

      console.log(`\nProcessing ${input}/ (${files.length} files)...`);

      for (const file of files) {
        await cropScreenshot(
          path.join(input, file),
          path.join(output, file)
        );
      }
    }

    console.log('\n✅ All 37 screenshots cropped to 390px width');
  }
}

main().catch(console.error);
