export type FindByIdRepository<ReturnType> = (
  id: string
) => Promise<ReturnType | null>;

export type DeleteManyByIdRepository = (id: string) => Promise<void>;
