Forked from [@tpdewolf/prisma-nestjs-dto-generator](https://www.npmjs.com/package/@tpdewolf/prisma-nestjs-dto-generator)

# Prisma NestJS Dto Generator

This generator generates Dto files based on your Prisma schema

## To install

```bash
yarn add @refo/prisma-nestjs-dto-generator
```

## Add the generator to your schema

```
generator dto {
  provider         = "prisma-nestjs-dto-generator"
  output           = "../generated" /// relative output path
  filenameCase     = "kebab" /// "kebab | "snake" | "camel" (default)
  classSuffix      = "Dto" /// (default = "Dto")
  classPrefix      = "Generated" /// (default = "")
  excludeRelations = true /// (default = false)
}
```
