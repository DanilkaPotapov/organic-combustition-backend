export type CompoundStatus = 'draft' | 'published' | 'deleted';
export type CompoundClass = 'alkane' | 'alkene' | 'alcohol';

export interface OrganicCompound {
  id: number;
  name: string;
  key: string;
  formula: string;
  molarMass: number;
  compoundClass: CompoundClass;
  classLabel: string;
  description: string;
  status: CompoundStatus;
  imageUrl: string;
  videoUrl: string;
  videoMime?: string;
  imageCredit?: string;
  videoCredit?: string;
  likes: number[];
}
