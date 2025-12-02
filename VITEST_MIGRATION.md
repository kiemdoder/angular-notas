# Vitest Migration Status

## Current Status: Angular 21 Upgraded - Vitest Configuration In Progress ⚠️

**Date:** December 2, 2025

The project has been successfully upgraded to Angular 21.0.2, and Vitest infrastructure is in place. The application builds and runs successfully, but test execution requires final configuration adjustments.

### What's Been Done ✅

1. **✅ Upgraded to Angular 21.0.2** (December 2, 2025):
   - All `@angular/*` packages updated to v21.0.2
   - `@angular/cli` and `@angular-devkit/build-angular` updated to v21.0.1
   - TypeScript upgraded to 5.9.3
   - `@angular/material` and `@angular/cdk` updated to v21.0.1
   - Zone.js change detection explicitly configured via `provideZoneChangeDetection()`
   - Form page migrated to block control flow syntax (`@if`, `@for`, etc.)

2. **✅ Installed Vitest and Angular 21 compatible dependencies**:
   - `vitest` v4.0.14
   - `@vitest/browser` v4.0.8
   - `@vitest/ui` v4.0.8
   - `@analogjs/vite-plugin-angular` v2.1.2 (Angular 21 compatible)
   - `@analogjs/vitest-angular` v2.1.2 (Angular 21 Vitest builder)
   - `@angular/build` v21.0.1 (required for Vitest plugin)
   - `@testing-library/angular` v18.1.0
   - `jsdom` v27.1.0
   - `playwright` v1.56.1

3. **✅ Configured Vitest**:
   - `vitest.config.ts` with `@analogjs/vite-plugin-angular` for Angular component compilation
   - `src/test-setup.ts` with Angular testing environment initialization
   - `tsconfig.spec.json` updated to use `vitest/globals` types instead of `jasmine`
   - `angular.json` configured with `@angular-devkit/build-angular:vitest` builder

4. **✅ Removed Karma**:
   - All Karma-related packages uninstalled
   - Karma configuration removed from `angular.json`
   - Test script in `package.json` now runs `vitest`

5. **✅ Modernized test files**:
   - Updated `app.component.spec.ts` to use `provideRouter` instead of deprecated `RouterTestingModule`

### Known Issues ⚠️

1. **Test Execution**: Tests are running but failing with "Need to call TestBed.initTestEnvironment() first"
   - The `test-setup.ts` file is configured correctly but may not be loading in the right order
   - This is a known issue with Vitest and Angular's TestBed initialization timing
   - Workarounds being investigated:
     - Import order in setup file
     - Vitest pool configuration
     - Setup file execution timing

2. **TestBed Setup Timing**: The Angular TestBed needs to be initialized before tests run, but Vitest's execution model may be loading tests before the setup file completes.

### What Works Now ✨

- ✅ **Build system**: Fully functional with Angular 21.0.2
- ✅ **TypeScript compilation**: Working with TypeScript 5.9.3
- ✅ **Standalone components**: All migrated and working
- ✅ **Development server**: Works perfectly (`npm start`)
- ✅ **Production builds**: Working (`npm run build`)
- ✅ **Angular Material**: Updated to v21 and rendering correctly
- ✅ **Zone.js**: Explicitly configured and working
- ✅ **New control flow syntax**: `@if`, `@for` working in templates

### Recommended Next Steps 🚀

**Option 1: Continue Vitest Debugging** (Current Path)
- Investigate Vitest pool configuration (`forks` vs `threads`)
- Try different setup file loading strategies
- Check `@analogjs/vitest-angular` documentation for Angular 21 specific setup
- Community support: Angular Discord, Stack Overflow

**Option 2: Use Angular's Official Test Runner**
Once Angular team releases official Vitest migration schematics:
```bash
ng generate @angular/core:vitest-migration
```
(Note: This schematic doesn't exist yet in Angular 21.0.1)

**Option 3: Temporarily Reinstall Jasmine/Karma**
If testing is urgently needed:
```bash
npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
```

Then update `angular.json`:
```json
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "inlineStyleLanguage": "scss",
    "assets": ["src/favicon.ico", "src/assets"],
    "styles": ["src/styles.scss"],
    "scripts": []
  }
}
```

### References 📚

**Angular 21**
- [Angular v21 Release Announcement](https://blog.angular.dev/announcing-angular-v21-57946c34f14b)
- [Angular Update Guide](https://angular.dev/update-guide)
- [What's New in Angular 21](https://blog.ninja-squad.com/2025/11/20/what-is-new-angular-21.0)

**Vitest & Angular**
- [Vitest in Angular 21 Migration Guide](https://angular.schule/blog/2025-11-migrate-to-vitest/)
- [Testing Angular 21 Components with Vitest](https://dev.to/olayeancarh/testing-angular-21-components-with-vitest-a-complete-guide-4db7)
- [Analog.js Vitest Plugin](https://analogjs.org/docs/packages/vite-plugin-angular/overview)
- [Vitest Documentation](https://vitest.dev/)

### Upgrade Summary

**Angular Version:** 20.3.9 → 21.0.2 ✅
**TypeScript:** 5.8.3 → 5.9.3 ✅
**Build System:** Working ✅
**Dev Server:** Working ✅
**Production Build:** Working ✅
**Tests:** Configuration complete, execution debugging in progress ⚠️

### Files Modified During Upgrade

- `package.json` - All dependency versions updated
- `package-lock.json` - Dependency tree updated
- `tsconfig.json` - Library updated to ES2022
- `tsconfig.spec.json` - Types changed from `jasmine` to `vitest/globals`
- `vitest.config.ts` - Configured with `@analogjs/vite-plugin-angular`
- `src/main.ts` - Added `provideZoneChangeDetection()`
- `src/test-setup.ts` - Updated with Angular 21 testing initialization
- `src/app/pages/form/form.page.ts` - Migrated to block control flow syntax

### Migration Timeline

- **December 2, 2025**: Upgraded to Angular 21.0.2
- **November 20, 2025**: Angular 21 officially released
- **Previous**: Angular 20.3.9 with partial Vitest configuration

---

**For Future Reference**: This migration was performed using the official Angular update command:
```bash
ng update @angular/core@21 @angular/cli@21 --force
ng update @angular/material@21
```