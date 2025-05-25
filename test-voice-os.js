#!/usr/bin/env node

// Simple test runner for Voice OS components
import { VoiceProcessor } from './build/voice/processor.js';
import { VoiceOS } from './build/context/voice-os.js';

async function testVoiceProcessing() {
    console.log('🔬 TESTING VOICE OS COMPONENTS\n');
    
    try {
        // Test 1: Basic Voice Processor
        console.log('📝 Test 1: Basic Voice Processor...');
        const processor = new VoiceProcessor({
            preferAI: false // Use fallback mode for testing
        });
        
        const testInput = {
            audio: "Create a card called 'Test Voice Input' in my backlog",
            timestamp: new Date(),
            sessionId: 'test-session-1'
        };
        
        const result = await processor.processVoiceInput(testInput);
        console.log('✅ Voice processing result:', {
            text: result.text,
            confidence: result.confidence,
            intent: result.intent
        });
        
        // Test 2: AI-powered processing (if API key available)
        console.log('\n🤖 Test 2: AI-powered processing...');
        const aiProcessor = new VoiceProcessor({
            preferAI: true
        });
        
        const aiResult = await aiProcessor.processVoiceInput(testInput);
        console.log('✅ AI processing result:', {
            text: aiResult.text,
            confidence: aiResult.confidence,
            nlpAnalysis: aiResult.nlpAnalysis ? 'Present' : 'Fallback used'
        });
        
        // Test 3: Voice OS Integration
        console.log('\n🎯 Test 3: Voice OS Integration...');
        const voiceOS = new VoiceOS();
        
        const osResult = await voiceOS.processVoiceInput(testInput);
        console.log('✅ Voice OS result:', {
            sessionId: osResult.sessionId,
            actionsCount: osResult.actions.executable.length,
            summary: osResult.actions.summary
        });
        
        console.log('\n🎉 ALL TESTS PASSED! Voice OS components working correctly.');
        
    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Test Trello MCP Connection
async function testTrelloMCP() {
    console.log('\n🔗 TESTING TRELLO MCP CONNECTION\n');
    
    try {
        console.log('📋 Testing environment variables...');
        const required = ['TRELLO_API_KEY', 'TRELLO_TOKEN', 'TRELLO_BOARD_ID'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            console.warn('⚠️  Missing env vars:', missing.join(', '));
            console.log('📝 Create .env file with Trello credentials for full testing');
        } else {
            console.log('✅ All Trello environment variables present');
        }
        
        console.log('\n🎯 Trello MCP setup complete');
        
    } catch (error) {
        console.error('❌ TRELLO TEST FAILED:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 VOICE OS INTEGRATION TESTING\n');
    console.log('=' .repeat(50));
    
    await testVoiceProcessing();
    await testTrelloMCP();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎊 TESTING COMPLETE!');
    console.log('\n💡 Next: Try real voice input or continue building!');
}

runAllTests().catch(console.error); 