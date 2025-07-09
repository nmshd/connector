import { Errors } from "@nmshd/typescript-rest";
import express from "express";
import { routeRequiresRoles } from "../../../../src";

describe("routeRequiresRoles middleware", () => {
    const res = {} as any as express.Response;

    it.each([
        [["admin"], ["admin"], true],
        [["admin"], [], false],
        [["admin"], ["aRandomRole"], false],
        [["admin", "core:messages"], ["core:messages"], true],
        [["admin"], undefined, false]
    ])("should properly handle the required and given roles", (requiredRoles: string[], userRoles: string[] | undefined, shouldBeAuthorized: boolean) => {
        const next = jest.fn();

        const fn = routeRequiresRoles(requiredRoles.at(0)!, ...requiredRoles.slice(1));
        fn({ userRoles } as any as express.Request, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        if (shouldBeAuthorized) {
            expect(next).toHaveBeenCalledWith();
        } else {
            expect(next).toHaveBeenCalledWith(new Errors.ForbiddenError("You are not allowed to access this endpoint."));
        }
    });

    it("should throw an error if no roles are specified", () => {
        expect(() => {
            // @ts-expect-error
            routeRequiresRoles();
        }).toThrow("At least one role must be specified.");
    });
});
