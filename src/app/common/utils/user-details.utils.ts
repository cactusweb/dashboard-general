import { OwnerDTO } from '@csd-models/owner.models';
import { UserDTO } from '@csd-models/user.models';

/**
 * Detects the backend's user-details gate rejection.
 *
 * The message is compared case-insensitively because the error
 * interceptor capitalizes its first letter before it reaches
 * component code. Both forms are accepted: the backend initially
 * returned `user_details_required` and now returns the human-readable
 * `Please fill in your profile details before purchasing`.
 */
const USER_DETAILS_REQUIRED_MESSAGES = [
  'user_details_required',
  'please fill in your profile details before purchasing',
];

export function isUserDetailsRequiredErr(err: any): boolean {
  const message = err?.error?.message?.toLowerCase();

  return (
    err?.status === 400 &&
    !!message &&
    USER_DETAILS_REQUIRED_MESSAGES.includes(message)
  );
}

/** All four detail fields are present. */
export function isUserDetailsComplete(user: UserDTO | null): boolean {
  return !!(
    user?.email &&
    user?.first_name &&
    user?.last_name &&
    user?.country
  );
}

/** The owner requires details and the profile is incomplete. */
export function isUserDetailsGateActive(
  owner: OwnerDTO | null,
  user: UserDTO | null,
): boolean {
  return !!owner?.require_user_details && !isUserDetailsComplete(user);
}
