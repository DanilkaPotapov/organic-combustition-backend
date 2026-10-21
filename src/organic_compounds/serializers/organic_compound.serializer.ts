import { OrganicCompoundResponseDto } from '../dto/organic_compound_response.dto';
import { OrganicCompound } from '../entities/organic_compound.entity';

export type OrganicCompoundWithLikeCount = OrganicCompound & {
  likeCount?: number;
};

export function serializeOrganicCompound(
  compound: OrganicCompoundWithLikeCount,
  currentUserId: number,
  isLiked: boolean,
  imageUrl: string | null,
  videoUrl: string | null,
): OrganicCompoundResponseDto {
  return {
    id: compound.id,
    name: compound.name,
    shortDescription: compound.shortDescription ?? null,
    status: compound.status,
    imageUrl,
    videoUrl,
    carbonCount: compound.carbonCount ?? null,
    hydrogenCount: compound.hydrogenCount ?? null,
    createdAt: compound.createdAt,
    creatorId: compound.creatorId,
    formedAt: compound.formedAt ?? null,
    likeCount: Number(compound.likeCount ?? 0),
    isOwner: compound.creatorId === currentUserId ? 1 : 0,
    isLiked: isLiked ? 1 : 0,
  };
}
