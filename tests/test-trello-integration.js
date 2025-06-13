#!/usr/bin/env node

// Test Trello integration with Voice OS
import { VoiceOS } from './build/context/voice-os.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function testTrelloIntegration() {
    console.log('🎯 TESTING TRELLO VOICE OS INTEGRATION\n');
    
    try {
        // Test 1: Voice OS Processing
        console.log('📝 Test 1: Voice processing with Trello action...');
        const voiceOS = new VoiceOS({
            preferAI: false // Use fallback mode for reliable testing
        });
        
        const testCommands = [
            "Create a card called 'Voice Test Card' in my backlog",
            "Add a new task 'Testing voice integration' to the todo list",
            "Make a card named 'Voice OS Working' with high priority"
        ];
        
        for (let i = 0; i < testCommands.length; i++) {
            const command = testCommands[i];
            console.log(`\n🎤 Processing: "${command}"`);
            
            const result = await voiceOS.processTextInput(command);
            
            console.log('✅ Voice OS Result:', {
                intent: result.processing.processedVoice.intent,
                confidence: result.metadata.overallConfidence,
                actionsCount: result.actions.executable.length,
                status: result.metadata.status
            });
            
            if (result.actions.executable.length > 0) {
                console.log('🎯 Extracted Actions:');
                result.actions.executable.forEach((action, index) => {
                    console.log(`  ${index + 1}. ${action.type}: ${JSON.stringify(action.parameters)}`);
                });
            }
            
            console.log('📊 Summary:', result.actions.summary || 'No summary');
            if (result.metadata.warnings.length > 0) {
                console.log('⚠️  Warnings:', result.metadata.warnings);
            }
        }
        
        // Test 2: Environment Check
        console.log('\n🔧 Test 2: Environment configuration...');
        const requiredVars = ['TRELLO_API_KEY', 'TRELLO_TOKEN', 'TRELLO_BOARD_ID'];
        const missing = requiredVars.filter(key => !process.env[key]);
        
        if (missing.length === 0) {
            console.log('✅ All Trello environment variables present');
            console.log('🎯 Ready for MCP server testing!');
        } else {
            console.log(`⚠️  Missing env vars for full Trello testing: ${missing.join(', ')}`);
            console.log('📝 Voice processing works, but Trello actions need env vars');
        }
        
        // Test 3: Action Extraction Quality
        console.log('\n🧠 Test 3: Action extraction quality...');
        const qualityTests = [
            { input: 'Create card "Important Task"', expectedAction: 'create_card' },
            { input: 'Move my task to done', expectedAction: 'move_card' },
            { input: 'Archive the completed items', expectedAction: 'archive_card' },
            { input: 'Show me all my cards', expectedAction: 'list_cards' }
        ];
        
        let passed = 0;
        for (const test of qualityTests) {
            const result = await voiceOS.processTextInput(test.input);
            const detectedIntent = result.processing.processedVoice.intent;
            const success = detectedIntent === test.expectedAction;
            
            console.log(`${success ? '✅' : '❌'} "${test.input}" → ${detectedIntent} (expected: ${test.expectedAction})`);
            if (success) passed++;
        }
        
        console.log(`\n📊 Intent Detection Accuracy: ${passed}/${qualityTests.length} (${(passed/qualityTests.length*100).toFixed(1)}%)`);
        
        console.log('\n🎉 TRELLO VOICE OS INTEGRATION TESTING COMPLETE!');
        console.log('\n💡 Next Steps:');
        console.log('1. Add Trello credentials to .env for full MCP testing');
        console.log('2. Test with real Trello API calls via MCP server');
        console.log('3. Integrate with voice input for complete Voice OS');
        
    } catch (error) {
        console.error('❌ INTEGRATION TEST FAILED:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testTrelloIntegration().catch(console.error); 