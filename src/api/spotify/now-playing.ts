import { getNowPlaying } from '../../services/spotifyService';

export default async function handler(req: any, res: any) {
  const response = await getNowPlaying();
  res.status(200).json(response);
}
