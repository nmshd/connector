export type CanCreateOwnIdentityAttributeResponse =
    | { isSuccess: true }
    | {
          isSuccess: false;
          code: string;
          message: string;
      };
