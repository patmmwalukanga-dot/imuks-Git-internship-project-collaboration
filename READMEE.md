Imuks-Git-internship-project-collaboration
This is an internship attactment ment to encourage collaboration and team building

This repository is part of an internship attachment meant to encourage collaboration and team building.
It contains a monorepo setup with both a Next.js web app and a React Native mobile app.

📂 Project Structure
repo-root/ ├── apps/ │ ├── web/ # Next.js app │ └── mobile/ # React Native app ├── packages/ # Shared code (components, utils, etc.) ├── tests/ # Centralized test configs ├── .github/ # Workflows and PR templates ├── README.md

🚀 Getting Started
1. Clone the repository
git clone <repo-url>
cd Imuks-Git-internship-project-collaboration
Install dependencies

yarn install
Run Next.js (web)

cd apps/web
yarn dev
NOTE:App runs at: http://localhost:3000

Run React Native (mobile)

cd apps/mobile
yarn start
Then run on emulator or device:

yarn android
yarn ios
NOTE: If your pc is not powerfull enough for emulation or you just want to use your phone, you can connect your phone to the pc after turing on developers mode depending on which platform your own, watch some tutorials for more information.
COLLABORATION RULES YOU MUST FOLLOW AT ALL TIMES

No direct pushes to the main branch All changes must go through a pull request

Tests required for new code Add or update tests for every feature/fix CI will block merges if tests fail

Code review checklist Ensure no merge conflicts Follow coding standards and lint rules Use the PR template checklist

Testing Web(Next.js)

cd apps/web
yarn test
Mobile (React Native):

cd apps/mobile
yarn test
Branch Protection The Main branch is protected Requires PR approval and passing status checks before merge Force pushes and deletions are blocked

License his project is licensed under the MIT License

📌 How to Add This
On GitHub, go to your repo.
Click Add file → Create new file.
Name it README.md.
Paste the full template above.
Commit the file to your repo (on a branch, not directly to main).
Open a Pull Request → reviewers approve → merge into main.
Quick Reference Table

Task	Yarn Command	npm Equivalent
Install dependencies	yarn install	npm install
Run dev server	yarn dev	npm run dev
Start app	yarn start	npm start
Add a package	yarn add <package>	npm install <package>
Remove a package	yarn remove <package>	npm uninstall <package>
Monica
Monica
Repo Summary
Supports the most advanced models to help you quickly understand the contents of the repo
About
This is an internship attactment ment to encourage collaboration and team building

Resources
 Readme
License
 MIT license
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Report repository
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Contributors
1
@patmmwalukanga-dot
patmmwalukanga-dot
Languages
TypeScript
74.5%
 
JavaScript
11.2%
 
CSS
9.8%
 
Batchfile
4.5%
Suggested workflows
Based on your tech stack
Webpack logo
Webpack
Build a NodeJS project with npm and webpack.
SLSA Generic generator logo
SLSA Generic generator
Generate SLSA3 provenance for your existing release workflows
Deno logo
Deno
Test your Deno project
More workflows
Footer
