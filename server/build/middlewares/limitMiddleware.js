import rateLimit from 'express-rate-limit';
const loginLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 20,
});
const resetLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
});
export { loginLimit, resetLimit };
//# sourceMappingURL=limitMiddleware.js.map