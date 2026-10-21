import { OrganicCompoundStatus } from '../entities/organic_compound.entity';

export class OrganicCompoundResponseDto {
  id: number;
  name: string;
  shortDescription: string | null;
  status: OrganicCompoundStatus;
  imageUrl: string | null;
  videoUrl: string | null;
  carbonCount: number | null;
  hydrogenCount: number | null;
  createdAt: Date;
  creatorId: number;
  formedAt: Date | null;
  likeCount: number;
  isOwner: 0 | 1;
  isLiked: 0 | 1;
}
