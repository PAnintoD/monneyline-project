const { z } = require('zod');

try {
    const schema = z.string();
    schema.parse(123);
} catch (err) {
    if (err instanceof z.ZodError) {
        console.log('Keys of ZodError:', Object.keys(err));
        console.log('Has errors property:', 'errors' in err);
        console.log('Has issues property:', 'issues' in err);
        console.log('err.errors:', err.errors);
        console.log('err.issues:', err.issues);
    }
}
