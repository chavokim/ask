// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "@/lib/mongodb";
import {Comment} from "@/module/comment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comment[]>
) {
  try {
    const client = await clientPromise;
    const db = client.db("ask");
    const { name } = req.query;

    const commentCol = db
        .collection<Comment>(name as string)

    if (req.method === 'POST') {
      console.log(JSON.parse(req.body));
      
      const comment = {
        ...JSON.parse(req.body),
        createdAt: new Date().toISOString(),
      };

      const inserted = await commentCol
          .insertOne(comment);
      comment._id = inserted.insertedId;

      return res.status(201).json(comment);
    }

    const comments = await commentCol.find({})
        .sort({ createdAt: -1 })
        .toArray();
    
    console.log(comments);

    return res.json(
      comments,
    );
  } catch (e) {
    console.error(e);
  }
}
