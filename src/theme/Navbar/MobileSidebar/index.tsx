import React from 'react';
import OriginalNavbarMobileSidebar from '@theme-original/Navbar/MobileSidebar';

/**
 * Keep the swizzle boundary, but delegate hook ownership back to the
 * Docusaurus theme implementation. This avoids provider/hook mismatches
 * under pnpm when multiple theme-common instances are present.
 */
export default function NavbarMobileSidebar() {
  return <OriginalNavbarMobileSidebar />;
}
