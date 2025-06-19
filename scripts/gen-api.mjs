import path from 'path'
import fs from 'fs'
import { generateApi } from 'swagger-typescript-api'

const outputDir = path.resolve(process.cwd(), './api/client/gen')
generateApi({
  url: 'http://localhost:3000/doc',
  silent: true,
  extractEnums: true,
  extractRequestBody: true,
  extractRequestParams: true,
  extractResponseBody: true,
  extractResponseError: true,
  extractResponses: true,
  generateClient: true,
  generateRouteTypes: true,
  sortRoutes: true,
  sortTypes: true,
  typePrefix: 'I',
  modular: true,
  hooks: {
    onParseSchema: (originalSchema, parsedSchema) => {
      if (
        originalSchema.type === 'string' &&
        ['date', 'date-time'].includes(originalSchema.format ?? '')
      ) {
        parsedSchema.content = 'Date'
      }
      return parsedSchema
    }
  }
}).then(({ files }) => {
  const nameMap = {
    ApiRoute: 'types',
    'data-contracts': 'model'
  }
  files.forEach(({ fileContent, fileName, fileExtension }) => {
    let modifiedContent = fileContent
    for (const [originalName, newName] of Object.entries(nameMap)) {
      const regex = new RegExp(`\\.\\/${originalName}`, 'g')
      modifiedContent = modifiedContent.replace(regex, `./${newName}`)
    }

    modifiedContent = modifiedContent
      .replace(' Symbol ', ' symbol ')
      .replace('D extends unknown', 'D')
      .replace('E extends unknown = unknown', 'E')
      .replace('SecurityDataType extends unknown', 'SecurityDataType')
    fs.writeFileSync(
      path.join(outputDir, (nameMap[fileName] || fileName) + fileExtension),
      modifiedContent
    )
  })
})
