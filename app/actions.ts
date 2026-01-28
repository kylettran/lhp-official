'use server';

import { isValidIcon } from '@/lib/subdomains';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

/**
 * Subdomains are NOT used for Lion Heart Productions.
 * This action now simply validates input and redirects.
 */
export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;

  if (!subdomain || !icon) {
    return { success: false, error: 'Subdomain and icon are required' };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)',
    };
  }

  const sanitizedSubdomain = subdomain
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens.',
    };
  }

  // Subdomain uniqueness checks disabled (no Redis, no persistence)
  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

/**
 * Deleting subdomains is disabled because subdomains are not persisted.
 */
export async function deleteSubdomainAction() {
  return {
    success: 'Subdomain functionality is disabled.',
  };
}