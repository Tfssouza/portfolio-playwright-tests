# Portfolio Playwright Test Showcase

A deliberately small, independent selection of Playwright tests against my personal portfolio: [thayrinesouza.com](https://thayrinesouza.com).

This project demonstrates how I select risk-based scenarios, structure browser automation and write observable assertions. It is intended for recruiters and technical reviewers who want to inspect and run a practical QA example.

**The application under test lives in a private repository. This project contains only the automation needed to demonstrate QA practices.** It does not contain the portfolio source code, React components, private application data, CV files or personal images. The tests were authored against the public UI rather than copied from the private test suite.

## Scope: eight independent tests

| Area | Scenario | What the assertions establish |
| --- | --- | --- |
| Smoke | Portuguese Home | HTTP response, page identity, language, landmarks and project entry point |
| Navigation | PT / EN / ES | Route, translated headline, active language and persistence after reload |
| Projects | Carousel | All four project titles and cyclic next/previous navigation |
| Keyboard | Enter / Space | Both keys open the intended project dialog |
| Keyboard | Focus containment | Initial focus, forward tab order and reverse wrap-around remain inside the modal |
| Keyboard | Escape | The dialog closes and focus returns to its original trigger with a visible outline |
| Documents | CV choices | PT/EN links, download filenames, successful PDF responses and file signatures |
| Responsive | 320 / 390 / 768 / 1440px | No horizontal page overflow; the mobile navigation can be opened and closed by keyboard |

Each test receives a fresh browser context. The Portuguese page is the baseline for interaction tests; the language scenario covers all three website languages. CV language selection is separate from website language selection; no Spanish CV is expected.

## Run locally

Requirements: Node.js 24 or later and npm. An internet connection and access to the public target site are required. No account, token or access to the private application repository is needed.

~~~sh
npm ci
npx playwright install chromium
npm run check
npm test
~~~

For Linux machines without browser libraries, use:

~~~sh
npx playwright install --with-deps chromium
~~~

To run a single area:

~~~sh
npx playwright test tests/keyboard.spec.ts
~~~

The default target is the public production origin. To use another authorised instance that exposes the same UI contract, set an origin-only BASE_URL:

~~~powershell
$env:BASE_URL = 'http://127.0.0.1:3000'
npm test
~~~

The configuration does not start an application server or import application code. Do not point these tests at a site you do not own or have permission to test.

## Project structure

~~~text
.github/workflows/playwright.yml
.gitignore
README.md
eslint.config.mjs
package.json
package-lock.json
playwright.config.ts
tsconfig.json
tests/
  navigation.spec.ts
  projects.spec.ts
  keyboard.spec.ts
  responsive.spec.ts
  support/portfolio.ts
~~~

The small support module centralises public project titles and semantic gallery locators. It is not an application page-object hierarchy and contains no private implementation imports.

## Automation decisions

- Prefer role and accessible-name locators. The only direct element selector is the document's html element, used to check the language declaration. Tests do not depend on React internals or styling classes.
- Test user-visible state changes rather than implementation details: heading, route, counter, dialog visibility, selected language and active focus.
- Use Playwright's web-first assertions and automatic waiting. No arbitrary sleeps, forced clicks, time-based polling loops or mocked application responses.
- Keep eight tests independent. Fresh contexts prevent language preferences, open modals or carousel state from leaking between tests.
- Run one Chromium worker with no automatic retries to keep load on the live site modest and failures visible. There is no scheduled monitoring or autoplay waiting test.
- Use reduced motion for deterministic interaction checks; animation appearance is outside this showcase's scope.
- Where desktop side arrows duplicate the lower carousel controls, select the first visible button with the correct accessible name. This is intentional scoping of equivalent controls, not a CSS dependency.
- Inspect CV response headers and the PDF signature in memory. Tests do not click document download links, save documents, extract CV content or retain response bodies as files. Browser downloads are disabled.

## GitHub Actions

The workflow runs on pushes to main, pull requests and manual dispatch. It checks out this test project, installs Node.js and the locked dependencies with npm ci, installs Chromium and its Linux dependencies, runs lint/typecheck, and executes the same suite against the public site.

A failing command fails the job. There is no continue-on-error or ignored test exit code. The workflow uses read-only repository permissions, does not check out the private application and requires no application secrets. There is no upload-artifact step. The npm cache contains dependency downloads, not application files or test evidence.

The workflow is provided for a future public repository; a local passing run does not demonstrate a GitHub-hosted run. Until the project is uploaded and the workflow actually runs, no CI badge or successful CI execution is claimed.

## Privacy and evidence policy

Screenshots, traces and videos are disabled in Playwright configuration, including on failure. Only a console test summary is produced; no HTML reporter is enabled. Temporary test output is not preserved and is ignored by Git. CV requests are read into memory and disposed; PDFs are never written to this project. No reports, visual evidence or downloaded documents are published by the workflow.

Do not add credentials, storage-state files, environment files, personal images, PDFs or private portfolio files to this repository. The ignore rules also exclude common binary evidence formats.

## Limitations

**Keyboard and interaction tests do not constitute a complete accessibility audit or WCAG conformance assessment.**

This is a representative sample, not the complete private suite or an exhaustive regression pack. It does not cover all project content, browsers, physical devices, assistive technologies, contrast, security, performance or every viewport. It does not validate the entire contents or professional accuracy of a CV: a PDF signature is a format smoke check, not complete document validation.

Tests run against a live deployment. Network outages, bot protection, deployments or intentional changes to public labels and content can cause failures. Such failures need investigation; a passing sample does not establish that the whole application is defect-free. No contact messages are submitted and no data is changed on the site.

## References

- [Playwright locators](https://playwright.dev/docs/locators)
- [Playwright assertions](https://playwright.dev/docs/test-assertions)
- [GitHub Actions checkout](https://github.com/actions/checkout)
- [GitHub Actions setup-node](https://github.com/actions/setup-node)
