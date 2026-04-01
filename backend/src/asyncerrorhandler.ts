import { Request, Response, NextFunction } from "express";

export type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncErrorHandler = (func: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch((err) => next(err));
    };
};