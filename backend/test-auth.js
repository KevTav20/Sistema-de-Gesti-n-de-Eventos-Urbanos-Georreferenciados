const mongoose = require('mongoose');
const User = require('./models/User.model');
const authService = require('./services/auth.service');

const MONGODB_URI = 'mongodb+srv://kjtp:12345@cluster0.1fzugm0.mongodb.net/?retryWrites=true&w=majority&appName=cluster25712';

async function test() {
    try {
        console.log('1. Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('   Connected successfully.');

        console.log('2. Creating test user...');
        const testUser = {
            username: 'testuser_' + Date.now(),
            email: 'test_' + Date.now() + '@example.com',
            password: 'password123'
        };

        try {
            const result = await authService.register(testUser);
            console.log('   User registered:', result.user.email);
        } catch (e) {
            console.error('   Registration failed:', e.message);
            throw e;
        }

        console.log('3. Testing login...');
        try {
            const loginResult = await authService.login({
                email: testUser.email,
                password: testUser.password
            });
            console.log('   Login successful. Token generated.');
        } catch (e) {
            console.error('   Login failed:', e);
            throw e;
        }

        console.log('4. Cleaning up...');
        await User.deleteOne({ email: testUser.email });
        console.log('   Test user deleted.');

        console.log('DIAGNOSTIC PASSED: DB connection and Auth logic are working.');

    } catch (error) {
        console.error('DIAGNOSTIC FAILED:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

test();
