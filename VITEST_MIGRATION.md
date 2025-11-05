# Vitest Migration Status

## Current Status: Partially Complete ⚠️

The project has been prepared for Vitest migration, but full Vitest support in Angular is not yet stable in Angular 20.

### What's Been Done ✅

1. **Installed Vitest and dependencies**:
   - `vitest` v4.0.7
   - `@vitest/browser` v4.0.7
   - `@vitest/ui` v4.0.7
   - `jsdom` v27.1.0
   - `playwright` v1.56.1
   - `@analogjs/vite-plugin-angular` (for Angular component support)
   - `@testing-library/angular` v18.1.0

2. **Removed Karma dependencies**:
   - All Karma-related packages have been uninstalled
   - Karma configuration removed from `angular.json`

3. **Created Vitest configuration**:
   - `vitest.config.ts` with Angular plugin support
   - `src/test-setup.ts` for Angular testing environment initialization

4. **Updated test script**:
   - `package.json` test script now runs `vitest` instead of `ng test`

5. **Modernized test files**:
   - Updated `app.component.spec.ts` to use `provideRouter` instead of deprecated `RouterTestingModule`

### Known Issues ⚠️

1. **Angular Build Compatibility**: The `@analogjs/vite-plugin-angular` requires `@angular/build/private` which is not yet available in Angular 20.3.

2. **Component Resource Resolution**: Angular components with `templateUrl` and `styleUrls` need special handling in Vitest that requires the Angular Vite plugin.

### Recommended Path Forward 🚀

**Option 1: Wait for Angular 21** (Recommended)
- Vitest will be the official default test runner in Angular 21
- Official Angular support with `@angular/build/vitest` plugin
- Full compatibility guaranteed
- Timeline: Angular 21 is expected in Q2 2025

**Option 2: Use Karma for Now**
If you need testing right away, you can temporarily reinstall Karma:
\`\`\`bash
npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
\`\`\`

Then restore the Karma configuration in `angular.json`:
\`\`\`json
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
\`\`\`

**Option 3: Use Jest**
Jest has better Angular 20 compatibility through community plugins like `jest-preset-angular`.

**Option 4: Continue with Analog.js Vitest**
Try upgrading `@analogjs/vite-plugin-angular` to match Angular 20 when a compatible version is released.

### References 📚

- [Angular Vitest Testing Guide](https://angular.dev/guide/testing)
- [Vitest Documentation](https://vitest.dev/)
- [Analog.js Vitest Plugin](https://analogjs.org/docs/packages/vite-plugin-angular/overview)

### What Works Now ✨

- Build system: Fully functional with Angular 20
- Standalone components: Fully migrated
- Development server: Works perfectly
- Production builds: Working

### Next Steps

Once Angular 21 is released or when `@angular/build` adds official Vitest support:

1. Update Angular to v21
2. Run `ng generate @angular/core:vitest-migration` (if available)
3. Remove the Analog.js plugin in favor of official Angular Vitest support
4. Run tests with `npm test`