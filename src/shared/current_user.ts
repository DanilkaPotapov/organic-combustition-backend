export interface CurrentUser {
  id: number;
}

const CURRENT_USER_ID = 1;
let currentUser: CurrentUser | null = null;

export function getCurrentUser(): CurrentUser {
  if (!currentUser) {
    currentUser = { id: CURRENT_USER_ID };
  }

  return currentUser;
}
