export interface OwnerDTO {
  name: string;
  avatar: string;
  background: string;
  primary_color: string;
  support_link: string | null;
  require_user_details?: boolean;
}
