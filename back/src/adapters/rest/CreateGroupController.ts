import {GroupRepo} from "../../usecase/ports/GroupRepo";
import {AuthenticatedRequest, sendUnauthorizedError} from "./RestUtils";
import express from "express";
import {createGroup} from "../../usecase/CreateGroup";

export function createGroupController(
    groupRepo: GroupRepo
) {
    return async (
        req: AuthenticatedRequest,
        res: express.Response
    ): Promise<express.Response> => {
        try {
            await createGroup(req.body.name, groupRepo);
            return res.status(201).send();
        } catch (e) {
            return sendUnauthorizedError(e);
        }
    }
}