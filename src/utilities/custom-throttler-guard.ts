import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
    // Overwritten to handle the IP restriction along with Name restriction

    protected throwThrottlingException(): Promise<void> {
        throw new BadRequestException({ error: 'You have exceeded the limit. Your username/ip has been blocked for 5 seconds!' });

    }

    async handleRequest(
        context: ExecutionContext,
        limit: number = 3,
        ttl: number = 10000,
    ): Promise<boolean> {

        const { req, res } = this.getRequestResponse(context);

        // Return early if the current user agent should be ignored.
        if (Array.isArray((this.options as any).ignoreUserAgents)) {
            for (const pattern of (this.options as any).ignoreUserAgents as any) {
                if (pattern.test(req.headers['user-agent'])) {
                    return true;
                }
            }
        }

        // Tracker for IP
        const tracker = this.getTracker(req);
        const key = this.generateKey(context, await tracker, await tracker);
        const { totalHits, timeToExpire } = await this.storageService.increment(
            key,
            ttl
        );

        // Tracker for Name
        const nameTracker = this.getNameTracker(req);
        const nameKey = this.generateKey(context, nameTracker, nameTracker);
        const { totalHits: totalHitsName, timeToExpire: timeToExpireName } =
            await this.storageService.increment(nameKey, ttl);

        // Throw an error when the user reached their limit (IP).
        if (totalHits > limit) {
            res.header('Retry-After', timeToExpire);
            this.throwThrottlingException();
        }

        if (
            totalHitsName > 3
        ) {
            res.header('Retry-After', timeToExpireName);
            this.throwThrottlingException();
        }

        res.header(`${this.headerPrefix}-Limit`, limit);

        res.header(
            `${this.headerPrefix}-Remaining`,
            Math.max(0, limit - totalHits)
        );
        res.header(`${this.headerPrefix}-Reset`, timeToExpire);

        return true;
    }

    protected getNameTracker(req: Record<string, any>): string {
        return req.body.name;
    }
}