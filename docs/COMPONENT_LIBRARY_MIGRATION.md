# Component Library Migration Plan - @kasoma/comp-lib

## Overview
Migrate Oliotya Safaris components to use the existing `@kasoma/comp-lib` package while centralizing theme management and fixing all TypeScript errors.

## Current State
- **Package**: `@kasoma/comp-lib` already exists and is built
- **Goal**: Migrate components from local files to use the published library
- **Theme**: Maintain Tailwind v4 CSS-first approach with CSS custom properties
- **Business Logic**: Server Actions + Client Hooks hybrid pattern

---

## Phase 1: Audit & Preparation

### 1.1 TypeScript Error Audit
Run diagnostics to identify all TypeScript errors:
```bash
yarn tsc --noEmit
```

### 1.2 Component Inventory
Identify which components exist in `@kasoma/comp-lib` vs local:
- Check `@kasoma/comp-lib` exports
- Map local components to library equivalents
- Identify components that need to remain local (app-specific)

### 1.3 Dependency Check
Ensure `@kasoma/comp-lib` is properly installed:
```bash
yarn add @kasoma/comp-lib
```

---

## Phase 2: Theme Integration

### 2.1 Verify Theme Compatibility
**Current**: `app/globals.css` uses Tailwind v4 with CSS custom properties
**Action**: Ensure `@kasoma/comp-lib` theme aligns with local theme

**Check:**
- Color tokens match (primary green: `oklch(0.5 0.15 142)`)
- Border radius values align
- Typography settings compatible
- Dark mode implementation matches

### 2.2 Theme Provider Setup
If `@kasoma/comp-lib` provides a theme provider:
```typescript
// app/layout.tsx
import { ThemeProvider } from '@kasoma/comp-lib';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Phase 3: Component Migration

### 3.1 Update Imports - UI Components

**Before:**
```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

**After:**
```typescript
import { Button, Card, Input } from '@kasoma/comp-lib';
// or
import { Button } from '@kasoma/comp-lib/button';
```

### 3.2 Update Imports - Hooks

**Before:**
```typescript
import { useToast } from '@/hooks/use-toast';
```

**After:**
```typescript
import { useToast } from '@kasoma/comp-lib/hooks';
// or
import { useToast } from '@kasoma/comp-lib';
```

### 3.3 Update Imports - Utilities

**Before:**
```typescript
import { cn } from '@/lib/utils';
```

**After:**
```typescript
import { cn } from '@kasoma/comp-lib/utils';
// or
import { cn } from '@kasoma/comp-lib';
```

### 3.4 Components to Keep Local

These are Oliotya Safaris-specific and should NOT migrate:
- `components/booking-form.tsx` - Business logic specific to Oliotya Safaris
- `components/contact-form-component.tsx` - App-specific form
- `components/header.tsx` - App navigation
- `components/footer.tsx` - App footer
- `components/hero-carousel.tsx` - App-specific carousel
- `components/cms/*-modal.tsx` - App-specific CMS modals (package-edit, destination-edit, etc.)

These components will IMPORT from `@kasoma/comp-lib` but remain local.

---

## Phase 4: TypeScript Error Fixes

### 4.1 Common Error Types & Fixes

#### Error: Module not found
```typescript
// Problem
import { Button } from '@/components/ui/button'; // Module not found

// Solution
import { Button } from '@kasoma/comp-lib';
```

#### Error: Type mismatch
```typescript
// Problem
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string; // Too loose
}

// Solution
import type { ButtonProps } from '@kasoma/comp-lib';
// Use the library's types directly
```

#### Error: Missing properties
```typescript
// Problem
<Button onClick={handler} /> // Missing required prop

// Solution
// Check @kasoma/comp-lib documentation for required props
<Button onClick={handler} variant="default" />
```

#### Error: Cannot find name
```typescript
// Problem
const toast = useToast(); // Cannot find name 'useToast'

// Solution
import { useToast } from '@kasoma/comp-lib/hooks';
```

### 4.2 Type-Only Imports
For better tree-shaking:
```typescript
import { Button } from '@kasoma/comp-lib';
import type { ButtonProps } from '@kasoma/comp-lib';
```

### 4.3 Prisma Client Types
Ensure Prisma client is properly generated:
```bash
npx prisma generate
```

Update imports:
```typescript
import { PrismaClient } from '@prisma/client';
// or if using custom location
import { PrismaClient } from '../prisma/app/generated/prisma-client';
```

