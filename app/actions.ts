'use server';

import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

/**
 * Subdomains are NOT used for Lion Heart Productions.
 * This action now only validates basic input and redirects.
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

  // Basic emoji length check (replaces isValidIcon)
  if (icon.length > 10) {
    return {
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)',
    };
  }

  const sanitizedSubdomain = subdomain
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens.',
    };
  }

  // Subdomain system is disabled — redirect only
  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

/**
 * Deleting subdomains is disabled because subdomains are not supported.
 */
export async function deleteSubdomainAction() {
  return {
    success: 'Subdomain functionality is disabled.',
  };
}