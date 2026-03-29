import { Request, Response } from "express";
import { aiSearchService } from "../services/aiService";
import { AiSearchRequest } from "../types/aiTypes";

export const aiSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.body as AiSearchRequest;
    const typedReq = req as Request & { user: { _id: string } };

    if (!query) {
      return res.status(400).json({
        message: "query is required",
      });
    }

    const result = await aiSearchService(query, typedReq.user._id.toString());

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to perform AI search",
    });
  }
};