---

## Phase 5: Validation & Business Logic

### 5.1 Validation Schemas

**Check if `@kasoma/comp-lib` includes validators**

**If YES:**
```typescript
// Before
import { bookingFormSchema } from '@/lib/validations/booking';

// After
import { bookingFormSchema } from '@kasoma/comp-lib/validators';
```

**If NO:**
Keep local validation schemas in `lib/validations/*` - these are app-specific.

### 5.2 API Client & Hooks

**Check if `@kasoma/comp-lib` provides:**
- `useQuery` / `useMutation` hooks
- API client utilities
- Form handling hooks

**If provided, update:**
```typescript
// Before
const { data, loading } = useCustomFetch('/api/bookings');

// After
import { useQuery } from '@kasoma/comp-lib/hooks';
const { data, loading } = useQuery('/api/bookings');
```

**If NOT provided:**
Keep local hooks in `hooks/` directory.

---

## Phase 6: CMS Component Migration

### 6.1 Generic CMS Components

**If `@kasoma/comp-lib` provides CMS utilities:**
- `EditableWrapper`
- `ImagePicker`
- `ImageUploadModal`
- `CMSHeader`
- `CMSSidebar`

**Update imports:**
```typescript
// Before
import { EditableWrapper } from '@/components/cms/editable-wrapper';

// After
import { EditableWrapper } from '@kasoma/comp-lib/cms';
```

### 6.2 App-Specific CMS Modals

**Keep local:**
- `components/cms/destination-edit-modal.tsx`
- `components/cms/package-edit-modal.tsx`
- `components/cms/booking-confirmation-*-modal.tsx`
- All other `*-modal.tsx` files with app-specific logic

**But update their internal imports to use `@kasoma/comp-lib`:**
```typescript
// Inside destination-edit-modal.tsx
import { Dialog, Button, Input, Tabs } from '@kasoma/comp-lib';
import { useToast } from '@kasoma/comp-lib/hooks';
```

---

## Phase 7: Style Integration

### 7.1 Import Component Styles

**If `@kasoma/comp-lib` requires style imports:**
```typescript
// app/globals.css
@import '@kasoma/comp-lib/styles';

/* Your custom styles below */
@theme {
  /* ... */
}
```

**Or in layout.tsx:**
```typescript
import '@kasoma/comp-lib/styles.css';
import './globals.css';
```

### 7.2 CSS Variable Overrides

Override library defaults with your theme:
```css
/* app/globals.css */
:root {
  /* Override @kasoma/comp-lib defaults */
  --primary: oklch(0.5 0.15 142);
  --radius: 0.75rem;
  /* ... */
}
```

---

## Phase 8: Testing & Validation

### 8.1 TypeScript Check
```bash
yarn tsc --noEmit
```

**Expected output:** 0 errors

### 8.2 Build Check
```bash
yarn build
```

**Expected output:** Successful build with no errors

### 8.3 Run Tests (if available)
```bash
yarn test
```

**Expected output:** All tests pass

### 8.4 Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Forms submit correctly
- [ ] CMS editor functions properly
- [ ] Images upload successfully
- [ ] Theme switching works (light/dark mode)
- [ ] Toast notifications appear
- [ ] Modals open and close
- [ ] Responsive design intact

---

## Phase 9: Cleanup

### 9.1 Remove Duplicate Components

**After confirming everything works, remove:**
```bash
# Only remove components that are now imported from @kasoma/comp-lib
rm -rf components/ui/button.tsx  # If using library version
rm -rf components/ui/card.tsx    # If using library version
# ... etc
```

**Keep:**
- App-specific components (header, footer, forms)
- CMS modals with business logic
- Any components not in `@kasoma/comp-lib`

### 9.2 Update Documentation

Update README.md:
```markdown
## Dependencies
- **@kasoma/comp-lib**: Shared component library
- All UI components imported from the library
- App-specific components in `components/` directory
```

### 9.3 Update Import Paths Config

If using path aliases, ensure `@kasoma/comp-lib` doesn't conflict:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./"],
      "@kasoma/comp-lib": ["./node_modules/@kasoma/comp-lib"]
    }
  }
}
```

---

## Common Migration Issues & Solutions

### Issue 1: Conflicting Component APIs
**Problem:** Library component has different props than local version
**Solution:**
- Check library documentation for correct props
- Create adapter component if needed:
```typescript
// components/adapted-button.tsx
import { Button as LibButton } from '@kasoma/comp-lib';

