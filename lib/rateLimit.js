// Simple in-memory rate limiter
const rateLimitMap = new Map();

export function rateLimit(limit = 10, windowMs = 60000) {
	return (req, res, next) => {
		const clientId =
			req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const now = Date.now();
		const windowStart = now - windowMs;

		// Clean old entries
		if (rateLimitMap.has(clientId)) {
			const requests = rateLimitMap
				.get(clientId)
				.filter((time) => time > windowStart);
			rateLimitMap.set(clientId, requests);
		} else {
			rateLimitMap.set(clientId, []);
		}

		const requests = rateLimitMap.get(clientId);

		if (requests.length >= limit) {
			res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
			return res.status(429).json({
				error: "Too many requests. Please try again later.",
				retryAfter: Math.ceil(windowMs / 1000),
			});
		}

		requests.push(now);
		rateLimitMap.set(clientId, requests);

		res.setHeader("X-RateLimit-Limit", limit);
		res.setHeader("X-RateLimit-Remaining", limit - requests.length);
		res.setHeader("X-RateLimit-Reset", new Date(now + windowMs).toISOString());

		if (next) next();
	};
}

// Clean up old entries every 5 minutes
setInterval(() => {
	const now = Date.now();
	const windowMs = 60000; // 1 minute
	const windowStart = now - windowMs;

	for (const [clientId, requests] of rateLimitMap.entries()) {
		const validRequests = requests.filter((time) => time > windowStart);
		if (validRequests.length === 0) {
			rateLimitMap.delete(clientId);
		} else {
			rateLimitMap.set(clientId, validRequests);
		}
	}
}, 300000); // 5 minutes
