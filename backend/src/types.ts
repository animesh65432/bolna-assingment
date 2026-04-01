import { NextFunction, Request, Response } from "express"
export type asyncErrorHandlerpayload = (req: Request, res: Response, next: NextFunction) => Promise<void>
