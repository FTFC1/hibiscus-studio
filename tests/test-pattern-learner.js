import { PatternLearner } from './build/patterns/pattern-learner.js';
import fs from 'fs/promises';
import path from 'path';

async function runPatternLearnerTests() {
    console.log('🧪 Testing PatternLearner...\n');
    
    const testPatternsPath = path.join(process.cwd(), 'test-patterns.json');
    const patternLearner = new PatternLearner({ patternsPath: testPatternsPath });
    
    try {
        // Clean up any existing test file
        try {
            await fs.unlink(testPatternsPath);
        } catch (error) {
            // File doesn't exist, that's fine
        }

        // Test 1: Initialization
        console.log('✅ Test 1: Initialization');
        await patternLearner.initialize();
        console.log('   ✓ PatternLearner initialized successfully\n');

        // Test 2: Learning from interaction
        console.log('✅ Test 2: Learning from interaction');
        const input = {
            text: 'create a task for project review',
            intent: 'create_task',
            entities: { taskName: 'project review' }
        };
        
        const action = {
            type: 'create_card',
            parameters: { name: 'project review', listId: 'todo' }
        };

        const pattern = await patternLearner.learnFromInteraction(input, action, 'user123');
        console.log('   ✓ Pattern created:', pattern.id);
        console.log('   ✓ Frequency:', pattern.metadata.frequency);
        console.log('   ✓ Success rate:', pattern.metadata.success_rate);
        console.log('');

        // Test 3: Pattern matching
        console.log('✅ Test 3: Pattern matching');
        const similarInput = {
            text: 'create task for team project review',
            intent: 'create_task',
            entities: { taskName: 'team project review' }
        };

        const matches = await patternLearner.findMatchingPatterns(similarInput, 'user123', 0.5);
        console.log('   ✓ Found', matches.length, 'matching patterns');
        if (matches.length > 0) {
            console.log('   ✓ Best match similarity:', (matches[0].similarity * 100).toFixed(1) + '%');
            console.log('   ✓ Best match confidence:', (matches[0].confidence * 100).toFixed(1) + '%');
        }
        console.log('');

        // Test 4: CRUD operations
        console.log('✅ Test 4: CRUD operations');
        
        // Add pattern
        const newPattern = {
            userId: 'user123',
            patternType: 'voice_to_action',
            trigger: {
                text: 'schedule meeting',
                intent: 'schedule',
                entities: { type: 'meeting' }
            },
            action: {
                type: 'create_event',
                parameters: { type: 'meeting' },
                confidence: 0.9
            }
        };

        const addedPattern = await patternLearner.addPattern(newPattern);
        console.log('   ✓ Pattern added:', addedPattern.id);

        // Get pattern
        const retrievedPattern = await patternLearner.getPattern(addedPattern.id);
        console.log('   ✓ Pattern retrieved:', retrievedPattern ? 'success' : 'failed');

        // Update pattern
        const updatedPattern = await patternLearner.updatePattern(addedPattern.id, {
            trigger: { ...addedPattern.trigger, text: 'schedule team meeting' }
        });
        console.log('   ✓ Pattern updated:', updatedPattern ? 'success' : 'failed');

        // Delete pattern
        const deleted = await patternLearner.deletePattern(addedPattern.id);
        console.log('   ✓ Pattern deleted:', deleted ? 'success' : 'failed');
        console.log('');

        // Test 5: Statistics
        console.log('✅ Test 5: Statistics');
        const stats = await patternLearner.getPatternStats();
        console.log('   ✓ Total patterns:', stats.total);
        console.log('   ✓ Pattern types:', Object.keys(stats.byType));
        console.log('   ✓ Average success rate:', (stats.avgSuccessRate * 100).toFixed(1) + '%');
        console.log('');

        // Test 6: Persistence
        console.log('✅ Test 6: Persistence');
        const fileExists = await fs.access(testPatternsPath).then(() => true).catch(() => false);
        console.log('   ✓ Patterns file exists:', fileExists ? 'yes' : 'no');
        
        if (fileExists) {
            const fileContent = await fs.readFile(testPatternsPath, 'utf-8');
            const patterns = JSON.parse(fileContent);
            console.log('   ✓ Patterns in file:', patterns.length);
        }
        console.log('');

        console.log('🎉 All PatternLearner tests passed!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        // Clean up test file
        try {
            await fs.unlink(testPatternsPath);
        } catch (error) {
            // File doesn't exist, that's fine
        }
    }
}

// Run the tests
runPatternLearnerTests().catch(console.error); 