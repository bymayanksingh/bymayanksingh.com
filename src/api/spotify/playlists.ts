import { getPlaylists } from '../../services/spotifyService';

export default async function handler(req: any, res: any) {
  const response = await getPlaylists();
  res.status(200).json(response);
}
