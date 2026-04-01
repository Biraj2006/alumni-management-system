const bcrypt = require('bcryptjs');

async function checkHash() {
    const hash = '$2b$10$rIC/Z5cQxK6Gy7NZ3s0XOeQh8t9VqgDv8j8HxMqJhB8M3K8G8K8G8';

    // Try common passwords
    const common = ['admin', 'admin123', 'password', '123456'];

    for (const p of common) {
        const isMatch = await bcrypt.compare(p, hash);
        console.log(`Password "${p}" matches: ${isMatch}`);
    }
}

checkHash();