export function Button(props: LocalButtonProps) {
  // Adapt local props to library props
  return <LibButton {...adaptedProps} />;
}
```

### Issue 2: Missing Types
**Problem:** `@kasoma/comp-lib` types not found
**Solution:**
```bash
# Ensure type definitions are installed
yarn add -D @types/kasoma__comp-lib
# or if bundled with the package
yarn install --force
```

### Issue 3: Style Conflicts
**Problem:** Library styles override app styles
**Solution:**
```css
/* Increase specificity for app styles */
.my-custom-component {
  @apply bg-primary; /* Use Tailwind utilities */
}

/* Or use !important as last resort */
.override {
  background: oklch(0.5 0.15 142) !important;
}
```

### Issue 4: Server/Client Component Mismatch
**Problem:** "use client" directive missing
**Solution:**
```typescript
// If using a client component from library in server component
import dynamic from 'next/dynamic';
const ClientButton = dynamic(() => import('@kasoma/comp-lib').then(mod => mod.Button), {
  ssr: false
});
```

---

## Rollback Plan

If migration causes issues:

### Option 1: Gradual Rollback
Revert specific imports:
```typescript
// Revert to local
import { Button } from '@/components/ui/button';
// Instead of
import { Button } from '@kasoma/comp-lib';
```

### Option 2: Full Rollback
```bash
# Restore previous version
git revert <migration-commit>

# Reinstall dependencies
yarn install
```

### Option 3: Hybrid Approach
Keep both implementations:
```typescript
// Use library for new components
import { NewComponent } from '@kasoma/comp-lib';

// Keep local for existing
import { LegacyButton } from '@/components/ui/button';
```

---

## Success Criteria

✅ **TypeScript Errors**: 0 errors when running `yarn tsc --noEmit`
✅ **Build**: Successful build with `yarn build`
✅ **Tests**: All tests pass (if applicable)
✅ **Runtime**: No console errors on any page
✅ **Functionality**: All features work as before
✅ **Performance**: No significant performance degradation
✅ **Bundle Size**: No massive increase in bundle size

---

## Migration Checklist

### Pre-Migration
- [ ] Audit `@kasoma/comp-lib` exports
- [ ] Document local vs library component mappings
- [ ] Backup current codebase
- [ ] Run baseline tests

### Phase 1: Core Components
- [ ] Update Button imports
- [ ] Update Card imports
- [ ] Update Input/Form imports
- [ ] Test forms still work

### Phase 2: Layout Components
- [ ] Update Dialog imports
- [ ] Update Dropdown imports
- [ ] Update Tabs imports
- [ ] Test modals open/close

### Phase 3: Utilities & Hooks
- [ ] Update `cn()` utility imports
- [ ] Update `useToast` imports
- [ ] Update validation imports (if applicable)
- [ ] Test toast notifications

### Phase 4: CMS Components
- [ ] Update EditableWrapper imports
- [ ] Update ImagePicker imports
- [ ] Update CMS modal component imports
- [ ] Test CMS editor functionality

### Phase 5: Validation
- [ ] Run TypeScript check
- [ ] Run build
- [ ] Run tests
- [ ] Manual testing

### Phase 6: Cleanup
- [ ] Remove unused local components
- [ ] Update documentation
- [ ] Commit changes

---

## Timeline Estimate

- **Day 1**: Audit & preparation (Phase 1)
- **Day 2**: Core component migration (Phase 2-3)
- **Day 3**: CMS & utilities migration (Phase 4)
- **Day 4**: TypeScript fixes & testing (Phase 5)
- **Day 5**: Cleanup & documentation (Phase 6)

**Total**: ~5 days for complete migration

---

## Support & Resources

- **@kasoma/comp-lib Documentation**: [Check package README or docs]
- **Migration Support**: Contact @kasoma/comp-lib maintainers
- **Local Fallback**: Keep `components/ui/` as backup during migration
- **Testing Environment**: Test in development before deploying

---

## Next Steps

1. Review this document
2. Check `@kasoma/comp-lib` documentation for available exports
3. Start with Phase 1: Fix immediate TypeScript errors
4. Run `yarn tsc --noEmit` to see all errors
5. Create a branch for migration work
6. Begin systematic component migration

---

**Last Updated**: 2025-01-26
**Status**: Planning Complete - Ready for Implementation
