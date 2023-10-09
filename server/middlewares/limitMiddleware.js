import rateLimit from 'express-rate-limit';

const loginLimit = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 1 day
	max: 20,  
});

const resetLimit = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 1 day
	max: 10, // лучше 1 и пусть катиться  
});

export { loginLimit, resetLimit }; 