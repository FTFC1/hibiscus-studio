const { PatternLearner } = require('../build/patterns/pattern-learner');
const fs = require('fs').promises;
const path = require('path');

describe('PatternLearner', () => {
    let patternLearner;
    let testPatternsPath;

    beforeEach(async () => {
        // Use a test-specific patterns file
        testPatternsPath = path.join(__dirname, 'test-patterns.json');
        patternLearner = new PatternLearner({ patternsPath: testPatternsPath });
        
        // Clean up any existing test file
        try {
            await fs.unlink(testPatternsPath);
        } catch (error) {
            // File doesn't exist, that's fine
        }
    });

    afterEach(async () => {
        // Clean up test file
        try {
            await fs.unlink(testPatternsPath);
        } catch (error) {
            // File doesn't exist, that's fine
        }
    });

    describe('Initialization', () => {
        test('should initialize successfully', async () => {
            await expect(patternLearner.initialize()).resolves.not.toThrow();
        });

        test('should create data directory if it does not exist', async () => {
            const deepPath = path.join(__dirname, 'deep', 'nested', 'test-patterns.json');
            const deepPatternLearner = new PatternLearner({ patternsPath: deepPath });
            
            await expect(deepPatternLearner.initialize()).resolves.not.toThrow();
            
            // Clean up
            await fs.unlink(deepPath);
            await fs.rmdir(path.dirname(deepPath));
            await fs.rmdir(path.dirname(path.dirname(deepPath)));
        });
    });

    describe('Learning from Interactions', () => {
        test('should create new pattern from interaction', async () => {
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
            
            expect(pattern).toBeDefined();
            expect(pattern.userId).toBe('user123');
            expect(pattern.trigger.text).toBe(input.text);
            expect(pattern.action.type).toBe(action.type);
            expect(pattern.metadata.frequency).toBe(1);
            expect(pattern.metadata.success_rate).toBe(1.0);
        });

        test('should update existing pattern frequency', async () => {
            const input = {
                text: 'create a task for project review',
                intent: 'create_task',
                entities: { taskName: 'project review' }
            };
            
            const action = {
                type: 'create_card',
                parameters: { name: 'project review', listId: 'todo' }
            };

            // First interaction
            const pattern1 = await patternLearner.learnFromInteraction(input, action, 'user123');
            expect(pattern1.metadata.frequency).toBe(1);

            // Second interaction with same pattern
            const pattern2 = await patternLearner.learnFromInteraction(input, action, 'user123');
            expect(pattern2.metadata.frequency).toBe(2);
            expect(pattern2.id).toBe(pattern1.id);
        });

        test('should handle failed interactions', async () => {
            const input = {
                text: 'create a task',
                intent: 'create_task',
                entities: {}
            };
            
            const action = {
                type: 'create_card',
                parameters: { name: 'task' }
            };

            // Successful interaction
            await patternLearner.learnFromInteraction(input, action, 'user123', true);
            
            // Failed interaction
            const pattern = await patternLearner.learnFromInteraction(input, action, 'user123', false);
            
            expect(pattern.learning.user_confirmations).toBe(1);
            expect(pattern.learning.user_corrections).toBe(1);
            expect(pattern.metadata.success_rate).toBe(0.5);
        });
    });

    describe('Pattern Matching', () => {
        beforeEach(async () => {
            // Set up some test patterns
            const patterns = [
                {
                    input: { text: 'create task for meeting', intent: 'create_task', entities: { taskName: 'meeting' } },
                    action: { type: 'create_card', parameters: { name: 'meeting' } },
                    userId: 'user123'
                },
                {
                    input: { text: 'add item to shopping list', intent: 'create_task', entities: { listName: 'shopping' } },
                    action: { type: 'create_card', parameters: { listName: 'shopping' } },
                    userId: 'user123'
                }
            ];

            for (const p of patterns) {
                await patternLearner.learnFromInteraction(p.input, p.action, p.userId);
            }
        });

        test('should find matching patterns with high similarity', async () => {
            const input = {
                text: 'create task for team meeting',
                intent: 'create_task',
                entities: { taskName: 'team meeting' }
            };

            const matches = await patternLearner.findMatchingPatterns(input, 'user123', 0.5);
            
            expect(matches.length).toBeGreaterThan(0);
            expect(matches[0].similarity).toBeGreaterThan(0.5);
            expect(matches[0].pattern.trigger.intent).toBe('create_task');
        });

        test('should return empty array when no patterns match threshold', async () => {
            const input = {
                text: 'completely different request',
                intent: 'unknown_intent',
                entities: {}
            };

            const matches = await patternLearner.findMatchingPatterns(input, 'user123', 0.8);
            expect(matches).toHaveLength(0);
        });

        test('should sort matches by confidence', async () => {
            const input = {
                text: 'create task',
                intent: 'create_task',
                entities: {}
            };

            const matches = await patternLearner.findMatchingPatterns(input, 'user123', 0.3);
            
            if (matches.length > 1) {
                for (let i = 1; i < matches.length; i++) {
                    expect(matches[i-1].confidence).toBeGreaterThanOrEqual(matches[i].confidence);
                }
            }
        });
    });

    describe('CRUD Operations', () => {
        test('should add pattern directly', async () => {
            const pattern = {
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

            const addedPattern = await patternLearner.addPattern(pattern);
            
            expect(addedPattern.id).toBeDefined();
            expect(addedPattern.userId).toBe('user123');
            expect(addedPattern.metadata.frequency).toBe(1);
            expect(addedPattern.learning.user_confirmations).toBe(0);
        });

        test('should get pattern by ID', async () => {
            const pattern = {
                userId: 'user123',
                patternType: 'voice_to_action',
                trigger: {
                    text: 'test pattern',
                    intent: 'test',
                    entities: {}
                },
                action: {
                    type: 'test_action',
                    parameters: {},
                    confidence: 0.8
                }
            };

            const addedPattern = await patternLearner.addPattern(pattern);
            const retrievedPattern = await patternLearner.getPattern(addedPattern.id);
            
            expect(retrievedPattern).toBeDefined();
            expect(retrievedPattern.id).toBe(addedPattern.id);
            expect(retrievedPattern.trigger.text).toBe('test pattern');
        });

        test('should return null for non-existent pattern', async () => {
            const pattern = await patternLearner.getPattern('non-existent-id');
            expect(pattern).toBeNull();
        });

        test('should update existing pattern', async () => {
            const pattern = {
                userId: 'user123',
                patternType: 'voice_to_action',
                trigger: {
                    text: 'original text',
                    intent: 'test',
                    entities: {}
                },
                action: {
                    type: 'test_action',
                    parameters: {},
                    confidence: 0.8
                }
            };

            const addedPattern = await patternLearner.addPattern(pattern);
            
            const updates = {
                trigger: {
                    text: 'updated text',
                    intent: 'test',
                    entities: {}
                }
            };

            const updatedPattern = await patternLearner.updatePattern(addedPattern.id, updates);
            
            expect(updatedPattern).toBeDefined();
            expect(updatedPattern.trigger.text).toBe('updated text');
            expect(updatedPattern.id).toBe(addedPattern.id);
        });

        test('should return null when updating non-existent pattern', async () => {
            const result = await patternLearner.updatePattern('non-existent-id', {});
            expect(result).toBeNull();
        });

        test('should delete pattern', async () => {
            const pattern = {
                userId: 'user123',
                patternType: 'voice_to_action',
                trigger: {
                    text: 'delete me',
                    intent: 'test',
                    entities: {}
                },
                action: {
                    type: 'test_action',
                    parameters: {},
                    confidence: 0.8
                }
            };

            const addedPattern = await patternLearner.addPattern(pattern);
            const deleted = await patternLearner.deletePattern(addedPattern.id);
            
            expect(deleted).toBe(true);
            
            const retrievedPattern = await patternLearner.getPattern(addedPattern.id);
            expect(retrievedPattern).toBeNull();
        });

        test('should return false when deleting non-existent pattern', async () => {
            const deleted = await patternLearner.deletePattern('non-existent-id');
            expect(deleted).toBe(false);
        });
    });

    describe('Utility Methods', () => {
        beforeEach(async () => {
            // Add some test patterns
            const patterns = [
                {
                    userId: 'user1',
                    patternType: 'voice_to_action',
                    trigger: { text: 'test1', intent: 'test', entities: {} },
                    action: { type: 'action1', parameters: {}, confidence: 0.8 }
                },
                {
                    userId: 'user2',
                    patternType: 'list_preference',
                    trigger: { text: 'test2', intent: 'test', entities: {} },
                    action: { type: 'action2', parameters: {}, confidence: 0.9 }
                },
                {
                    userId: 'global',
                    patternType: 'workflow',
                    trigger: { text: 'test3', intent: 'test', entities: {} },
                    action: { type: 'action3', parameters: {}, confidence: 0.7 }
                }
            ];

            for (const p of patterns) {
                await patternLearner.addPattern(p);
            }
        });

        test('should get all patterns', async () => {
            const allPatterns = await patternLearner.getAllPatterns();
            expect(allPatterns.length).toBe(3);
        });

        test('should filter patterns by user', async () => {
            const user1Patterns = await patternLearner.getAllPatterns('user1');
            expect(user1Patterns.length).toBe(2); // user1 + global
            
            const user2Patterns = await patternLearner.getAllPatterns('user2');
            expect(user2Patterns.length).toBe(2); // user2 + global
        });

        test('should generate pattern statistics', async () => {
            const stats = await patternLearner.getPatternStats();
            
            expect(stats.total).toBe(3);
            expect(stats.byType.voice_to_action).toBe(1);
            expect(stats.byType.list_preference).toBe(1);
            expect(stats.byType.workflow).toBe(1);
            expect(stats.byUser.user1).toBe(1);
            expect(stats.byUser.user2).toBe(1);
            expect(stats.byUser.global).toBe(1);
            expect(stats.avgSuccessRate).toBe(1.0);
        });
    });

    describe('Persistence', () => {
        test('should persist patterns to file', async () => {
            const pattern = {
                userId: 'user123',
                patternType: 'voice_to_action',
                trigger: {
                    text: 'persist test',
                    intent: 'test',
                    entities: {}
                },
                action: {
                    type: 'test_action',
                    parameters: {},
                    confidence: 0.8
                }
            };

            await patternLearner.addPattern(pattern);
            
            // Check file exists
            const fileExists = await fs.access(testPatternsPath).then(() => true).catch(() => false);
            expect(fileExists).toBe(true);
            
            // Check file content
            const fileContent = await fs.readFile(testPatternsPath, 'utf-8');
            const patterns = JSON.parse(fileContent);
            expect(patterns.length).toBe(1);
            expect(patterns[0].trigger.text).toBe('persist test');
        });

        test('should load patterns from file on initialization', async () => {
            // Create a new instance and add a pattern
            const pattern = {
                userId: 'user123',
                patternType: 'voice_to_action',
                trigger: {
                    text: 'load test',
                    intent: 'test',
                    entities: {}
                },
                action: {
                    type: 'test_action',
                    parameters: {},
                    confidence: 0.8
                }
            };

            await patternLearner.addPattern(pattern);
            
            // Create a new instance with the same file path
            const newPatternLearner = new PatternLearner({ patternsPath: testPatternsPath });
            await newPatternLearner.initialize();
            
            const allPatterns = await newPatternLearner.getAllPatterns();
            expect(allPatterns.length).toBe(1);
            expect(allPatterns[0].trigger.text).toBe('load test');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty input gracefully', async () => {
            const input = { text: '', intent: '', entities: {} };
            const action = { type: '', parameters: {} };
            
            const pattern = await patternLearner.learnFromInteraction(input, action);
            expect(pattern).toBeDefined();
        });

        test('should handle malformed JSON file gracefully', async () => {
            // Write malformed JSON to file
            await fs.writeFile(testPatternsPath, '{ invalid json }');
            
            // Should not throw, but should warn
            await expect(patternLearner.initialize()).resolves.not.toThrow();
        });

        test('should calculate similarity correctly for identical inputs', async () => {
            const input1 = {
                text: 'create task for meeting',
                intent: 'create_task',
                entities: { taskName: 'meeting' }
            };
            
            const input2 = {
                text: 'create task for meeting',
                intent: 'create_task',
                entities: { taskName: 'meeting' }
            };
            
            const action = { type: 'create_card', parameters: {} };
            
            await patternLearner.learnFromInteraction(input1, action);
            const matches = await patternLearner.findMatchingPatterns(input2);
            
            expect(matches.length).toBeGreaterThan(0);
            expect(matches[0].similarity).toBe(1.0);
        });
    });
}); 