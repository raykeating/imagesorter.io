import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_PUBLIC_API_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// handler

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { data: photos, error } = await supabase
		.from("photos")
		.select("*");

	if (error) {
		res.status(500).json({ error });
	} else {
		res.status(200).json({ photos });
	}
}
