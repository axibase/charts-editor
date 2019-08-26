# Charts Editor

Service using axibase/charts-language-service an syntax core and monaco editor.

## Update to latest charts-ls release

1. **Important:** increase patch version in `package.json`.
    <br>For example: 0.1.0 -> 0.1.1. 
    <br>This will save you from problems with outdated cache
    <br>
2. Copy resources and build:
    `npm run upgrade-editor`
<br>
3. Open PR and merge it

## Development & testing guide
1. Switch to branch *stage*
<br>
2. Install dependencies:
`npm i`
<br>
3. Build project:
`npm run build`
<br>
4. Run local server:
`npm run serve`
