export type CanCreateRelationshipResponse =
    | { isSuccess: true }
    | {
          isSuccess: false;
          code: string;
          message: string;
      };
