import { Request, Response } from "express";

export const get = (req: Request, res: Response) => {
    const status = 200;
    res.status(status).send("OK");
};