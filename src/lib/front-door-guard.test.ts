import { isTrustedFrontDoorRequest } from './front-door-guard';

describe('Azure Front Door origin guard', () => {
    it('allows local operation when the guard is not configured', () => {
        expect(isTrustedFrontDoorRequest(null, undefined)).toBe(true);
    });

    it('rejects direct origin traffic when the Front Door header is absent', () => {
        expect(isTrustedFrontDoorRequest(null, 'expected-front-door-id')).toBe(false);
    });

    it('rejects traffic from a different Front Door profile', () => {
        expect(isTrustedFrontDoorRequest('another-id', 'expected-front-door-id')).toBe(false);
    });

    it('allows traffic from the configured Front Door profile', () => {
        expect(isTrustedFrontDoorRequest('expected-front-door-id', 'expected-front-door-id')).toBe(true);
    });
});
