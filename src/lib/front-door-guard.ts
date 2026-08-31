export function isTrustedFrontDoorRequest(
    actualFrontDoorId: string | null,
    expectedFrontDoorId: string | undefined,
): boolean {
    return !expectedFrontDoorId || actualFrontDoorId === expectedFrontDoorId;
}
